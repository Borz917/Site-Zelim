(() => {
  const API_URL = "https://my-ia-snowy.vercel.app";

  // UI
  const bubble = document.createElement("button");
  bubble.className = "ai-bubble";
  bubble.textContent = "AI";

  const panel = document.createElement("div");
  panel.className = "ai-panel";
  panel.innerHTML = `
    <div class="ai-top">
      <div>Assistant IA</div>
      <button class="ai-close">Fermer</button>
    </div>
    <div class="ai-messages" id="aiMessages"></div>
    <div class="ai-input">
      <input id="aiInput" type="text" placeholder="Écris ici..." autocomplete="off" />
      <button id="aiSend">Envoyer</button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(panel);

  const closeBtn = panel.querySelector(".ai-close");
  const msgs = panel.querySelector("#aiMessages");
  const input = panel.querySelector("#aiInput");
  const sendBtn = panel.querySelector("#aiSend");

  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className = `ai-msg ${who === "user" ? "ai-user" : ""}`;
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function toggle(open) {
    panel.style.display = open ? "block" : "none";
    if (open && msgs.childElementCount === 0) {
      addMsg("Salut ! Je suis l’assistant du portfolio. Tu veux des infos sur le parcours, les projets, ou comment contacter Zelimkhan ?", "ai");
    }
    if (open) setTimeout(() => input.focus(), 50);
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    addMsg(text, "user");

    addMsg("…", "ai");
    const loading = msgs.lastChild;

    try {
      const r = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      const data = await r.json();
      loading.remove();
      if (!r.ok) addMsg("Erreur: " + (data.error || "Impossible de répondre."), "ai");
      else addMsg(data.reply, "ai");
    } catch (e) {
      loading.remove();
      addMsg("Erreur réseau. Réessaie.", "ai");
    }
  }

  bubble.addEventListener("click", () => toggle(true));
  closeBtn.addEventListener("click", () => toggle(false));
  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
  });
})();
