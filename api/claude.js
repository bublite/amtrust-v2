export const maxDuration = 30;

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).end();

  const { prompt, max_tokens = 1000 } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                          "Content-Type": "application/json",
                          "x-api-key": process.env.ANTHROPIC_API_KEY,
                          "anthropic-version": "2023-06-01",
                },
                body: JSON.stringify({
                          model: "claude-haiku-4-5-20251001",
                          max_tokens: Math.min(max_tokens, 1500),
                          messages: [{ role: "user", content: prompt }],
                }),
        });

      if (!r.ok) {
              const errText = await r.text();
              return res.status(r.status).json({ error: errText });
      }

      const data = await r.json();
        const text = data.content?.[0]?.text ?? "";
        return res.status(200).json({ text });
  } catch (err) {
        return res.status(500).json({ error: err.message });
  }
}
