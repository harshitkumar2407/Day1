(() => {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const toggleButtons = document.querySelectorAll("[data-toggle-pw]");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.closest(".input-row") || document;
      const input = row.querySelector("[data-pw]");
      if (!input) return;
      const isHidden = input.getAttribute("type") === "password";
      input.setAttribute("type", isHidden ? "text" : "password");
      btn.textContent = isHidden ? "Hide" : "Show";
      input.focus();
    });
  });
})();

