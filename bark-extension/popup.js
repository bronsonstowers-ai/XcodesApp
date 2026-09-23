const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const phoneEl = document.getElementById("phone");
const urlEl = document.getElementById("url");

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type !== "LEAD_DETAILS_VISIBLE") return;

  const d = msg.details || {};
  nameEl.textContent = d.name || "Not found/hidden";
  emailEl.textContent = d.email || "Not found/hidden";
  phoneEl.textContent = d.phone || "Not found/hidden";
  urlEl.textContent = d.url || "";
});