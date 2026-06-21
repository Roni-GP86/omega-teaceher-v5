const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) { console.log('no key'); process.exit(0); }
const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey;
const prompt = '{"karakteristik": "...", "model": "...", "alasan": "..."}';
const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
};
fetch(url, {method:'POST', body:JSON.stringify(payload)})
.then(res => res.text())
.then(t => console.log(t));