/* PTE Decode Academy — content protection (website + Student Portal).
   Browsers cannot fully stop screenshots or screen recording (they happen in the
   operating system), so this script blocks the easy routes and deters the rest:
   - no text selection, right-click, copying, dragging images, saving or printing;
   - Print Screen clears the clipboard and briefly hides the page;
   - the page is hidden whenever it loses focus (snipping tools, recorders' pickers,
     switching windows) — students in the portal see "Content hidden";
   - students in the portal get a faint watermark with their name and code, so any
     leaked screenshot or recording can be traced.
   Typing, pasting and selecting INSIDE answer boxes and form fields still works,
   and the Teacher Portal is not restricted. */
(function () {
  "use strict";
  var d = document, root = d.documentElement;

  /* ---------- who is using the page ---------- */
  function portalState() {
    try { if (typeof S === "undefined" || !S) return null; return S; } catch (e) { return null; }
  }
  function isTeacher() {
    var st = portalState();
    if (st) return st.mode === "teacher" && !st.preview;
    return /teacher/i.test(location.hash);
  }
  function student() {
    var st = portalState();
    if (!st || st.mode === "teacher" || st.preview || !st.session || !st.session.code) return null;
    return st.session;
  }
  var protectedNow = function () { return !isTeacher(); };

  /* ---------- styles ---------- */
  var css = d.createElement("style");
  css.textContent =
    "html.pd-guard body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}" +
    "html.pd-guard input,html.pd-guard textarea,html.pd-guard select,html.pd-guard [contenteditable]{-webkit-user-select:text;user-select:text}" +
    "html.pd-guard img{-webkit-user-drag:none;user-drag:none}" +
    "html.pd-guard.pd-hide body>*:not(#pdShield){filter:blur(22px)!important}" +
    "#pdShield{position:fixed;inset:0;z-index:2147483646;display:none;place-items:center;background:rgba(10,31,68,.88);color:#fff;" +
    "font:600 18px/1.5 'Segoe UI',system-ui,sans-serif;text-align:center;padding:24px}" +
    "html.pd-hide #pdShield{display:grid}" +
    "#pdShield b{display:block;font-size:22px;color:#FF7A00;margin-bottom:6px}" +
    "#pdMark{position:fixed;inset:0;z-index:2147483645;pointer-events:none;display:none;opacity:.10;" +
    "background-repeat:repeat;background-size:360px 200px}" +
    "html.pd-mark #pdMark{display:block}" +
    "@media print{html.pd-guard body{display:none!important}html.pd-guard:after{content:'Printing is disabled on PTE Decode Academy.';display:block;padding:40px;font:20px sans-serif}}";
  (d.head || root).appendChild(css);

  function ready(fn) { if (d.readyState !== "loading") fn(); else d.addEventListener("DOMContentLoaded", fn); }

  /* ---------- shield + watermark elements ---------- */
  var shield, mark, hideTimer = null;
  ready(function () {
    shield = d.createElement("div"); shield.id = "pdShield"; shield.setAttribute("aria-live", "polite");
    shield.innerHTML = "<div><b>Content hidden</b>Screenshots and screen recording are not allowed.<br>Click here to continue.</div>";
    shield.addEventListener("click", function () { show(); });
    mark = d.createElement("div"); mark.id = "pdMark"; mark.setAttribute("aria-hidden", "true");
    d.body.appendChild(mark); d.body.appendChild(shield);
    refresh(); setInterval(refresh, 1500);
  });

  var lastMark = "";
  function refresh() {
    root.classList.toggle("pd-guard", protectedNow());
    var s = student();
    var text = s ? (s.n || "Student") + " · " + s.code + " · " + new Date().toISOString().slice(0, 10) : "";
    if (text !== lastMark && mark) {
      lastMark = text;
      if (text) {
        var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]; }); };
        var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='360' height='200'><text x='20' y='110' fill='%230A1F44' font-family='Segoe UI,Arial' font-size='15' " +
          "transform='rotate(-24 180 100)'>" + encodeURIComponent(esc(text + " · PTE Decode Academy")) + "</text></svg>";
        mark.style.backgroundImage = "url(\"data:image/svg+xml;utf8," + svg + "\")";
      }
    }
    root.classList.toggle("pd-mark", !!text);
    if (!protectedNow()) show();
  }

  function hide(ms) {
    if (!protectedNow()) return;
    root.classList.add("pd-hide");
    clearTimeout(hideTimer);
    if (ms) hideTimer = setTimeout(show, ms);
  }
  function show() { clearTimeout(hideTimer); root.classList.remove("pd-hide"); }

  /* ---------- helpers ---------- */
  function editable(el) {
    if (!el || !el.closest) return false;
    return !!el.closest("input,textarea,select,[contenteditable=''],[contenteditable='true']");
  }
  function block(e) { if (protectedNow() && !editable(e.target)) { e.preventDefault(); e.stopPropagation(); return false; } }
  function wipeClipboard() {
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(" ").catch(function () {}); } catch (e) {}
  }

  /* ---------- copy / select / drag / right-click ---------- */
  ["contextmenu", "dragstart", "selectstart"].forEach(function (t) { d.addEventListener(t, block, true); });
  ["copy", "cut"].forEach(function (t) {
    d.addEventListener(t, function (e) {
      if (!protectedNow() || editable(e.target)) return;
      e.preventDefault();
      if (e.clipboardData) e.clipboardData.setData("text/plain", "Copying content from PTE Decode Academy is not allowed.");
    }, true);
  });

  /* ---------- keyboard shortcuts ---------- */
  d.addEventListener("keydown", function (e) {
    if (!protectedNow()) return;
    var k = (e.key || "").toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (k === "printscreen") { wipeClipboard(); hide(2500); return; }
    if (k === "f12" || (mod && e.shiftKey && (k === "i" || k === "j" || k === "c" || k === "s")) || (mod && (k === "u" || k === "s" || k === "p"))) {
      e.preventDefault(); e.stopPropagation(); return;
    }
    if (e.metaKey && e.shiftKey && (k === "3" || k === "4" || k === "5")) { hide(2500); }   // macOS screenshot keys
    if (!editable(e.target) && mod && (k === "c" || k === "x" || k === "a")) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  d.addEventListener("keyup", function (e) {
    if (protectedNow() && (e.key || "").toLowerCase() === "printscreen") { wipeClipboard(); hide(2500); }
  }, true);

  /* ---------- hide when the page loses focus (snipping tools, recorders, other windows) ---------- */
  window.addEventListener("blur", function () {
    // a file picker or microphone prompt opened by the page itself can also blur the window; keep it short
    hide();
  });
  window.addEventListener("focus", function () { setTimeout(show, 150); });
  d.addEventListener("visibilitychange", function () { if (d.hidden) hide(); else setTimeout(show, 150); });

  /* ---------- printing ---------- */
  window.addEventListener("beforeprint", function () { hide(); });
  window.addEventListener("afterprint", function () { show(); });
})();
