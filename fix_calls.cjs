const fs = require('fs');
const files = ['./public/rpm_builder.html', './public/rpm_builder_b.html', './public/rpm_builder_c.html'];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');

    const replacement = `async function callGemini(prompt) {
        const rawKey = window.localStorage.getItem('custom_gemini_api_key') || '';
        let apiKey = rawKey;
        if (rawKey && !rawKey.startsWith('AIzaSy')) {
            try {
                const decoded = atob(rawKey);
                apiKey = decoded.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 3)).join('');
            } catch(e) {
                apiKey = rawKey;
            }
        }

        const url = '/api/proxy-generate';
        const payload = { prompt: prompt, model: 'gemini-2.5-flash-preview-09-2025' };
        
        const headers = { 'Content-Type': 'application/json' };
        if (apiKey) {
            headers['x-gemini-key'] = apiKey;
        }

        for (let i = 0; i < 5; i++) {
            try {
                const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
                const json = await res.json();
                
                if (!res.ok || !json.success) {
                     if (json.error && (json.error.includes('FATAL') || json.error.includes('TIDAK VALID') || json.error.includes('TERBATAS') || json.error.includes('KUNCI API'))) {
                         throw new Error(json.error);
                     }
                     throw new Error('Retry');
                }
                const rawText = json.text;
                const firstBrace = rawText.indexOf('{');`;

    let changed = false;
    
    // First pattern for A/B (using "{")
    const rxAB = /async function callGemini\(prompt\) \{[\s\S]*?rawText\.indexOf\("\{"\);/m;
    // Second pattern for C (using '{')
    const rxC = /const apiKey = "";[\s\S]*?async function callGemini\(prompt\) \{[\s\S]*?rawText\.indexOf\('\{'\);/m;

    if (rxAB.test(content)) {
        content = content.replace(rxAB, replacement);
        changed = true;
    } else if (rxC.test(content)) {
        content = content.replace(rxC, replacement);
        changed = true;
    } else {
        console.log('No regex match for', f);
        return;
    }

    fs.writeFileSync(f, content);
    console.log('Updated', f);
});
