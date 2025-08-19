// ====== CONFIG ======
const OTP_API_BASE = "https://<your-vercel-project>.vercel.app"; // set this!
const LAB_URLS = {
  lab1: "https://example.com/lab1",  // <-- replace with real URLs
  lab2: "https://example.com/lab2"
};
// ====================

let currentLab = null;
let requestId = null;
const $ = (id) => document.getElementById(id);
function showMsg(t){ const el=$("otpMsg"); el.textContent=t; el.style.display="block"; }
function hideMsg(){ const el=$("otpMsg"); el.style.display="none"; el.textContent=""; }

function openOtp(lab){
  currentLab = lab; $("otpTitle").textContent = `Access ${lab.toUpperCase()}`;
  $("otpInput").value = ""; hideMsg(); $("otpModal").style.display = "flex";
  requestOtp();
}
function closeOtp(){ $("otpModal").style.display="none"; currentLab=null; requestId=null; }
function requestOtpAgain(){ if(currentLab) requestOtp(); }

async function requestOtp(){
  hideMsg(); $("otpVerifyBtn").disabled = true;
  try{
    const body = new URLSearchParams({ action:"request", purpose: currentLab });
    const r = await fetch(`${OTP_API_BASE}/api/otp`, { method:"POST", body });
    if(!r.ok) throw new Error();
    const data = await r.json(); requestId = data.request_id; showMsg("Code sent.");
  }catch{ showMsg("Could not send code. Try again."); }
  finally{ $("otpVerifyBtn").disabled = false; }
}

async function verifyOtp(){
  hideMsg();
  const code = $("otpInput").value.trim();
  if(code.length!==6) return showMsg("Enter the 6-digit code.");
  $("otpVerifyBtn").disabled = true;
  try{
    const body = new URLSearchParams({ action:"verify", request_id:requestId, code });
    const r = await fetch(`${OTP_API_BASE}/api/otp`, { method:"POST", body });
    if(!r.ok) return showMsg(r.status===401?"Invalid/expired code.":"Verification failed.");
    window.location.href = LAB_URLS[currentLab];
  }catch{ showMsg("Network error."); }
  finally{ $("otpVerifyBtn").disabled = false; }
}
