import React, { useState } from "react";
import { UploadCloud, File, AlertTriangle, RefreshCw, Download, Check, Copy, Sparkles, FileText, Brain, ArrowRight, CheckCircle2, Database, ExternalLink } from "lucide-react";
import { jsPDF } from "jspdf";
import { CinematicLoading } from "./CinematicLoading";

interface ExtractionResult {
  markdown: string;
  fileName: string;
  wasTrimmed?: boolean;
  originalPageCount?: number;
}

export const AiPdfExtractor: React.FC = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [instruction, setInstruction] = useState<string>(
    "Ekstrak Capaian Pembelajaran (CP) dan elemen kompetensi dasar hanya untuk jenjang SD (Fase A, B, C) saja."
  );
  
  const [status, setStatus] = useState<"idle" | "reading" | "processing" | "success" | "error">("idle");
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // Document Bank saving states
  const [isSavedToBank, setIsSavedToBank] = useState<boolean>(false);
  const [savingToBank, setSavingToBank] = useState<boolean>(false);
  const [savedDocId, setSavedDocId] = useState<string | null>(null);

  // Profile and Administrator Synchronization States
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('omega_admin_logged_in') === 'true' || localStorage.getItem('omega_admin_logged_in') === 'true';
  });

  const [detectedJenjang, setDetectedJenjang] = useState<"SD" | "SMP" | "SMA" | "SMK">(() => {
    const saved = localStorage.getItem("profile_jenjang") || localStorage.getItem("kosp_jenjang");
    if (saved === "SD" || saved === "SMP" || saved === "SMA" || saved === "SMK") {
      return saved as "SD" | "SMP" | "SMA" | "SMK";
    }
    const schoolNameStr = (localStorage.getItem("kosp_nama_sekolah") || localStorage.getItem("omega_school_name") || "").toUpperCase();
    if (schoolNameStr.includes("SMP") || schoolNameStr.includes("MTS")) return "SMP";
    if (schoolNameStr.includes("SMK")) return "SMK";
    if (schoolNameStr.includes("SMA") || schoolNameStr.includes("MAN") || schoolNameStr.includes("KEJURUAN")) return "SMA";
    return "SD";
  });

  const [schoolName, setSchoolName] = useState<string>(() => {
    return localStorage.getItem("kosp_nama_sekolah") || localStorage.getItem("omega_school_name") || "SD NEGERI FATUBAI";
  });

  // New level and subject selection states for complete & precise extraction
  const [selectedJenjang, setSelectedJenjang] = useState<"SD" | "SMP" | "SMA" | "SMK">(() => {
    const isUserAdmin = sessionStorage.getItem('omega_admin_logged_in') === 'true' || localStorage.getItem('omega_admin_logged_in') === 'true';
    if (isUserAdmin) return "SD"; // defaults to SD for simulator
    // For normal user, lock strictly to detected school level
    const saved = localStorage.getItem("profile_jenjang") || localStorage.getItem("kosp_jenjang");
    if (saved === "SD" || saved === "SMP" || saved === "SMA" || saved === "SMK") {
      return saved as "SD" | "SMP" | "SMA" | "SMK";
    }
    const schoolNameStr = (localStorage.getItem("kosp_nama_sekolah") || localStorage.getItem("omega_school_name") || "").toUpperCase();
    if (schoolNameStr.includes("SMP") || schoolNameStr.includes("MTS")) return "SMP";
    if (schoolNameStr.includes("SMK")) return "SMK";
    if (schoolNameStr.includes("SMA") || schoolNameStr.includes("MAN") || schoolNameStr.includes("KEJURUAN")) return "SMA";
    return "SD";
  });

  const [selectedFase, setSelectedFase] = useState<string>("SEMUA");
  const [selectedSubject, setSelectedSubject] = useState<string>("SEMUA");

  // Sync profile details if changed elsewhere
  React.useEffect(() => {
    const handleProfileUpdate = () => {
      const isUserAdmin = sessionStorage.getItem('omega_admin_logged_in') === 'true' || localStorage.getItem('omega_admin_logged_in') === 'true';
      setIsAdmin(isUserAdmin);

      const saved = localStorage.getItem("profile_jenjang") || localStorage.getItem("kosp_jenjang");
      let computed: "SD" | "SMP" | "SMA" | "SMK" = "SD";
      if (saved === "SD" || saved === "SMP" || saved === "SMA" || saved === "SMK") {
        computed = saved as "SD" | "SMP" | "SMA" | "SMK";
      } else {
        const sName = (localStorage.getItem("kosp_nama_sekolah") || localStorage.getItem("omega_school_name") || "").toUpperCase();
        if (sName.includes("SMP") || sName.includes("MTS")) computed = "SMP";
        else if (sName.includes("SMK")) computed = "SMK";
        else if (sName.includes("SMA") || sName.includes("MAN") || sName.includes("KEJURUAN")) computed = "SMA";
      }
      setDetectedJenjang(computed);
      
      const sName = localStorage.getItem("kosp_nama_sekolah") || localStorage.getItem("omega_school_name") || "SD NEGERI FATUBAI";
      setSchoolName(sName);
      
      if (!isUserAdmin) {
        setSelectedJenjang(computed);
      }
    };
    
    window.addEventListener("omega-school-profile-updated", handleProfileUpdate);
    handleProfileUpdate();
    return () => {
      window.removeEventListener("omega-school-profile-updated", handleProfileUpdate);
    };
  }, []);

  // Automatically generate instructions based on chosen Level (Jenjang), Fase, and Subject (Mata Pelajaran)
  React.useEffect(() => {
    let levelText = "";
    let faseText = "";
    
    if (selectedJenjang === "SD") {
      levelText = "Sekolah Dasar (SD)";
      if (selectedFase === "A") faseText = "Fase A (Kelas 1 & 2)";
      else if (selectedFase === "B") faseText = "Fase B (Kelas 3 & 4)";
      else if (selectedFase === "C") faseText = "Fase C (Kelas 5 & 6)";
      else {
        faseText = "Siklus Lengkap Fase A, B, dan C (Kelas 1-6 secara utuh)";
      }
    } else if (selectedJenjang === "SMP") {
      levelText = "Sekolah Menengah Pertama (SMP)";
      if (selectedFase === "D") faseText = "Fase D (Kelas 7, 8, & 9)";
      else {
        faseText = "Fase D Lengkap";
      }
    } else if (selectedJenjang === "SMA") {
      levelText = "Sekolah Menengah Atas (SMA)";
      if (selectedFase === "E") faseText = "Fase E (Kelas 10)";
      else if (selectedFase === "F") faseText = "Fase F (Kelas 11 & 12)";
      else {
        faseText = "Fase E dan F secara utuh";
      }
    } else {
      levelText = "Sekolah Menengah Kejuruan (SMK)";
      if (selectedFase === "E") faseText = "Fase E (Kelas 10 Kejuruan)";
      else if (selectedFase === "F") faseText = "Fase F (Kelas 11 & 12 Kelompok Kejuruan)";
      else {
        faseText = "Fase E dan F khusus Kejuruan";
      }
    }

    const faseDetailInfo = selectedFase !== "SEMUA" 
      ? `terfokus khusus secara linear hanya untuk ${faseText} saja`
      : `meliputi seluruh runtutan akademis lengkap ${faseText}`;

    if (selectedSubject === "SEMUA") {
      setInstruction(
        `Ekstrak Capaian Pembelajaran (CP) dan semua Elemen Kompetensi Dasar untuk SELURUH mata pelajaran jenjang ${levelText}, yang ${faseDetailInfo} secara lengkap, utuh, dan sekongkrit mungkin. Meliputi Pendidikan Agama, Pancasila, Bahasa Indonesia, Matematika, IPAS, PJOK, Seni Budaya, dan Bahasa Inggris. JANGAN RINGKAS, sertakan seluruh deskripsi kompetensi dan elemennya secara mendalam untuk basis penyusunan dokumen kurikulum KOSP komparatif, TP, ATP, KKTP, Prota, dan Promes.`
      );
    } else {
      setInstruction(
        `Ekstrak Capaian Pembelajaran (CP) dan semua Elemen Kompetensi Dasar secara LENGKAP, DETAIL, dan UTUH khusus untuk Mata Pelajaran ${selectedSubject.toUpperCase()} jenjang ${levelText}, yang ${faseDetailInfo} saja. Pastikan untuk merinci secara penuh setiap elemen mata pelajaran, deskripsi, materi esensial, serta kompetensi capaian pembelajaran tanpa melakukan penyimpulan, singkatan, atau perangkuman ringkas.`
      );
    }
  }, [selectedJenjang, selectedFase, selectedSubject]);

  const saveToDocumentBank = () => {
    if (!result) return;
    setSavingToBank(true);
    try {
      const storedDocs = localStorage.getItem("omega_db_documents");
      const currentDocs = storedDocs ? JSON.parse(storedDocs) : [];
      
      const newDoc = {
        id: "doc-ext-" + Date.now(),
        name: result.fileName.replace(".md", "").replace("ekstraksi_", "Hasil Ekstraksi - "),
        category: "extracted",
        folderId: "f-extracted", // Save in Ekstraksi PDF folder
        content: result.markdown,
        size: result.markdown.length,
        createdAt: new Date().toISOString()
      };
      
      const updatedDocs = [...currentDocs, newDoc];
      localStorage.setItem("omega_db_documents", JSON.stringify(updatedDocs));
      setSavedDocId(newDoc.id);
      setIsSavedToBank(true);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan dokumen ke bank lokal.");
    } finally {
      setSavingToBank(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")) {
        setFile(selectedFile);
        setStatus("idle");
        setResult(null);
      } else {
        setErrorMessage("Format file tidak didukung. Sila unggah berkas bertipe PDF.");
        setStatus("error");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf" || selectedFile.name.endsWith(".pdf")) {
        setFile(selectedFile);
        setStatus("idle");
        setResult(null);
      } else {
        setErrorMessage("Format file tidak didukung. Sila unggah berkas bertipe PDF.");
        setStatus("error");
      }
    }
  };

  const setPresetInstruction = (text: string) => {
    setInstruction(text);
  };

  const processFileWithGemini = async () => {
    if (!file) return;

    setStatus("reading");
    setErrorMessage("");
    setResult(null);
    setProgressMsg("Membaca berkas biner PDF & merakit data aliran penyandi...");

    try {
      const reader = new FileReader();
      
      reader.onerror = () => {
        throw new Error("Gagal membaca file lokal.");
      };

      reader.onload = async (e) => {
        try {
          const resultStr = e.target?.result as string;
          const base64Data = resultStr.split(",")[1];
          const mimeType = file.type || "application/pdf";

          setStatus("processing");
          setProgressMsg("Menjalankan penalaran kognitif bersama sistem pemrosesan...");

          // Simulate step milestones for an immersive and professional user experience
          const milestones = [
            "Memilah metadata tabel referensi dokumen CP...",
            "Mengisolasi kluster jenjang pendidikan sasaran...",
            "Mengekstraksi elemen-elemen materi esensial & kompetensi...",
            "Menyusun visualisasi struktural bermutu tinggi...",
          ];

          let i = 0;
          const intervalId = setInterval(() => {
            if (i < milestones.length) {
              setProgressMsg(milestones[i]);
              i++;
            } else {
              clearInterval(intervalId);
            }
          }, 4000);

          const localKey = (localStorage.getItem("custom_gemini_api_key") || "").trim();
          const response = await fetch("/api/extract", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(localKey ? { "x-gemini-key": localKey } : {}),
            },
            body: JSON.stringify({
              fileBase64: base64Data,
              mimeType: mimeType,
              instruction: instruction,
            }),
          });

          clearInterval(intervalId);

          const contentType = response.headers.get("content-type");
          let data: any = null;
          if (contentType && contentType.includes("application/json")) {
            try {
              data = await response.json();
            } catch (e) {
              console.error("Gagal mengurai JSON ekstraksi:", e);
            }
          }

          if (!response.ok) {
            const errMsg = data?.error || `Server bermasalah atau sedang offline (Kode Status: ${response.status}). Hubungi administrator atau coba lagi nanti.`;
            const errMsgLower = errMsg.toLowerCase();
            if (response.status === 429 || errMsgLower.includes("quota") || errMsgLower.includes("exhausted") || errMsgLower.includes("rate limit") || errMsgLower.includes("limit") || errMsgLower.includes("429")) {
              window.dispatchEvent(new CustomEvent("gemini-quota-exhausted"));
            } else if (response.status === 403 || response.status === 400 || errMsg.includes("403") || errMsg.includes("400") || errMsg.includes("PERMISSION_DENIED") || errMsg.includes("TERBATAS") || errMsg.includes("DITOLAK") || errMsg.includes("KUNCI API") || errMsg.includes("api_key_invalid") || errMsg.includes("API key not valid")) {
              window.dispatchEvent(new CustomEvent("gemini-api-error-403"));
            }
            throw new Error(errMsg);
          }

          if (data && data.success) {
            setResult({
              markdown: data.text,
              fileName: `ekstraksi_${file.name.replace(".pdf", "")}.md`,
              wasTrimmed: data.wasTrimmed,
              originalPageCount: data.originalPageCount,
            });
            setStatus("success");
          } else {
            throw new Error(data?.error || "Gagal memperoleh hasil ekstraksi teks.");
          }

        } catch (err: any) {
          console.error(err);
          setErrorMessage(err.message || "Gagal meretas isi dokumen.");
          setStatus("error");
        }
      };

      reader.readAsDataURL(file);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Terdapat kegagalan tidak dikenal saat memproses berkas.");
      setStatus("error");
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.markdown);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const triggerDownload = (format: "md" | "txt") => {
    if (!result) return;
    const blob = new Blob([result.markdown], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const nameOnly = result.fileName.replace(".md", "");
    link.download = `${nameOnly}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const triggerPdfDownload = () => {
    if (!result) return;
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const maxLineWidth = pageWidth - (margin * 2);

      let currentY = 25;

      // Header info
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(217, 119, 6); // Amber title color
      doc.text("HASIL EKSTRAKSI ASISTEN EMAS CERDAS", margin, currentY);
      currentY += 8;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139); // Slate grayish text
      doc.text(`Sumber Dokumen: ${file?.name || "Naskah Kurikulum"}`, margin, currentY);
      currentY += 4.5;
      doc.text(`Dibuat Pada: ${new Date().toLocaleString("id-ID")}`, margin, currentY);
      currentY += 8;

      // Draw a sleek line separating header with body
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 10;

      // Parse and flow text body
      const rawLines = result.markdown.split("\n");
      
      const addNewPageIfNeeded = (heightNeeded: number) => {
        if (currentY + heightNeeded > pageHeight - margin - 15) {
          doc.addPage();
          currentY = margin;
          return true;
        }
        return false;
      };

      rawLines.forEach((rawLine) => {
        const line = rawLine.trim();
        if (line === "") {
          currentY += 4;
          return;
        }

        // Heading 1 (#)
        if (line.startsWith("# ")) {
          const text = line.replace("# ", "").replace(/\*\*/g, "");
          const splitText = doc.splitTextToSize(text, maxLineWidth);
          const blockHeight = splitText.length * 8;
          addNewPageIfNeeded(blockHeight + 5); // Prevent orphan H1
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(217, 119, 6); // Amber title color
          splitText.forEach((textLine: string) => {
            doc.text(textLine, margin, currentY);
            currentY += 7.5;
          });
          currentY += 1.5;
          return;
        }

        // Heading 2 (##)
        if (line.startsWith("## ")) {
          const text = line.replace("## ", "").replace(/\*\*/g, "");
          const splitText = doc.splitTextToSize(text, maxLineWidth);
          const blockHeight = splitText.length * 6;
          addNewPageIfNeeded(blockHeight + 5); // Prevent orphan H2
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11.5);
          doc.setTextColor(31, 41, 55); // gray-800
          splitText.forEach((textLine: string) => {
            doc.text(textLine, margin, currentY);
            currentY += 6;
          });
          currentY += 1.5;
          return;
        }

        // Heading 3 (###)
        if (line.startsWith("### ")) {
          const text = line.replace("### ", "").replace(/\*\*/g, "");
          const splitText = doc.splitTextToSize(text, maxLineWidth);
          const blockHeight = splitText.length * 5;
          addNewPageIfNeeded(blockHeight + 4); // Prevent orphan H3
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(217, 119, 6); // amber-600
          splitText.forEach((textLine: string) => {
            doc.text(textLine, margin, currentY);
            currentY += 5;
          });
          currentY += 1;
          return;
        }

        // Bullet lists (- or *)
        if (line.startsWith("- ") || line.startsWith("* ")) {
          const rawText = line.substring(2).replace(/\*\*/g, "");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(55, 65, 81); // gray-700
          
          const splitText = doc.splitTextToSize(`•  ${rawText}`, maxLineWidth);
          const blockHeight = splitText.length * 5;
          addNewPageIfNeeded(blockHeight);
          
          splitText.forEach((textLine: string) => {
            doc.text(textLine, margin, currentY);
            currentY += 5;
          });
          return;
        }

        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          const rawText = line.replace(/\*\*/g, "");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(55, 65, 81); // gray-700

          const splitText = doc.splitTextToSize(rawText, maxLineWidth);
          const blockHeight = splitText.length * 5;
          addNewPageIfNeeded(blockHeight);

          splitText.forEach((textLine: string) => {
            doc.text(textLine, margin, currentY);
            currentY += 5;
          });
          return;
        }

        // Parse Table | Column 1 | Column 2 |
        if (line.startsWith("|") && line.endsWith("|")) {
          if (line.includes("---")) return; // skip divider line
          const cells = line.split("|").map(col => col.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(55, 65, 81);
          
          const columnsCount = cells.length;
          if (columnsCount === 0) return;
          const colWidth = maxLineWidth / columnsCount;

          // Compute wrapped cells first to see how much vertical space we need
          const cellLinesList: string[][] = cells.map(cell => doc.splitTextToSize(cell.replace(/\*\*/g, ""), colWidth - 2));
          const maxLines = Math.max(...cellLinesList.map(lines => lines.length), 1);
          const blockHeight = maxLines * 4.5 + 2;

          addNewPageIfNeeded(blockHeight);

          cellLinesList.forEach((wrappedLines, idx) => {
            const xPos = margin + (idx * colWidth);
            wrappedLines.forEach((textLine, lineIdx) => {
              doc.text(textLine, xPos, currentY + (lineIdx * 4.5));
            });
          });
          
          currentY += blockHeight;
          return;
        }

        // Normal paragraph text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(55, 65, 81); // gray-700
        const cleanParagraph = line.replace(/\*\*/g, "");
        const splitText = doc.splitTextToSize(cleanParagraph, maxLineWidth);
        const blockHeight = splitText.length * 5;
        
        addNewPageIfNeeded(blockHeight);
        splitText.forEach((textLine: string) => {
          doc.text(textLine, margin, currentY);
          currentY += 5;
        });
      });

      // Add elegant footer page numbers
      const pageCount = doc.internal.pages.length - 1;
      for (let page = 1; page <= pageCount; page++) {
        doc.setPage(page);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175); // gray-400
        
        doc.text(
          `Dokumen ini dihasilkan oleh Asisten Emas Cerdas  |  Halaman ${page} dari ${pageCount}`, 
          margin, 
          pageHeight - 10
        );
      }

      const nameOnly = result.fileName.replace(".md", "");
      doc.save(`${nameOnly}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Gagal mengunduh berkas PDF. Silakan coba lagi atau gunakan opsi salin konten.");
    }
  };

  // Safe block-based markdown parsing and rendering
  const renderCustomMarkdown = (text: string) => {
    const parseMarkdown = (rawText: string) => {
      const lines = rawText.split("\n");
      const blocks: any[] = [];
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];
        const trimmed = line.trim();

        if (trimmed === "") {
          blocks.push({ type: "space" });
          i++;
          continue;
        }

        if (trimmed.startsWith("### ")) {
          blocks.push({ type: "h3", content: trimmed.replace("### ", "") });
          i++;
          continue;
        }
        if (trimmed.startsWith("## ")) {
          blocks.push({ type: "h2", content: trimmed.replace("## ", "") });
          i++;
          continue;
        }
        if (trimmed.startsWith("# ")) {
          blocks.push({ type: "h1", content: trimmed.replace("# ", "") });
          i++;
          continue;
        }

        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const items: string[] = [];
          while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
            items.push(lines[i].trim().substring(2));
            i++;
          }
          blocks.push({ type: "list", items });
          continue;
        }

        if (/^\d+\.\s/.test(trimmed)) {
          const items: string[] = [];
          while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
            items.push(lines[i].trim().replace(/^\d+\.\s/, ""));
            i++;
          }
          blocks.push({ type: "numbered-list", items });
          continue;
        }

        if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
          const rows: string[][] = [];
          let headers: string[] = [];
          
          const extractCells = (l: string) => {
            return l.split("|")
              .map(cell => cell.trim())
              .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          };

          headers = extractCells(line);
          i++;

          if (i < lines.length && lines[i].trim().includes("---")) {
            i++;
          }

          while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
            rows.push(extractCells(lines[i]));
            i++;
          }

          blocks.push({ type: "table", headers, rows });
          continue;
        }

        blocks.push({ type: "paragraph", content: trimmed });
        i++;
      }

      return blocks;
    };

    const blocks = parseMarkdown(text);

    const formatBold = (content: string) => {
      if (!content.includes("**")) return content;
      const parts = content.split("**");
      return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part);
    };

    return blocks.map((block, idx) => {
      switch (block.type) {
        case "h1":
          return <h3 key={idx} className="text-lg font-black text-amber-300 mt-6 mb-4 font-display">{formatBold(block.content)}</h3>;
        case "h2":
          return <h4 key={idx} className="text-base font-extrabold text-white mt-5 mb-3 border-l-4 border-amber-500 pl-2 font-display">{formatBold(block.content)}</h4>;
        case "h3":
          return <h5 key={idx} className="text-sm font-bold text-amber-400 mt-4 mb-2 border-b border-zinc-800/60 pb-1 font-mono uppercase tracking-wide">{formatBold(block.content)}</h5>;
        case "list":
          return (
            <ul key={idx} className="space-y-1 my-2 pl-4">
              {block.items.map((item: string, itemIdx: number) => (
                <li key={itemIdx} className="text-zinc-300 text-xs list-disc marker:text-amber-500 leading-relaxed">
                  {formatBold(item)}
                </li>
              ))}
            </ul>
          );
        case "numbered-list":
          return (
            <ol key={idx} className="space-y-1 my-2 pl-4 list-decimal marker:text-amber-500">
              {block.items.map((item: string, itemIdx: number) => (
                <li key={itemIdx} className="text-zinc-300 text-xs leading-relaxed">
                  {formatBold(item)}
                </li>
              ))}
            </ol>
          );
        case "table":
          return (
            <div key={idx} className="overflow-x-auto my-4 border border-zinc-900 rounded-xl bg-zinc-950/50">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-amber-500/10 border-b border-zinc-800 text-amber-400 font-mono font-semibold">
                    {block.headers.map((cell: string, cIdx: number) => (
                      <th key={cIdx} className="p-3 font-semibold">{cell}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row: string[], rIdx: number) => (
                    <tr key={rIdx} className="border-b border-zinc-900 hover:bg-zinc-900/30 text-zinc-300 last:border-none">
                      {row.map((cell: string, cIdx: number) => (
                        <td key={cIdx} className="p-3 align-top leading-relaxed">{formatBold(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case "paragraph":
          return <p key={idx} className="text-zinc-400 text-xs leading-relaxed my-2">{formatBold(block.content)}</p>;
        case "space":
          return <div key={idx} className="h-2" />;
        default:
          return null;
      }
    });
  };

  return (
    <div className="premium-card premium-border-amber rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-amber-555/10 blur-[55px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-orange-555/10 blur-[50px] pointer-events-none" />

      {/* Title */}
      <div className="mb-6 bg-[#0e0f14] p-5 rounded-2xl border border-amber-950 text-left">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Sparkles className="w-5 h-5 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)] animate-pulse" />
          </div>
          <div>
            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
              ASISTEN EMAS: PENYARING & EKSTRAKTOR DOKUMEN CERDAS
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono">MODULE_DOC_PURIFIER_V3.5</span>
          </div>
        </div>
        <p className="text-zinc-400 text-xs leading-relaxed font-sans">
          Unggah naskah resmi PDF (misalnya, dokumen Kurikulum seluruh jenjang dari SD, SMP, SMA/SMK). 
          Masukkan kriteria instruksi pencarian Anda, lalu saksikan kecerdasan sistem memindai, melacak, 
          dan mengupas bagian spesifik yang Anda butuhkan ke dalam satu dokumen ringkas baru.
        </p>
      </div>

      {status === "reading" || status === "processing" ? (
        <CinematicLoading
          title="Mengekstrak dan Purifikasi Dokumen"
          subtitle="Sistem sedang menganalisis naskah kurikulum PDF Anda secara komprehensif untuk menyaring, mengekstrak, dan merekonstruksi bagian yang paling krusial"
          progressMsg={progressMsg || "Menyiapkan engine parsing PDF..."}
        />
      ) : (
        <div className="space-y-6 text-left">
        {/* Upload Zone */}
        <div className="space-y-2">
          <span className="text-zinc-300 font-bold text-xs block font-mono flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]" />
            1. UNGGAH DOKUMEN BAHAN (PDF TARGET):
          </span>
          
          {!file ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-amber-450 bg-amber-500/5 scale-[0.99]"
                  : "border-zinc-805 bg-[#050508]/60 hover:border-zinc-700"
              }`}
            >
              <input
                id="ai-pdf-uploader"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileInput}
              />
              <label htmlFor="ai-pdf-uploader" className="cursor-pointer space-y-3 block">
                <div className="p-3 bg-zinc-900 rounded-2xl w-12 h-12 flex items-center justify-center mx-auto text-zinc-400">
                  <UploadCloud className="w-6 h-6 text-amber-400 animate-bounce" />
                </div>
                <div>
                  <p className="text-xs text-zinc-200 font-bold">Seret berkas ke sini atau klik untuk menelusuri</p>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">Ekstensi yang Didukung: .pdf (Maks. 30MB)</p>
                </div>
              </label>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-[#050508] border border-zinc-850 rounded-2xl font-mono text-xs font-mono">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <File className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.4)]" />
                </div>
                <div>
                  <div className="text-zinc-200 font-semibold truncate max-w-xs md:max-w-md">{file.name}</div>
                  <div className="text-[10px] text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setStatus("idle");
                }}
                className="py-1 px-3 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg transition"
              >
                Ganti Berkas
              </button>
            </div>
          )}
        </div>

        {/* Synchronized Profile Banner */}
        {isAdmin ? (
          <div className="mb-3 flex items-center justify-between text-[11px] px-3.5 py-2.5 bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/30 rounded-xl font-mono text-amber-400">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
              <span>★ <strong>MODE SIMULATOR ADMIN AKTIF:</strong> Semua Pilihan Jenjang &amp; Simulasi Terbuka Secara Fleksibel.</span>
            </span>
            <span className="text-[9.5px] bg-amber-500/20 text-white rounded px-2 py-0.5 border border-amber-500/30 font-bold">Simulator</span>
          </div>
        ) : (
          <div className="mb-3 flex items-center justify-between text-[11px] px-3.5 py-2.5 bg-gradient-to-r from-cyan-950/40 via-cyan-900/10 to-transparent border border-cyan-500/30 rounded-xl font-mono text-cyan-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>SINKRON PROFIL SEKOLAH: <strong className="text-white font-sans uppercase">{schoolName || "SD NEGERI FATUBAI"}</strong> • TERKUNCI KE JENJANG <strong className="text-white font-bold">{detectedJenjang}</strong></span>
            </span>
            <span className="text-[9px] bg-cyan-950 text-cyan-300 rounded px-2 py-0.5 border border-cyan-800/40 font-bold">SINKRON</span>
          </div>
        )}

        {/* New Interactive Level and Subject Extraction Controller */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#08090d]/50 p-4 rounded-2xl border border-zinc-800/80">
          <div className="space-y-2 text-left">
            <label className="text-zinc-300 font-bold text-xs block font-mono flex items-center gap-1.5">
              ★ JENJANG TARGET:
              {!isAdmin && <span className="text-[10px] text-cyan-400 font-normal italic">(Locked)</span>}
            </label>
            <select
              value={selectedJenjang}
              onChange={(e) => {
                const val = e.target.value as "SD" | "SMP" | "SMA" | "SMK";
                setSelectedJenjang(val);
                setSelectedFase("SEMUA");
              }}
              disabled={!isAdmin}
              className={`w-full ${!isAdmin ? "opacity-90 bg-zinc-950/60 cursor-not-allowed border-dashed border-zinc-700 text-amber-400 font-bold" : ""}`}
            >
              <option value="SD">Sekolah Dasar (SD)</option>
              <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
              <option value="SMA">Sekolah Menengah Atas (SMA)</option>
              <option value="SMK">Sekolah Menengah Kejuruan (SMK)</option>
            </select>
            <span className="text-[10px] text-zinc-500 block font-mono pl-1">
              {isAdmin ? "Pilih jenjang simulasi kurikulum luring" : "Sesuai profil satuan pendidikan aktif"}
            </span>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-zinc-300 font-bold text-xs block font-mono">
              ★ FASE PENDIDIKAN:
            </label>
            <select
              value={selectedFase}
              onChange={(e) => setSelectedFase(e.target.value)}
              className="w-full"
            >
              {selectedJenjang === "SD" && (
                <>
                  <option value="SEMUA">Semua Fase SD (A, B, C / Kelas 1-6)</option>
                  <option value="A">Fase A (Kelas 1 & 2)</option>
                  <option value="B">Fase B (Kelas 3 & 4)</option>
                  <option value="C">Fase C (Kelas 5 & 6)</option>
                </>
              )}
              {selectedJenjang === "SMP" && (
                <>
                  <option value="SEMUA">Semua Fase (Fase D / Kelas 7-9)</option>
                  <option value="D">Fase D (Kelas 7, 8, & 9)</option>
                </>
              )}
              {selectedJenjang === "SMA" && (
                <>
                  <option value="SEMUA">Semua Fase SMA (E, F / Kelas 10-12)</option>
                  <option value="E">Fase E (Kelas 10)</option>
                  <option value="F">Fase F (Kelas 11 & 12)</option>
                </>
              )}
              {selectedJenjang === "SMK" && (
                <>
                  <option value="SEMUA">Semua Fase SMK (E, F Kejuruan)</option>
                  <option value="E">Fase E Kejuruan (Kelas 10)</option>
                  <option value="F">Fase F Kejuruan (Kelas 11 & 12)</option>
                </>
              )}
            </select>
            <span className="text-[10px] text-zinc-500 block font-mono pl-1">
              {selectedFase === "SEMUA" 
                ? "Ekstraksi menyeluruh untuk draft KOSP"
                : "Spesifik guru kelas & bidang studi luring"}
            </span>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-zinc-300 font-bold text-xs block font-mono">
              ★ PILIH MATA PELAJARAN:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full"
            >
              <option value="SEMUA">Semua Mata Pelajaran (Lengkap)</option>
              <option value="Matematika">Matematika</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Ilmu Pengetahuan Alam dan Sosial (IPAS)">IPAS / IPA-IPS</option>
              <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
              <option value="Pendidikan Agama">Pendidikan Agama</option>
              <option value="Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)">PJOK</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
              <option value="Seni Budaya">Seni Budaya</option>
              {selectedJenjang === "SMK" && (
                <>
                  <option value="Dasar-Dasar Kejuruan">Dasar-Dasar Program Keahlian</option>
                  <option value="Konsentrasi Keahlian">Mata Pelajaran Konsentrasi Keahlian</option>
                  <option value="Projek Kreatif">Projek Kreatif dan Kewirausahaan (PKK)</option>
                </>
              )}
            </select>
            <span className="text-[10px] text-zinc-500 block font-mono pl-1">
              Dapat dibatasi per mata pelajaran luring.
            </span>
          </div>
        </div>

        {/* Extraction Instruction Query */}
        <div className="space-y-3">
          <span className="text-zinc-300 font-bold text-xs block font-mono flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.4)]" />
            2. KRITERIA DAN FORMULASI PERINTAH EKSTRAKSI:
          </span>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Contoh: Saya hanya butuh jenjang SD saja. Hasilkan capaian pembelajaran (kompetensi dasar) dan elemen untuk jenjang SD..."
            rows={4}
            className="w-full p-4 text-xs bg-[#050508] border border-zinc-800 focus:border-amber-400 rounded-2xl text-white outline-none font-sans leading-relaxed transition"
          />

          {/* Quick presets templates row */}
          <div>
            <span className="text-zinc-500 text-[10px] uppercase font-mono tracking-wide block mb-2">
              Tombol Cepat (Presets): {!isAdmin && <span className="text-cyan-400">(Disaring untuk Jenjang {selectedJenjang})</span>}
            </span>
            <div className="flex flex-wrap gap-2">
              {(isAdmin || selectedJenjang === "SD") && (
                <>
                  <button
                    onClick={() => {
                      setSelectedJenjang("SD");
                      setSelectedFase("SEMUA");
                      setSelectedSubject("SEMUA");
                    }}
                    className="py-1 px-3 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 bg-zinc-950/70 hover:border-amber-500/40 hover:text-amber-400 transition"
                  >
                    Semua Mapel SD (Fase A-C)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedJenjang("SD");
                      setSelectedFase("B");
                      setSelectedSubject("Matematika");
                    }}
                    className="py-1 px-3 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 bg-zinc-950/70 hover:border-amber-500/40 hover:text-amber-400 transition"
                  >
                    Matematika SD Fase B (Kelas 3-4)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedJenjang("SD");
                      setSelectedFase("C");
                      setSelectedSubject("Ilmu Pengetahuan Alam dan Sosial (IPAS)");
                    }}
                    className="py-1 px-3 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 bg-zinc-950/70 hover:border-amber-500/40 hover:text-amber-400 transition"
                  >
                    IPAS SD Fase C (Kelas 5-6)
                  </button>
                </>
              )}
              {(isAdmin || selectedJenjang === "SMP") && (
                <button
                  onClick={() => {
                    setSelectedJenjang("SMP");
                    setSelectedFase("D");
                    setSelectedSubject("SEMUA");
                  }}
                  className="py-1 px-3 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 bg-zinc-950/70 hover:border-amber-500/40 hover:text-amber-400 transition"
                >
                  Semua Mapel SMP (Fase D)
                </button>
              )}
              {(isAdmin || selectedJenjang === "SMA") && (
                <button
                  onClick={() => {
                    setSelectedJenjang("SMA");
                    setSelectedFase("SEMUA");
                    setSelectedSubject("SEMUA");
                  }}
                  className="py-1 px-3 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 bg-zinc-950/70 hover:border-amber-500/40 hover:text-amber-400 transition"
                >
                  Semua Mapel SMA (Fase E/F)
                </button>
              )}
              {(isAdmin || selectedJenjang === "SMK") && (
                <button
                  onClick={() => {
                    setSelectedJenjang("SMK");
                    setSelectedFase("SEMUA");
                    setSelectedSubject("SEMUA");
                  }}
                  className="py-1 px-3 rounded-lg border border-zinc-800 text-[11px] text-zinc-400 bg-zinc-950/70 hover:border-amber-500/40 hover:text-amber-400 transition"
                >
                  Kurikulum SMK Kejuruan (Fase E/F)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Process button */}
        <div className="pt-2 text-center">
          <button
            onClick={processFileWithGemini}
            disabled={!file || status === "reading" || status === "processing"}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-450 via-amber-400 to-orange-400 text-black font-extrabold text-xs hover:opacity-95 disabled:opacity-40 transition flex items-center justify-center gap-2.5 font-mono shadow-lg shadow-amber-500/10"
          >
            {status === "reading" || status === "processing" ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>MEMPROSES: {progressMsg.toUpperCase()}</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 shrink-0 text-black" />
                <span>MULAI EKSTRAKSI CERDAS SEKARANG</span>
              </>
            )}
          </button>
        </div>



        {/* Error Notification */}
        {status === "error" && (
          <div className="p-5 bg-red-950/15 rounded-2xl border border-red-500/20 text-xs text-red-300 flex items-start gap-3.5 backdrop-blur-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-400 animate-pulse" />
            <div>
              <strong className="text-red-400 block mb-2 font-mono font-bold tracking-wide">GAGAL_SISTEM:</strong>
              <div className="whitespace-pre-line leading-relaxed font-sans">{errorMessage}</div>
            </div>
          </div>
        )}

        {/* Success Output Workspace */}
        {status === "success" && result && (
          <div className="space-y-4 animate-fade-in border border-amber-500/10 bg-[#0c0c11] p-6 rounded-3xl mt-4 relative">
            <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 border-b border-zinc-850 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-white text-xs font-mono font-bold uppercase tracking-wide">
                    FILE DOKUMEN BARU BERHASIL DIHASILKAN!
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  Isi diproses berdasarkan naskah asli kurikulum PDF menggunakan sistem pemrosesan luring
                </div>
              </div>

              {/* Download / Copy Action Tools */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full xl:w-auto">
                <button
                  onClick={saveToDocumentBank}
                  disabled={isSavedToBank || savingToBank}
                  className={`py-2 px-3 border rounded-xl text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto col-span-2 sm:col-span-1 ${
                    isSavedToBank 
                      ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 cursor-default shadow-sm shadow-emerald-500/5" 
                      : "bg-amber-500/10 border-amber-500/20 text-amber-300 hover:border-amber-400 hover:text-white"
                  }`}
                >
                  <Database className="w-3.5 h-3.5 shrink-0 text-amber-450" />
                  <span>{savingToBank ? "Proses..." : isSavedToBank ? "Tersimpan!" : "Simpan Bank"}</span>
                </button>
                {isSavedToBank && savedDocId && (
                  <button
                    onClick={() => {
                      localStorage.setItem("omega_db_selected_doc_id", savedDocId);
                      window.dispatchEvent(new CustomEvent("navigate-to-tool", { detail: "doc_bank" }));
                    }}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.35)] animate-[pulse_2s_infinite] cursor-pointer w-full sm:w-auto col-span-2 sm:col-span-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Dokumen 🔓</span>
                  </button>
                )}
                <button
                  onClick={copyToClipboard}
                  className="py-2 px-3 bg-[#0d0d10] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer w-full sm:w-auto"
                >
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Selesai!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>Salin Konten</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => triggerDownload("md")}
                  className="py-2 px-3 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer w-full sm:w-auto"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unduh .MD</span>
                </button>
                <button
                  onClick={() => triggerDownload("txt")}
                  className="py-2 px-3 bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer w-full sm:w-auto"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Unduh .TXT</span>
                </button>
                <button
                  onClick={triggerPdfDownload}
                  className="py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black rounded-xl text-[11px] font-mono font-semibold flex items-center justify-center gap-1.5 transition-all duration-205 shadow-md shadow-amber-500/10 active:scale-95 w-full sm:w-auto cursor-pointer col-span-2 sm:col-span-1"
                >
                  <File className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </button>
              </div>
            </div>

            {/* Warning Banner if PDF was programmatically sliced */}
            {result.wasTrimmed && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 flex items-start gap-3.5">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5 animate-pulse" />
                <div>
                  <strong className="text-amber-400 block font-mono font-bold mb-1 uppercase tracking-wide">DOKUMEN MELEBIHI BATAS (DIPOTONG OTOMATIS):</strong>
                  <p className="leading-relaxed text-zinc-300">
                    Dokumen asli yang Anda unggah memiliki total <span className="text-amber-300 font-bold font-mono">{result.originalPageCount}</span> halaman. Karena sistem membatasi pembacaan dokumen maksimal 1.000 halaman per proses, sistem kami <strong>telah memotong berkas Anda secara dinamis</strong> dan mengekstrak informasi penting secara eksklusif dari <strong>1.000 halaman pertama</strong>. Semua bagian disaring secara rapi tanpa terjadi kegagalan sistem!
                  </p>
                </div>
              </div>
            )}

            {/* Document Content Box */}
            <div className="p-5 md:p-6 bg-[#050508] border border-zinc-900 rounded-2xl max-h-[500px] overflow-y-auto antialiased font-sans text-zinc-300 select-text scrollbar-thin scrollbar-thumb-zinc-800">
              {renderCustomMarkdown(result.markdown)}
            </div>

            <div className="flex gap-2.5 items-start text-[11px] text-zinc-500 mt-2 font-mono">
              <span className="text-amber-400 block shrink-0 font-bold">&gt;&gt; CATATAN:</span>
              <span>Dokumen di atas siap Anda salin untuk diletakkan di Microsot Word, atau klik "Unduh .MD/.TXT" untuk membukanya secara langsung di komputer Anda.</span>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};
