// --- simple token auth for static hosting (GitHub Pages) ---

function isAuthed() {
  const token = localStorage.getItem("authToken");
  const exp = parseInt(localStorage.getItem("authExp") || "0", 10);
  return Boolean(token) && Date.now() <= exp;
}

function forceToLogin() {
  // replace() prevents forward-button returning to protected page
  window.location.replace("index.html");
}

function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("authExp");
  forceToLogin();
}

/** Call on every protected page ASAP (in <head>) */
function guardProtectedPage() {
  const run = () => { if (!isAuthed()) forceToLogin(); };

  run();                                  // initial
  window.addEventListener("pageshow", run); // bfcache restore
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") run();
  });
  window.addEventListener("storage", run);  // another tab cleared token
}
