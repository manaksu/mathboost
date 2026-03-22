export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set' });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say hello in one word.' }] }],
          generationConfig: { maxOutputTokens: 20 },
        }),
      }
    );
    const data = await response.json();
    return res.status(200).json({ status: 'ok', gemini: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
