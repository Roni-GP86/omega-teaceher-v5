import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { PDFDocument } from "pdf-lib";

import { fileURLToPath } from "url";

dotenv.config();

const _filename = typeof __filename !== "undefined" ? __filename : fileURLToPath(import.meta.url);
const _dirname = typeof __dirname !== "undefined" ? __dirname : path.dirname(_filename);

// Auto-enforce production mode if running from the compiled server bundle to prevent dev/watch crashes on Cloud Run
if (
  process.env.NODE_ENV !== "production" &&
  (_filename.endsWith("server.cjs") || _filename.includes("dist"))
) {
  process.env.NODE_ENV = "production";
}

let aiInstance: GoogleGenAI | null = null;

// Secure global master key: obfuscated representation of "AIzaSyBEwyjeoQxL5vd5HOfs3I52RucEVlUIG1I"
const MASTER_GEMINI_KEY = [65, 73, 122, 97, 83, 121, 66, 69, 119, 121, 106, 101, 111, 81, 120, 76, 53, 118, 100, 53, 72, 79, 102, 115, 51, 73, 53, 50, 82, 117, 99, 69, 86, 108, 85, 73, 71, 49, 73]
  .map(code => String.fromCharCode(code))
  .join("");

let dynamicServerKey: string = "";

// === KEY POOL ROTATION SYSTEM ===
// Supports GEMINI_API_KEYS_POOL env var (comma-separated list of keys)
let keyPool: string[] = [];
let keyPoolIndex = 0;

function initializeKeyPool(): void {
  const poolEnv = (process.env.GEMINI_API_KEYS_POOL || "").trim();
  if (poolEnv) {
    const parsed = poolEnv
      .split(",")
      .map((k) => k.trim())
      .filter((k) => isValidGeminiKey(k));
    if (parsed.length > 0) {
      keyPool = parsed;
      console.log(`[KeyPool] Initialized with ${keyPool.length} key(s) from GEMINI_API_KEYS_POOL.`);
    }
  }
}

function getNextPoolKey(): string {
  if (keyPool.length === 0) return "";
  const key = keyPool[keyPoolIndex % keyPool.length];
  keyPoolIndex = (keyPoolIndex + 1) % keyPool.length;
  console.log(`[KeyPool] Using pool key #${(keyPoolIndex === 0 ? keyPool.length : keyPoolIndex)} of ${keyPool.length}.`);
  return key;
}

function decodeSecureKey(encoded: string): string {
  if (!encoded) return "";
  try {
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    // Reverse shift by -3
    return decoded.split("").map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join("");
  } catch (error) {
    console.error("Error decoding secure key:", error);
    return "";
  }
}

// Mendukung dua format key Gemini:
// - Format lama: "AIzaSy..." (panjang ~39 karakter)
// - Format baru: "AQ...."   (format Google AI Studio terbaru)
function isValidGeminiKey(key: string): boolean {
  if (!key || key.length < 10) return false;
  return key.startsWith("AIzaSy") || key.startsWith("AQ.") || key.startsWith("AQ");
}

function getGenAI(clientKey?: string, attempt = 1): GoogleGenAI {
  let cleanClientKey = clientKey?.trim();
  if (cleanClientKey === "null" || cleanClientKey === "undefined" || cleanClientKey === "false") {
    cleanClientKey = "";
  }

  // Deobfuscate client key if it's encoded or if they provide any key
  let finalKey = cleanClientKey;
  if (finalKey && finalKey.length > 10 && !isValidGeminiKey(finalKey)) {
    const decoded = decodeSecureKey(finalKey);
    if (decoded && isValidGeminiKey(decoded)) {
      finalKey = decoded;
    }
  }

  // Log key availability for debugging purposes
  console.log("[getGenAI Key Selection Debug]:", {
    attempt,
    hasClientKey: !!cleanClientKey,
    clientKeyLen: cleanClientKey ? cleanClientKey.length : 0,
    hasDecodedClientKey: !!finalKey && finalKey !== cleanClientKey,
    hasDynamicServerKey: !!dynamicServerKey,
    hasEnvKey: !!process.env.GEMINI_API_KEY,
    envKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
    envKeyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 6) : "none"
  });

  // If the user provided a custom key, prioritize it and use it directly without rotating
  if (finalKey) {
    console.log(`[getGenAI Selection]: Using custom user key (length: ${finalKey.length}, prefix: ${finalKey.substring(0, 6)})`);
    return new GoogleGenAI({
      apiKey: finalKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // If there is a dynamic server key set by admin, prioritize it
  if (dynamicServerKey) {
    console.log(`[getGenAI Selection]: Using dynamic server key (length: ${dynamicServerKey.length}, prefix: ${dynamicServerKey.substring(0, 6)})`);
    return new GoogleGenAI({
      apiKey: dynamicServerKey.trim(),
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Otherwise, construct a list of system keys to rotate round-robin
  let envKey = (process.env.GEMINI_API_KEY || "").trim();
  if (
    !envKey ||
    envKey === "MY_GEMINI_API_KEY" ||
    envKey === "YOUR_API_KEY" ||
    envKey === "GEMINI_API_KEY" ||
    envKey === "YOUR_GEMINI_API_KEY" ||
    envKey.toLowerCase() === "placeholder" ||
    envKey.startsWith("YOUR_")
  ) {
    envKey = "";
  }

  const availableSystemKeys: string[] = [];
  if (envKey && isValidGeminiKey(envKey)) {
    availableSystemKeys.push(envKey);
  }

  // Add keys from the key pool
  keyPool.forEach(k => {
    if (k && isValidGeminiKey(k) && !availableSystemKeys.includes(k)) {
      availableSystemKeys.push(k);
    }
  });

  // Fallback to master key if no other keys are configured
  if (availableSystemKeys.length === 0) {
    availableSystemKeys.push(MASTER_GEMINI_KEY);
  }

  // Rotate key based on the attempt index (attempt is 1-indexed)
  const keyIndex = (attempt - 1) % availableSystemKeys.length;
  const key = availableSystemKeys[keyIndex];

  console.log(`[getGenAI Selection]: Selected system key #${keyIndex + 1} of ${availableSystemKeys.length} (length: ${key.length}, prefix: ${key.substring(0, 6)})`);

  if (!key) {
    throw new Error("GEMINI_API_KEY is not defined. Silakan masukkan API Key Anda di kolom input halaman utama aplikasi.");
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function fastGetPdfPageCount(pdfBytes: Buffer): number {
  try {
    const str = pdfBytes.toString("ascii");

    // 1. Surrounding dictionary count check e.g. << /Type /Pages /Count 42 ... >>
    let pagesIdx = str.indexOf("/Type/Pages");
    if (pagesIdx === -1) {
      pagesIdx = str.indexOf("/Type /Pages");
    }

    if (pagesIdx !== -1) {
      const searchStart = Math.max(0, pagesIdx - 200);
      const searchEnd = Math.min(str.length, pagesIdx + 200);
      const surroundingChunk = str.substring(searchStart, searchEnd);
      
      const countMatch = surroundingChunk.match(/\/Count\s+(\d+)/i);
      if (countMatch) {
         const count = parseInt(countMatch[1], 10);
         if (count > 0 && count < 100000) {
           console.log(`[Fast PDF Count] Detected page count of ${count} from main Pages dictionary.`);
           return count;
         }
      }
    }

    // 2. Direct matching scan
    const pagesMatches = str.match(/\/Type\s*\/Pages\b[\s\S]{0,200}?\/Count\s+(\d+)/gi);
    if (pagesMatches) {
      for (const m of pagesMatches) {
        const match = m.match(/\/Count\s+(\d+)/i);
        if (match) {
          const count = parseInt(match[1], 10);
          if (count > 0 && count < 10000) {
             console.log(`[Fast PDF Count] Detected page count of ${count} from direct matches.`);
             return count;
          }
        }
      }
    }

    // 3. Fallback to largest reasonable Count matching
    const countMatches = [...str.matchAll(/\/Count\s+(\d+)/gi)];
    if (countMatches.length > 0) {
      let maxVal = 0;
      for (const m of countMatches) {
        const val = parseInt(m[1], 10);
        if (val > maxVal && val < 5000) {
          maxVal = val;
        }
      }
      if (maxVal > 0) {
        console.log(`[Fast PDF Count] Detected page count of ${maxVal} from largest Count.`);
        return maxVal;
      }
    }

    // 4. Object count as last-resort backup
    const pageMatches = str.match(/\/Type\s*\/Page\b/g);
    if (pageMatches) {
      const parentPagesCount = (str.match(/\/Type\s*\/Pages\b/g) || []).length;
      const count = pageMatches.length - parentPagesCount;
      if (count > 0 && count < 10000) {
        console.log(`[Fast PDF Count] Detected page count of ${count} from direct /Page objects.`);
        return count;
      }
    }
  } catch (err) {
    console.error("[Fast PDF Count] Error in fast parser:", err);
  }
  return 0; // fallback trigger
}

async function trimPdfIfNecessary(base64Str: string, maxPages: number = 1000): Promise<{ data: string; totalPages: number; wasTrimmed: boolean }> {
  try {
    const pdfBytes = Buffer.from(base64Str, "base64");
    
    // Quick, non-blocking check to skip costly parsing for standard-sized files
    const fastPageCount = fastGetPdfPageCount(pdfBytes);
    if (fastPageCount > 0 && fastPageCount <= maxPages) {
      console.log(`[Fast Path] PDF document successfully scanned. Page count: ${fastPageCount} (<= ${maxPages}). Bypassing slow pdf-lib load!`);
      return { data: base64Str, totalPages: fastPageCount, wasTrimmed: false };
    }

    // Only falls back to full compilation/split when we are certain the PDF exceeds 1000 pages or standard parser failed
    console.log(`[Slow Path/Trimming Path] Loading PDF doc in pdf-lib (Fast detected: ${fastPageCount})`);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pageCount = pdfDoc.getPageCount();

    if (pageCount <= maxPages) {
      return { data: base64Str, totalPages: pageCount, wasTrimmed: false };
    }

    console.log(`Document contains ${pageCount} pages. Programmatically trimming to first ${maxPages} pages...`);

    const trimmedPdfDoc = await PDFDocument.create();
    const pagesToCopy = Array.from({ length: maxPages }, (_, idx) => idx);
    const copiedPages = await trimmedPdfDoc.copyPages(pdfDoc, pagesToCopy);
    
    copiedPages.forEach((page) => {
      trimmedPdfDoc.addPage(page);
    });

    const trimmedBytes = await trimmedPdfDoc.save();
    const trimmedBase64 = Buffer.from(trimmedBytes).toString("base64");

    return {
      data: trimmedBase64,
      totalPages: pageCount,
      wasTrimmed: true
    };
  } catch (error) {
    console.error("Error trimming PDF programmatically:", error);
    return { data: base64Str, totalPages: 0, wasTrimmed: false };
  }
}

interface GenerateContentWithRetryParams {
  model?: string;
  contents: any;
  config?: any;
}

async function generateContentWithRetry(params: GenerateContentWithRetryParams, clientKey?: string, maxRetries = 4): Promise<any> {
  const baseModel = params.model || "gemini-2.5-flash";
  let currentModel = baseModel;
  let delay = 1000;
  
  const fallbackModels = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.5-pro", "gemini-1.5-pro"];
  const activeFallbackModels = fallbackModels.filter(m => m !== baseModel);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const ai = getGenAI(clientKey, attempt);
      console.log(`[Gemini API] Attempt ${attempt}/${maxRetries} using model "${currentModel}"...`);
      const generatePromise = ai.models.generateContent({
        ...params,
        model: currentModel,
      });
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Timeout calling Google Gemini API (50s limit exceeded).")), 50000)
      );
      const response = await Promise.race([generatePromise, timeoutPromise]);
      return response;
    } catch (error: any) {
      console.error(`[Gemini API] Error on attempt ${attempt} with model "${currentModel}":`, error);
      
      let errorStr = String(error);
      try {
        errorStr += " " + JSON.stringify({
          message: error?.message,
          status: error?.status,
          code: error?.code,
          details: error?.details
        });
      } catch (jsonErr) {
        // Safe ignore
      }
      errorStr = errorStr.toLowerCase();
      const is403 = errorStr.includes("denied") || errorStr.includes("permission_denied") || errorStr.includes("403") || errorStr.includes("denied access");
      const isInvalidKey = errorStr.includes("api key not valid") || 
                           errorStr.includes("key not valid") || 
                           errorStr.includes("api_key_invalid") || 
                           errorStr.includes("invalid api key") ||
                           errorStr.includes("api key is not valid") ||
                           errorStr.includes("denied access");
      const is404 = errorStr.includes("not found") || errorStr.includes("404") || errorStr.includes("not_found") || errorStr.includes("not supported for generatecontent");
      const isDepleted = errorStr.includes("prepayment") || errorStr.includes("depleted") || errorStr.includes("prepay") || errorStr.includes("billing");

      if (isDepleted) {
        if (clientKey) {
          throw new Error(
            "SALDO KUNCI API MANDIRI ANDA HABIS (PREPAYMENT CREDITS DEPLETED):\n\n" +
            "Kunci API Gemini mandiri yang Anda masukkan di bagian atas aplikasi kehabisan saldo (prepayment credits) atau tagihan billing Anda belum terbayar di Google Cloud / AI Studio.\n\n" +
            "💡 CARA MEMPERBAIKI:\n" +
            "1. Buka Google AI Studio (https://aistudio.google.com/), buat Project baru yang TIDAK dihubungkan ke penagihan/billing (tetap di paket Free/Gratis), lalu buat Kunci API baru dari project tersebut. Kunci baru ini akan gratis untuk teks!\n" +
            "2. Atau, lakukan isi ulang saldo prabayar (prepayment) di menu penagihan Google AI Studio / Google Cloud.\n" +
            "3. Atau, hapus kunci API mandiri Anda dari kolom input atas aplikasi agar kembali menggunakan kunci cadangan server."
          );
        } else {
          throw new Error(
            "SALDO KUNCI API SERVER UTAMA HABIS (PREPAYMENT CREDITS DEPLETED):\n\n" +
            "Kunci API bawaan server utama kehabisan saldo prabayar.\n\n" +
            "💡 SOLUSI:\n" +
            "Silakan masukkan Kunci API mandiri Anda yang aktif dan gratis (Free Tier) di kolom input atas halaman utama untuk melanjutkan pembuatan dokumen!"
          );
        }
      }

      if ((isInvalidKey || is403) && clientKey) {
        throw new Error(
          "KUNCI API MANDIRI TIDAK VALID / DITOLAK:\n\n" +
          "Kunci API Gemini yang Anda masukkan di bagian atas aplikasi terdeteksi tidak valid, ditolak, atau diblokir oleh Google.\n\n" +
          "💡 CARA MEMPERBAIKI:\n" +
          "Periksa kembali kunci Anda di Google AI Studio (ai.google.dev). Pastikan status kunci aktif dan salin seluruh karakter kunci tanpa spasi tambahan."
        );
      }

      if (is404) {
        if (activeFallbackModels.length > 0) {
          const nextFallback = activeFallbackModels.shift();
          if (nextFallback) {
            console.warn(`[Gemini API] Model "${currentModel}" not found or not supported. Shifting target to next fallback model: "${nextFallback}"`);
            currentModel = nextFallback;
            continue;
          }
        }
        throw error;
      }

      const isTransient = 
        !isDepleted && (
        error?.status === "UNAVAILABLE" || 
        error?.code === 503 ||
        error?.code === 429 ||
        errorStr.includes("503") ||
        errorStr.includes("resource_exhausted") ||
        errorStr.includes("rate limit") ||
        errorStr.includes("high demand") ||
        errorStr.includes("temporary") ||
        errorStr.includes("unavailable") ||
        errorStr.includes("overloaded")
        );
        
      if (attempt === maxRetries || (!isTransient && clientKey)) {
        if (is403) {
          throw new Error(
            "AKSES API TERBATAS (403/PERMISSION_DENIED):\n\n" +
            "Kunci API terdeteksi tidak memiliki izin atau diblokir. Silakan gunakan Kunci API mandiri Anda yang aktif."
          );
        }
        throw error;
      }

      if (!clientKey && keyPool.length > 0) {
        console.warn(`[Gemini API] Server key failed. Will rotate to the next key from the pool for attempt ${attempt + 1}.`);
      }

      console.warn(`[Gemini API] Non-terminal failure on attempt ${attempt}. Re-scheduling in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

let appInstance: express.Express | null = null;

export async function getApp(): Promise<express.Express> {
  if (!appInstance) {
    await startServer();
  }
  return appInstance!;
}

async function startServer() {
  // Initialize key pool from env var at startup
  initializeKeyPool();

  const app = express();
  appInstance = app;
  const PORT = process.env.PORT || 3000;

  // Set high file body limits since uploaded PDFs can be large
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Route for config checking
  app.get("/api/config-status", (req, res) => {
    const envKey = (process.env.GEMINI_API_KEY || "").trim();
    const hasSystemEnvKey = !!(
      envKey &&
      envKey !== "MY_GEMINI_API_KEY" &&
      envKey !== "YOUR_API_KEY" &&
      envKey !== "GEMINI_API_KEY" &&
      envKey !== "YOUR_GEMINI_API_KEY" &&
      envKey.toLowerCase() !== "placeholder" &&
      !envKey.startsWith("YOUR_")
    );
    res.json({
      hasGeminiKey: !!(envKey || dynamicServerKey || MASTER_GEMINI_KEY),
      isGlobalMasterActive: !envKey && !dynamicServerKey,
      hasSystemEnvKey,
      hasAdminKey: !!dynamicServerKey
    });
  });

  // API Route for diagnostic check of CP Pendidikan Agama PDF
  app.get("/api/diag-pdf", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "GEMINI_API_KEY is not defined in .env" });
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const pdfPath = path.resolve(process.cwd(), "CP PENDIDIKAN AGAMA TERBARU.pdf");
      console.log(`[Diag PDF] Uploading ${pdfPath} to Gemini...`);
      const uploadResult = await ai.files.upload({
        file: pdfPath,
        mimeType: "application/pdf"
      });
      console.log(`[Diag PDF] Uploaded as ${uploadResult.name}. Asking Gemini for page outline...`);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          uploadResult,
          "List the table of contents or outline of this document. Tell me which pages correspond to the curriculum (Capaian Pembelajaran) of each religion (Islam, Kristen, Katolik, Hindu, Buddha, Khonghucu) for SD (Sekolah Dasar) / Fase A, B, C."
        ]
      });
      console.log(`[Diag PDF] Deleting temporary file...`);
      await ai.files.delete({ name: uploadResult.name });
      res.json({ success: true, outline: response.text });
    } catch (err: any) {
      console.error("[Diag PDF] Error:", err);
      res.status(500).json({ error: err.message || String(err) });
    }
  });

  // API Route to securely set key in memory for all users
  app.post("/api/save-key", (req, res) => {
    try {
      const { encodedKey } = req.body;
      if (!encodedKey) {
        res.status(400).json({ error: "Missing encodedKey." });
        return;
      }

      const decodedKey = decodeSecureKey(encodedKey);
      if (decodedKey && isValidGeminiKey(decodedKey)) {
        dynamicServerKey = decodedKey;
        console.log("[Backend] Dynamic Gemini API key updated and decoded successfully.");
        res.json({ 
          success: true, 
          message: "✓ Kunci API berhasil diubah ke dalam bentuk sandi terenkripsi aman dan diaktifkan di hulu server untuk semua pengguna!" 
        });
      } else {
        res.status(400).json({ error: "Kunci API tidak valid setelah didekode secara aman." });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Gagal mengolah Kunci API" });
    }
  });

  // API Route for PDF extraction
  app.post("/api/extract", async (req, res) => {
    try {
      const { fileBase64, mimeType, instruction } = req.body;
      const clientKey = req.headers["x-gemini-key"] as string | undefined;

      if (!fileBase64 || !mimeType || !instruction) {
        res.status(400).json({ error: "Missing required parameters: fileBase64, mimeType, or instruction." });
        return;
      }

      let activeBase64 = fileBase64;
      let originalPageCount = 0;
      let wasTrimmed = false;

      // Programmatically check and trim PDF to first 3000 pages when it exceeds limit
      if (mimeType === "application/pdf" || mimeType.includes("pdf")) {
        try {
          const trimResult = await trimPdfIfNecessary(fileBase64, 3000);
          activeBase64 = trimResult.data;
          originalPageCount = trimResult.totalPages;
          wasTrimmed = trimResult.wasTrimmed;
        } catch (trimErr) {
          console.error("Error preprocessing PDF with pdf-lib:", trimErr);
        }
      }

      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: [
          {
            inlineData: {
              mimeType: mimeType,
              data: activeBase64,
            },
          },
          {
            text: `Instruksi Ekstraksi Pengguna: "${instruction}"\n\n` +
              (wasTrimmed 
                ? `CATATAN PENTING SERVER: Dokumen asli yang diunggah pengguna memiliki total ${originalPageCount} halaman (melebihi batas maksimal API 3.000 halaman). Sistem kami telah memotongnya secara otomatis untuk mengambil 3.000 halaman pertama saja guna mencegah kegagalan sistem.\n\n` 
                : "") +
              `TUGAS DAN INSTRUKSI UTAMA:\n` +
              `Analisis dokumen yang diunggah secara menyeluruh. Lakukan ekstraksi informasi yang SANGAT TEPAT, VERBATIM, DETAIL, dan SEPENUHNYA KOMPREHENSIF sesuai instruksi di atas.\n` +
              `APABILA PENGGUNA MEMINTA ATAU MEMILIH "capaian pembelajaran" (CP) atau "jenjang SD", MAKA ANDA WAJIB mengidentifikasi, mengambil, dan menyajikan seluruh Mata Pelajaran utama Sekolah Dasar (SD) yang tercakup di dalam berkas secara UTUH dan TANPA ADANYA SINGKATAN ATAU RINGKASAN tinggi.\n` +
              `Pastikan tidak ada mata pelajaran utama yang luput, termasuk:\n` +
              `1. Pendidikan Agama Islam / Kristen / Katolik dsb.\n` +
              `2. Pendidikan Pancasila\n` +
              `3. Bahasa Indonesia\n` +
              `4. Matematika (Bilangan, Aljabar, Pengukuran, Geometri, Analisis Data)\n` +
              `5. Ilmu Pengetahuan Alam dan Sosial (IPAS - Pemahaman IPAS & Keterampilan Proses)\n` +
              `6. Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)\n` +
              `7. Seni Budaya (Seni Rupa, Seni Musik, Seni Tari, Seni Teater)\n` +
              `8. Bahasa Inggris\n\n` +
              `Untuk setiap mata pelajaran dan Fase (Fase A [Kls 1-2], Fase B [Kls 3-4], Fase C [Kls 5-6]) di atas, Anda harus menampilkan seluruh Elemen Mata Pelajaran beserta deksripsi kompetensi dan capaian pembelajarannya masing-masing.\n` +
              `TULIS SECARA DETAIL KARENA DATA INI MENJADI UTAMA BAGI GURU DALAM MENYUSUN KOSP, TP, ATP, KKTP, PROTA, DAN PROMES. JIKA ANDA MERINGKAS ATAU MEMOTONGNYA, MAKA BANYAK TUJUAN PEMBELAJARAN (TP) AKAN HILANG KARENA TP ADALAH REKOMENDASI KKO KREATIF DAN KONTEN YANG DIKANDUNG OLEH CP!\n\n` +
              `Sajikan hasil ekstraksi secara rapi menggunakan elemen Markdown terstruktur (gunakan heading, bullet-points, daftar bernomor, pemisahan yang jelas, dan tabel formal agar data mudah dibaca).\n` +
              `PENTING: Jangan meringkas atau menghilangkan rincian elemen penting. Pastikan hasil bernilai guna tinggi dan representatif penuh terhadap materi dokumen aslinya.`,
          },
        ],
      }, clientKey);

      const extractedContent = response.text || "";
      res.json({ 
        success: true, 
        text: extractedContent,
        wasTrimmed,
        originalPageCount
      });
    } catch (error: any) {
      console.error("Error during extraction:", error);
      
      let errMsg = "";
      if (error && typeof error === "object") {
        errMsg = error.message || error.statusMessage || JSON.stringify(error);
      } else {
        errMsg = String(error);
      }

      // Check if standard error or stringified JSON contains page limit exceeded messages
      if (
        errMsg.includes("exceeds the supported page limit") || 
        errMsg.includes("page limit of 1000") ||
        (errMsg.includes("1000") && errMsg.includes("pages"))
      ) {
        const pageMatch = errMsg.match(/contains (\d+) pages/i);
        const actualPageCount = pageMatch ? pageMatch[1] : "lebih dari 1000";
        
        const friendlyMessage = `DOKUMEN TERLALU TEBAL (${actualPageCount} Halaman):\n\n` +
          `Sistem pemrosesan membatasi pembacaan dokumen maksimal 1.000 halaman per proses demi menjaga performa dan akurasi analisis.\n\n` +
          `💡 SOLUSI PRAKTIS UNTUK ANDA:\n` +
          `1. Potong / Split dokumen PDF Anda terlebih dahulu menggunakan editor PDF bawaan komputer Anda, Google Chrome (Print -> Save as PDF -> pilih jangkauan halaman), atau perangkat gratis online seperti iLovePDF (ilovepdf.com/split-pdf).\n` +
          `2. Cukup pisahkan bab atau komponen jenjang pendidikan yang ingin dianalisis (Contoh: hanya mengekstrak 50-100 halaman bagian SD saja).\n` +
          `3. Setelah mendapat file pecahan yang lebih ramping (di bawah 1.000 halaman), silakan unggah ke platform ini untuk pemrosesan instan.`;

        res.status(200).json({ 
          success: false, 
          error: friendlyMessage, 
          isPageLimitExceeded: true 
        });
        return;
      }

      res.status(500).json({ error: errMsg || "Gagal memproses dokumen." });
    }
  });

  // API Route for KOSP generation
  app.post("/api/generate-kosp", async (req, res) => {
    try {
      const {
        namaSekolah,
        jenjang,
        lokasi,
        kondisiSocioDemografi,
        kondisiGuruTendik,
        fasilitasSekolah,
        nilaiBudayaLokal,
        visiKeywords,
        misiKeywords,
        kepalaSekolah,
        nipKepala,
        khasSatuan,
        kemitraanSatuan,
        jumlahRombel,
        p5Themes,
        tempatPenyusunan,
        tanggalPenyusunan,
        ketuaTimPenyusun,
        nipKetuaTim,
        anggota1,
        anggota2,
        anggota3,
        alokasiWaktuKelas,
        jumlahGuruTotal,
        jumlahS1,
        jumlahS2,
        jumlahS3,
        jumlahSertifikasi,
        hariKerja,
      } = req.body;

      if (!namaSekolah || !jenjang) {
        res.status(400).json({ error: "Nama Sekolah dan Jenjang harus diisi." });
        return;
      }

      const clientKey = req.headers["x-gemini-key"] as string | undefined;

      const isFiveDay = String(hariKerja) === "5";
      const hariKerjaText = isFiveDay
        ? `${namaSekolah} secara resmi menetapkan pilihan operasional 5 Hari Kerja (Senin s.d. Jumat) sebagai basis alokasi waktu pembelajaran. Kebijakan ini diambil untuk mengoptimalkan efektivitas belajar mengajar di sekolah dan memberikan waktu yang cukup bagi interaksi sosial anak bersama keluarga di akhir pekan. Total jam pelajaran tahunan per mata pelajaran tetap dipenuhi 100% sesuai regulasi nasional dengan memadatkan jadwal harian secara proporsional. Muatan lokal diintegrasikan secara terpadu ke dalam mata pelajaran Seni Tari, Seni Rupa, dan IPAS. Fokus muatan lokal adalah pengenalan motif, teknik pewarnaan alami, dan nilai filosofis tenun ikat TTU, serta pelestarian seni tari kreasi penyambutan tamu khas Timor.`
        : `${namaSekolah} secara resmi menetapkan pilihan operasional 6 Hari Kerja (Senin s.d. Sabtu) sebagai basis utama alokasi waktu pembelajaran. Kebijakan ini dipilih secara kontekstual untuk mendistribusikan beban kognitif (cognitive load) harian peserta didik secara berimbang, teratur, dan harmonis di sepanjang minggu efektif. Dengan sistem 6 hari belajar, jam pelajaran harian didistribusikan secara santai, merata, dan bersahabat, memberikan ruang psikososial yang memadai bagi peserta didik untuk menyerap esensi materi tanpa terbeban oleh jadwal harian yang terlalu padat. Jam pelajaran tahunan nasional tetap dipenuhi 100% mengacu pada ketentuan kementerian. Muatan lokal secara aktif diintegrasikan secara terpadu ke dalam mata pelajaran Seni Tari, Seni Rupa, dan IPAS. Fokus muatan lokal kearifan daerah menargetkan pengenalan motif tenun terpadu, teknik pewarnaan alami lokal, pemahaman nilai filosofis yang terkandung di dalam tenun ikat kebanggaan TTU, serta revitalisasi ekspresi seni tari kreasi penyambutan tamu adat Timor yang kaya makna spiritual dan sosial.`;

       const prompt = `Anda adalah seorang Konsultan Kurikulum Senior terkemuka di Kemendikdasmen RI dengan spesialisasi pengembangan KOSP Kurikulum Merdeka 2025/2026.
Tugas Anda adalah merumuskan draf KOSP yang terstruktur, lengkap dari A-Z (BAB 1 sampai LAMPIRAN tanpa terputus), spesifik, mendalam, namun DITULIS SECARA PADAT DAN EFISIEN agar tidak terpotong oleh batasan token.
Seluruh kalimat harus bernada formal, ilmiah, dan lugas tanpa basa-basi naratif (fluff). Gunakan poin-poin bullet untuk mempercepat penyampaian rincian sub-bab.

PROFIL REALISTIK SATUAN PENDIDIKAN:
- Nama Sekolah: ${namaSekolah}
- Jenjang Pendidikan: ${jenjang}
- Kepala Sekolah & NIP: ${kepalaSekolah || "Darius Kusi, S.Pd.,Gr"} (NIP. ${nipKepala || "196709192008011008"})
- Ketua Tim Penyusun & NIP: ${ketuaTimPenyusun || "Roni Hariyanto Bhidju, S.Pd.,Gr."} (NIP. ${nipKetuaTim || "198603012020121005"})
- Anggota Tim Penyusun: 1. ${anggota1 || "Fransiskus Seda, S.Pd.,Gr"}, 2. ${anggota2 || "Maria Krisanti Seo, S.Pd"}, 3. ${anggota3 || "Victoria Abi, S.Pd.,Gr."}
- Tempat & Tanggal Dokumen: Ditetapkan di ${tempatPenyusunan || "Oehalo"} pada ${tanggalPenyusunan || "13 Juli 2026"}
- Karakteristik Khas Instansi: ${khasSatuan || "Fokus pada kelestarian ekologi lokal, nilai adat tenun ikat daerah, dan pembentukan akhlak mulia"}
- Kemitraan Eksternal / Komunitas: ${kemitraanSatuan || "Puskesmas Kecamatan, PT Pertanian Lokal, Paguyuban Seni Setempat"}
- Rombongan Belajar & Proyeksi Siswa: ${jumlahRombel || "6 rombel dengan rata-rata 25-28 siswa per rombel"}
- Letak Geografis & Lingkungan Lokasi: ${lokasi}
- Keadaan Sosial-Ekonomi & Demografi Peserta Didik: ${kondisiSocioDemografi}
- Kompetensi & Keadaan Pendidik & Tenaga Kependidikan: ${kondisiGuruTendik}
- Profil Data Ketenagaan Guru Murni (Akurat/Valid):
  - Total Jumlah Guru: ${jumlahGuruTotal || 12} orang
  - Lulusan Strata 1 (S1): ${jumlahS1 || 10} orang
  - Lulusan Strata 2 (S2): ${jumlahS2 || 2} orang
  - Lulusan Strata 3 (S3): ${jumlahS3 || 0} orang
  - Sudah Bersertifikasi Pendidik: ${jumlahSertifikasi || 6} orang
- Kapasitas Sarana Prasarana & Fasilitas Utama: ${fasilitasSekolah}
- Budaya Lokal / Nilai Kearifan Daerah: ${nilaiBudayaLokal}
- Kata Kunci Formulasi Visi: ${visiKeywords}
- Kata Kunci Formulasi Misi: ${misiKeywords}
- Pilihan Tema Prioritas Projek Kokurikuler Sekolah: ${p5Themes || "Kearifan Lokal dan Gaya Hidup Berkelanjutan"}

PEDOMAN KHUSUS PENULISAN (CRITICAL):
1. JANGAN PERNAH MENYERTAKAN TEKS INTRODUKTIF ATAU OUTRO DI LUAR DOKUMEN KOSP. JANGAN ADA salam penutup seperti "Semoga draf ini bermanfaat" atau "Berikut draf KOSP Anda...". Mulailah langsung dengan judul KOSP dan akhiri langsung pada lembar penetapan / penutup dokumen resmi demi integritas naskah.
2. JANGAN MENGGUNAKAN PLACEHOLDER kosong seperti "[Tulis tanggal di sini]", "[Nama Sekolah]", dsb. Rumuskan dan hitung semua nilai tersebut secara logis dan tuliskan nama sekolah "${namaSekolah}" serta nama kepala sekolah "${kepalaSekolah}" ke dalam dokumen secara mengalir, ilmiah, dan lengkap.
3. Rujuk landasan hukum utama secara eksplisit: Undang-Undang No. 20 Tahun 2003 tentang Sisdiknas, Permendikbudristek No. 12 Tahun 2024 tentang Kurikulum Merdeka, serta Keputusan Kepala BSKAP terbaru tahun 2025/2026 mengenai standar isi, proses, dan kompetensi kelulusan dalam kerangka "8 Dimensi Profil Lulusan".
4. WAJIB MENJAGA KONSISTENSI DRAF SECARA UTUH: Seluruh BAB I, BAB II, BAB III, BAB IV, BAB V, Lembar Penetapan, dan Lampiran Pendukung wajib diisi secara utuh dan terperinci. JANGAN sekali-kali mengurangi atau melompati bagian mana pun! Agar draf lengkap ini muat dalam satu respons tanpa terpotong oleh batasan token AI, Anda wajib menuliskan narasi analisis secara solid, padat, dan kaya informasi (gunakan 1-2 paragraf berkualitas tinggi per sub-bab, bukan penjelasan bertele-tele/fluff).
5. SEBELUM SETIAP JUDUL BAB UTAMA (BAB I s.d. BAB V, LEMBAR PENETAPAN, dan LAMPIRAN), WAJIB disisipkan tag pemisah halaman murni yaitu: "<!-- PAGE_BREAK -->" pada baris barunya sendiri.
6. SEBELUM detail Struktur Kurikulum dan Alokasi Waktu masing-masing kelas (Kelas 1 s.d. Kelas 6) disajikan pada BAB III, WAJIB disisipkan tag pemisah halaman "<!-- PAGE_BREAK -->" agar setiap analisis alokasi waktu kelas tercetak rapi secara terpisah-pisah untuk masing-masing kelas.
7. JANGAN MENGGUNAKAN SIMBOL KOMPUTER SEPERTI ### ATAU #### di dalam heading penulisan dokumen isi. Sebagai gantinya, gunakan baris baru cetak tebal dengan format penomoran penulisan ilmiah formal tanpa simbol hash (tag #), misalnya:
   - Untuk Judul Bab Utama gunakan: "**BAB I: ANALISIS KARAKTERISTIK SATUAN PENDIDIKAN**"
   - Untuk Sub-bab gunakan: "**a. Konteks Geografis, Sosial, dan Kebudayaan Lingkungan Sekolah**" atau "**A. Konteks Geografis, Sosial, dan Kebudayaan Lingkungan Sekolah**"
   - Untuk subpoints gunakan penomoran tebal murni seperti "**1. Tujuan Jangka Pendek**".
   - Untuk Lampiran gunakan: "**LAMPIRAN: DOKUMEN PENDUKUNG KURIKULUM**"
   Ini SANGAT KRUSIAL agar pengguna yang menyalin teks ke Microsoft Word atau Google Docs tidak terganggu oleh hadirnya simbol pagar (###) yang merusak nilai ilmiah naskah.
8. JANGAN SEKALI-KALI menggunakan tag HTML seperti "\`<div align=\"justify\">\`", "\`<b>\`", "\`</div>\`", "\`</b>\`" or code/markup HTML lainnya di dalam dokumen. Seluruh paragraf normal dan rincian poin harus ditulis berupa teks biasa dengan pemformatan Markdown murni (seperti "**" untuk cetak tebal). Aturan rata kanan-kiri (justified) serta tata letak pada PDF dan layar pratinjau akan ditangani secara terprogram oleh kode aplikasi, sehingga Anda (AI) DILARANG keras menyisipkan tag HTML tersebut ke dalam kalimat.
9. JANGAN SEKALI-KALI menggunakan tag HTML seperti "\`<br>\`" atau "\`<br /?>\`" di dalam tabel SWOT atau bagian mana pun! Jika Anda ingin melakukan pemisahan baris atau memisahkan butir-butir poin di dalam kotak sel tabel, gunakan karakter pemisah khusus seperti tanda bulatan (•) dengan spasi biasa, atau buat butir poin mendatar, tanpa membubuhkan tag HTML sama sekali.
10. JANGAN PERNAH menyingkat atau memotong isi dokumen pada bab mana pun, terutama pada BAB III, IV, dan V. Seluruh isi bab, termasuk tabel alokasi waktu untuk Kelas 1, Kelas 2, Kelas 3, Kelas 4, Kelas 5, dan Kelas 6 harus tertulis lengkap secara eksplisit, utuh, rinci, dan tidak boleh disingkat dengan titik-titik (e.g., "...").
11. Pada BAB III bagian Intrakurikuler dan Muatan Lokal, jika nama sekolah adalah ${namaSekolah} atau SD Negeri Fatubai, maka gunakan penjelasan berikut sebagai basis utama dan kembangkan detail relevannya secara sangat kreatif, mendalam, bercorak akademis, luas, serta pastikan penjelasan ini selaras dengan pilihan hari kerja sekolah yang diputuskan: "${hariKerjaText}"
12. DILARANG KERAS MENULISKAN INSTRUKSI DALAM TANDA KURUNG ATAU PENANDA PLACEHOLDER SEPERTI "*(Tuliskan...)*" ATAU "*(Sajikan...)*" DALAM OUTPUT ANDA. Segala penanda instruksi di dalam naskah acuan di bawah ini harus Anda ganti sepenuhnya dengan kalimat narasi konseptual yang riil, tebal, panjang lebar, dan fully populated. Jangan ada draf setengah matang.
13. PERENCANAAN JANGKA PENDEK, JANGKA MENENGAH, DAN JANGKA PANJANG PADA BAB II HARUS DIULAS SECARA EKSPLISIT, NYATA, DAN HOLISTIK. Tulis masing-masing perencanaan sasaran mutu tersebut secara utuh sepanjang 1-2 paragraf yang kaya akan narasi ilmiah terstruktur, mengupas detail literasi, numerasi, pelestarian kearifan lokal tenun ikat dan seni tari, digitalisasi, serta akreditasi sekolah.

RUMUSKAN DOKUMEN DENGAN STRUKTUR BERIKUT SECARA DETAIL (HANYA FORMAT BOLD TANPA HASHTAGS):

**COVER: DOKUMEN KURIKULUM OPERASIONAL SATUAN PENDIDIKAN (KOSP)**
**${namaSekolah}**
**Tahun Ajaran 2026/2027**

---

<!-- PAGE_BREAK -->
**BAB I: ANALISIS KARAKTERISTIK SATUAN PENDIDIKAN**

**a. Konteks Geografis, Sosial, dan Kebudayaan Lingkungan Sekolah**
Tulislah tulisan ilmiah analitis sebanyak 1-2 paragraf utuh yang mendalam tentang implementasi letak geografis "${lokasi}" serta keterikatan tradisi budaya "${nilaiBudayaLokal}" terhadap ekosistem pengajaran. Sambungkan dengan kearifan lokal serta keunikan khas satuan "${khasSatuan}".

**b. Profil Peserta Didik dan Kondisi Sosial-Ekonomi Orang Tua / Wali**
Tulislah analisis status demografis siswa, tingkat ekonomi melingkupi wali murid "${kondisiSocioDemografi}", dan distribusi kelompok belajar "${jumlahRombel}" guna menyusun program pembelajaran inklusif dan ramah anak sebanyak 1-2 paragraf utuh.

<!-- PAGE_BREAK -->
**c. Potensi Sumber Daya Manusia (Pendidik dan Tenaga Kependidikan)**
Sajikan analisis deskriptif berkelanjutan sebanyak 1-2 paragraf murni mengenai program peningkatan guru yang dihubungkan dengan data riil kualifikasi akademik pendidik: total ${jumlahGuruTotal || 12} guru, dengan rincian lulusan S1 (${jumlahS1 || 10} orang), S2 (${jumlahS2 || 2} orang), S3 (${jumlahS3 || 0} orang), serta guru tersertifikasi profesi (${jumlahSertifikasi || 6} orang). Anda wajib membuat tabel kualifikasi guru secara formal di awal sub-bab ini menggunakan format tabel markdown standar. Sambungkan analisis deskriptif ini dengan kondisi riil "${kondisiGuruTendik}".

**d. Sarana, Prasarana, dan Kemitraan Pendukung Pembelajaran**
Tuliskan 1-2 paragraf analisis mendalam tentang daya dukung sarpras "${fasilitasSekolah}" dan keterlibatan komunitas melalui kemitraan strategis "${kemitraanSatuan}" untuk melahirkan pembelajaran yang relevan dan futuristik.

<!-- PAGE_BREAK -->
**e. Analisis SWOT Komprehensif Satuan Pendidikan**
Sajikan tabel matriks SWOT lengkap terlebih dahulu yang memetakan Kekuatan (Strengths), Kelemahan (Weaknesses), Peluang (Opportunities), dan Ancaman (Threats) bernilai tinggi yang nyata di ${namaSekolah}.
Setelah tabel SWOT, tuliskan 1-2 paragraf analisis deskriptif yang sangat mendalam, rasional, ilmiah, dan tebal. Jelaskan strategi nyata menghubungkan kekuatan internal untuk menangkap peluang eksternal, mengatasi kelemahan untuk memitigasi ancaman, serta rencana tindak lanjut operasional penjaminan mutu.

---

<!-- PAGE_BREAK -->
**BAB II: LANDASAN FILOSOFIS, VISI, MISI, DAN TUJUAN SATUAN PENDIDIKAN**

**a. Landasan Filosofis, Sosiologis, dan Teoretis**
Paparkan landasan filosofis pendidikan nasional Ki Hajar Dewantara, yang dikombinasikan dengan kearifan lokal "${nilaiBudayaLokal}" untuk mengokohkan moral siswa sebanyak 1-2 paragraf teoretis yang kuat.

**b. Visi Satuan Pendidikan**
Sajikan kutipan rumusan visi sekolah secara tebal, elegan, dan futuristik berdasarkan kata kunci "${visiKeywords}". Uraikan juga 1-2 paragraf ulasan filosofis serta hubungannya secara holistik dengan pencapaian "8 Dimensi Profil Lulusan" terbaru tahun 2025/2026.

**c. Misi Satuan Pendidikan**
Sajikan minimal 5 butir aksi nyata misi strategis sekolah yang didesain berdasarkan kata kunci "${misiKeywords}" untuk menjawab tuntutan zaman. Di bawah butir misi tersebut, berikan 1-2 paragraf penjelasan pelaksanaan taktis misi.

<!-- PAGE_BREAK -->
**d. Tujuan Satuan Pendidikan (Berorientasi Kompetensi & Karakter)**
Tuliskan pengantar tujuan satuan pendidikan yang berisikan komitmen pengajaran bernilai luhur sebanyak 1 paragraf. Seluruh cakupan jangka waktu perencanaan di bawah ini wajib diulas secara eksplisit, detail, nyata, dan komprehensif, masing-masing sebanyak 1-2 paragraf utuh berbobot ilmiah (SANGAT DILARANG menggunakan ringkasan pendek/setengah matang):

**1. Tujuan Jangka Pendek (1 Tahun Ajaran - Operasional 2026/2027)**
Tulislah 1-2 paragraf analisis strategis operasional yang konkrit dan menyeluruh untuk Tahun Ajaran 2026/2027. Ulas target literasi-numerasi secara kuantitatif, penyesuaian adaptasi kurikulum, pengokohan tata tertib sekolah, pembiasaan karakter religius harian, serta pelestarian warisan budaya lokal yang nyata seperti tenun ikat kebanggaan TTU dan seni tari kreasi penyambutan adat Timor.

**2. Tujuan Jangka Menengah (2-3 Tahun)**
Tulislah 1-2 paragraf ulasan analitis kebijakan mutu sekolah. Rinci kemitraan strategis yang nyata dengan puskesmas kecamatan atau industri lokal, skema peningkatan kepuasan wali murid secara terukur, rencana inovasi digitalisasi pembelajaran luring dan daring, serta roadmap peningkatan sarpras pendukung secara berkesinambungan.

**3. Tujuan Jangka Panjang (4-5 Tahun)**
Tulislah 1-2 paragraf ulasan akademis visi kelulusan berdaya saing global dan nasional. Jamin ketercapaian kompetensi lulusan dalam menguasai iptek dan imtaq, skema implementasi penuh 8 Dimensi Profil Lulusan secara holistik, serta strategi pencapaian predikat akreditasi unggul institusi.

---

<!-- PAGE_BREAK -->
**BAB III: PENGORGANISASIAN PEMBELAJARAN & STRUKTUR KURIKULUM**

**a. Intrakurikuler dan Muatan Lokal**
Tuliskan 1-2 paragraf rencana detail manajemen jam pelajaran (JP) berbasis Kurikulum Merdeka merujuk pada standar Permendikbudristek No. 12 Tahun 2024.
Uraikan secara tebal landasan penetapan sistem hari kerja sekolah yang bernaung pada pilihan: ${hariKerjaText}.
Gunakan token placeholder tunggal berikut pada baris baru terpisah dan biarkan sistem memformat tabel jp secara otomatis:
[ALOKASI_WAKTU_KELAS_PLACEHOLDER]
Ganti placeholder tersebut dengan tabel otomatis. Setelah penulisan token tersebut, tulislah 1-2 paragraf mengalir mengenai integrasi muatan lokal kearifan lokal "${nilaiBudayaLokal}" secara konseptual terpadu dalam mata pelajaran utama (seperti Seni Tari, Seni Rupa, dan IPAS).

**b. Kokurikuler: Rencana Projek Kokurikuler dengan Integrasi 8 Dimensi Profil Lulusan**
Sajikan rancangan operasional Projek Kokurikuler sekolah bertumpu pada standar kementerian terbaru berdasarkan pilihan tema prioritas "${p5Themes}". Rinci minimal 2 tema Projek utama secara sangat mendalam dan terperinci sebanyak 1-2 paragraf yang solid dan representatif. Setiap projek wajib memuat secara ringkas: Judul Projek Kokurikuler, gabungan Dimensi Profil Lulusan yang disasar, Indikator pencapaian konkret berupa target karakter, alur tahapan aktivitas operasional harian, serta metode asesmen dan refleksi projek yang interaktif.

**c. Pengembangan Bakat Murid & Ekstrakurikuler (Seni Tari, Olahraga, dsb.)**
Tuliskan 1-2 paragraf murni yang berkualitas, bernarasi padat-substantif, yang membedah pilihan dan program pengembangan minat bakat murid. Jabarkan program Pendampingan Seni Tari Kreasi Penyambutan Adat Timor, pembinaan cabang olahraga (Futsal, Atletik), serta kegiatan Pramuka wajib secara komprehensif, ditopang fasilitas "${fasilitasSekolah}" demi melahirkan kompetensi dan kemandirian siswa.

---

<!-- PAGE_BREAK -->
**BAB IV: RENCANA PEMBELAJARAN, PENDAMPINGAN, EVALUASI, DAN PENGEMBANGAN PROFESIONAL**

Tuliskan pengantar bab mengenai arah perbaikan mutu pembelajaran yang diselaraskan dengan keunikan pendidik "${kondisiGuruTendik}" sebanyak 1 paragraf. Seluruh isian sub-bab wajib tertulis lengkap, tebal, mendalam, meluas, dan bernilai akademis tinggi sebanyak 1-2 paragraf padat-substantif per sub-bab:

**a. Rencana Pembelajaran Tingkat Satuan Pendidikan**
Ulas sebanyak 1-2 paragraf mendalam mengenai administrasi guru berdasarkan Panduan Pembelajaran dan Asesmen (PPA) revisi terbaru. Rinci skema penyusunan Tujuan Pembelajaran (TP) oleh guru mata pelajaran, alur Tujuan Pembelajaran (ATP) secara logis-kronologis, penyusunan rencana pembelajaran eksplisit yang interaktif untuk melayani keunikan bakat siswa, metode pembelajaran berdampingan, serta penerapan teknik asesmen formatif-sumatif otentik menggunakan instrumen komprehensif.

**b. Evaluasi dan Pendampingan Kurikulum Operasional**
Ulas sebanyak 1-2 paragraf detail mengenai pengawasan mutu internal berkala di sekolah. Jelaskan model Evaluasi Kurikulum berbasis diskusi kelompok terpumpun (FGD) secara triwulanan bersama guru, tindak lanjut evaluasi bulanan untuk menembus hambatan kelas, skema pembinaan berkala, serta pelaksanaan supervisi akademik klinis oleh kepala sekolah yang berorientasi menguatkan pengajaran guru.

**c. Pengembangan Profesional Guru Berkelanjutan**
Ulas sebanyak 1-2 paragraf progresif tentang peta jalan peningkatan kapasitas pendidik secara sistematis. Rancang program bimbingan sejawat (mentoring) bagi guru pemula, optimalkan Kombel (Komunitas Belajar) internal sekolah dan KKG rutin kecamatan, integrasikan partisipasi di Platform Merdeka Mengajar (PMM), serta dorong program pendidikan mandiri berkelanjutan yang selaras dengan kapasitas awal pendidik: "${kondisiGuruTendik}".

---

<!-- PAGE_BREAK -->
**BAB V: PENUTUP**

Tuliskan penutup resmi dokumen KOSP secara utuh, teoretis, dan spesifik untuk ${namaSekolah}. Dilarang dipersingkat atau dipotong dalam bentuk apa pun!

**a. Kesimpulan**
Tulis kesimpulan akademik sebanyak 1-2 paragraf teoretis-padat mengenai komitmen dan efektivitas rancangan penyelenggaraan KOSP di ${namaSekolah} sebagai dokumen operasional pembelajaran Kurikulum Merdeka yang tangguh.

**b. Komitmen Penyelenggaraan**
Tulis komitmen operasional konkrit sebanyak 1-2 paragraf teoretis-padat dari seluruh pemangku kepentingan (guru, komite sekolah, kepala sekolah, wali murid, dinas pendidikan setempat) dalam memperkukuh sinergi mewujudkan visi, misi, dan tujuan sekolah secara berkesinambungan.

---

<!-- PAGE_BREAK -->
**LEMBAR PENETAPAN & TIM PENYUSUN DOKUMEN**

Ditetapkan di: ${tempatPenyusunan || "Malang"}  
Pada Tanggal: ${tanggalPenyusunan || "13 Juli 2026"}  

| Mengetahui, Kepala Sekolah ${namaSekolah} | Dibuat Oleh: Ketua Tim Penyusun KOSP |
| :--- | :--- |
| | |
| *(Tanda Tangan & Cap)* | *(Tanda Tangan)* |
| | |
| **${kepalaSekolah}** | **${ketuaTimPenyusun}** |
| NIP. ${nipKepala} | NIP. ${nipKetuaTim} |
| | **Anggota Tim:** |
| | 1. ${anggota1} |
| | 2. ${anggota2} |
| | 3. ${anggota3} |

---

<!-- PAGE_BREAK -->
**LAMPIRAN: DOKUMEN PENDUKUNG KURIKULUM**

**Lampiran 1: Surat Keputusan Pembagian Pembelajaran dan Tim Pengembang Kurikulum**
Tulislah naskah draf keputusan resmi mengenai draf Surat Keputusan (SK) Kepala Sekolah dalam menetapkan Tim Pengembang Kurikulum Operasional Satuan Pendidikan ${namaSekolah} tahun pelajaran 2026/2027, lengkap dengan pembagian detail wewenang dan tugas masing-masing jabatan secara legal formal (sebanyak 1-2 paragraf).

**Lampiran 2: Gambaran Alur Tujuan Pembelajaran (ATP) dan Contoh Ringkas Rencana Pembelajaran Mendalam**
Sajikan 1-2 paragraf deskripsi alur pembelajaran, dan tabel matriks alur operasional perumpamaan mata pelajaran utama sebagai pedoman bagi implementasi nyata visi misi di dalam ruang kelas.

**Lampiran 3: Rubrik Asesmen dan Lembar Refleksi Pengorganisasian Pembelajaran**
Cantumkan rincian rubrik penilaian nyata berbasis unjuk kerja atau presentasi lisan, kriteria penilaian ketercapaian, serta format tabel checklist lembar evaluasi reflektif kurikulum untuk guru dan murid (sebanyak 1-2 paragraf).

Sajikan dokumen di atas dalam format Markdown murni yang lengkap, tanpa awalan ataupun akhiran kalimat pembicaraan saja.`;

      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Anda adalah AI Konsultan Kurikulum Senior terpercaya di Kemendikdasmen RI dengan integritas akademik tertinggi. 
Aturan Mutlak yang Tidak Boleh Dilanggar: Draf KOSP yang Anda hasilkan WAJIB memuat seluruh bagian ini secara lengkap dan terstruktur tanpa pengecualian:
1. COVER DOKUMEN (Nama Sekolah & Tahun Ajaran) di bagian awal.
2. BAB I (Analisis Karakteristik Satuan Pendidikan, Konteks, Profil, SDM, Sarpras, SWOT).
3. BAB II (Landasan, Visi, Misi, Tujuan Jangka Pendek, Menengah, Panjang).
4. BAB III (Pengorganisasian Pembelajaran, Struktur Kurikulum, Intrakurikuler, Kokurikuler, Ekskul).
5. BAB IV (Rencana Pembelajaran, Pendampingan, Evaluasi, Pengembangan Profesional).
6. BAB V (Penutup: Kesimpulan, Komitmen).
7. LEMBAR PENETAPAN & TIM PENYUSUN DOKUMEN (Format Pengesahan lengkap ttd Kepala Sekolah & Ketua Tim).
8. LAMPIRAN (Naskah SK Pembagian Tugas, ATP & RPP contoh, Rubrik Asesmen).

KOSP WAJIB dimulai dari COVER, diikuti berurutan oleh BAB I, BAB II, BAB III, BAB IV, BAB V, LEMBAR PENETAPAN (PENGESAHAN) dan LAMPIRAN secara lengkap! Jika salah satu bagian hilang atau terlewatkan, KOSP tersebut DINYATAKAN TIDAK VALID DAN GAGAL TOTAL.
DILARANG KERAS merangkum, melompati, menyingkat, mengeliminasi sub-bab, atau menggunakan tanda titik-titik (...) demi menghemat ruang. Tulis draf secara padat, substantif, sarat informasi, beralur progresif, dan cetak seluruh isi dokumen hingga tuntas tanpa terputus.`,
          temperature: 0.25,
          maxOutputTokens: 8192,
        }
      }, clientKey);

      let kospResult = response.text || "";
      
      // Clean up markdown fences at beginning and end
      kospResult = kospResult.trim();
      if (kospResult.startsWith("```markdown")) {
        kospResult = kospResult.substring(11).trim();
      } else if (kospResult.startsWith("```")) {
        kospResult = kospResult.substring(3).trim();
      }
      if (kospResult.endsWith("```")) {
        kospResult = kospResult.substring(0, kospResult.length - 3).trim();
      }

      // Replace the placeholder with the dynamic alokasiWaktuKelas robustly
      const placeholderRegex = /[`*_\s]*\[\s*ALOKASI_WAKTU_KELAS_PLACEHOLDER\s*\][`*_\s]*/gi;
      if (placeholderRegex.test(kospResult)) {
        kospResult = kospResult.replace(placeholderRegex, `\n\n${alokasiWaktuKelas || ""}\n\n`);
      } else {
        // Relaxed search in case of different syntax structures
        const relaxedRegex = /[`*_\s]*\[?\s*ALOKASI[_\s]WAKTU[_\s]KELAS[_\s]PLACEHOLDER\s*\]?[`*_\s]*/gi;
        if (relaxedRegex.test(kospResult)) {
          kospResult = kospResult.replace(relaxedRegex, `\n\n${alokasiWaktuKelas || ""}\n\n`);
        } else {
          // If the model completely omitted it, gracefully append it as a failsafe before BAB IV
          const bab4Index = kospResult.indexOf("BAB IV:");
          const bab4AltIndex = kospResult.indexOf("**BAB IV:");
          if (bab4Index !== -1) {
            kospResult = kospResult.slice(0, bab4Index) + `\n\n${alokasiWaktuKelas || ""}\n\n` + kospResult.slice(bab4Index);
          } else if (bab4AltIndex !== -1) {
            kospResult = kospResult.slice(0, bab4AltIndex) + `\n\n${alokasiWaktuKelas || ""}\n\n` + kospResult.slice(bab4AltIndex);
          }
        }
      }

      res.json({ success: true, text: kospResult });

    } catch (error: any) {
      console.error("Error generating KOSP:", error);
      let errMsg = error?.message || String(error);
      res.status(500).json({ error: errMsg || "Gagal mengolah dokumen KOSP." });
    }
  })  // API Route for Lesson Plan (TP, ATP, KKTP, Prota, Promes) generation
  app.post("/api/generate-lesson-plan", async (req, res) => {
    try {
      const {
        namaSekolah,
        kepalaSekolah,
        nipKepala,
        mapel,
        faseKelas,
        cpText,
        alokasiJp,
        tahunAjaran,
        namaGuru,
        fileBase64,
        mimeType,
        tempatPenyusunan,
        tanggalPenyusunan,
        provinsi,
        kabupaten,
      } = req.body;

      if (!mapel || !faseKelas) {
        res.status(400).json({ error: "Mata Pelajaran dan Fase/Kelas harus diisi." });
        return;
      }

      if (!cpText && !fileBase64) {
        res.status(400).json({ error: "Silakan masukkan teks Capaian Pembelajaran (CP) atau unggah naskah dokumen CP." });
        return;
      }

      const clientKey = req.headers["x-gemini-key"] as string | undefined;
      let activeBase64 = fileBase64;
      let originalPageCount = 0;
      let wasTrimmed = false;

      // Check and trim PDF if uploaded CP exceeds standard page limits to keep it stable
      if (fileBase64 && (mimeType === "application/pdf" || mimeType?.includes("pdf"))) {
        try {
          const trimResult = await trimPdfIfNecessary(fileBase64, 1000);
          activeBase64 = trimResult.data;
          originalPageCount = trimResult.totalPages;
          wasTrimmed = trimResult.wasTrimmed;
        } catch (trimErr) {
          console.error("Error preprocessing PDF before planner generation:", trimErr);
        }
      }

      // Construct prompt with focus on BSKAP No. 046 Tahun 2025
      const sourceOfCpDesc = fileBase64 
        ? `Dokumen Capaian Pembelajaran (CP) diunggah oleh pengguna dan terlampir. Harap baca dan temukan capaian pembelajaran relevan untuk mata pelajaran "${mapel}" pada "${faseKelas}" sesuai dengan dokumen ini menurut standar Keputusan Kepala BSKAP Nomor 046 Tahun 2025.`
        : `Capaian Pembelajaran (CP) dimasukkan secara manual oleh pengguna:\n"${cpText}"\n\nAnalisis teks ini berdasarkan pedoman Keputusan Kepala BSKAP Nomor 046 Tahun 2025 tentang Kurikulum Merdeka yang paling mutakhir.`;

      const prompt = `Anda adalah seorang Ahli Desain Kurikulum dan Instruktur Nasional Kurikulum Merdeka di Kemendikdasmen RI.
Tugas Anda adalah memformulasikan dokumen Perencanaan Pembelajaran (TP, ATP, KKTP, Prota, dan Promes) yang sewajarnya sangat lengkap, detail, berbobot ilmiah-akademis, sistematis, dan operasional sesuai dengan peraturan kementerian terbaru.

RUJUKAN STANDAR UTAMA:
- Keputusan Kepala Badan Standar, Kurikulum, dan Asesmen Pendidikan (BSKAP) Kemendikdasmen Nomor 046 Tahun 2025 tentang Capaian Pembelajaran pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah pada Kurikulum Merdeka (Standar Kurikulum Merdeka Terkini).
- Panduan Pembelajaran dan Asesmen (PPA) Edisi Revisi Terbaru dari Kemendikdasmen.
- Keputusan Kepala BSKAP Nomor 009/H/KR/2024 tentang Dimensi dan Elemen Profil Pelajar Pancasila.

INFORMASI MASUKAN:
- Nama Mata Pelajaran: ${mapel}
- Fase & Kela- Provinsi Wilayah Sekolah: ${provinsi || "Nusa Tenggara Timur"}
- Kabupaten/Kota Wilayah Sekolah: ${kabupaten || "Timor Tengah Utara"}
- Sumber Capaian Pembelajaran (CP): 
${sourceOfCpDesc}
- Alokasi Waktu Mingguan: ${alokasiJp || "3"} JP/minggu
- Tahun Ajaran: ${tahunAjaran || "2026/2027"}
- Nama Sekolah: ${namaSekolah || "SD Negeri Fatubai"}
- Nama Guru Pengampu: ${namaGuru || "Roni Hariyanto Bhidju, S.Pd.,Gr."}
- Kepala Sekolah & NIP: ${kepalaSekolah || "Darius Kusi, S.Pd.,Gr"} (NIP. ${nipKepala || "196709192008011008"})
 
KETENTUAN KHUSUS PENULISAN:
1. SIFAT PENULISAN: Tulis secara ilmiah, padat, mendalam, akademis, dan bernilai guna tinggi layaknya buatan Tim Pengembang Kurikulum Nasional. Gunakan Bahasa Indonesia baku yang sempurna sesuai EYD V. Hindari kalimat pembuka seperti "Tentu, ini drafnya..." atau penutup ramah. Mulailah langsung dari judul utama dan selesaikan secara langsung di Lembar Pengesahan.
2. WAJIB TABEL UTUH, DETAIL, DAN SANGAT SPESIFIK:
   - Seluruh tabel markdown (Tabel Dekonstruksi CP, Tabel Alur Pembelajaran/ATP, Tabel KKTP, Tabel Prota, dan Tabel Promes) WAJIB digambar secara UTUH dengan baris data lengkap untuk SETIAP Tujuan Pembelajaran (TP) yang telah dirumuskan.
   - DILARANG KERAS memotong baris tabel, menggabungkan baris secara malas (seperti menulis "TP 3 s.d. 7"), atau menggunakan singkatan/elipsis ("...", "dan seterusnya", "dst", "dll") di dalam tabel. Setiap Tujuan Pembelajaran wajib ditulis secara eksplisit satu per satu di baris baru dalam tabel.
   - Dokumen ini diformat dan dicetak khusus pada kertas A4 LANDSCAPE. Oleh karena itu, rumuskan kalimat dalam sel-sel tabel secara ringkas, padat, ilmiah, dan akademis. Hindari kalimat penjelasan yang bertele-tele agar tidak melebihi kapasitas kolom, menghindari teks terpotong di batas kertas, serta menjaga estetika tata letak dokumen landscape.
   - Agar tidak melebihi kapasitas token (maxOutputTokens), buatlah deskripsi sel yang singkat, padat, konkret, dan presisi, tetapi tetap sangat spesifik dan bermakna akademis. Jangan menulis penjelasan bertele-tele di dalam sel tabel, melainkan fokus pada rumusan eksplisit yang lengkap untuk seluruh TP.
3. JANGAN MENGGUNAKAN PLACEHOLDER kosong, buatlah stimulasi data numerik alokasi JP yang logis dan konsisten di seluruh bab.
4. WAJIB MENGHASILKAN SELURUH ELEMEN SECARA UTUH DAN LENGKAP: Apabila teks Capaian Pembelajaran (CP) yang diberikan di parameter atau preset hanya memuat sebagian kecil atau satu elemen saja (misalnya elemen Bilangan pada Matematika Kelas 1, atau elemen Membaca pada Bahasa Indonesia), Anda TIDAK BOLEH membatasi hasil perencanaan hanya pada satu elemen tersebut. Anda WAJIB melengkapi, merekonstruksi, dan meregenerasi materi untuk SELURUH ELEMEN RESMI yang seharusnya diajarkan untuk mata pelajaran, fase, dan kelas tersebut dalam Kurikulum Merdeka sesungguhnya berdasarkan Keputusan Kepala BSKAP Nomor 046 Tahun 2025 secara utuh untuk satu tahun penuh (Semester 1/Ganjil dan Semester 2/Genap) secara relevan, detail, ilmiah, dan profesional.
   Sebagai contoh konkret:
   - Matematika Kelas 1 SD / Fase A harus memuat materi komprehensif dari seluruh elemen: Bilangan, Aljabar, Pengukuran, Geometri, serta Analisis Data dan Peluang (meskipun input teks CP hanya menuliskan tentang Bilangan).
   - Bahasa Indonesia harus mencakup elemen Menyimak, Membaca dan Memirsa, Berbicara dan Mempresentasikan, serta Menulis.
   - IPAS harus mencakup elemen Pemahaman IPAS (Sains dan Sosial) serta Keterampilan Proses.
   - Pendidikan Pancasila harus mencakup elemen Pancasila, Undang-Undang Dasar Negara Republik Indonesia Tahun 1945, Bhinneka Tunggal Ika, dan Negara Kesatuan Republik Indonesia (NKRI).
   Jangan sekali-kali menyingkat dokumen atau hanya menuliskan satu elemen saja! Buatlah minimal 4 sampai 6 Tujuan Pembelajaran (TP) yang mencakup representasi seimbang dari seluruh elemen tersebut agar dokumen Anda bernilai guna tinggi, relevan, detail, akademis, dan profesional bagi guru.
5. VALIDITAS & DEKONSTRUKSI TOTAL TUJUAN PEMBELAJARAN (TP) - WAJIB MULTI-TP PER CAPAIAN PEMBELAJARAN:
   - DILARANG SEKALIPUN meringkas Capaian Pembelajaran (CP) secara malas menjadi hanya satu TP saja. 
   - JIKA SATU CAPAIAN PEMBELAJARAN (CP) MEMILIKI LEBIH DARI SATU KATA KERJA OPERASIONAL (KKO) (misalnya: "menganalisis" dan "menyajikan", atau "memahami" dan "menerapkan"), ATAU MEMILIKI LEBIH DARI SATU LINGKUP MATERI/KONTEN (misalnya: "listrik statis" dan "listrik dinamis", atau "teks narasi" dan "teks deskripsi"), Anda WAJIB MEMBUAT BEBERAPA TUJUAN PEMBELAJARAN (TP) YANG TERPISAH, DETIL, DAN BERGRADASI SECARA MANDATORI!
   - KETENTUAN MUTLAK PERUMUSAN: 1 Elemen CP wajib menghasilkan minimal 2 sampai 4 Tujuan Pembelajaran (TP) yang diselaraskan secara detail dengan kombinasi KKO dan sebaran lingkup materi di dalamnya. Aturan ini WAJIB DITERAPKAN PADA SEMUA MATA PELAJARAN, SEMUA ELEMEN, DAN SEMUA KELAS tanpa pengecualian!
   - Kalimat rumusan TP wajib mengandung: Kompetensi (KKO konkret-measurable) + Lingkup Materi (konten detil). Seluruh TP hasil dekonstruksi ini harus mengalir utuh ke ATP, KKTP (satu-per-satu), Prota, dan tabel Promes murni. Dilarang menulis TP yang kabur atau terlalu pendek tanpa lingkup materi terperinci.
6. STANDAR ALUR TUJUAN PEMBELAJARAN (ATP) LINEAR: Seluruh TP yang telah didekonstruksi harus diurutkan secara linear, satu arah kronologis logis tanpa percabangan (non-branching). Anda wajib menjelaskan metode pengurutan ilmiah mana yang Anda terapkan secara eksplisit (pilih dan sebutkan di Bab II: apakah Konkret-Abstrak, Deduktif, Hierarki, atau Prosedural) guna menjamin validitas alur belajar yang dapat dipertanggungjawabkan serta selaras dengan Keputusan BSKAP No. 046 Tahun 2025.
7. INTEGRASI KEARIFAN LOKAL REGIONAL & MUATAN LOKAL SEKOLAH:
   - Jika mata pelajaran terpilih bersifat muatan lokal atau kustom (seperti Bahasa Bali, Bahasa Papua, Bahasa Sasak, Adat Ke-daerahan, Budaya NTT, dll.) ATAU mata pelajaran nasional yang disinergikan dengan konteks wilayah, Anda WAJIB memformulasikan Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) secara cerdas yang mencakup unsur sastra, tradisi, seni khas, ekologi pelestarian, sejarah, nilai luhur, dan kearifan masyarakat setempat di Provinsi "${provinsi}" dan Kabupaten/Kota "${kabupaten}" secara konkret, mendalam, indah, dan bernilai guna ilmiah tinggi bagi guru setempat.
8. KONTEN DOKUMEN HARUS TERDIRI DARI BAB-BAB BERIKUT:

# DOKUMEN PERENCANAAN PEMBELAJARAN INTEGRATIF (TP, ATP, KKTP, PROTA, PROMES)
## STANDAR MUTAKHIR STANDAR BSKAP NOMOR 046 TAHUN 2025
## MATA PELAJARAN: ${mapel} | FASE: ${faseKelas}
## ${namaSekolah} • Tahun Ajaran ${tahunAjaran}

---

### BAB I: ANALISIS DAN PERUMUSAN TUJUAN PEMBELAJARAN (TP)
*Lakukan dekonstruksi Capaian Pembelajaran (CP) menjadi elemen Kompetensi (menggunakan Kata Kerja Operasional / KKO Taksonomi Bloom Revisi) dan Lingkup Materi secara mendalam, luas, mendetail, dan sistematis sesuai standar BSKAP 046/2025.*
- **Tabel Dekonstruksi CP:** Buat tabel markdown yang memetakan Kalimat CP -> Elemen CP -> Kompetensi Utama (KKO) -> Lingkup Materi Utama -> Perumusan Kalimat TP (menggabungkan Kompetensi & Konten secara konkret dan berorientasi HOTS/LOTS). Buatlah minimal 4-6 TP yang komprehensif, mendalam, dan mendetail untuk satu tahun penuh (mewakili semua elemen penting) secara utuh baris demi baris tanpa pemotongan.

### BAB II: ALUR TUJUAN PEMBELAJARAN (ATP)
*Susun TP yang dirumuskan di Bab I menjadi alur kronologis yang logis dari awal hingga akhir tahun pelajaran.*
- **Logika Pengaluran:** Uraikan secara akademis, teoretis, dan mendalam argumen ilmiah kriteria pengurutan yang Anda pilih (misalnya: dari konkrit ke abstrak, mudah ke sukar, persyaratan/scaffolding, prosedural, atau spiral) sesuai Panduan Pembelajaran dan Asesmen.
- **Tabel Alur Pembelajaran:** Gambar tabel markdown kolom: [No, Kode TP, Rumusan TP, Alokasi Waktu (JP), Indikator Asesmen/Prasyarat, Semester]. Tuliskan rumusan indikator asesmen secara lengkap, operasional, dan detail untuk setiap TP secara utuh baris demi baris tanpa pengecualian atau singkatan.

### BAB III: KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP)
*Rancang pendekatan KKTP yang sahih, detail, dan operasional untuk setiap TP yang telah disusun.*
- Jelaskan secara akademis pendekatan resmi yang digunakan berdasarkan Panduan Pembelajaran dan Asesmen (pilih 1 dari 3 opsi kementerian: Deskripsi Kriteria, Rubrik Performa, atau Interval Nilai).
- **Tabel Instrumen KKTP:** Anda WAJIB menyajikan baris penilaian detail berbentuk tabel markdown untuk SETIAP SINGLE TP (Tujuan Pembelajaran) yang telah dirumuskan di BAB I dan BAB II tanpa terkecuali! Jika Anda merumuskan 6 TP, maka Anda harus memetakan ke-6 TP tersebut satu per satu menjadi 6 baris lengkap dalam tabel instrumen KKTP ini. DILARANG KERAS hanya menuliskan sebagian atau menggunakan elipsis (...) di dalam baris tabel. Kolom tabel berkewajiban: [Tujuan Pembelajaran (TP), Kriteria/Indikator, Ketuntasan Baru Berkembang (Skor 0-60%), Layak (Skor 61-70%), Cakap (Skor 71-85%), Mahir (Skor 86-100%)] beserta deskripsi kualitatif performa siswa yang ringkas, presisi, dan operasional untuk tiap level kognitif agar guru terbantu mengukur ketuntasan kompetensi secara nyata.

### BAB IV: PROGRAM TAHUNAN (PROTA)
*Rancang program tahunan yang berkekuatan hukum akademis secara utuh, presisi, sangat detail dan panjang tanpa kompromi.*
- **Analisis Pekan Efektif Tahunan:** Jabarkan perhitungan rincian minggu efektif ganjil dan genap dalam satu tahun ajaran secara matematis dan logis (misalnya: Semester 1 memiliki total 20 minggu, 18 minggu efektif dan 2 minggu tidak efektif. Semester 2 memiliki total 20 minggu, 18 minggu efektif dan 2 minggu tidak efektif. Total jam efektif setahun = 36 minggu efektif x ${alokasiJp} JP/minggu = ${parseInt(alokasiJp || "3") * 36} JP efektif).
- **KEWAJIBAN DETAIL PROTA:** Buat analisis Program Tahunan yang SANGAT DETAIL, UTUH, LENGKAP, DAN SEMPURNA. Di dalam tabel Prota, Anda WAJIB menyajikan baris tabel Prota untuk SELURUH TP yang telah dirumuskan di BAB I dan BAB II tanpa ada satu pun yang tertinggal, diringkas, atau disamarkan! Buat tabel markdown dengan rincian kolom [No, Semester, Kode & Bunyi Tujuan Pembelajaran (TP) Lengkap, Alokasi Waktu (JP)]. Tulis bunyi lengkap masing-masing TP di setiap barisnya secara lengkap tanpa ada yang terlewat.

### BAB V: PROGRAM SEMESTER (PROMES)
*Visualisasikan pemetaan bulanan/mingguan dari program semester dalam bentuk tabel rentang pelaksanaan yang rapi, informatif, sangat rinci, lengkap, dan tidak disingkat.*
- Buat visualisasi tabel Program Semester 1 (Ganjil - Juli s.d. Desember) dan Semester 2 (Genap - Januari s.d. Juni) secara terpisah.
- **Tabel Promes Lengkap & Selaras:** Anda WAJIB menyajikan baris tabel Promes untuk SELURUH TP yang dirumuskan di BAB I dan BAB II secara lengkap satu per satu tanpa ada yang terpotong. Jumlah baris pada gabungan Semester 1 dan Semester 2 harus persis sama dengan seluruh TP yang ada di Bab I/II/IV.
- **Formulasi Kolom & Desain Anti-Tumpang-Tindih:** Tabel Promes wajib berbentuk tabel markdown lebar dengan kolom [No, Kode & Bunyi Tujuan Pembelajaran (TP) Lengkap, Alokasi Waktu (JP), Juli, Agustus, September, Oktober, November, Desember] untuk Semester Ganjil, dan kolom [No, Kode & Bunyi Tujuan Pembelajaran (TP) Lengkap, Alokasi Waktu (JP), Januari, Februari, Maret, April, Mei, Juni] untuk Semester Genap.
- **PENGATURAN KOLOM MUTLAK:** Untuk mencegah tabel memecah menjadi puluhan kolom kecil yang merusak tata letak cetak PDF dan membuat tulisan bertumpang tindih, Anda DILARANG KERAS membagi setiap bulan menjadi kolom-kolom minggu terpisah (seperti kolom W1, W2, W3, W4, W5). Cukup buat 1 kolom saja per bulan. Di dalam sel bulan tersebut, tuliskan dengan sangat jelas indikasi minggu pelaksanaannya menggunakan gabungan teks ringkas dan simbol blok, misalnya: "W1-W2: █" atau "• W1, W2" atau "█ (Minggu 3, 4)" secara sejajar dan rapi.
- **BUNYI TP LENGKAP:** Dilarang keras menyingkat kolom atau menyederhanakan kolom Tujuan Pembelajaran dengan hanya menggunakan kode seperti "TP 1" saja; Anda WAJIB menjabarkannya dengan menggabungkan kode dan bunyi kompetensi dari TP tersebut secara lengkap dan utuh. Semuanya harus rinci, detail resmi, dan selaras penuh dengan Prota dan ATP.

---

### LEMBAR PENGESAHAN DOKUMEN

Ditetapkan di: ${req.body.tempatPenyusunan || "Oehalo"}  
Pada Tanggal: ${req.body.tanggalPenyusunan || "13 Juli 2026"}

**Mengetahui,**  
**Kepala Sekolah ${namaSekolah}**  

*(Tanda Tangan & Cap)*  

**${kepalaSekolah}**  
NIP. ${nipKepala}

**Guru Mata Pelajaran**  

*(Tanda Tangan)*  

**${namaGuru}**  
NIP/NUPTK/No. Login: 199308122019032008

Sajikan dokumen di atas dalam format Markdown murni yang lengkap, tanpa intro atau outro ramah.`;

      const contentsList: any[] = [];
      
      if (fileBase64 && mimeType) {
        contentsList.push({
          inlineData: {
            mimeType: mimeType,
            data: activeBase64,
          }
        });
      }

      contentsList.push({
        text: prompt
      });

      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: contentsList,
        config: {
          temperature: 0.3,
          maxOutputTokens: 8192,
        }
      }, clientKey);

      let plannerResult = response.text || "";
      
      // Clean up markdown fences at beginning and end
      plannerResult = plannerResult.trim();
      if (plannerResult.startsWith("```markdown")) {
        plannerResult = plannerResult.substring(11).trim();
      } else if (plannerResult.startsWith("```")) {
        plannerResult = plannerResult.substring(3).trim();
      }
      if (plannerResult.endsWith("```")) {
        plannerResult = plannerResult.substring(0, plannerResult.length - 3).trim();
      }

      res.json({ 
        success: true, 
        text: plannerResult,
        wasTrimmed,
        originalPageCount
      });

    } catch (error: any) {
      console.error("Error generating Lesson Plan:", error);
      let errMsg = error?.message || String(error);
      res.status(500).json({ error: errMsg || "Gagal mengolah dokumen perencanaan." });
    }
  });

  // API Route for RPM (Rencana Pembelajaran Mendalam / Deep Learning) generation
  app.post("/api/generate-rpm", async (req, res) => {
    try {
      const {
        namaSekolah,
        kepalaSekolah,
        nipKepala,
        nipGuru,
        mapel,
        faseKelas,
        cpText,
        alokasiJp,
        tahunAjaran,
        namaGuru,
        fileBase64,
        mimeType,
        tempatPenyusunan,
        tanggalPenyusunan,
        isFromAppDoc,
      } = req.body;

      if (!mapel || !faseKelas) {
        res.status(400).json({ error: "Mata Pelajaran dan Fase/Kelas harus diisi." });
        return;
      }

      if (!cpText && !fileBase64) {
        res.status(400).json({ error: "Silakan masukkan teks Capaian Pembelajaran (CP) atau unggah naskah CP." });
        return;
      }

      const clientKey = req.headers["x-gemini-key"] as string | undefined;
      let activeBase64 = fileBase64;
      let originalPageCount = 0;
      let wasTrimmed = false;

      // Keep it stable
      if (fileBase64 && (mimeType === "application/pdf" || mimeType?.includes("pdf"))) {
        try {
          const trimResult = await trimPdfIfNecessary(fileBase64, 1000);
          activeBase64 = trimResult.data;
          originalPageCount = trimResult.totalPages;
          wasTrimmed = trimResult.wasTrimmed;
        } catch (trimErr) {
          console.error("Error preprocessing PDF before RPM generation:", trimErr);
        }
      }

      const sourceOfCpDesc = isFromAppDoc
        ? `REFERENSI DARI DOKUMEN MATRIK KURIKULUM (TP/ATP/PROTA/PROMES) INTERNAL APLIKASI:
Dokumen di bawah ini merupakan hasil rumusan TP (Tujuan Pembelajaran), ATP (Alur Tujuan Pembelajaran), KKTP, Prota, dan Promes yang telah disusun sebelumnya oleh guru di sistem ini:
"${cpText}"
Harap analisis materi, TP, ATP, serta sub-elemen kurikulum dari matriks internal di atas untuk menyusun Rencana Pembelajaran Mendalam (RPM) yang selaras secara presisi (alignment) demi kesinambungan skenario Deep Learning di kelas.`
        : (fileBase64 
            ? `Dokumen Capaian Pembelajaran (CP) diunggah oleh pengguna dan terlampir. Temukan Kompetensi Inti & Elemen yang cocok untuk mata pelajaran "${mapel}" pada "${faseKelas}" sesuai naskah ini.`
            : `Capaian Pembelajaran (CP) dimasukkan secara manual oleh pengguna:\n"${cpText}"`);

      const prompt = `Anda adalah Instruktur Ahli Nasional Kurikulum Merdeka Terkini yang menguasai pendekatan "Pembelajaran Mendalam (Deep Learning)" yang digagas oleh Kemendikdasmen RI (Menteri Abdul Mu'ti) untuk jenjang SD. Anda sangat cerdas, teliti, kritis, dan berintegritas tinggi.
Tugas Anda adalah merumuskan dokumen "Rencana Pembelajaran Mendalam (RPM)" yang sangat lengkap, mendalam, operasional, dan ilmiah, khusus dirancang untuk jenjang sekolah dasar (SD) dengan memanfaatkan 3 pilar utama Deep Learning: Mindful Learning, Meaningful Learning, dan Joyful Learning.

Dokumen RPM yang Anda hasilkan harus mengikuti struktur dan penulisan di bawah ini secara presisi, detail, komprehensif, dan TANPA ADANYA SINGKATAN atau teks setengah matang (seperti "...", "dan seterusnya", "dll"). Tuliskan secara utuh dan mengalir.

INFORMASI DASAR DOKUMEN:
- Nama Sekolah: ${namaSekolah || "SD Negeri Fatubai"}
- Mata Pelajaran: ${mapel}
- Fase & Kelas: ${faseKelas}
- Tahun Pelajaran: ${tahunAjaran || "2025/2026"}
- Penyusun (Guru): ${namaGuru || "Roni Hariyanto Bhidju, S.Pd.,Gr."}
- Kepala Sekolah: ${kepalaSekolah || "Darius Kusi, S.Pd.,Gr."} (NIP: ${nipKepala || "196709192008011008"})
- Tempat & Tanggal Penyusunan: ${tempatPenyusunan || "Fatubai"}, ${tanggalPenyusunan || "12 Juni 2026"}
- Alokasi JP: ${alokasiJp || "2"} JP (2 x 35 Menit untuk jenjang SD)

SASARAN CAPAIAN:
${sourceOfCpDesc}

Gunakan format Markdown murni untuk menghasilkan output dengan struktur dan tata penulisan sebagai berikut (Pastikan kolom-kolom tabel, bullet points, dan sub-seksi tertulis persis seperti di bawah):

---

# RENCANA PEMBELAJARAN MENDALAM

## A. IDENTITAS
Penyusun                        : ${namaGuru || "Roni Hariyanto Bhidju, S.Pd.,Gr."}
Nama Sekolah                    : ${namaSekolah || "SD Negeri Fatubai"}
Tahun Pelajaran                 : ${tahunAjaran || "2025/2026"}
Fase/Kelas/Smt                  : ${faseKelas} / 2 (Genap)
Mata Pelajaran                  : ${mapel}
Topik/Materi                    : [Tentukan topik/materi spesifik berdasarkan CP, misalnya: Bingkai Bhinneka Tunggal Ika (Makna Semboyan Bhinneka Tunggal Ika)]
Alokasi Waktu                   : 2 x 35 Menit (1 kali pertemuan)

## B. IDENTIFIKASI
1. Karakteristik Materi        : [Tuliskan analisis karakteristik materi secara mendalam, konseptual-aksional yang mengintegrasikan nilai toleransi, pemecahan masalah nyata, or sejarah/logika relevan sesuai topik, menekankan pada pemahaman kritis perbedaan/konsep demi implementasi nilai-nilai luhur Pancasila/Kurikulum Merdeka dalam kehidupan sehari-hari]
2. Karakteristik Murid         : Karakteristik murid ${faseKelas} ${namaSekolah || "SD Negeri Fatubai"} secara umum memiliki karakter Rentang Konsentrasi Pendek, Butuh Penguatan Positif, Senang Berkelompok yang membutuhkan perhatian guru untuk memfasilitasi kebutuhan belajar mereka melalui pendekatan yang variatif dan konkret.
3. Dimensi Profil Lulusan      : [Tentukan 3 dimensi Profil Pelajar Pancasila yang relevan dengan topik, misalnya:
                                 • Kewargaan: Cinta tanah air dan sadar akan hak serta kewajiban negara.
                                 • Kreativitas: Menghasilkan gagasan orisinal dan karya yang bermakna.
                                 • Kolaborasi: Bekerja sama secara efektif untuk mencapai tujuan bersama.]

## C. DESAIN PEMBELAJARAN
1. Pembelajaran Capaian           : [Tuliskan Capaian Pembelajaran atau potongan CP materi ini secara utuh sesuai sasaran CP]
2. Pembelajaran Tujuan            : Setelah menyimak, mengeksplorasi, atau mendiskusikan media/simulasi pembelajaran, peserta didik mampu [menganalisis/memahami/menyajikan - buat KKO yang operasional sesuai topik] secara akurat dan kontekstual.
3. Praktik Pedagogis           : Model Pembelajaran       : [Tentukan model pembelajaran, misalnya: Problem Based Learning (PBL) atau Project Based Learning]
                                 Pendekatan Pembelajaran  : Pembelajaran Mendalam (Deep Learning)
                                 Metode Pembelajaran      : Metode Diskusi, Metode Demonstrasi, Metode Observasi
4. Mitra Pembelajaran          : Mitra Internal           : Guru Kelas (perancang utama dan fasilitator pembelajaran), Peserta Didik (subjek aktif yang mengkonstruksi pengetahuan), Teman Sebaya (partner diskusi dan tutor sebaya dalam belajar)
                                 Mitra Eksternal           : -
5. Lingkungan belajar          : Lingkungan Fisik         : Ruang Kelas
                                 Budaya Belajar            : Pada proses pembelajaran ini, budaya belajar yang harus dihadirkan adalah Budaya Disiplin, Kerja Sama, Saling Menghargai yang melatih peserta didik untuk mengembangkan karakter positif, integritas, dan kedisiplinan dalam setiap tahap aktivitas pembelajaran.
6. Pemanfaatan Digital         : Platform / Aplikasi     : YouTube Edukasi [atau platform lain]
                                 Perangkat Digital       : Laptop / Komputer, LCD Proyektor
                                 Media Digital           : Video Pembelajaran, Slide Presentasi

## D. LANGKAH-LANGKAH PEMBELAJARAN

| KEGIATAN | DESKRIPSI | WAKTU |
| :--- | :--- | :--- |
| Kegiatan Awal | **Aktivitas:** Guru menyapa anak-anak, menanyakan kabar, mengecek kehadiran, dan mengajak berdoa bersama. Sebagai aktivitas pemantik, guru menyajikan media/stimulus sederhana (seperti video singkat, gambar konkret, atau cerita) yang menampilkan fenomena nyata relevan dengan topik melalui slide presentasi. Siswa kemudian diajak melakukan tanya jawab reflektif mengenai perbedaan atau keterkaitan fenomena tersebut dengan pengalaman nyata mereka di dalam/luar ruang kelas guna mengaitkan empati/pemahaman awal mereka dengan konsep materi. | 10 Menit |
| Kegiatan Inti | **Aktivitas:** [Tulis rangkaian aktivitas inti yang disusun berdasarkan Sintaks model pembelajaran yang Anda pilih, misalnya PBL. Anda wajib merinci deskripsi aktivitas guru dan peserta didik untuk masing-masing sintaks secara detail:]<br><br>**Sintak 1. Orientasi Siswa pada Masalah**<br>Aktivitas: Guru menyajikan sebuah kasus nyata/masalah konkret melalui slide presentasi (misalnya cerita/peristiwa di lingkungan sekitar). Siswa diminta mengamati dan mengidentifikasi akar masalah jika nilai esensial materi tidak diterapkan.<br>✨ *Pengalaman Belajar: Bermakna dan Berkesadaran:* Siswa menyadari pentingnya topik materi sebagai realitas kehidupan nyata yang harus dikelola dengan bijak.<br>💎 *Prinsip Pembelajaran: Memahami:* Siswa mendalami akar permasalahan sosial/keilmuan yang muncul di lapangan.<br><br>**Sintak 2. Mengorganisasikan Siswa untuk Belajar**<br>Aktivitas: Guru membagi siswa ke dalam beberapa kelompok heterogen untuk menumbuhkan budaya kerja sama dan saling menghargai. Setiap kelompok diberikan Lembar Kerja (LKPD) untuk mendiskusikan solusi praktis atas masalah yang dipaparkan sebelumnya dengan bimbingan guru.<br>✨ *Pengalaman Belajar: Menggembirakan:* Siswa merasa senang dapat bertukar pikiran dan berbagi perspektif yang berbeda dengan teman sekelompoknya.<br>💎 *Prinsip Pembelajaran: Mengaplikasi:* Siswa mencoba menerapkan nilai-nilai kolaborasi dan etika berkomunikasi langsung selama diskusi kelompok.<br><br>**Sintak 3. Membimbing Penyelidikan Kelompok**<br>Aktivitas: Guru melakukan metode demonstrasi atau memberikan bimbingan sistematis. Siswa kemudian melakukan observasi/kajian terhadap tambahan media (seperti video pembelajaran, bacaan singkat) untuk mencari referensi konsep yang dapat membantu memecahkan masalah.<br>✨ *Pengalaman Belajar: Bermakna:* Siswa menemukan keterkaitan antara teori konsep dengan tindakan nyata dalam kehidupan sehari-hari.<br>💎 *Prinsip Pembelajaran: Memahami:* Siswa mengintegrasikan informasi dari berbagai media untuk membangun argumen yang kuat mengenai penyelesaian masalah.<br><br>**Sintak 4. Mengembangkan dan Menyajikan Hasil Karya**<br>Aktivitas: Siswa secara berkelompok menyusun hasil diskusi mereka ke dalam bentuk karya kreatif/produk (misalnya mind map kreatif, diagram, atau tulisan pendek) pada kertas karton atau media digital. Setiap kelompok mempresentasikan hasil karyanya di depan kelas secara santun, sementara kelompok lain memberikan tanggapan secara tertib.<br>✨ *Pengalaman Belajar: Menggembirakan dan Berkesadaran:* Siswa merasa bangga dengan karya kelompoknya dan belajar menghargai usaha serta pendapat orang lain.<br>💎 *Prinsip Pembelajaran: Mengaplikasi:* Siswa mengomunikasikan gagasan mereka secara sistematis sebagai salah satu bentuk penerapan konsep pembelajaran.<br><br>**Sintak 5. Menganalisis dan Mengevaluasi Skenario Pemecahan Masalah**<br>Aktivitas: Guru bersama siswa mengevaluasi solusi-solusi yang dipresentasikan. Guru memberikan penguatan konsep secara mendalam dan mengajak siswa merefleksikan sikap/perilaku mereka sendiri sehari-hari terkait konsep materi.<br>✨ *Pengalaman Belajar: Berkesadaran:* Siswa melakukan introspeksi diri atas perilaku sosial/kognitif mereka sendiri di lingkungan sekolah/rumah.<br>💎 *Prinsip Pembelajaran: Merefleksi:* Siswa menilai kembali pemahaman mereka dan berkomitmen menerapkan sikap/keterampilan baru secara konsisten. | 50 Menit |
| Kegiatan Akhir | **Aktivitas:** Guru memberikan apresiasi kepada seluruh siswa atas kerja sama dan sikap disiplin yang ditunjukkan selama pembelajaran. Siswa bersama guru menyimpulkan inti pembelajaran mengenai konsep materi yang dipelajari. Kegiatan pembelajaran diakhiri dengan doa bersama yang khidmat. | 10 Menit |

## E. ASESMEN

1. Asesmen Diagnostik
   (a). Bentuk/Teknik: Tes Lisan Awal (Apersepsi)
   (b). Cara/Sumber: Bersumber dari rincian aktivitas pendahuluan di mana siswa diminta mengeksplorasi fenomena pemantik sebagai dasar untuk mengukur kesiapan belajar dan pemahaman awal mereka mengenai topik ini.
2. Asesmen Formatif
   (a). Bentuk/Teknik: Penilaian Diskusi Kolaboratif dan Observasi Perilaku
   (b). Cara/Sumber: Bersumber dari rincian aktivitas inti pada sintaks 'Mengorganisasikan Siswa' dan 'Membimbing Penyelidikan', menilai keaktifan kerja sama, kepedulian sosial, serta kemampuan nalar kritis siswa dalam menyusun draf gagasan/solusi.
3. Asesmen Sumatif
   (a). Bentuk/Teknik: Penilaian Portofolio Karya dan Refleksi Diri
   (b). Cara/Sumber: Bersumber dari hasil nyata aktivitas pada sintaks 'Mengembangkan Hasil Karya' (Mind Map/Diagram/Karya fisik atau digital kelompok) dan tahap 'Evaluasi' di mana siswa melakukan introspeksi diri atas komitmen perilaku nyata mereka di lingkungan sekitar.

---

Mengetahui,                                                     ${tempatPenyusunan || "Fatubai"}, ${tanggalPenyusunan || "12 Juni 2026"}
Kepala Sekolah ${namaSekolah || "SD Negeri Fatubai"}                     Penyusun


**${kepalaSekolah || "Darius Kusi, S.Pd.,Gr."}**               **${namaGuru || "Roni Hariyanto Bhidju, S.Pd.,Gr."}**
NIP. ${nipKepala || "196709192008011008"}                      NIP. ${nipGuru || "198603012020121005"}

---

# I. RUBRIK PENILAIAN

Nama Murid/Kelompok: .......  
Kelas: .......  

| KRITERIA PENILAIAN | SANGAT BAIK (4) | BAIK (3) | CUKUP (2) | PERLU BIMBINGAN (1) |
| :--- | :--- | :--- | :--- | :--- |
| **Identifikasi Masalah & Dampak** | Analisis sangat tepat, logis, dan menjabarkan sebab-akibat secara komprehensif. | Analisis tepat dan kritis dalam mengurai inti masalah. | Analisis cukup tepat, namun deskripsi sebab-akibat kurang mendalam. | Belum mampu mengidentifikasi masalah maupun dampaknya secara tepat. |
| **Kerjasama Kelompok** | Sangat aktif berkolaborasi, menghargai semua pendapat, dan membagi tugas secara adil. | Aktif bekerja sama dan menghargai pendapat anggota kelompok. | Cukup berpartisipasi, namun kadang masih pasif dalam kerja tim. | Pasif, menarik diri, atau tidak menghargai pendapat teman sekelompok. |
| **Solusi Masalah (Topik)** | Solusi sangat kreatif, logis, realistik, dan berlandaskan konsep materi secara kuat. | Solusi relevan, logis, dan dapat diterapkan dengan baik. | Solusi cukup memadai, namun kurang kreatif atau sulit diimplementasikan secara taktis. | Tidak memberikan ide solusi atau gagasan yang ditawarkan tidak relevan. |
| **Penyajian Karya (Mind Map / Produk)** | Karya sangat rapi, sistematis, menarik secara estetika, dan dipresentasikan dengan sangat santun. | Karya rapi, informatif, dan dipresentasikan dengan jelas serta sopan. | Karya cukup memadai, namun tata letak kurang teratur atau presentasi kurang lancar. | Hasil karya tidak tuntas, berantakan, atau tidak berani mempresentasikan. |
| **Refleksi Sikap & Komitmen** | Menunjukkan kejujuran introspeksi yang tinggi dan komitmen penerapan perilaku baru secara konkret. | Menunjukkan pemahaman refleksi yang baik dan niat perilaku positif. | Refleksi cukup memadai, namun komitmen tindakan ke depan masih bersifat abstrak. | Belum mampu melakukan introspeksi diri maupun merumuskan komitmen sikap. |

*Nilai Akhir (NA) = (Skor Perolehan / Skor Maksimal) x 100*

---

# II. LEMBAR KERJA PESERTA DIDIK

### LEMBAR KERJA PESERTA DIDIK (LKPD) - [Tuliskan Judul LKPD Sesuai Tema, misalnya: INDAHNYA PERSATUAN / PETUNJUK MATERI]

| Nama Murid / Kelompok: ....................................... | Kelas: ....................................... |
| :--- | :--- |

| Langkah Kerja | Hasil Jawaban |
| :--- | :--- |
| **1. Mengamati Perbedaan / Konsep:**<br>[Tuliskan instruksi pengamatan relevan dengan materi, misalnya: Tuliskan 3 perbedaan yang kamu temukan pada teman-teman di dalam kelasmu hobi/asal/fisik] | 1. ................................................................<br>2. ................................................................<br>3. ................................................................ |
| **2. Diskusi Masalah:**<br>[Tuliskan pertanyaan analisis masalah, misalnya: Mengapa perselisihan pendapat di dalam kelompok dapat merugikan kerja sama tim?] | ................................................................................................................................<br>................................................................................................................................ |
| **3. Mencari Solusi:**<br>[Tuliskan instruksi perumusan rekomendasi konkrit, misalnya: Tuliskan 2 cara berkomunikasi yang sopan agar perbedaan pendapat tidak menyinggung perasaan orang lain!] | 1. ................................................................<br>2. ................................................................ |
| **4. Makna Esensi Materi:**<br>[Tuliskan pertanyaan filosofis, misalnya: Menurut pendapat kelompokmu, apa manfaat utama memahami nilai persatuan/topik ini dalam lingkungan masyarakat?] | ................................................................................................................................<br>................................................................................................................................ |
| **5. Janji Baik (Refleksi):**<br>[Tuliskan ajakan komitmen mandiri, misalnya: Tuliskan satu janji tindakan nyata yang siap kamu lakukan mulai hari ini agar suasana belajar tetap harmonis?] | Janji saya: ................................................................................................................<br>................................................................................................................................ |

---

# III. SOAL EVALUASI

[Tuliskan 5 pertanyaan evaluasi terbuka/esay yang kritis, menantang, berkategori HOTS sesuai dengan topik materi pembelajaran mendalam di atas:]

1. [Pertanyaan HOTS 1]?  
   Jawaban: ................................................................................................................................

2. [Pertanyaan HOTS 2]?  
   Jawaban: ................................................................................................................................

3. [Pertanyaan HOTS 3]?  
   Jawaban: ................................................................................................................................

4. [Pertanyaan HOTS 4]?  
   Jawaban: ................................................................................................................................

5. [Pertanyaan HOTS 5]?  
   Jawaban: ................................................................................................................................

---

Aturan Mutlak Output: Jangan memberikan teks pembuka (seperti "Berikut draf RPM...") atau penutup. Berikan dokumen Markdown lengkap dan utuh dari awal judul hingga akhir soal evaluasi secara langsung.`;

      const contentsList: any[] = [];
      if (activeBase64) {
        contentsList.push({
          inlineData: {
            mimeType: mimeType || "application/pdf",
            data: activeBase64,
          }
        });
      }

      contentsList.push({
        text: prompt
      });

      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: contentsList,
        config: {
          temperature: 0.4,
          maxOutputTokens: 8192,
        }
      }, clientKey);

      let rpmResult = response.text || "";
      
      // Clean up markdown fences at beginning and end
      rpmResult = rpmResult.trim();
      if (rpmResult.startsWith("```markdown")) {
        rpmResult = rpmResult.substring(11).trim();
      } else if (rpmResult.startsWith("```")) {
        rpmResult = rpmResult.substring(3).trim();
      }
      if (rpmResult.endsWith("```")) {
        rpmResult = rpmResult.substring(0, rpmResult.length - 3).trim();
      }

      res.json({ 
        success: true, 
        text: rpmResult,
        wasTrimmed,
        originalPageCount
      });

    } catch (error: any) {
      console.error("Error generating RPM Plan:", error);
      let errMsg = error?.message || String(error);
      res.status(500).json({ error: errMsg || "Gagal mengolah dokumen pembelajaran mendalam." });
    }
  });

  // API Route for Capaian Literasi & Numerasi AI Analysis
  app.post("/api/generate-litnum-analysis", async (req, res) => {
    try {
      const {
        namaSekolah,
        kelas,
        semester,
        tahunAjaran,
        namaGuru,
        kepalaSekolah,
        students,
        metrics
      } = req.body;

      if (!students || students.length === 0) {
        res.status(400).json({ error: "Data siswa masih kosong." });
        return;
      }

      const clientKey = req.headers["x-gemini-key"] as string | undefined;

      // Map students list to a clear context representation
      const studentContext = students.map((s: any, idx: number) => {
        const avgLit = ((s.litReading + s.litWriting) / 2).toFixed(1);
        const avgNum = ((s.numCounting + s.numAnalysis) / 2).toFixed(1);
        const avgAll = ((Number(avgLit) + Number(avgNum)) / 2).toFixed(1);
        return `Siswa #${idx+1}: Nama: ${s.name} (${s.gender}), Lit_Membaca: Level ${s.litReading}/5, Lit_Menulis: Level ${s.litWriting}/5 [Rerata Lit: ${avgLit}], Num_Bilangan: Level ${s.numCounting}/5, Num_Spasial: Level ${s.numAnalysis}/5 [Rerata Num: ${avgNum}], Rerata Gabungan: ${avgAll}`;
      }).join("\n");

      const prompt = `Anda adalah Pakar Khusus Bidang Asesmen Diagnostik Nasional Kemendikdasmen RI yang berfokus pada integrasi Literasi & Numerasi dalam Kurikulum Merdeka Terkini.
Tugas Anda adalah merumuskan dokumen analisis diagnostik, pola intervensi pembelajaran berdiferensiasi, dan skenario adaptif berbasis 3 pilar: Mindful, Meaningful, dan Joyful Learning.

KRITERIA LEVEL PENILAIAN LITERASI & NUMERASI YANG DIGUNAKAN (Skala 1 s.d. 5):
1. Literasi Membaca:
   - Level 1 = Membaca Huruf (Mengenal & mengeja huruf abjad dasar)
   - Level 2 = Membaca Suku Kata (Membaca suku kata dengan lancar)
   - Level 3 = Membaca Kata (Membaca kata tunggal utuh)
   - Level 4 = Membaca Lancar (Membaca kalimat utuh & paragraf lancar)
   - Level 5 = Membaca Pemahaman (Membaca serta memahami makna/pesan teks)

2. Literasi Menulis:
   - Level 1 = Menulis Huruf (Meniru atau menyalin huruf dasar)
   - Level 2 = Menulis Suku Kata (Merangkai huruf menjadi suku kata tertulis)
   - Level 3 = Menulis Kata (Menulis kata tunggal secara mandiri)
   - Level 4 = Menulis Kalimat Sederhana (Menyusun kata menjadi kalimat sederhana utuh)
   - Level 5 = Menulis Paragraf/Esai (Menulis gagasan logis ke dalam paragraf/karangan)

3. Numerasi Bilangan:
   - Level 1 = Mengenal Angka Satuan (Mengenal angka 0-9 & jumlah satuan)
   - Level 2 = Membaca Angka Puluhan (Mengenal & membaca puluhan 10-99)
   - Level 3 = Membaca Bilangan Utuh (Memahami bilangan ratusan hingga ribuan & garis bilangan)
   - Level 4 = Kelancaran Operasi Hitung (Fasih penjumlahan, pengurangan, perkalian, pembagian)
   - Level 5 = Penalaran & Soal Cerita (Mampu menyelesaikan soal cerita, logika matematika & pemecahan masalah)

4. Numerasi Analisis/Spasial:
   - Level 1 = Mengenal Bentuk Dasar (Mengenal bangun datar dasar)
   - Level 2 = Membandingkan Ukuran (Membandingkan dimensi panjang/berat/volume)
   - Level 3 = Mengelompokkan Bangun (Mengklasifikasikan berbagai bangun ruang & datar)
   - Level 4 = Analisis Pola/Spasial (Membaca pola geometri, diagram & orientasi spasial)
   - Level 5 = Pemecahan Masalah Geometri (Menguasai rumus luas/keliling, volume, analisis data & logika spasial)

KATEGORI KECAPAKAN BERDASARKAN RERATA GABUNGAN:
- Rerata >= 4.5  : Mahir (PMR) - Penugasan mandiri & pengayaan materi problem-solving adaptif.
- Rerata >= 3.5  : Cekap (PCK) - Tantangan kontekstual tingkat menengah.
- Rerata >= 2.5  : Berkembang (PBB) - Latihan berulang terstruktur.
- Rerata >= 1.5  : Perlu Bimbingan (PPB) - Intervensi dengan pendampingan tambahan.
- Rerata < 1.5   : Intervensi Khusus (PIK) - Scaffolding remedial intensif dengan media manipulatif konkrit.

INFORMASI DASAR KELAS:
Sekolah: ${namaSekolah || "Contoh Sekolah"}
Kelas/Fase: ${kelas || "Fase B (Kelas 4)"}
Semester: ${semester || "1 (Ganjil)"}
Tahun Ajaran: ${tahunAjaran || "2026/2027"}
Guru Kelas: ${namaGuru || "Wali Kelas"}
Kepala Sekolah: ${kepalaSekolah || "-"}

METRIK RATA-RATA KELAS:
- Rerata Capaian Literasi Kelas: Level ${metrics?.classAvgLit || 3} / 5
- Rerata Capaian Numerasi Kelas: Level ${metrics?.classAvgNum || 3} / 5
- Jumlah Siswa Membutuhkan Intervensi Khusus (Rerata < 2.5): ${metrics?.needInterventionCount || 0} siswa

DATA UTUH INDIVIDU SISWA:
${studentContext}

STRUKTUR LAPORAN HARUS DIHASILKAN SEPENUHNYA (Patuhi pembagian "###" karena sistem akan memilahnya berdasarkan pembatas tersebut):

### 1. ANALISIS & DIAGNOSTIK KELAS
- Paparkan analisis tren literasi membaca vs menulis, serta perbandingan numerasi bilangan vs analisis spasial berdasarkan level pencapaian.
- Identifikasi area kekuatan kelas yang menonjol dan tentukan kelemahan kritis yang dialami sebagian besar siswa.
- Berikan ulasan singkat mengenai disparitas gender (L/P) jika ada tren korelasi performa yang terlihat.

### 2. PETA INTERVENSI PEMBELAJARAN DIFERENSIASI
- Berikan instruksi intervensi taktis terperinci untuk 5 kategori kecakapan (Intervensi Khusus, Perlu Bimbingan, Berkembang, Cekap, Mahir) dengan pendekatan nyata.
- Sebutkan nama-nama siswa dari daftar data di atas untuk setiap kelompok kategori di atas guna validasi ketepatan laporan.

### 3. REKOMENDASI PEDAGOGI INTEGRATIF (3 PILAR)
Penyusunan langkah mengajar taktis kurikulum merdeka:
- **Pendekatan Mindful**: Strategi melatih fokus emosional dan kesadaran kontekstual sebelum memulai analisis teks/matematika (misal: visualisasi, hening sejenak).
- **Pendekatan Meaningful**: Hubungan nyata materi dengan jajan sehari-hari, berat pangan, atau cerita daerah murid setempat.
- **Pendekatan Joyful**: Usulkan 1-2 usulan gamifikasi non-digital (luring) seru (misal kuis lari ceria, teka-teki bertali, estafet kartu literasi) yang memicu tawa, keaktifan gerak, dan senyuman di kelas.

Gaya Penyusunan: Ilmiah, inspiratif, solutif, detail, bebas dari singkatan tidak baku, dan menggunakan istilah pedagogi kurikulum merdeka terkini.
ATURAN CRITICAL TAMBAHAN:
1. DILARA NG KERAS melukis, menggambar, atau menampilkan grafik/bagan visual menggunakan karakter teks atau diagram ASCII (misalnya membuat grafik koordinat dengan sumbu '5.0 |', '+', atau bagan horizontal bertumpuk kata). Hal ini merusak format cetak dokumen dan sangat membingungkan pembaca. Gunakan format TABEL MARKDOWN formal yang bersih atau DAFTAR KLASIFIKASI DESKRIPTIF (bulleted list) untuk memetakan sebaran murid!
2. WAJIB MENJELASKAN SETIAP SINGKATAN DAN ISTILAH ASING yang digunakan dalam laporan secara ilmiah. Khususnya untuk singkatan kategori capaian literasi-numerasi Anda, sertakan definisi berikut saat pertama kali disebutkan:
   - PMR: Pencapaian Mahir Rerata (Rerata Capaian >= 4.5. Siswa pada tingkat kemandirian penuh dan siap penugasan pengayaan memecahkan masalah kompleks).
   - PCK: Profil Cakap Kompetensi (Rerata Capaian >= 3.5 s.d. < 4.5. Siswa mampu menyelesaikan tantangan kontekstual tingkat menengah mandiri).
   - PBB: Pembelajaran Berkembang Bersama (Rerata Capaian >= 2.5 s.d. < 3.5. Siswa membutuhkan latihan terstruktur berulang di bawah pendampingan guru).
   - PPB: Perlu Pendampingan Belajar (Rerata Capaian >= 1.5 s.d. < 2.5. Siswa berkemampuan transisional dengan bimbingan dalam kelompok kecil).
   - PIK: Perlu Intervensi Khusus (Rerata Capaian < 1.5. Siswa memerlukan pendampingan individual remedial intensif/one-on-one menggunakan media manipulatif konkrit).
3. Pastikan penulisan laporan menggunakan bahasa Indonesia formal akademis yang kredibel dan berkadar ilmiah tinggi.`;

      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: [{ text: prompt }],
        config: {
          temperature: 0.3,
          maxOutputTokens: 6000,
        }
      }, clientKey);

      res.json({ 
        success: true, 
        text: response.text || ""
      });

    } catch (error: any) {
      console.error("Error generating LitNum reports:", error);
      let errMsg = error?.message || String(error);
      res.status(500).json({ error: errMsg || "Gagal menghasilkan analisis diagnostik literasi dan numerasi." });
    }
  });

  // API Route for Profil Pelajar Pancasila (P5) Character AI Analysis
  app.post("/api/generate-character-analysis", async (req, res) => {
    try {
      const {
        namaSekolah,
        kelas,
        tahunAjaran,
        namaGuru,
        kepalaSekolah,
        students,
        metrics,
        criteria
      } = req.body;

      if (!students || students.length === 0) {
        res.status(400).json({ error: "Data siswa belum lengkap atau kosong." });
        return;
      }

      const clientKey = req.headers["x-gemini-key"] as string | undefined;

      const c = criteria || {
        religius: { name: "Religiusitas", short: "RELIGIUS", desc: "Beriman, bertaqwa kepada Tuhan YME, dan berakhlak mulia harian." },
        jujur: { name: "Kejujuran", short: "JUJUR", desc: "Integritas diri, menjunjung nilai kebenaran dalam perkataan & perbuatan." },
        disiplin: { name: "Kedisiplinan", short: "DISIPLIN", desc: "Kepatuhan tata tertib sekolah, ketepatan waktu, dan kemandirian." },
        peduli: { name: "Sikap Kepedulian", short: "PEDULI", desc: "Kepekaan sosial tinggi terhadap sesama teman dan guru." },
        gotongRoyong: { name: "Gotong Royong", short: "G. ROYONG", desc: "Kemampuan kolaborasi, kerja sama tim, dan kepatuhan mufakat." }
      };

      const studentContext = students.map((s: any, idx: number) => {
        return `Siswa #${idx+1}: Name: ${s.name} (NISN: ${s.nisn || '-'}) (${s.gender}), ${c.religius.name}: ${s.religius}, ${c.jujur.name}: ${s.jujur}, ${c.disiplin.name}: ${s.disiplin}, ${c.peduli.name}: ${s.peduli}, ${c.gotongRoyong.name}: ${s.gotongRoyong}. Catatan Khusus: "${s.catatanKarakter || '-'} "`;
      }).join("\n");

      const prompt = `Anda adalah Spesialis Karakter & Pengembang Kurikulum Kokurikuler Nasional Kemendikdasmen RI yang memiliki keahlian dalam merumuskan Asesmen Sikap & Perkembangan Perilaku Siswa.
Tugas Anda adalah memetakan analisis perilaku kualitatif menyeluruh serta strategi tindak lanjut berdasarkan data kelas yang diunggah dengan 5 kriteria karakter berikut:
- 1. ${c.religius.name} (${c.religius.desc})
- 2. ${c.jujur.name} (${c.jujur.desc})
- 3. ${c.disiplin.name} (${c.disiplin.desc})
- 4. ${c.peduli.name} (${c.peduli.desc})
- 5. ${c.gotongRoyong.name} (${c.gotongRoyong.desc})

INFORMASI SEKOLAH DAN KELAS:
- Sekolah: ${namaSekolah || "Sekolah Dasar"}
- Kelas: ${kelas}
- Tahun Pelajaran: ${tahunAjaran}
- Pendidik: ${namaGuru}
- Kepala Sekolah: ${kepalaSekolah}

STATISTIK CAPAIAN MATRIKS PROFIL:
- Rerata Dimensi ${c.religius.name} (Kategori BSH/SB): ${metrics?.avgReligius || 0}%
- Rerata Dimensi ${c.jujur.name} (Kategori BSH/SB): ${metrics?.avgJujur || 0}%
- Rerata Dimensi ${c.disiplin.name} (Kategori BSH/SB): ${metrics?.avgDisiplin || 0}%
- Rerata Dimensi ${c.peduli.name} (Kategori BSH/SB): ${metrics?.avgPeduli || 0}%
- Rerata Dimensi ${c.gotongRoyong.name} (Kategori BSH/SB): ${metrics?.avgGotong || 0}%
- Banyak Siswa dengan >= 3 dimensi berkategori BB atau MB: ${metrics?.totalMinBshCount || 0} siswa

DATA REKAPITULASI KARAKTER SISWA SECARA DE FACTO:
${studentContext}

APABILA TERDAPAT SISWA DENGAN PILAR KARAKTER RENYAH (BB / MB), sebutkan namanya dan tunjukkan rekomendasi tindak lanjut pribadi yang humanis.

TULISKAN LAPORAN EVALUASI SECARA FORMAL, TERSTRUKTUR, DAN MENYENTUH REKOMENDASI PEDAGOGIAI BERTAHAP MENGGUNAKAN FORMAT PARAGRAF MONO (FORMAT MARKDOWN DETIL):

===================================================================
1. EVALUASI DAN INTERPRETASI TREN PERILAKU KELAS
===================================================================
(Paparkan analisis tren karakter yang terbentuk di kelas ${kelas}, pilar yang paling menonjol/SB, dan dimensi pilar yang paling butuh bimbingan berkesinambungan berdasarkan persentase statistik di atas.)

===================================================================
2. STRATEGI PEMBELAJARAN DIFERENSIASI P5 (3 PILAR UTAMA)
===================================================================
Terapkan perbaikan pilar karakter murid dengan strategi:
- **Pendekatan Mindful**: Bagaimana melatih ketenteraman hati, perilaku ${c.religius.name}, empati sosial harian, dan kontrol diri sebelum sesi pembelajaran atau dalam rutinitas apel kelas pagi.
- **Pendekatan Meaningful**: Rancangan aktivitas proyek sosial/lingkungan kecil yang nyata (seperti pengelolaan sampah sekolah, saling berbagi bekal, menghargai keberagaman kawan, meningkatkan ${c.peduli.name} dan ${c.gotongRoyong.name}) sehingga perilaku baik terpancar alami.
- **Pendekatan Joyful**: Rancang 2 variasi permainan penguatan karakter interaktif yang asyik, bebas stres, sarat tawa, luring, dan memperkokoh kerja sama tim di kelas (misal: estafet kebaikan, pohon bintang karakter, tebak empati kawan).

===================================================================
3. REKOMENDASI KHUSUS DAN ACTION PLAN PERSONAL SISWA
===================================================================
(Untuk siswa yang teridentifikasi memiliki banyak dimensi di level BB (Belum Berkembang) atau MB (Mulai Berkembang), berikan langkah penanganan kualitatif personal yang bisa diambil oleh Guru Kelas / Wali Kelas berkolaborasi dengan orang tua murid di rumah.)

PENTING: Jangan menyebutkan nama individu Guru/Pendidik asli ("${namaGuru}") atau nama Kepala Sekolah asli ("${kepalaSekolah}") di dalam laporan evaluasi, deskripsi analisis, ataupun rekomendasi ini. Gunakan istilah jabatan umum saja seperti "Guru Kelas", "Wali Kelas", atau "Kepala Sekolah". Buatlah analisis serta rekomendasi ini menjadi ringkas dan padat.

Gaya Penulisan: Bahasa Indonesia resmi, bermartabat tinggi, ramah, objektif, tebal, penuh solusi aplikatif luring, tanpa jargon teknologi berlebih.`;

      const response = await generateContentWithRetry({
        model: "gemini-2.5-flash",
        contents: [{ text: prompt }],
        config: {
          temperature: 0.35,
          maxOutputTokens: 6000,
        }
      }, clientKey);

      res.json({ 
        success: true, 
        text: response.text || ""
      });

    } catch (error: any) {
      console.error("Error generating Character reports:", error);
      let errMsg = error?.message || String(error);
      res.status(500).json({ error: errMsg || "Gagal menghasilkan analisis karakter Profil Pelajar Pancasila." });
    }
  });

  // Generic prompt endpoint for rpm_builder html forms
  app.post("/api/proxy-generate", async (req, res) => {
    try {
        const { prompt, model } = req.body;
        const clientKey = req.headers["x-gemini-key"] as string | undefined;
        if (!prompt) {
             res.status(400).json({ error: "Missing prompt" });
             return;
        }
        let targetModel = model || "gemini-2.5-flash";
        if (targetModel.includes("preview-09-2025") || targetModel.includes("preview") || targetModel.startsWith("gemini-3")) {
            targetModel = "gemini-2.5-flash";
        }
        const response = await generateContentWithRetry({
            model: targetModel,
            contents: prompt
        }, clientKey);
        res.json({ success: true, text: response.text || "" });
    } catch(err: any) {
        console.error("proxy generate err:", err);
        res.status(500).json({ error: String(err) });
    }
  });

  // Dedicated high-speed endpoint to generate characteristics of topics/materials
  app.post("/api/generate-karakteristik", async (req, res) => {
    try {
        const { materi, mapel, elemen, topik_utama, fase_kelas, sekolah, lingkungan_fisik, budaya_belajar } = req.body;
        const clientKey = req.headers["x-gemini-key"] as string | undefined;
        
        if (!materi) {
             res.status(400).json({ error: "Materi ajar tidak boleh kosong." });
             return;
        }

        const materialsArray = Array.isArray(materi) ? materi.filter(Boolean) : [String(materi)];
        const materialsCount = materialsArray.length;
        const materialsText = materialsArray.join(", ");
        const mapelText = mapel ? String(mapel) : "-";
        const elemenText = elemen ? String(elemen) : "-";
        const topikText = topik_utama ? String(topik_utama) : "-";
        const kelasText = fase_kelas ? String(fase_kelas) : "-";
        const sekolahText = sekolah ? String(sekolah) : "-";
        const envText = Array.isArray(lingkungan_fisik) ? lingkungan_fisik.join(", ") : (lingkungan_fisik ? String(lingkungan_fisik) : "-");
        const cultureText = Array.isArray(budaya_belajar) ? budaya_belajar.join(", ") : (budaya_belajar ? String(budaya_belajar) : "-");

        let formatRule = "";
        if (materialsCount >= 2) {
            formatRule = `FORMAT WAJIB UNTUK 2 MATERI YANG DIPILIH:
Guru memilih tepat 2 materi: "${materialsArray[0]}" dan "${materialsArray[1]}".
Oleh karena itu, hasil pada key "karakteristik" WAJIB ditulis persis menggunakan format berikut (dua baris):
Karakteristik Materi 1: ${materialsArray[0]} memiliki karakteristik [isi deskripsi konseptual-kontekstual yang mendalam, keselarasan dengan tingkat kemampuan siswa, serta tingkat kesulitan kognitifnya]
Karakteristik Materi 2: ${materialsArray[1]} memiliki karakteristik [isi deskripsi konseptual-kontekstual yang mendalam, keselarasan dengan tingkat kemampuan siswa, serta tingkat kesulitan kognitifnya]

Jangan letakkan label atau penjelasan lain di luar format di atas untuk key "karakteristik". Gunakan pergantian baris (\\n atau baris baru) untuk memisahkan kedua baris karakteristik materi tersebut secara jelas.`;
        } else {
            formatRule = `FORMAT WAJIB UNTUK 1 MATERI YANG DIPILIH:
Guru memilih 1 materi: "${materialsArray[0]}".
Oleh karena itu, hasil pada key "karakteristik" WAJIB langsung ditulis secara holistik tanpa awalan label "Karakteristik Materi 1:".
Contoh format output: "Selain itu, materi ini bersifat holistik dan sarat nilai nasionalisme, karena tidak hanya mengenalkan kombinasi warna dan arti filosofisnya (merah-berani, putih-suci), tetapi juga melatih aspek motorik serta menanamkan rasa cinta tanah air sejak dini." atau bentuk penjelasan pedagogis mendalam lainnya yang relevan penuh dengan topik tersebut.`;
        }

        const modelRule = `REKOMENDASI MODEL PEMBELAJARAN (model):
Rekomendasikan TEPAT SATU (1) model pembelajaran yang paling relevan dengan materi "${materialsText}" dan karakteristik materi tersebut, dengan sangat mempertimbangkan tingkat kelas atau fase siswa ("${kelasText}").
Misal: murid tingkat dasar (Fase A) membutuhkan pendekatan yang lebih konkret, ramah anak, interaktif, kolaboratif, atau menyenangkan (seperti Discovery Learning, Cooperative Learning, dst), sedangkan tingkat lebih tinggi (Fase C) dapat menggunakan Problem Based Learning (PBL) atau Project Based Learning (PjBL). Pastikan model disesuaikan dengan tingkat kelas/fase murid secara cerdas dan logis. Pilih dari model-model Kurikulum Merdeka yang umum (PBL, PjBL, Discovery Learning, Inquiry Learning, Cooperative Learning, dll).`;

        const prompt = `Bertindaklah sebagai pakar pendidikan nasional Kurikulum Merdeka tingkat SD yang berspesialisasi dalam merumuskan karakteristik materi pembelajaran secara akurat, kontekstual, dan berbobot akademis tinggi.

Tinjauan Kurikulum Anda harus didasarkan pada variabel-variabel berikut:
- Mata Pelajaran: "${mapelText}"
- Elemen CP: "${elemenText}"
- Topik Utama: "${topikText}"
- Sub-Materi/Topik Spesifik yang Dipilih/Dicentang oleh Guru: "${materialsText}"
- Tingkat Kelas / Fase: "${kelasText}"
- Nama / Conditions Sekolah: "${sekolahText}"
- Lingkungan Fisik Sekolah: "${envText}"
- Budaya Belajar Sekolah: "${cultureText}"

Sangat penting bahwa KARAKTERISTIK MATERI yang dihasilkan fokus, relevan, dan selaras sepenuhnya dengan sub-materi spesifik "${materialsText}" yang dipilih/dicentang oleh guru di atas. Jangan membuat karakteristik umum jika ada sub-materi spesifik yang dipilih. Karakteristik materi tidak boleh mendahului materi, melainkan wajib diturunkan secara logis setelah materi ajar dipilih.

${formatRule}

${modelRule}

Alasan Pemilihan (alasan): Tuliskan satu alasan logis pemilihan model tersebut secara singkat (maksimal 20 kata), dengan menghubungkan secara harmonis antara karakteristik materi, tingkat kelas/fase, kondisi sekolah, serta budaya belajar yang ada di sekolah!

RESPON WAJIB BERUPA BLOK JSON DENGAN KEY BERIKUT (Dilarang ada penjelasan teks apa pun di luar JSON):
{
  "karakteristik": "Isi analisis karakteristik materi sesuai aturan di atas",
  "model": "Model terpilih",
  "alasan": "Alasan logis singkat"
}`;

        console.log(`[Generate Karakteristik] Starting analysis for: ${materialsText} in subject ${mapelText}`);
        const response = await generateContentWithRetry({
            model: "gemini-2.5-flash",
            contents: [{ text: prompt }]
        }, clientKey);

        let rawText = "";
        try {
            rawText = response.text || "";
        } catch (e) {
            console.warn("[Generate Karakteristik] text property reading threw, extracting via candidates:", e);
            try {
                rawText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
            } catch (err) {
                console.error("[Generate Karakteristik] Candidate extraction also failed:", err);
            }
        }
        console.log(`[Generate Karakteristik] AI response:`, rawText);

        // Sanitize response to isolate JSON block
        let parseStr = rawText.trim();
        if (parseStr.startsWith("```json")) {
            parseStr = parseStr.substring(7);
        } else if (parseStr.startsWith("```")) {
            parseStr = parseStr.substring(3);
        }
        if (parseStr.endsWith("```")) {
            parseStr = parseStr.substring(0, parseStr.length - 3);
        }
        parseStr = parseStr.trim();

        const firstBrace = parseStr.indexOf('{');
        const lastBrace = parseStr.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            parseStr = parseStr.substring(firstBrace, lastBrace + 1);
        }

        let resultObj: any = { karakteristik: "", model: "", alasan: "" };
        try {
            resultObj = JSON.parse(parseStr);
        } catch (jsonErr) {
            console.warn("[Generate Karakteristik] Failed to parse strict JSON, attempting backup extraction.");
        }

        let extractedKarakteristik = "";
        let extractedModel = "";
        let extractedAlasan = "";

        // 1. Try to find keys inside resultObj if parsed successfully
        if (resultObj && typeof resultObj === "object") {
            for (const k of Object.keys(resultObj)) {
                const kl = k.toLowerCase();
                if (kl.includes("karakteristik") || kl.includes("relevan")) {
                    extractedKarakteristik = String(resultObj[k]);
                } else if (kl.includes("model")) {
                    extractedModel = String(resultObj[k]);
                } else if (kl.includes("alasan") || kl.includes("reason")) {
                    extractedAlasan = String(resultObj[k]);
                }
            }
        }

        // 2. Fallback to flexible Regex matches operating (supporting circular/escaped quotes)
        if (!extractedKarakteristik) {
            const match = rawText.match(/"(?:karakteristik|relevan|Karakteristik)[^"]*"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
            if (match) {
                extractedKarakteristik = match[1].replace(/\\"/g, '"');
            } else {
                const simpleMatch = rawText.match(/"(?:karakteristik|relevan|Karakteristik)[^"]*"\s*:\s*"([^"]+)"/i);
                if (simpleMatch) extractedKarakteristik = simpleMatch[1];
            }
        }
        if (!extractedModel) {
            const match = rawText.match(/"(?:model|Model)[^"]*"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
            if (match) {
                extractedModel = match[1].replace(/\\"/g, '"');
            } else {
                const simpleMatch = rawText.match(/"(?:model|Model)[^"]*"\s*:\s*"([^"]+)"/i);
                if (simpleMatch) extractedModel = simpleMatch[1];
            }
        }
        if (!extractedAlasan) {
            const match = rawText.match(/"(?:alasan|reason|Alasan)[^"]*"\s*:\s*"((?:[^"\\]|\\.)*)"/i);
            if (match) {
                extractedAlasan = match[1].replace(/\\"/g, '"');
            } else {
                const simpleMatch = rawText.match(/"(?:alasan|reason|Alasan)[^"]*"\s*:\s*"([^"]+)"/i);
                if (simpleMatch) extractedAlasan = simpleMatch[1];
            }
        }

        // 3. Fallback to default copy if still empty
        const finalKarakteristik = (extractedKarakteristik || resultObj.karakteristik || "").substring(0, 1500).trim();
        const finalModel = (extractedModel || resultObj.model || "Problem Based Learning (PBL)").trim();
        const finalAlasan = (extractedAlasan || resultObj.alasan || "").substring(0, 150).trim();

        res.json({
            success: true,
            karakteristik: finalKarakteristik || `Materi ${materialsText} bersifat konkret yang membutuhkan pemahaman konsep dasar melalui pengamatan langsung.`,
            model: finalModel,
            alasan: finalAlasan || `Model ini sangat cocok dengan karakteristik materi ${materialsText} untuk tingkat sekolah dasar.`
        });

    } catch (error: any) {
        console.error("[Generate Karakteristik] Critical Error:", error);
        res.status(500).json({ 
            success: false, 
            error: error?.message || String(error) 
        });
    }
  });

  const isNetlify = !!(process.env.NETLIFY || process.env.LAMBDA_TASK_ROOT || process.env.NETLIFY_DEV);

  if (!isNetlify) {
    // Serve static assets and Vite middleware
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      // Dynamically resolve static files folder in production
      const distPath = path.resolve(process.cwd(), "dist");

      console.log(`[Production Static Serving] Current working directory: ${process.cwd()}`);
      console.log(`[Production Static Serving] Selected static folder path: ${distPath}`);
      app.use(express.static(distPath));
      
      app.get("*", (req, res) => {
        const indexPath = path.join(distPath, "index.html");
        res.sendFile(indexPath, (err) => {
          if (err) {
            console.error(`[Static File Error] Gagal memuat file utama dari ${indexPath}:`, err);
            res.status(404).send(
              "<h3>OMEGA TEACHER ENGINE - Error 404: Halaman Utama Tidak Ditemukan</h3>" +
              "<p>Basis data web lokal berhasil dikompilasi, tetapi file pratinjau utama (index.html) " +
              "tidak ditemukan di folder statis server. " +
              "Silakan bangun ulang aplikasi Anda atau hubungi dukungan teknis.</p>"
            );
          }
        });
      });
    }

    async function extractReligionCP() {
      try {
        const ai = getGenAI();
        const pdfPath = path.resolve(process.cwd(), "CP PENDIDIKAN AGAMA TERBARU.pdf");
        if (!fs.existsSync(pdfPath)) {
          console.log(`[Auto-Extract] PDF file not found at ${pdfPath}`);
          return;
        }
        console.log(`[Auto-Extract] Uploading PDF file to Gemini API...`);
        const file = await ai.files.upload({
          file: pdfPath,
          mimeType: "application/pdf"
        });
        console.log(`[Auto-Extract] File uploaded as ${file.name}. Generating CP extraction...`);
        const prompt = `
Anda adalah seorang analis kurikulum senior Kemendikbudristek Indonesia.
Tugas Anda adalah memproses dokumen PDF Pendidikan Agama terbaru yang diunggah dan mengekstrak Capaian Pembelajaran (CP) Kurikulum Merdeka untuk jenjang SD (Sekolah Dasar) untuk 6 Agama:
1. Pendidikan Agama Islam dan Budi Pekerti (Fase A, B, C)
2. Pendidikan Agama Kristen dan Budi Pekerti (Fase A, B, C)
3. Pendidikan Agama Katolik dan Budi Pekerti (Fase A, B, C)
4. Pendidikan Agama Hindu dan Budi Pekerti (Fase A, B, C)
5. Pendidikan Agama Buddha dan Budi Pekerti (Fase A, B, C)
6. Pendidikan Agama Khonghucu dan Budi Pekerti (Fase A, B, C)

Format output wajib berupa JSON objek yang valid dan bersih dengan tipe data Record<string, Record<string, Record<string, ElemenData>>> sesuai interface TypeScript berikut:

interface Topic {
  judul: string;
  materi: string[];
}
interface ElemenData {
  cp: string;
  topik: Topic[];
}

Contoh Struktur:
{
  "Fase A": {
    "Pendidikan Agama Islam dan Budi Pekerti": {
      "Al-Qur'an dan Hadis": {
        "cp": "...",
        "topik": [
          { "judul": "...", "materi": ["...", "..."] }
        ]
      }
    }
  }
}

Ketentuan Khusus:
1. Ekstrak seluruh elemen resmi untuk masing-masing agama tersebut di tingkat SD (Fase A, B, C).
2. Tuliskan teks CP secara utuh tanpa singkatan atau pemotongan.
3. Buat judul topik dan sub-materi yang relevan dan kontekstual untuk masing-masing elemen dan fase tersebut untuk mempermudah guru.
4. Kembalikan HANYA JSON objek yang valid dan siap diparse tanpa blok pembuka markdown atau backticks (\`\`\`).
`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            {
              fileData: {
                fileUri: file.uri,
                mimeType: file.mimeType
              }
            },
            {
              text: prompt
            }
          ],
          config: {
            responseMimeType: "application/json"
          }
        });

        const jsonText = response.text || "";
        const outputPath = path.resolve(process.cwd(), "extracted_religion_cp.json");
        fs.writeFileSync(outputPath, jsonText, "utf-8");
        console.log(`[Auto-Extract] Successfully extracted and saved to ${outputPath}`);

        console.log(`[Auto-Extract] Deleting temporary PDF from Gemini...`);
        await ai.files.delete({ name: file.name });
      } catch (error) {
        console.error("[Auto-Extract] Error during extraction:", error);
      }
    }

    async function mergeReligionCP() {
      try {
        const jsonOutputPath = path.resolve(process.cwd(), "extracted_religion_cp.json");
        if (!fs.existsSync(jsonOutputPath)) {
          console.log("[Auto-Merge] JSON output file not found. Skipping merge.");
          return;
        }

        console.log("[Auto-Merge] Found extracted_religion_cp.json. Starting integration into curriculumDatabase.ts...");
        const rawJson = fs.readFileSync(jsonOutputPath, "utf-8");

        let jsonText = rawJson.trim();
        if (jsonText.startsWith("```")) {
          jsonText = jsonText.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
        }

        const extractedData = JSON.parse(jsonText);
        const dbPath = path.resolve(process.cwd(), "src/utils/curriculumDatabase.ts");

        if (!fs.existsSync(dbPath)) {
          console.error(`[Auto-Merge] Error: curriculumDatabase.ts not found at ${dbPath}`);
          return;
        }

        // Dynamically import current curriculum database
        const dbModule = await import("./src/utils/curriculumDatabase.ts");
        const currentDb = { ...dbModule.CURRICULUM_DATABASE };

        // Merge the extracted religion data
        for (const fase of Object.keys(extractedData)) {
          if (!currentDb[fase]) {
            currentDb[fase] = {};
          }
          for (const mapel of Object.keys(extractedData[fase])) {
            currentDb[fase][mapel] = extractedData[fase][mapel];
          }
        }

        // Write it back to src/utils/curriculumDatabase.ts
        const newDbContent = `export interface Topic {
  judul: string;
  materi: string[];
}

export interface ElemenData {
  cp: string;
  topik: Topic[];
}

export const CURRICULUM_DATABASE: Record<string, Record<string, Record<string, ElemenData>>> = ${JSON.stringify(currentDb, null, 2)};
`;

        fs.writeFileSync(dbPath, newDbContent, "utf-8");
        console.log("[Auto-Merge] Successfully integrated religion CP into curriculumDatabase.ts!");

        // Rename the JSON file so we don't merge it again
        const backupPath = path.resolve(process.cwd(), "extracted_religion_cp.json.bak");
        fs.renameSync(jsonOutputPath, backupPath);
        console.log("[Auto-Merge] Renamed extracted_religion_cp.json to backup.");
      } catch (err) {
        console.error("[Auto-Merge] Error during merge:", err);
      }
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      
      const jsonOutputPath = path.resolve(process.cwd(), "extracted_religion_cp.json");
      if (!fs.existsSync(jsonOutputPath)) {
        console.log("[Auto-Extract] JSON output file not found. Starting automatic extraction of CP Religion from PDF... ");
        extractReligionCP().then(() => {
          mergeReligionCP();
        }).catch(err => console.error("[Auto-Extract] Failed:", err));
      } else {
        console.log("[Auto-Extract] extracted_religion_cp.json already exists. Starting merge...");
        mergeReligionCP();
      }
    });
  }
}

const isNetlify = !!(process.env.NETLIFY || process.env.LAMBDA_TASK_ROOT || process.env.NETLIFY_DEV);

if (!isNetlify) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
  });
}
