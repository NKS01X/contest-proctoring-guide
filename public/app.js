(() => {
  const $ = (s) => document.querySelector(s);
  const chat = $("#chat"), box = $("#messages"), form = $("#form"), input = $("#input"), send = $("#send");
  let history = [], busy = false;

  /* one-time reveal of the sample host log */
  const rows = [...document.querySelectorAll("#log li")];
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    rows.forEach((r) => r.classList.add("pending"));
    rows.forEach((r, i) => setTimeout(() => r.classList.remove("pending"), 350 + i * 420));
  }

  /* active section in the side nav */
  const links = [...document.querySelectorAll(".toc a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-20% 0px -70% 0px" });
  document.querySelectorAll("main section").forEach((s) => io.observe(s));

  /* chat open/close */
  const open = () => { chat.hidden = false; input.focus(); };
  const close = () => { chat.hidden = true; $("#open-chat").focus(); };
  $("#open-chat").onclick = open;
  $("#open-chat-2").onclick = open;
  $("#close-chat").onclick = close;
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !chat.hidden) close(); });
  document.querySelectorAll(".chips button").forEach((b) => (b.onclick = () => ask(b.textContent)));

  input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = input.scrollHeight + "px"; });
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener("submit", (e) => { e.preventDefault(); const t = input.value.trim(); if (t) ask(t); });

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function render(text) {
    const lines = esc(text).split("\n");
    let out = "", list = false;
    for (const l of lines) {
      const li = l.match(/^\s*(?:[-*]|\d+\.)\s+(.*)/);
      if (li) { if (!list) { out += "<ul>"; list = true; } out += "<li>" + inline(li[1]) + "</li>"; continue; }
      if (list) { out += "</ul>"; list = false; }
      if (l.trim()) out += "<p>" + inline(l) + "</p>";
    }
    return out + (list ? "</ul>" : "");
  }
  const inline = (s) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");

  function add(cls, html) {
    const d = document.createElement("div");
    d.className = "msg " + cls; d.innerHTML = html;
    box.appendChild(d); box.scrollTop = box.scrollHeight;
    return d;
  }

  async function ask(text) {
    if (busy) return;
    busy = true; send.disabled = true;
    $("#empty")?.remove();
    input.value = ""; input.style.height = "auto";
    add("user", "<p>" + esc(text) + "</p>");
    history.push({ role: "user", content: text });
    const bubble = add("bot", "<p>Thinking...</p>");
    let answer = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history })
      });
      if (!res.ok || !res.body) {
        let msg = "The assistant is unavailable. Try again in a moment.";
        try { msg = (await res.json()).error || msg; } catch {}
        throw new Error(msg);
      }
      const reader = res.body.getReader(), dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n"); buf = parts.pop();
        for (const p of parts) {
          if (!p.startsWith("data:")) continue;
          const data = p.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) { answer += delta; bubble.innerHTML = render(answer); box.scrollTop = box.scrollHeight; }
          } catch {}
        }
      }
      if (!answer) throw new Error("No answer came back. Try again.");
      history.push({ role: "assistant", content: answer });
    } catch (err) {
      bubble.className = "msg err"; bubble.innerHTML = "<p>" + esc(err.message) + "</p>";
      history.pop();
    } finally {
      busy = false; send.disabled = false; input.focus();
    }
  }
})();
