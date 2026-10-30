/* =====================================================================
   PTE DECODE ACADEMY — SITE SETTINGS (the only file you need to edit)
   1. apiUrl: paste your Google Apps Script Web app URL (the same one the
      portal uses). Everything else — WhatsApp number, Instagram, prices,
      payment links, CliQ details, auto-replies and student results — is
      managed from the Teacher Portal → Website tab, so no further edits.
   2. The values below are only fallbacks used before the online settings load.
   ===================================================================== */
window.SITE_CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbzt3DTz89kftd7xc9KKnb_YqBpVO5mMR34427NNmO5jS6ACx8JXnCVRllV2hXZGy9U7/exec",
  whatsapp: "",                                   // e.g. "962791234567" (country code, no + or spaces)
  instagram: "",                                  // e.g. "https://www.instagram.com/ptedecodeacademy"
  facebook: "https://www.facebook.com/ptedecodeacademy",
  facebookVideo: "https://www.facebook.com/share/r/1FMfFRWzAQ/",
  email: "",                                      // e.g. "info@yourdomain.com"
  trainerName: ""                                 // optional, shown on the About page
};
