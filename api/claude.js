export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set.' });

  try {
    const body = req.body;
    const systemPrompt = body.system || '';
    const userMessage = body.messages?.[0]?.content || '';
    const fullPrompt = systemPrompt + '\n\n' + userMessage;

    const geminiBody = {
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 8192,
        // Removed responseMimeType — it causes empty responses on some prompts
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      }
    );

    const data = await response.json();

    // Log full Gemini response for debugging
    console.log('Gemini status:', response.status);
    console.log('Gemini response:', JSON.stringify(data).substring(0, 500));

    // Check for API-level errors
    if (data.error) {
      return res.status(500).json({ error: `Gemini error: ${data.error.message}` });
    }

    // Check for blocked content
    const candidate = data?.candidates?.[0];
    if (!candidate) {
      return res.status(500).json({
        error: 'No candidates returned from Gemini',
        promptFeedback: data?.promptFeedback || null,
        raw: JSON.stringify(data).substring(0, 400),
      });
    }

    // Check finish reason
    if (candidate.finishReason === 'SAFETY') {
      return res.status(500).json({ error: 'Gemini blocked the response due to safety filters. Try different topic wording.' });
    }

    const text = candidate?.content?.parts?.[0]?.text || '';

    if (!text) {
      return res.status(500).json({
        error: 'Empty text from Gemini candidate',
        finishReason: candidate.finishReason,
        raw: JSON.stringify(candidate).substring(0, 400),
      });
    }

    // Strip markdown code fences if Gemini adds them
    const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();

    // Return in Anthropic-compatible shape
    return res.status(200).json({
      content: [{ type: 'text', text: cleaned }],
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
