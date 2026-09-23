function pickFirstNonEmpty(list) {
  for (const v of list) {
    if (typeof v === "string" && v.trim()) return v.trim();
    if (v && typeof v === "object" && v.textContent && v.textContent.trim()) return v.textContent.trim();
  }
  return null;
}

function isVisible(el) {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function getVisibleTextFromSelectors(selectors) {
  const nodes = selectors.flatMap(sel => Array.from(document.querySelectorAll(sel)));
  const visible = nodes.filter(isVisible);
  const texts = visible.map(n => n.textContent);
  return pickFirstNonEmpty(texts);
}

function extractCandidateName() {
  return getVisibleTextFromSelectors([
    '[data-testid*="name" i]',
    '[class*="name" i]',
    '[id*="name" i]',
    'h1',
    'h2',
    'header [class*="title" i]',
    '[role="heading"]',
    'a[href*="contact"], a[href*="profile"]'
  ]);
}

function normalizeMaybeEmail(text) {
  if (!text) return null;
  const m = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return m ? m[0] : null;
}

function normalizeMaybePhone(text) {
  if (!text) return null;
  const m = text.match(/(\+?\d[\d\s().-]{7,}\d)/);
  return m ? m[0].trim() : null;
}

function extractCandidateEmail() {
  const mailto = getVisibleTextFromSelectors(['a[href^="mailto:"]']);
  if (mailto) return normalizeMaybeEmail(mailto);
  return normalizeMaybeEmail(getVisibleTextFromSelectors([
    '[data-testid*="email" i]',
    '[class*="email" i]',
    '[id*="email" i]'
  ]));
}

function extractCandidatePhone() {
  const telText = getVisibleTextFromSelectors(['a[href^="tel:"]']);
  if (telText) return normalizeMaybePhone(telText);
  return normalizeMaybePhone(getVisibleTextFromSelectors([
    '[data-testid*="phone" i]',
    '[class*="phone" i]',
    '[id*="phone" i]'
  ]));
}

const details = {
  name: extractCandidateName(),
  email: extractCandidateEmail(),
  phone: extractCandidatePhone(),
  url: location.href,
  extractedAt: new Date().toISOString()
};

chrome.runtime.sendMessage({ type: "LEAD_DETAILS_VISIBLE", details });