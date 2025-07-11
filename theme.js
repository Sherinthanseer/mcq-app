console.log("🔹 theme.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  // 1. Get saved theme or use default
  const saved = localStorage.getItem("infyniqTheme") || "default";
  console.log("Saved theme from storage:", saved);

  // 2. Remove all old theme classes and apply new one
  document.body.classList.remove("default-theme", "dark-theme", "pastel-theme");
  document.body.classList.add(`${saved}-theme`);

  // 3. If dropdown exists, sync it and allow change
  const sel = document.getElementById("theme-select");
  if (sel) {
    sel.value = saved;
    sel.addEventListener("change", () => {
      document.body.classList.remove("default-theme", "dark-theme", "pastel-theme");
      document.body.classList.add(`${sel.value}-theme`);
      localStorage.setItem("infyniqTheme", sel.value);
    });
  }
});
