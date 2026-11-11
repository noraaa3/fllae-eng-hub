// Small server function: the website sends text here, this adds the secret Gemini key and returns the answer.
// The key lives in Netlify's settings (GEMINI_API_KEY), never in the website file.

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const MAX_PROMPT_CHARS = 60000;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_IP = 25;            // requests per visitor per hour (best effort)
const hits = new Map();

function reply(status, body) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function tooMany(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_IP) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return false;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return reply(405, { error: "Method not allowed" });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return reply(500, { error: "The AI is not configured yet." });

  const ip =
    (event.headers["x-nf-client-connection-ip"] ||
      event.headers["x-forwarded-for"] ||
      "unknown").split(",")[0].trim();
  if (tooMany(ip)) return reply(429, { error: "Too many requests. Try again later." });

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    return reply(400, { error: "Bad request." });
  }
  const prompt = typeof data.prompt === "string" ? data.prompt : "";
  if (!prompt.trim()) return reply(400, { error: "Empty request." });
  if (prompt.length > MAX_PROMPT_CHARS) return reply(413, { error: "The text is too long." });

  const generationConfig = { maxOutputTokens: 4096 };
  if (data.json === true) generationConfig.responseMimeType = "application/json";

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig }),
      }
    );
    if (r.status === 429) return reply(429, { error: "The free AI limit was reached. Try again in a few minutes." });
    if (!r.ok) return reply(502, { error: "The AI service returned an error." });
    const out = await r.json();
    const parts = (out.candidates && out.candidates[0] && out.candidates[0].content && out.candidates[0].content.parts) || [];
    const text = parts.map((p) => p.text || "").join("").trim();
    if (!text) return reply(502, { error: "The AI returned an empty answer." });
    return reply(200, { text });
  } catch (e) {
    return reply(502, { error: "Could not reach the AI service." });
  }
};
