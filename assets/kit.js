// Copy buttons: any .codebox gets one
document.querySelectorAll(".codebox").forEach(box => {
  const pre = box.querySelector("pre");
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "copy"; btn.textContent = "Copy";
  btn.addEventListener("click", () => {
    const done = () => { btn.textContent = "Copied"; setTimeout(() => btn.textContent = "Copy", 1500); };
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents(pre);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = "Press Ctrl+C";
    };
    try { navigator.clipboard.writeText(pre.textContent).then(done, fallback); } catch (e) { fallback(); }
  });
  box.appendChild(btn);
});

// Tabs: <div class="tabs" data-tabs="name"> buttons with data-tab, panels with data-panel under [data-tabset="name"]
document.querySelectorAll("[data-tabs]").forEach(tabs => {
  const set = document.querySelector(`[data-tabset="${tabs.dataset.tabs}"]`);
  const pick = key => {
    tabs.querySelectorAll("button").forEach(b => b.setAttribute("aria-selected", b.dataset.tab === key));
    set.querySelectorAll("[data-panel]").forEach(p => p.hidden = p.dataset.panel !== key);
    try { localStorage.setItem("kit-tab-" + tabs.dataset.tabs, key); } catch (e) {}
  };
  tabs.addEventListener("click", e => { const b = e.target.closest("button"); if (b) pick(b.dataset.tab); });
  let start = tabs.querySelector("button").dataset.tab;
  const ua = navigator.userAgent;
  if (/Mac/.test(ua)) start = "mac"; else if (/Linux/.test(ua) && !/Android/.test(ua)) start = "linux";
  try { const saved = localStorage.getItem("kit-tab-" + tabs.dataset.tabs); if (saved && tabs.querySelector(`[data-tab="${saved}"]`)) start = saved; } catch (e) {}
  if (!tabs.querySelector(`[data-tab="${start}"]`)) start = tabs.querySelector("button").dataset.tab;
  pick(start);
});
