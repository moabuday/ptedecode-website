/* PTE Decode Academy — shared website script (navigation, live prices, payments, results, WhatsApp assistant) */
(function(){
"use strict";
const CFG = window.SITE_CONFIG || {};
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* ---------- default content (overridden by Teacher Portal → Website) ---------- */
const DEFAULT_PRICES = {
  "acad-group":{jod:"155",usd:"220"}, "acad-private":{jod:"220",usd:"310"}, "acad-skill":{jod:"60",usd:"85"},
  "core-group":{jod:"140",usd:"200"}, "core-private":{jod:"200",usd:"280"}, "core-skill":{jod:"60",usd:"85"}
};
const COURSE_NAMES = {
  "acad-group":"PTE Academic — Group Course", "acad-private":"PTE Academic — Private Full Course", "acad-skill":"PTE Academic — Private Skill-Focused",
  "core-group":"PTE Core — Group Course", "core-private":"PTE Core — Private Full Course", "core-skill":"PTE Core — Private Skill-Focused"
};
const FROM = {"acad-skill":true, "core-skill":true};
const DEFAULT_GREETING = "Hi there 👋 Welcome to PTE Decode Academy!\nChoose a topic below for an instant answer, or continue the conversation with us on WhatsApp.";
const DEFAULT_REPLIES = [
  {q:"Course prices", a:"{prices}"},
  {q:"Academic or Core?", a:"PTE Academic is for university study, professional registration and visas in many countries, and is accepted by thousands of universities worldwide.\n\nPTE Core is the general-English test accepted by IRCC for Canadian immigration (permanent residency and citizenship).\n\nApplying for Canadian PR? Choose PTE Core. Planning to study? Choose PTE Academic."},
  {q:"Group size & duration", a:"Group courses: 5 weeks, 5–7 students, weekly live classes (1.5 hours each).\nPrivate full course: 5 weeks, one-to-one, flexible scheduling.\nSkill-focused: one-to-one, choose 1, 2 or 3 skills, flexible duration."},
  {q:"How do I pay?", a:"You can pay by Visa or Mastercard on our secure payment page, or by CliQ or bank transfer.\nOpen the Payments page from the menu, or ask us here for help."},
  {q:"When do PTE results come out?", a:"Pearson typically releases PTE Academic and PTE Core results within about 48 hours of the test, often sooner."},
  {q:"Talk to the trainer", a:"Of course! Tap “Continue on WhatsApp” and send your name, the exam you're preparing for (Academic or Core) and your target score. We'll reply as soon as we can."}
];

/* ---------- live settings ---------- */
let SITE = {whatsapp:CFG.whatsapp||"", instagram:CFG.instagram||"", facebook:CFG.facebook||"", email:CFG.email||"",
  cliqAlias:"", cliqName:"", bank:"", payNote:"", greeting:"", payLinks:{}, prices:{}, autoReplies:[]};
let RESULTS = readCache().results || [];
SITE = (function(c){ const o = Object.assign({}, SITE); Object.keys(c||{}).forEach(k => { const v = c[k]; if (v && (typeof v !== "object" || Object.keys(v).length)) o[k] = v; }); return o; })(readCache().site);
function readCache(){ try { return JSON.parse(localStorage.getItem("pd_site") || "{}"); } catch(e){ return {}; } }
function merge(s){ const o = {whatsapp:CFG.whatsapp||"", instagram:CFG.instagram||"", facebook:CFG.facebook||"", email:CFG.email||"",
  cliqAlias:"", cliqName:"", bank:"", payNote:"", greeting:"", payLinks:{}, prices:{}, autoReplies:[]};
  Object.keys(s||{}).forEach(k => { const v = s[k]; if (v && (typeof v !== "object" || Object.keys(v).length)) o[k] = v; }); return o; }
const price = id => (SITE.prices && SITE.prices[id] && SITE.prices[id].jod) ? SITE.prices[id] : DEFAULT_PRICES[id];
const waNum = () => String(SITE.whatsapp || "").replace(/\D/g, "");
const waLink = text => waNum() ? `https://wa.me/${waNum()}?text=${encodeURIComponent(text || "Hello PTE Decode Academy!")}` : "";

async function api(action, data={}){
  if (!CFG.apiUrl) throw new Error("not connected");
  const r = await fetch(CFG.apiUrl, {method:"POST", body: JSON.stringify({action, ...data}), redirect:"follow"});
  const j = await r.json(); if (!j.ok) throw new Error(j.error || "error"); return j;
}

/* ---------- icons ---------- */
const ICON = {
  wa:'<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.1c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3zm0 23.2c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.2 1.2-4-.3-.4c-1.1-1.7-1.7-3.6-1.7-5.6 0-5.8 4.7-10.5 10.6-10.5S26.6 9.9 26.6 15.7 21.8 26.2 16 26.2zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1c-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.9-1.7-2.2s0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.7 5.8 5.1 2.8 1.1 3.4.9 4 .8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>',
  ig:'<svg viewBox="0 0 24 24"><path d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM21.9 8c-.1-1.6-.4-3-1.6-4.2S17.6 2.2 16 2.1C14.4 2 9.6 2 8 2.1 6.4 2.2 5 2.5 3.8 3.7S2.2 6.4 2.1 8C2 9.6 2 14.4 2.1 16c.1 1.6.4 3 1.6 4.2s2.6 1.5 4.2 1.6c1.6.1 6.4.1 8 0 1.6-.1 3-.4 4.2-1.6s1.5-2.6 1.6-4.2c.1-1.6.1-6.4 0-8zm-2.1 9.8a3.3 3.3 0 0 1-1.9 1.9c-1.3.5-4.4.4-5.9.4s-4.6.1-5.9-.4a3.3 3.3 0 0 1-1.9-1.9c-.5-1.3-.4-4.4-.4-5.9s-.1-4.6.4-5.9a3.3 3.3 0 0 1 1.9-1.9c1.3-.5 4.4-.4 5.9-.4s4.6-.1 5.9.4a3.3 3.3 0 0 1 1.9 1.9c.5 1.3.4 4.4.4 5.9s.1 4.6-.4 5.9z"/></svg>',
  fb:'<svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>'
};

/* ---------- apply settings to the page ---------- */
function apply(){
  // WhatsApp links
  $$("[data-wa]").forEach(a => { const l = waLink(a.dataset.wa); if (l) { a.href = l; a.target = "_blank"; a.rel = "noopener"; a.classList.remove("hidden"); } else { a.href = "contact.html"; a.removeAttribute("target"); } });
  $$("[data-wa-only]").forEach(el => el.classList.toggle("hidden", !waNum()));
  // social
  $$("[data-ig]").forEach(a => { if (SITE.instagram) { a.href = SITE.instagram; a.classList.remove("hidden"); } else a.classList.add("hidden"); });
  $$("[data-fb]").forEach(a => { a.href = SITE.facebook || "https://www.facebook.com/ptedecodeacademy"; });
  $$("[data-fbvideo]").forEach(a => { a.href = CFG.facebookVideo || SITE.facebook; });
  $$("[data-email]").forEach(a => { if (SITE.email) { a.href = "mailto:" + SITE.email; a.textContent = a.dataset.email === "text" ? SITE.email : a.textContent; a.classList.remove("hidden"); } else a.classList.add("hidden"); });
  $$("[data-trainer]").forEach(el => { if (CFG.trainerName) { el.textContent = CFG.trainerName; el.closest("[data-trainer-wrap]")?.classList.remove("hidden"); } });
  // prices
  $$("[data-price]").forEach(el => { const p = price(el.dataset.price); el.innerHTML = `${FROM[el.dataset.price] ? '<span class="small muted" style="font-size:.9rem;font-weight:600">From </span>' : ""}${esc(p.jod)} JOD<small>${p.usd ? "(≈ " + esc(p.usd) + " USD)" : "&nbsp;"}</small>`; });
  $$("[data-price-text]").forEach(el => { const p = price(el.dataset.priceText); el.textContent = (FROM[el.dataset.priceText] ? "from " : "") + p.jod + " JOD"; });
  // card payment buttons
  $$("[data-pay]").forEach(a => { const id = a.dataset.pay, link = (SITE.payLinks || {})[id];
    if (link) { a.href = link; a.target = "_blank"; a.rel = "noopener"; a.innerHTML = a.dataset.label || "Pay by card"; a.removeAttribute("aria-disabled"); }
    else { const l = waLink(`Hello! I'd like to pay for: ${COURSE_NAMES[id]}. Could you send me a payment link?`); a.href = l || "contact.html"; if (l) { a.target = "_blank"; a.rel = "noopener"; } a.innerHTML = "Request a card payment link"; } });
  // CliQ / bank
  $$("[data-cliq]").forEach(el => { el.innerHTML = SITE.cliqAlias ? `<b>CliQ alias:</b> <span class="copy">${esc(SITE.cliqAlias)}</span>${SITE.cliqName ? ` <span class="muted small">(${esc(SITE.cliqName)})</span>` : ""}` : `<span class="muted">Message us on WhatsApp and we'll send you our CliQ alias.</span>`; });
  $$("[data-bank]").forEach(el => { el.innerHTML = SITE.bank ? esc(SITE.bank).replace(/\n/g, "<br>") : `<span class="muted">Message us on WhatsApp for bank transfer details.</span>`; });
  $$("[data-paynote]").forEach(el => { el.classList.toggle("hidden", !SITE.payNote); el.innerHTML = esc(SITE.payNote).replace(/\n/g, "<br>"); });
  renderResults();
}

/* ---------- student results ---------- */
const imgCache = {};
function renderResults(){
  $$("[data-results]").forEach(box => {
    const exam = box.dataset.results, limit = +box.dataset.limit || 0, filter = box.dataset.filter || "All";
    let list = RESULTS.filter(r => (exam === "all" || r.exam === exam) && (filter === "All" || r.exam === filter));
    if (limit) list = list.slice(0, limit);
    const wrapSec = box.closest("[data-results-section]");
    if (!list.length) { if (wrapSec && box.dataset.hideEmpty !== undefined) wrapSec.classList.add("hidden"); else box.innerHTML = `<div class="empty">New student results are added regularly — check back soon.</div>`; return; }
    if (wrapSec) wrapSec.classList.remove("hidden");
    box.innerHTML = list.map(r => `<div class="card result-card"><div class="cert" data-rid="${esc(r.id)}" role="button" tabindex="0" aria-label="View ${esc(r.name)}'s certificate"><span class="small muted">Loading certificate…</span></div>
      <div class="body"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="color:var(--navy)">${esc(r.name)}</b><span class="tag">PTE ${esc(r.exam)}</span></div>
      <div style="font-size:1.6rem;font-weight:800;color:var(--navy);line-height:1.2">${esc(r.overall)}<span class="small muted" style="font-weight:600"> overall</span></div>
      <div class="mini-scores">${[["L",r.listening],["R",r.reading],["S",r.speaking],["W",r.writing]].filter(x => x[1] !== "" && x[1] != null).map(x => `<span>${x[0]} ${esc(x[1])}</span>`).join("")}</div>
      ${r.quote ? `<div class="quote">“${esc(r.quote)}”</div>` : ""}</div></div>`).join("");
    const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); loadCert(e.target); } }), {rootMargin:"200px"}) : null;
    $$(".cert", box).forEach(c => { io ? io.observe(c) : loadCert(c); c.addEventListener("click", () => openCert(c)); c.addEventListener("keydown", e => { if (e.key === "Enter") openCert(c); }); });
  });
}
async function loadCert(el){
  const id = el.dataset.rid;
  try { const src = imgCache[id] || (imgCache[id] = (await api("resultImage", {id})).data); el.innerHTML = `<img src="${src}" alt="PTE score report">`; }
  catch(e){ el.innerHTML = `<span class="small muted">Certificate preview unavailable</span>`; }
}
function openCert(el){ const src = imgCache[el.dataset.rid]; if (!src) return; const lb = document.createElement("div"); lb.className = "lightbox"; lb.innerHTML = `<img src="${src}" alt="PTE score report">`; lb.addEventListener("click", () => lb.remove()); document.body.appendChild(lb); }
$$("[data-filter-for]").forEach(group => $$("button", group).forEach(b => b.addEventListener("click", () => {
  $$("button", group).forEach(x => x.classList.toggle("on", x === b)); const box = $("#" + group.dataset.filterFor); box.dataset.filter = b.dataset.f; renderResults(); })));

/* ---------- WhatsApp auto-reply assistant ---------- */
function pricesText(){
  const l = id => `${COURSE_NAMES[id].split(" — ")[1]}: ${FROM[id] ? "from " : ""}${price(id).jod} JOD`;
  return `PTE Academic\n• ${l("acad-group")}\n• ${l("acad-private")}\n• ${l("acad-skill")}\n\nPTE Core\n• ${l("core-group")}\n• ${l("core-private")}\n• ${l("core-skill")}`;
}
function buildAssistant(){
  if ($(".wa-fab")) return;
  const fab = document.createElement("button"); fab.className = "wa-fab"; fab.type = "button"; fab.setAttribute("aria-label", "Chat with PTE Decode Academy"); fab.innerHTML = ICON.wa + '<span class="dot"></span>';
  document.body.appendChild(fab);
  let panel = null;
  const now = () => new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
  fab.addEventListener("click", () => {
    if (panel) { panel.remove(); panel = null; return; }
    fab.querySelector(".dot")?.remove();
    panel = document.createElement("div"); panel.className = "wa-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "WhatsApp assistant");
    const replies = (SITE.autoReplies && SITE.autoReplies.length) ? SITE.autoReplies : DEFAULT_REPLIES;
    panel.innerHTML = `<header><img src="assets/logo.png" alt=""><div><b>PTE Decode Academy</b><small>Typically replies on WhatsApp</small></div><button type="button" aria-label="Close">×</button></header>
      <div class="wa-body"></div><div class="quick">${replies.map((r, i) => `<button type="button" data-i="${i}">${esc(r.q)}</button>`).join("")}</div>
      <a class="btn wa block wa-go" href="#">${ICON.wa.replace('<svg', '<svg style="inline-size:20px;block-size:20px;fill:#fff"')} Continue on WhatsApp</a>`;
    document.body.appendChild(panel);
    const body = $(".wa-body", panel), go = $(".wa-go", panel); let lastTopic = "";
    const add = (text, cls) => { const m = document.createElement("div"); m.className = "msg " + cls; m.innerHTML = esc(text) + `<span class="t">${now()}</span>`; body.appendChild(m); body.scrollTop = body.scrollHeight; };
    const setGo = () => { const l = waLink(lastTopic ? `Hello PTE Decode Academy! I have a question about: ${lastTopic}` : "Hello PTE Decode Academy! I'd like to know more about your PTE courses.");
      if (l) { go.href = l; go.target = "_blank"; go.rel = "noopener"; } else { go.href = SITE.facebook || "contact.html"; go.target = "_blank"; go.innerHTML = "Message us on Facebook"; } };
    add(SITE.greeting || DEFAULT_GREETING, "in"); setGo();
    $("header button", panel).addEventListener("click", () => { panel.remove(); panel = null; });
    $$(".quick button", panel).forEach(b => b.addEventListener("click", () => { const r = replies[+b.dataset.i]; lastTopic = r.q.replace(/^[^\w]+/u, "").trim();
      add(r.q, "out"); setTimeout(() => { add(String(r.a).replace(/__PRICES__|\{prices\}/g, pricesText()), "in"); setGo(); }, 450); }));
  });
}

/* ---------- navigation ---------- */
function nav(){
  const btn = $(".menu-btn"), n = $(".nav"); if (btn && n) btn.addEventListener("click", () => { n.classList.toggle("open"); btn.setAttribute("aria-expanded", n.classList.contains("open")); });
  const page = document.body.dataset.page; $$(".nav a[data-p]").forEach(a => a.classList.toggle("on", a.dataset.p === page));
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  // contact form → WhatsApp
  const cf = $("#enquiry"); if (cf) cf.addEventListener("submit", e => { e.preventDefault(); const f = new FormData(cf);
    const text = `Hello PTE Decode Academy!\nName: ${f.get("name")}\nExam: ${f.get("exam")}\nTarget score: ${f.get("target") || "-"}\nPreferred course: ${f.get("course")}\n\n${f.get("message") || ""}`;
    const l = waLink(text); if (l) window.open(l, "_blank", "noopener"); else window.open(SITE.facebook || "https://www.facebook.com/ptedecodeacademy", "_blank", "noopener"); });
  // copy buttons
  document.addEventListener("click", e => { const c = e.target.closest(".copy"); if (!c) return; navigator.clipboard && navigator.clipboard.writeText(c.textContent.trim()).then(() => toast("Copied")); });
}
function toast(t){ const d = document.createElement("div"); d.className = "toast"; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1800); }

/* ---------- boot ---------- */
nav(); apply(); buildAssistant();
if (CFG.apiUrl) api("siteInfo").then(r => { SITE = merge(r.site); RESULTS = r.results || []; try { localStorage.setItem("pd_site", JSON.stringify({site:r.site, results:RESULTS})); } catch(e){} apply(); }).catch(() => {});
window.PD = {price, COURSE_NAMES};
})();
