(() => {
  // UI
  const bubble = document.createElement("button");
  bubble.className = "ai-bubble";
  bubble.textContent = "AI";

  const panel = document.createElement("div");
  panel.className = "ai-panel";
  panel.innerHTML = `
    <div class="ai-top">
      <div>Assistant IA</div>
      <button class="ai-close" type="button">Fermer</button>
    </div>
    <div class="ai-messages" id="aiMessages"></div>
    <div class="ai-input">
      <input id="aiInput" type="text" placeholder="Écris ici..." autocomplete="off" />
      <button id="aiSend" type="button">Envoyer</button>
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
      addMsg(
        "🚧 Assistant IA — En cours de développement\n\nCette fonctionnalité sera bientôt disponible. Merci de votre patience 🙂",
        "ai"
      );

      // Désactiver sans casser le style (le CSS s’en occupe)
      input.disabled = true;
      sendBtn.disabled = true;
      input.placeholder = "Bientôt disponible…";
    }
  }

  // Envoi désactivé (au cas où)
  function send() {
    // rien
  }

  // Toggle via la bulle
  bubble.addEventListener("click", () => {
    const isOpen = panel.style.display === "block";
    toggle(!isOpen);
  });

  closeBtn.addEventListener("click", () => toggle(false));
  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") send();
    if (e.key === "Escape") toggle(false);
  });
})();
