"use strict";
// --- simple token auth for static hosting (GitHub Pages or similar) ---


function isAuthed() {
const token = localStorage.getItem("authToken");
const exp = Number(localStorage.getItem("authExp"));
return Boolean(token) && Number.isFinite(exp) && Date.now() <= exp;
}


function forceToLogin() {
// replace() prevents forward-button returning to protected page
window.location.replace("./login.html");
}


function logout() {
try {
localStorage.removeItem("authToken");
localStorage.removeItem("authExp");
} finally {
forceToLogin();
}
}


/** Call on every protected page ASAP (in <head>) */
function guardProtectedPage() {
const run = () => { if (!isAuthed()) forceToLogin(); };


run(); // initial check (including cold load)
window.addEventListener("pageshow", run); // handles bfcache restores
document.addEventListener("visibilitychange", () => {
if (document.visibilityState === "visible") run();
});
window.addEventListener("storage", run); // other tabs logging out
}
