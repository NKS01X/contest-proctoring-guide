(() => {
  const launcher = document.getElementById("launcher");
  const chat = document.getElementById("chat");
  const bubble = document.getElementById("bubble");
  const open = () => document.getElementById("open-chat").click();

  document.getElementById("bot-btn").addEventListener("click", open);
  document.getElementById("bubble-open").addEventListener("click", open);
  document.getElementById("bubble-close").addEventListener("click", () => { bubble.hidden = true; });

  // Hide the robot while the chat panel is open, show it again when closed
  new MutationObserver(() => { launcher.hidden = !chat.hidden; })
    .observe(chat, { attributes: true, attributeFilter: ["hidden"] });
})();
