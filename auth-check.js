// --- simple token auth for static hosting (GitHub Pages) ---
function isAuthed() {
  const token = localStorage.getItem("authToken");
  const exp = parseInt(localStorage.getItem("authExp") || "0", 10);
  return Boolean(token) && Date.now() <= exp;
}
function forceToLogin() { window.location.replace("index.html"); }
function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authExp");
  forceToLogin();
}
/** Call on every protected page ASAP (in <head>) */
function guardProtectedPage() {
  const run = () => { if (!isAuthed()) forceToLogin(); };
  run();
  window.addEventListener("pageshow", run);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") run();
  });
  window.addEventListener("storage", run);
}
