const fs = require("fs"); 
["public/rpm_builder.html", "public/rpm_builder_b.html", "public/rpm_builder_c.html"].forEach(f => { 
    let html = fs.readFileSync(f, "utf8"); 
    
    // We update gemini-2.5-flash to gemini-1.5-flash everywhere just in case
    html = html.replace(/gemini-2\.5-flash/g, "gemini-1.5-flash");

    // Replace the callGemini
    const newCallGemini = `async function callGemini(prompt) {
        const rawKey = window.localStorage.getItem("custom_gemini_api_key") || "";
        let apiKey = rawKey;
        if (rawKey && !rawKey.startsWith("AIzaSy")) {
            try {
                const decoded = atob(rawKey);
                apiKey = decoded.split("").map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join("");
            } catch(e) {
                apiKey = rawKey;
            }
        }
        if (!apiKey) {
            throw new Error("Kunci API Gemini belum diatur di menu utama.");
        }
    
        const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`;
        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        let lastError = "";

        for (let i = 0; i < 5; i++) {
            try {
                const res = await fetch(url, { method: "POST", body: JSON.stringify(payload) });
                if (!res.ok) {
                    if (res.status === 400 || res.status === 401 || res.status === 403 || res.status === 404) {
                         const errText = await res.text();
                         if (res.status === 401 || res.status === 403) throw new Error("FATAL: API Key Gemini tidak valid atau API Key tidak memiliki izin (kode " + res.status + ").");
                         if (res.status === 404) throw new Error("FATAL: Model AI tidak ditemukan (kode 404). Kemungkinan versi tidak tersedia.");
                         throw new Error("FATAL: Permintaan ditolak API (kode " + res.status + ") - " + errText.substring(0, 50));
                    }
                    throw new Error("Retry");
                }
                const json = await res.json();
                const rawText = json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts && json.candidates[0].content.parts[0] ? json.candidates[0].content.parts[0].text : "";
                if (!rawText) throw new Error("Respons AI kosong.");
                
                const firstBrace = rawText.indexOf("{");
                const lastBrace = rawText.lastIndexOf("}");
                if (firstBrace === -1 || lastBrace === -1) {
                    if (rawText.includes("[")) return JSON.parse(rawText.substring(rawText.indexOf("["), rawText.lastIndexOf("]") + 1));
                    throw new Error("Format Salah");
                }
                return JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
            } catch (e) {
                lastError = e.message;
                if (e.message && e.message.startsWith("FATAL:")) {
                    throw new Error(e.message.replace("FATAL: ", ""));
                }
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
        throw new Error("Gagal terhubung dengan AI: " + lastError);
    }`;

    // Use regex to replace the function entirely
    // Find everything between 'async function callGemini(prompt) {' and 'throw new Error("Gagal menghubungi AI.");\n        }'
    
    const startObj = "async function callGemini(prompt) {";
    let startIndex = html.indexOf(startObj);
    if (startIndex > -1) {
       // Look for the end of the old function 
       // In previous iterations it threw 'throw new Error("Gagal menghubungi AI.");' or similar.
       // The closing bracket '}' is placed shortly after.
       // Let's just find the next window.generateKarakteristikMateri which occurs soon after
       
       const nextFnIndex = html.indexOf("window.generateKarakteristikMateri =");
       if (nextFnIndex > -1) {
           // We find the '}' just before window.generateKarakteristikMateri
           const endIndex = html.lastIndexOf("}", nextFnIndex);
           if (endIndex > startIndex) {
               html = html.substring(0, startIndex) + newCallGemini + "\n\n        " + html.substring(endIndex + 1);
               fs.writeFileSync(f, html);
               console.log(f + " successfully patched!");
           } else {
               console.log(f + " boundary error");
           }
       } else {
           console.log(f + " next fn not found");
       }
    } else {
        console.log(f + " start not found");
    }
});
