// auth-check.js
function checkAuth() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    // No token, redirect back to login
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "index.html";
}
