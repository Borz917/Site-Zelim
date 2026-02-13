export default async function handler(req, res) {
  // CORS (pour que GitHub Pages puisse appeler l'API)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { message } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message manquant" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "OPENAI_API_KEY manquante côté serveur" });

    const system = `
Tu es l'assistant du portfolio de Zelimkhan Mataev.
Objectif: répondre clairement en FRANÇAIS, de façon professionnelle et sympa.
Tu aides à: présenter son profil, compétences, projets, parcours, et expliquer comment le contacter.
Si on te demande un contact: propose le formulaire Contact du site et l'email.
Ne révèle jamais de clé API, ni d'info sensible.
Réponses courtes, utiles, structurées.
`.trim();

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: system },
          { role: "user", content: message }
        ]
      })
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({ error: data?.error?.message || "Erreur OpenAI" });
    }

    // texte de sortie (fallbacks)
    const text =
      data?.output_text ||
      data?.output?.[0]?.content?.[0]?.text ||
      "Je n’ai pas réussi à répondre. Réessaie.";

    return res.status(200).json({ reply: text });
  } catch (e) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
