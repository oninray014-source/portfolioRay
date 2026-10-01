/* Ray Formacil — guided Portfolio Assistant and site behavior. */
document.documentElement.classList.add("js");
document.getElementById("year").textContent = new Date().getFullYear();

const CONTACT_EMAIL = "oninray014@gmail.com";
const WHATSAPP_URL = "https://wa.me/639204314649";

/* ---------- Mobile navigation ---------- */
const navEl = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
function setMenuState(open) {
  navEl.classList.toggle("menu-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
navToggle.addEventListener("click", () => setMenuState(!navEl.classList.contains("menu-open")));
document.querySelectorAll(".mobile-menu a").forEach((link) => link.addEventListener("click", () => setMenuState(false)));

/* ---------- Progressive reveal ---------- */
const revealEls = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((element) => io.observe(element));
} else {
  revealEls.forEach((element) => element.classList.add("in-view"));
}

/* ---------- Section accordion / unfolding scroll transition ---------- */
(function initSectionTransitions() {
  const sections = document.querySelectorAll("#main > section.folio-section");
  if (!sections.length) return;

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    sections.forEach((sec) => sec.classList.add("is-inview"));
    return;
  }

  // Directional scroll tracker (passive, non-blocking)
  let lastScrollY = window.scrollY;
  let scrollDir = "down";
  let ticking = false;

  function updateScrollDir() {
    const currentY = window.scrollY;
    const diff = currentY - lastScrollY;
    if (Math.abs(diff) > 3) {
      const newDir = diff > 0 ? "down" : "up";
      if (newDir !== scrollDir) {
        scrollDir = newDir;
        document.documentElement.setAttribute("data-scroll-dir", scrollDir);
      }
      lastScrollY = currentY;
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    },
    { passive: true }
  );
  document.documentElement.setAttribute("data-scroll-dir", "down");

  if (!("IntersectionObserver" in window)) {
    sections.forEach((sec) => sec.classList.add("is-inview"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const sec = entry.target;
        const rect = entry.boundingClientRect;

        if (entry.isIntersecting) {
          sec.classList.remove("is-below", "is-above");
          sec.classList.add("is-inview");
        } else {
          sec.classList.remove("is-inview");
          if (rect.top > 0) {
            sec.classList.remove("is-above");
            sec.classList.add("is-below");
          } else {
            sec.classList.remove("is-below");
            sec.classList.add("is-above");
          }
        }
      });
    },
    {
      threshold: [0, 0.08, 0.2],
      rootMargin: "0px 0px -20px 0px",
    }
  );

  // Synchronous initial placement so currently visible sections are immediately in-view
  sections.forEach((sec) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      sec.classList.add("is-inview");
    } else if (rect.top >= window.innerHeight) {
      sec.classList.add("is-below");
    } else {
      sec.classList.add("is-above");
    }
    observer.observe(sec);
  });

  // Keep internal anchor smooth navigation seamless
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", () => {
      const targetId = anchor.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetEl = document.querySelector(targetId);
        if (targetEl && targetEl.classList.contains("folio-section")) {
          targetEl.classList.remove("is-below", "is-above");
          targetEl.classList.add("is-inview");
        }
      }
    });
  });
})();

/* ---------- Verified portfolio knowledge ---------- */
const KB = {
  about: "Ray is a digital solutions builder with 10+ years of BPO experience and 7+ years in digital advertising/PPC. He combines business and customer-facing experience with hands-on work in automation, AI-assisted tools, and custom systems.",
  services: "Ray works across four areas: Automation (lead capture, qualification, follow-up, notifications, and data sync), guided AI-assisted workflows, Custom Business Systems (CRMs, dashboards, and internal tools), and Workflow Improvement.",
  automation: "Ray designs workflows that move information between systems and reduce repetitive work: lead intake, follow-up, appointment workflows, and internal operations. Tools mentioned on this site include Make.com, n8n, webhooks, Gmail, Google Sheets, Google Calendar, and AI-assisted workflow logic.",
  ai: "Ray builds practical AI-assisted tools such as guided assistants, customer-service tools, lead qualification support, and decision-support workflows. This portfolio assistant is rule-based; it does not use a live AI backend.",
  process: "Ray's process is: Understand the workflow and bottlenecks, Design the process map, Build with the appropriate tools, Test & Refine, then Handover so the business can use what was built.",
  projects: "Ray's portfolio includes DayMate (done, v1.0), GlucoSense (approximately 90%, in development), TummyTrack (done), a CRM + Collaboration Hub (currently building), and AI CSR (concept / early build). Ask about any project by name for the verified details.",
  daymate: "DayMate is a completed v1.0 AI productivity and personal assistant application. It includes natural-language task creation, task management, reminders, Google Calendar integration, authentication, Firestore storage, real-time synchronization, and productivity gamification.",
  glucosense: "GlucoSense is approximately 90% complete and still in development. It is a personal tracking and analytics platform with structured data entry, dashboards, historical records, authentication, database-backed CRUD workflows, and row-level security. Planned AI insights are not completed functionality.",
  tummytrack: "TummyTrack is a completed gamified wellness and habit tracker. Its documented features include tracking, scores, streaks, challenges, badges, rewards, a virtual garden, and progress visualization.",
  crm: "The CRM + Collaboration Hub is currently being built. Planned/developing capabilities include lead and customer management, team members, tasks, assignments, due dates, scheduling, dashboards, and collaboration. It is not presented as a finished system.",
  aicsr: "AI CSR is a concept / early build for a customer-service and lead assistant. Potential capabilities include answering common questions, handling repetitive inquiries, and supporting initial lead qualification; it is not a finished product.",
  contact: "You can book a 30-minute discovery call directly on Ray's calendar, start a guided inquiry here, email him at oninray014@gmail.com, or message him on WhatsApp.",
  booking: "You can book a 30-minute discovery call directly on Ray's calendar to discuss your business systems or automation needs.",
};
const INTENTS = [
  { key: "about", patterns: ["who is ray", "about ray", "background", "experience", "who are you", "bpo", "who's ray"] },
  { key: "services", patterns: ["service", "what do you do", "what does ray do", "offer", "solutions", "help with", "what can you build"] },
  { key: "automation", patterns: ["automation", "workflow", "make.com", "n8n", "zapier", "webhook", "integrate", "connect systems"] },
  { key: "ai", patterns: ["ai ", " ai", "artificial intelligence", "chatbot", "assistant", "gpt", "claude"] },
  { key: "process", patterns: ["how do you work", "how does ray work", "process", "how it works", "methodology", "steps"] },
  { key: "projects", patterns: ["what has he built", "what have you built", "projects", "systems built", "portfolio"] },
  { key: "daymate", patterns: ["daymate"] }, { key: "glucosense", patterns: ["glucosense", "glucose"] },
  { key: "tummytrack", patterns: ["tummytrack", "tummy track"] }, { key: "crm", patterns: ["crm", "collaboration hub"] },
  { key: "aicsr", patterns: ["ai csr", "customer service ai"] },
  { key: "booking", patterns: ["book a call", "book call", "discovery call", "schedule", "calendar", "meeting", "book a meeting", "appointment"] },
  { key: "contact", patterns: ["contact", "reach", "email", "whatsapp", "talk to ray", "get in touch"] },
  { key: "pricing", patterns: ["price", "pricing", "cost", "how much", "rate", "budget"] },
];
const PROBLEM_SIGNALS = ["manually", "by hand", "copy and paste", "copy-paste", "spreadsheet", "excel", "every time someone", "i have to", "we have to", "takes forever", "repetitive", "every day i", "keep forgetting", "fall through the cracks", "no system", "different tools", "too many tools"];
function normalize(text) { return text.toLowerCase().trim(); }
function matchIntent(text) {
  const value = normalize(text); let best = null; let score = 0;
  INTENTS.forEach((intent) => intent.patterns.forEach((pattern) => { if (value.includes(pattern) && pattern.length > score) { best = intent.key; score = pattern.length; } }));
  return best;
}
function looksLikeProblemDescription(text) { return PROBLEM_SIGNALS.some((signal) => normalize(text).includes(signal)); }

/* ---------- Chat UI and accessibility ---------- */
const chatWidget = document.getElementById("chatWidget");
const chatLauncher = document.getElementById("chatLauncher");
const chatPanel = document.getElementById("chatPanel");
const chatClose = document.getElementById("chatClose");
const chatBody = document.getElementById("chatBody");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatSuggestions = document.getElementById("chatSuggestions");
const chatLive = document.getElementById("chatLive");
let lastFocusedElement = null;
let activeActionGroup = null;
function escapeHtml(value) { const element = document.createElement("div"); element.textContent = value; return element.innerHTML; }
function announce(message) { chatLive.textContent = message; }
function botSay(html) {
  const message = document.createElement("div"); message.className = "msg msg-bot";
  // Only fixed, local strings and explicitly escaped inquiry fields reach this helper.
  message.innerHTML = html; chatBody.appendChild(message); chatBody.scrollTop = chatBody.scrollHeight; announce(message.textContent);
}
function userSay(text) { const message = document.createElement("div"); message.className = "msg msg-user"; message.textContent = text; chatBody.appendChild(message); chatBody.scrollTop = chatBody.scrollHeight; }
function clearQuickReplies() { if (activeActionGroup) activeActionGroup.remove(); activeActionGroup = null; }
function showQuickReplies(options) {
  clearQuickReplies(); const group = document.createElement("div"); group.className = "msg-actions";
  options.forEach((option) => { const button = document.createElement("button"); button.type = "button"; button.textContent = option.label; button.addEventListener("click", () => { userSay(option.label); clearQuickReplies(); option.action(); }); group.appendChild(button); });
  activeActionGroup = group; chatBody.appendChild(group); chatBody.scrollTop = chatBody.scrollHeight;
}
function showTyping() { const element = document.createElement("div"); element.className = "msg msg-bot typing-msg"; element.innerHTML = '<div class="typing" aria-label="Assistant is typing"><span></span><span></span><span></span></div>'; chatBody.appendChild(element); chatBody.scrollTop = chatBody.scrollHeight; return element; }
function renderSuggestions(suggestions) { chatSuggestions.innerHTML = ""; suggestions.forEach((suggestion) => { const button = document.createElement("button"); button.type = "button"; button.textContent = suggestion; button.addEventListener("click", () => handleUserMessage(suggestion)); chatSuggestions.appendChild(button); }); }
function focusableInChat() { return [...chatPanel.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hasAttribute("disabled") && element.getClientRects().length); }
function openChat(trigger = document.activeElement) {
  lastFocusedElement = trigger instanceof HTMLElement ? trigger : null; chatWidget.classList.add("open"); chatLauncher.setAttribute("aria-expanded", "true"); chatPanel.setAttribute("aria-hidden", "false");
  if (!chatBody.dataset.started) { chatBody.dataset.started = "1"; botSay("Hi, I'm Ray's guided Portfolio Assistant. Ask about Ray's work, systems, or how he can help with something you're dealing with."); renderSuggestions(["What does Ray do?", "What has he built?", "How does he work?", "Can he help with my process?"]); }
  chatInput.focus();
}
function closeChat() { chatWidget.classList.remove("open"); chatLauncher.setAttribute("aria-expanded", "false"); chatPanel.setAttribute("aria-hidden", "true"); if (lastFocusedElement?.isConnected) lastFocusedElement.focus(); }
chatLauncher.addEventListener("click", () => chatWidget.classList.contains("open") ? closeChat() : openChat(chatLauncher));
chatClose.addEventListener("click", closeChat);
document.addEventListener("keydown", (event) => {
  if (!chatWidget.classList.contains("open")) return;
  if (event.key === "Escape") { event.preventDefault(); closeChat(); return; }
  if (event.key === "Tab") { const targets = focusableInChat(); if (!targets.length) return; const first = targets[0]; const last = targets[targets.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
});

/* ---------- Guided inquiry ---------- */
const INQUIRY_FIELDS = [
  { key: "name", label: "your name", prompt: "Sure — what's your name?" },
  { key: "business", label: "your business or company", prompt: "What's your business or company called?" },
  { key: "problem", label: "the business problem", prompt: "In a sentence or two, what's taking too much time or feels disorganized?" },
  { key: "currentProcess", label: "the current process", prompt: "How is that handled today — manually, in spreadsheets, or in another tool?" },
  { key: "outcome", label: "the desired outcome", prompt: "What would a better version of this look like for you?" },
  { key: "email", label: "a valid email address", prompt: "What's the best email to reach you at?", validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
  { key: "whatsapp", label: "a WhatsApp number", prompt: "Optional: what's the best WhatsApp number? Type “skip” if you'd rather not share one.", optional: true, validate: (value) => /^[+\d][\d\s()-]{6,}$/.test(value) },
  { key: "contactPref", label: "a contact preference", prompt: "Would you prefer a reply by email or WhatsApp?", validate: (value) => /^(email|whatsapp)$/i.test(value) },
];
let inquiryActive = false; let inquiryConfirming = false; let inquiryStep = 0; let inquiryData = {};
function resetInquiry() { inquiryActive = false; inquiryConfirming = false; inquiryStep = 0; inquiryData = {}; }
function askInquiryStep() {
  botSay(INQUIRY_FIELDS[inquiryStep].prompt);
  showQuickReplies([{ label: "Restart inquiry", action: startInquiry }, { label: "Cancel inquiry", action: cancelInquiry }]);
}
function startInquiry() { resetInquiry(); inquiryActive = true; botSay("I can help you prepare a concise inquiry for Ray. Nothing is sent automatically from this site."); askInquiryStep(); }
function cancelInquiry() { resetInquiry(); botSay("Inquiry cancelled. No details were sent or saved by this site."); }
function validateField(field, value) { if (!value) return `Please enter ${field.label}.`; if (field.optional && /^(skip|no|none|n\/a)$/i.test(value)) return null; if (field.validate && !field.validate(value)) return field.key === "contactPref" ? "Please reply with either “email” or “WhatsApp”." : `Please enter ${field.label}.`; return null; }
function inquirySummary(data) { return `<strong>Please confirm these details:</strong><br><br>Name: ${escapeHtml(data.name)}<br>Business: ${escapeHtml(data.business)}<br>Problem: ${escapeHtml(data.problem)}<br>Current process: ${escapeHtml(data.currentProcess)}<br>Desired outcome: ${escapeHtml(data.outcome)}<br>Email: ${escapeHtml(data.email)}<br>WhatsApp: ${escapeHtml(data.whatsapp || "Not provided")}<br>Preferred contact: ${escapeHtml(data.contactPref)}`; }
function advanceInquiry(text) {
  const field = INQUIRY_FIELDS[inquiryStep]; const error = validateField(field, text); if (error) { botSay(error); return; }
  inquiryData[field.key] = field.optional && /^(skip|no|none|n\/a)$/i.test(text) ? "" : text; inquiryStep += 1;
  if (inquiryStep < INQUIRY_FIELDS.length) { askInquiryStep(); return; }
  inquiryActive = false; inquiryConfirming = true; botSay(inquirySummary(inquiryData)); showQuickReplies([{ label: "Confirm details", action: confirmInquiry }, { label: "Start over", action: startInquiry }, { label: "Cancel inquiry", action: cancelInquiry }]);
}
function addDeliveryOption(label, href, external = false) { const link = document.createElement("a"); link.className = "btn btn-ghost"; link.textContent = label; link.href = href; if (external) { link.target = "_blank"; link.rel = "noopener"; } return link; }
function confirmInquiry() {
  inquiryConfirming = false;
  const lines = [`Name: ${inquiryData.name}`, `Business: ${inquiryData.business}`, `Problem: ${inquiryData.problem}`, `Current process: ${inquiryData.currentProcess}`, `Desired outcome: ${inquiryData.outcome}`, `Email: ${inquiryData.email}`, `WhatsApp: ${inquiryData.whatsapp || "Not provided"}`, `Preferred contact: ${inquiryData.contactPref}`];
  const subject = encodeURIComponent(`Portfolio inquiry from ${inquiryData.name}`); const body = encodeURIComponent(`Hello Ray,\n\nI'd like to discuss the following:\n\n${lines.join("\n")}`);
  const actions = document.createElement("div"); actions.className = "msg-actions delivery-actions"; actions.append(addDeliveryOption("Open pre-filled email", `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`)); actions.append(addDeliveryOption("Open WhatsApp", `${WHATSAPP_URL}?text=${encodeURIComponent(`Hello Ray, I'd like to discuss this business process:\n\n${lines.join("\n")}`)}`, true)); chatBody.appendChild(actions); chatBody.scrollTop = chatBody.scrollHeight;
  botSay("Your inquiry has not been sent by this website. Choose an option above, review the pre-filled message, and send it yourself. No information is stored after this chat session."); resetInquiry();
}

/* ---------- Response routing ---------- */
function fallbackMessage() { botSay("I don't have enough information to answer that confidently. You can prepare an inquiry here, email Ray, or contact him on WhatsApp."); showQuickReplies([{ label: "Start an inquiry", action: startInquiry }]); }
function answer(text) {
  if (inquiryConfirming) { if (/^(confirm|yes|send|correct)$/i.test(normalize(text))) confirmInquiry(); else if (/^(restart|start over|edit)$/i.test(normalize(text))) startInquiry(); else if (/^(cancel|no)$/i.test(normalize(text))) cancelInquiry(); else botSay("Please choose Confirm details, Start over, or Cancel inquiry."); return; }
  if (inquiryActive) {
    if (/^(cancel|stop)$/i.test(normalize(text))) { cancelInquiry(); return; }
    if (/^(restart|start over)$/i.test(normalize(text))) { startInquiry(); return; }
    advanceInquiry(text);
    return;
  }
  if (/leave (an |my )?inquiry|contact me|reach out to me|talk to ray directly/i.test(text)) { startInquiry(); return; }
  if (looksLikeProblemDescription(text)) { botSay("That sounds like a workflow that may be streamlined. A possible starting shape is:<br><br><strong>Trigger → Capture → Qualification → Database → Follow-up → Notification.</strong><br><br>That is only a starting point, not a promise that it fits your case. Would you like to prepare an inquiry for Ray?"); showQuickReplies([{ label: "Start an inquiry", action: startInquiry }, { label: "Not right now", action: () => botSay("No problem — ask me anything else about Ray's work.") }]); return; }
  const intent = matchIntent(text);
  if (intent === "booking") {
    botSay(KB.booking);
    showQuickReplies([
      { label: "Book a Discovery Call", action: () => openBookingModal(chatLauncher) },
      { label: "Start an inquiry instead", action: startInquiry }
    ]);
    return;
  }
  if (intent === "pricing" || !intent || !KB[intent]) { fallbackMessage(); return; }
  botSay(KB[intent]);
}
function handleUserMessage(text) { const value = text.trim(); clearQuickReplies(); if (!value) { if (inquiryActive) botSay(`Please enter ${INQUIRY_FIELDS[inquiryStep].label}.`); return; } userSay(value); chatInput.value = ""; chatSuggestions.innerHTML = ""; const typing = showTyping(); window.setTimeout(() => { typing.remove(); answer(value); }, 450); }
chatForm.addEventListener("submit", (event) => { event.preventDefault(); handleUserMessage(chatInput.value); });
const startConvoBtn = document.getElementById("startConvoBtn");
if (startConvoBtn) {
  startConvoBtn.addEventListener("click", () => {
    const inquirySection = document.getElementById("inquirySection");
    if (inquirySection) {
      inquirySection.scrollIntoView({ behavior: "smooth", block: "start" });
      const nameInput = document.getElementById("inquiryName");
      if (nameInput) {
        window.setTimeout(() => nameInput.focus(), 600);
      }
    } else {
      openChat(startConvoBtn);
      startInquiry();
    }
  });
}
document.getElementById("moreAboutBtn").addEventListener("click", (event) => { openChat(event.currentTarget); handleUserMessage("Tell me more about Ray's background"); });

/* ==========================================================================
   CONTACT INQUIRY FORM CONTROLLER
   ========================================================================== */
const inquiryForm = document.getElementById("inquiryForm");
if (inquiryForm) {
  const helpChips = inquiryForm.querySelectorAll(".help-chip");
  helpChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
    });
  });

  inquiryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("inquiryName");
    const emailInput = document.getElementById("inquiryEmail");
    const companyInput = document.getElementById("inquiryCompany");
    const improveInput = document.getElementById("inquiryImprove");
    const feedbackBox = document.getElementById("inquiryFeedback");
    const mailtoLink = document.getElementById("inquiryMailtoLink");
    const whatsappLink = document.getElementById("inquiryWhatsappLink");

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const company = companyInput ? companyInput.value.trim() : "";
    const improve = improveInput ? improveInput.value.trim() : "";

    // Validation
    if (!name) {
      if (nameInput) nameInput.focus();
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      if (emailInput) emailInput.focus();
      return;
    }
    if (!improve) {
      if (improveInput) improveInput.focus();
      return;
    }

    // Selected help chips
    const selectedHelp = [];
    inquiryForm.querySelectorAll(".help-chip.active").forEach((chip) => {
      selectedHelp.push(chip.getAttribute("data-value") || chip.textContent.trim());
    });

    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Company / Business: ${company || "Not provided"}`,
      `How can I help: ${selectedHelp.length ? selectedHelp.join(", ") : "General inquiry"}`,
      ``,
      `What I would like to improve:`,
      improve
    ];

    const subjectText = `Inquiry from ${name}${company ? ' (' + company + ')' : ''}`;
    const bodyText = `Hello Ray,\n\nI would like to discuss a business process improvement:\n\n${lines.join("\n")}`;

    const mailtoHref = `mailto:oninray014@gmail.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;
    const whatsappText = `Hello Ray, I'd like to discuss a process improvement:\n\n${lines.join("\n")}`;
    const whatsappHref = `https://wa.me/639204314649?text=${encodeURIComponent(whatsappText)}`;

    if (mailtoLink) mailtoLink.href = mailtoHref;
    if (whatsappLink) whatsappLink.href = whatsappHref;

    if (feedbackBox) {
      feedbackBox.style.display = "block";
      feedbackBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    // Automatically open mailto
    window.location.href = mailtoHref;
  });
}

/* ==========================================================================
   DISCOVERY CALL BOOKING CONTROLLER
   ========================================================================== */
const bookingModal = document.getElementById("bookingModal");
const bookingCloseBtn = document.getElementById("bookingCloseBtn");
const bookingStatusBanner = document.getElementById("bookingStatusBanner");
const bookingBannerText = document.getElementById("bookingBannerText");

const bookingModalEyebrow = document.getElementById("bookingModalEyebrow");
const bookingModalTitle = document.getElementById("bookingModalTitle");
const bookingModalSubtitle = document.getElementById("bookingModalSubtitle");

const calPrevMonth = document.getElementById("calPrevMonth");
const calNextMonth = document.getElementById("calNextMonth");
const calMonthLabel = document.getElementById("calMonthLabel");
const calendarDays = document.getElementById("calendarDays");
const hostTzLabel = document.getElementById("hostTzLabel");

const selectedDateHeading = document.getElementById("selectedDateHeading");
const visitorTzSelect = document.getElementById("visitorTzSelect");
const slotsContainer = document.getElementById("slotsContainer");
const slotsPlaceholder = document.getElementById("slotsPlaceholder");
const slotsLoading = document.getElementById("slotsLoading");
const slotsList = document.getElementById("slotsList");

const openRequestTimeBtn = document.getElementById("openRequestTimeBtn");
const bookingStepDateTime = document.getElementById("bookingStepDateTime");
const bookingStepForm = document.getElementById("bookingStepForm");
const bookingStepConfirmation = document.getElementById("bookingStepConfirmation");
const bookingStepRequestTime = document.getElementById("bookingStepRequestTime");
const bookingStepRequestConfirmation = document.getElementById("bookingStepRequestConfirmation");

const summaryDatetimeText = document.getElementById("summaryDatetimeText");
const summaryTzText = document.getElementById("summaryTzText");
const changeSlotBtn = document.getElementById("changeSlotBtn");

const bookingDetailsForm = document.getElementById("bookingDetailsForm");
const bookName = document.getElementById("bookName");
const bookEmail = document.getElementById("bookEmail");
const bookCompany = document.getElementById("bookCompany");
const bookWhatsapp = document.getElementById("bookWhatsapp");
const bookTopic = document.getElementById("bookTopic");
const bookDetails = document.getElementById("bookDetails");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const topicError = document.getElementById("topicError");
const formSubmitError = document.getElementById("formSubmitError");
const backToCalendarBtn = document.getElementById("backToCalendarBtn");
const submitBookingBtn = document.getElementById("submitBookingBtn");
const bookingSpinner = document.getElementById("bookingSpinner");

const confirmDatetimeVal = document.getElementById("confirmDatetimeVal");
const confirmTzVal = document.getElementById("confirmTzVal");
const confirmMeetRow = document.getElementById("confirmMeetRow");
const confirmMeetLink = document.getElementById("confirmMeetLink");
const confirmTopicVal = document.getElementById("confirmTopicVal");
const closeConfirmationBtn = document.getElementById("closeConfirmationBtn");

// Flexible scheduling request elements
const backToCalendarFromRequestBtn = document.getElementById("backToCalendarFromRequestBtn");
const submitRequestBtn = document.getElementById("submitRequestBtn");
const reqSpinner = document.getElementById("reqSpinner");
const closeRequestConfirmationBtn = document.getElementById("closeRequestConfirmationBtn");

const requestTimeForm = document.getElementById("requestTimeForm");
const reqName = document.getElementById("reqName");
const reqEmail = document.getElementById("reqEmail");
const reqCompany = document.getElementById("reqCompany");
const reqTimezone = document.getElementById("reqTimezone");
const reqDate = document.getElementById("reqDate");
const reqTime = document.getElementById("reqTime");
const reqTopic = document.getElementById("reqTopic");
const reqMessage = document.getElementById("reqMessage");

const reqNameError = document.getElementById("reqNameError");
const reqEmailError = document.getElementById("reqEmailError");
const reqDateError = document.getElementById("reqDateError");
const reqTimeError = document.getElementById("reqTimeError");
const reqTopicError = document.getElementById("reqTopicError");
const reqFormSubmitError = document.getElementById("reqFormSubmitError");

const reqConfirmDatetimeVal = document.getElementById("reqConfirmDatetimeVal");
const reqConfirmTzVal = document.getElementById("reqConfirmTzVal");
const reqConfirmContactVal = document.getElementById("reqConfirmContactVal");
const reqConfirmTopicVal = document.getElementById("reqConfirmTopicVal");

let lastFocusedBookingEl = null;
let bookingConfig = {
  configured: true,
  hostName: "Ray Formacil",
  hostTimezone: "Asia/Manila",
  durationMins: 30,
  minNoticeHours: 4,
  workingDays: [1, 2, 3, 4, 5]
};
let detectedVisitorTimezone = "Asia/Manila";
let selectedVisitorTimezone = "Asia/Manila";
const _initDate = new Date();
let viewYear = _initDate.getFullYear();
let viewMonth = _initDate.getMonth();
let selectedDateStr = null;
let selectedSlot = null;
let lastBookingResult = null;
let bookingInitialized = false;

// Common timezones for selector
const COMMON_TIMEZONES = [
  "Asia/Manila",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Australia/Sydney",
  "UTC"
];

function initTimezoneSelector() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) detectedVisitorTimezone = tz;
  } catch (err) {
    detectedVisitorTimezone = "Asia/Manila";
  }
  selectedVisitorTimezone = detectedVisitorTimezone;

  const tzSet = new Set([detectedVisitorTimezone, ...COMMON_TIMEZONES]);
  visitorTzSelect.innerHTML = "";
  if (reqTimezone) reqTimezone.innerHTML = "";

  tzSet.forEach((tz) => {
    const opt = document.createElement("option");
    opt.value = tz;
    opt.textContent = tz.replace(/_/g, " ");
    if (tz === selectedVisitorTimezone) opt.selected = true;
    visitorTzSelect.appendChild(opt);

    if (reqTimezone) {
      const reqOpt = opt.cloneNode(true);
      reqTimezone.appendChild(reqOpt);
    }
  });
}

visitorTzSelect.addEventListener("change", () => {
  selectedVisitorTimezone = visitorTzSelect.value;
  if (reqTimezone) reqTimezone.value = selectedVisitorTimezone;
  if (selectedDateStr) {
    fetchAvailableSlots(selectedDateStr);
  }
});

if (reqTimezone) {
  reqTimezone.addEventListener("change", () => {
    selectedVisitorTimezone = reqTimezone.value;
    visitorTzSelect.value = selectedVisitorTimezone;
    if (selectedDateStr) {
      fetchAvailableSlots(selectedDateStr);
    }
  });
}

async function fetchBookingConfig() {
  try {
    const res = await fetch("/api/booking/config");
    if (res.ok) {
      const data = await res.json();
      bookingConfig = { ...bookingConfig, ...data };
      if (hostTzLabel) {
        hostTzLabel.textContent = `${bookingConfig.hostTimezone} (UTC+8)`;
      }
      if (!bookingConfig.configured) {
        bookingStatusBanner.style.display = "flex";
        bookingBannerText.textContent = "Google Calendar authorization is currently pending on this server. Live scheduling is in configuration mode.";
      } else {
        bookingStatusBanner.style.display = "none";
      }
      return;
    }
  } catch (err) {
    // Standalone static mode: default to active booking
  }
  if (hostTzLabel) {
    hostTzLabel.textContent = `${bookingConfig.hostTimezone} (UTC+8)`;
  }
  if (bookingStatusBanner) {
    bookingStatusBanner.style.display = "none";
  }
}

function generateStaticSlots(dateStr, timezone) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const anchorDate = new Date(Date.UTC(y, m - 1, d, 12 - 8, 0, 0));
  const dayOfWeek = anchorDate.getUTCDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return []; // Weekends off

  const slots = [];
  const startMins = 9 * 60; // 09:00 Manila (UTC+8)
  const endMins = 18 * 60;  // 18:00 Manila (UTC+8)
  const duration = 30;
  const now = Date.now();
  const minNoticeMs = 4 * 60 * 60 * 1000;

  for (let mins = startMins; mins + duration <= endMins; mins += duration) {
    const hours = Math.floor(mins / 60);
    const mPart = mins % 60;
    // Asia/Manila is UTC+8
    const slotStart = new Date(Date.UTC(y, m - 1, d, hours - 8, mPart, 0));
    const slotEnd = new Date(Date.UTC(y, m - 1, d, hours - 8, mPart + duration, 0));

    if (slotStart.getTime() >= now + minNoticeMs) {
      let label = "";
      try {
        label = new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: timezone,
        }).format(slotStart);
      } catch (e) {
        label = `${String(hours).padStart(2, "0")}:${String(mPart).padStart(2, "0")}`;
      }
      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
        label: label,
      });
    }
  }
  return slots;
}

function renderCalendar() {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  calMonthLabel.textContent = `${monthNames[viewMonth]} ${viewYear}`;
  calendarDays.innerHTML = "";

  const firstDayOfWeek = new Date(Date.UTC(viewYear, viewMonth, 1)).getUTCDay();
  const totalDays = new Date(Date.UTC(viewYear, viewMonth + 1, 0)).getUTCDate();

  // Add empty slots for days before start of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const blank = document.createElement("div");
    blank.className = "cal-day-empty";
    calendarDays.appendChild(blank);
  }

  // Today in host timezone
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  for (let day = 1; day <= totalDays; day++) {
    const dayStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayDate = new Date(Date.UTC(viewYear, viewMonth, day));
    const dayOfWeek = dayDate.getUTCDay();

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cal-day-btn";
    btn.textContent = String(day);
    btn.setAttribute("data-date", dayStr);

    if (dayStr === todayStr) {
      btn.classList.add("today");
    }

    if (dayStr === selectedDateStr) {
      btn.classList.add("selected");
    }

    // Past date check
    const isPast = dayStr < todayStr;
    // Working day check (default Mon-Fri: 1-5)
    const isWorkingDay = (bookingConfig.workingDays || [1, 2, 3, 4, 5]).includes(dayOfWeek);

    if (isPast || !isWorkingDay) {
      btn.disabled = true;
      btn.setAttribute("aria-disabled", "true");
    } else {
      btn.addEventListener("click", () => {
        selectDate(dayStr, btn);
      });
    }

    calendarDays.appendChild(btn);
  }
}

calPrevMonth.addEventListener("click", () => {
  viewMonth--;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  renderCalendar();
});

calNextMonth.addEventListener("click", () => {
  viewMonth++;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  renderCalendar();
});

function selectDate(dateStr, clickedBtn) {
  selectedDateStr = dateStr;
  document.querySelectorAll(".cal-day-btn").forEach((el) => el.classList.remove("selected"));
  if (clickedBtn) clickedBtn.classList.add("selected");

  // Format date display
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  const options = { weekday: "long", month: "short", day: "numeric" };
  selectedDateHeading.textContent = dateObj.toLocaleDateString("en-US", { ...options, timeZone: "UTC" });

  fetchAvailableSlots(dateStr);
}

async function fetchAvailableSlots(dateStr) {
  slotsPlaceholder.style.display = "none";
  slotsLoading.style.display = "flex";
  slotsList.innerHTML = "";

  let slotsData = null;

  try {
    const url = `/api/booking/available-slots?date=${encodeURIComponent(dateStr)}&timezone=${encodeURIComponent(selectedVisitorTimezone)}`;
    const res = await fetch(url);
    if (res.ok) {
      slotsData = await res.json();
    }
  } catch (err) {
    // API not reachable in static mode
  }

  slotsLoading.style.display = "none";

  if (!slotsData || !slotsData.configured || !slotsData.slots) {
    // Standalone static mode: generate candidate slots
    const staticSlots = generateStaticSlots(dateStr, selectedVisitorTimezone);
    slotsData = { configured: true, slots: staticSlots };
  }

  if (!slotsData.slots || slotsData.slots.length === 0) {
    slotsList.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 32px 12px; text-align: center; color: var(--ink-faint); font-size: 0.88rem;">
        No 30-minute slots remaining for this date. Please choose another date on the calendar.
      </div>
    `;
    return;
  }

  slotsData.slots.forEach((slot) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "slot-btn";
    btn.textContent = slot.label;
    btn.setAttribute("data-start", slot.start);
    btn.setAttribute("data-end", slot.end);

    btn.addEventListener("click", () => {
      document.querySelectorAll(".slot-btn").forEach((s) => s.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSlot = slot;
      goToFormStep();
    });

    slotsList.appendChild(btn);
  });
}

function goToFormStep() {
  if (!selectedSlot) return;

  const startDate = new Date(selectedSlot.start);
  const formattedDateTime = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: selectedVisitorTimezone
  }).format(startDate);

  summaryDatetimeText.textContent = formattedDateTime;
  summaryTzText.textContent = `(${selectedVisitorTimezone})`;

  bookingStepDateTime.style.display = "none";
  bookingStepConfirmation.style.display = "none";
  if (bookingStepRequestTime) bookingStepRequestTime.style.display = "none";
  if (bookingStepRequestConfirmation) bookingStepRequestConfirmation.style.display = "none";
  bookingStepForm.style.display = "block";
  formSubmitError.style.display = "none";

  if (bookingModalEyebrow) bookingModalEyebrow.textContent = "Discovery Call";
  if (bookingModalTitle) bookingModalTitle.textContent = "Book a 30-Minute Call";
  if (bookingModalSubtitle) {
    bookingModalSubtitle.textContent = "Enter your details to confirm your 30-minute discovery call.";
  }

  window.setTimeout(() => bookName.focus(), 100);
}

function goToCalendarStep() {
  bookingStepForm.style.display = "none";
  bookingStepConfirmation.style.display = "none";
  if (bookingStepRequestTime) bookingStepRequestTime.style.display = "none";
  if (bookingStepRequestConfirmation) bookingStepRequestConfirmation.style.display = "none";
  bookingStepDateTime.style.display = "block";

  if (bookingModalEyebrow) bookingModalEyebrow.textContent = "Discovery Call";
  if (bookingModalTitle) bookingModalTitle.textContent = "Book a 30-Minute Call";
  if (bookingModalSubtitle) {
    bookingModalSubtitle.textContent = "Discuss your workflow bottlenecks, automation opportunities, or custom business systems.";
  }
}

changeSlotBtn.addEventListener("click", goToCalendarStep);
backToCalendarBtn.addEventListener("click", goToCalendarStep);

// Form validation
function clearFormErrors() {
  nameError.textContent = "";
  nameError.classList.remove("visible");
  emailError.textContent = "";
  emailError.classList.remove("visible");
  topicError.textContent = "";
  topicError.classList.remove("visible");
  formSubmitError.style.display = "none";
  formSubmitError.textContent = "";
}

bookName.addEventListener("input", () => {
  nameError.classList.remove("visible");
});
bookEmail.addEventListener("input", () => {
  emailError.classList.remove("visible");
});
bookTopic.addEventListener("input", () => {
  topicError.classList.remove("visible");
});

bookingDetailsForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearFormErrors();

  let hasError = false;
  const nameVal = bookName.value.trim();
  const emailVal = bookEmail.value.trim();
  const topicVal = bookTopic.value.trim();

  if (!nameVal || nameVal.length < 2) {
    nameError.textContent = "Please enter your name (at least 2 characters).";
    nameError.classList.add("visible");
    hasError = true;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal || !emailRegex.test(emailVal)) {
    emailError.textContent = "Please enter a valid email address.";
    emailError.classList.add("visible");
    hasError = true;
  }

  if (!topicVal || topicVal.length < 3) {
    topicError.textContent = "Please provide a brief topic or problem to discuss.";
    topicError.classList.add("visible");
    hasError = true;
  }

  if (hasError) return;

  if (!selectedSlot) {
    formSubmitError.textContent = "Please select an available time slot on the calendar.";
    formSubmitError.style.display = "block";
    return;
  }

  // Submit booking
  submitBookingBtn.disabled = true;
  bookingSpinner.style.display = "inline-block";

  const payload = {
    name: nameVal,
    email: emailVal,
    company: bookCompany.value.trim(),
    whatsapp: bookWhatsapp.value.trim(),
    topic: topicVal,
    details: bookDetails.value.trim(),
    slotStart: selectedSlot.start,
    slotEnd: selectedSlot.end,
    visitorTimezone: selectedVisitorTimezone
  };

  try {
    let bookedData = null;
    try {
      const res = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          bookedData = data.booking;
        }
      }
    } catch (apiErr) {
      // Standalone static mode: proceed with client-side confirmation
    }

    submitBookingBtn.disabled = false;
    bookingSpinner.style.display = "none";

    // Success in server or standalone static mode!
    lastBookingResult = {
      ...(bookedData || {}),
      start: selectedSlot.start,
      end: selectedSlot.end,
      topic: topicVal,
      name: nameVal,
      email: emailVal,
      company: bookCompany.value.trim(),
      meetLink: bookedData?.meetLink || null
    };
    showConfirmationStep(lastBookingResult);
  } catch (err) {
    submitBookingBtn.disabled = false;
    bookingSpinner.style.display = "none";
    formSubmitError.textContent = "A network error occurred while confirming your booking. Please try again.";
    formSubmitError.style.display = "block";
  }
});

function showConfirmationStep(booking) {
  bookingStepForm.style.display = "none";
  bookingStepDateTime.style.display = "none";
  if (bookingStepRequestTime) bookingStepRequestTime.style.display = "none";
  if (bookingStepRequestConfirmation) bookingStepRequestConfirmation.style.display = "none";
  bookingStepConfirmation.style.display = "block";

  if (bookingModalEyebrow) bookingModalEyebrow.textContent = "Booking Confirmed";
  if (bookingModalTitle) bookingModalTitle.textContent = "Your Discovery Call is Booked";
  if (bookingModalSubtitle) {
    bookingModalSubtitle.textContent = "A calendar invitation has been dispatched to your email address.";
  }

  const startDate = new Date(booking.start);
  const endDate = new Date(booking.end);

  const formattedDateTime = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: selectedVisitorTimezone
  }).format(startDate);

  const formattedEndTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: selectedVisitorTimezone
  }).format(endDate);

  confirmDatetimeVal.textContent = `${formattedDateTime} - ${formattedEndTime}`;
  confirmTzVal.textContent = `${selectedVisitorTimezone}`;
  confirmTopicVal.textContent = booking.topic;

  if (booking.meetLink) {
    confirmMeetRow.style.display = "flex";
    confirmMeetLink.href = booking.meetLink;
    confirmMeetLink.textContent = "Join Google Meet";
  } else {
    confirmMeetRow.style.display = "none";
  }
}

closeConfirmationBtn.addEventListener("click", () => {
  closeBookingModal();
  goToCalendarStep();
  bookingDetailsForm.reset();
  selectedSlot = null;
});

/* ==========================================================================
   FLEXIBLE SCHEDULING REQUEST HANDLERS
   ========================================================================== */
function goToRequestTimeStep() {
  bookingStepDateTime.style.display = "none";
  bookingStepForm.style.display = "none";
  bookingStepConfirmation.style.display = "none";
  if (bookingStepRequestConfirmation) bookingStepRequestConfirmation.style.display = "none";
  if (bookingStepRequestTime) bookingStepRequestTime.style.display = "block";

  if (bookingModalEyebrow) bookingModalEyebrow.textContent = "Discovery Call · Flexible Scheduling";
  if (bookingModalTitle) bookingModalTitle.textContent = "Request a Different Time";
  if (bookingModalSubtitle) {
    bookingModalSubtitle.textContent = "Suggest your preferred date and time. This is a scheduling request, not an immediate booking.";
  }

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  if (reqDate) {
    reqDate.min = todayStr;
    if (selectedDateStr && selectedDateStr >= todayStr) {
      reqDate.value = selectedDateStr;
    } else if (!reqDate.value) {
      reqDate.value = todayStr;
    }
  }

  if (reqTimezone) {
    reqTimezone.value = selectedVisitorTimezone;
  }

  clearRequestFormErrors();
  window.setTimeout(() => {
    if (reqName) reqName.focus();
  }, 100);
}

function clearRequestFormErrors() {
  if (reqNameError) {
    reqNameError.textContent = "";
    reqNameError.classList.remove("visible");
  }
  if (reqEmailError) {
    reqEmailError.textContent = "";
    reqEmailError.classList.remove("visible");
  }
  if (reqDateError) {
    reqDateError.textContent = "";
    reqDateError.classList.remove("visible");
  }
  if (reqTimeError) {
    reqTimeError.textContent = "";
    reqTimeError.classList.remove("visible");
  }
  if (reqTopicError) {
    reqTopicError.textContent = "";
    reqTopicError.classList.remove("visible");
  }
  if (reqFormSubmitError) {
    reqFormSubmitError.style.display = "none";
    reqFormSubmitError.textContent = "";
  }
}

if (reqName) {
  reqName.addEventListener("input", () => {
    if (reqNameError) reqNameError.classList.remove("visible");
  });
}
if (reqEmail) {
  reqEmail.addEventListener("input", () => {
    if (reqEmailError) reqEmailError.classList.remove("visible");
  });
}
if (reqDate) {
  reqDate.addEventListener("input", () => {
    if (reqDateError) reqDateError.classList.remove("visible");
  });
}
if (reqTime) {
  reqTime.addEventListener("input", () => {
    if (reqTimeError) reqTimeError.classList.remove("visible");
  });
}
if (reqTopic) {
  reqTopic.addEventListener("input", () => {
    if (reqTopicError) reqTopicError.classList.remove("visible");
  });
}

if (openRequestTimeBtn) {
  openRequestTimeBtn.addEventListener("click", goToRequestTimeStep);
}
if (backToCalendarFromRequestBtn) {
  backToCalendarFromRequestBtn.addEventListener("click", () => {
    goToCalendarStep();
    if (openRequestTimeBtn) openRequestTimeBtn.focus();
  });
}

if (requestTimeForm) {
  requestTimeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearRequestFormErrors();

    let hasError = false;
    const nameVal = reqName ? reqName.value.trim() : "";
    const emailVal = reqEmail ? reqEmail.value.trim() : "";
    const companyVal = reqCompany ? reqCompany.value.trim() : "";
    const dateVal = reqDate ? reqDate.value.trim() : "";
    const timeVal = reqTime ? reqTime.value.trim() : "";
    const tzVal = reqTimezone ? reqTimezone.value : selectedVisitorTimezone;
    const topicVal = reqTopic ? reqTopic.value.trim() : "";
    const messageVal = reqMessage ? reqMessage.value.trim() : "";

    if (!nameVal || nameVal.length < 2) {
      if (reqNameError) {
        reqNameError.textContent = "Please enter your name (at least 2 characters).";
        reqNameError.classList.add("visible");
      }
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      if (reqEmailError) {
        reqEmailError.textContent = "Please enter a valid email address.";
        reqEmailError.classList.add("visible");
      }
      hasError = true;
    }

    if (!dateVal) {
      if (reqDateError) {
        reqDateError.textContent = "Please select your preferred date.";
        reqDateError.classList.add("visible");
      }
      hasError = true;
    }

    if (!timeVal || timeVal.length < 2) {
      if (reqTimeError) {
        reqTimeError.textContent = "Please suggest your preferred time (e.g. 10:30 AM or Afternoon).";
        reqTimeError.classList.add("visible");
      }
      hasError = true;
    }

    if (!topicVal || topicVal.length < 3) {
      if (reqTopicError) {
        reqTopicError.textContent = "Please describe what you would like to discuss (at least 3 characters).";
        reqTopicError.classList.add("visible");
      }
      hasError = true;
    }

    if (hasError) return;

    if (submitRequestBtn) submitRequestBtn.disabled = true;
    if (reqSpinner) reqSpinner.style.display = "inline-block";

    const payload = {
      name: nameVal,
      email: emailVal,
      company: companyVal,
      timezone: tzVal,
      preferredDate: dateVal,
      preferredTime: timeVal,
      topic: topicVal,
      message: messageVal,
    };

    try {
      try {
        await fetch("/api/booking/request-time", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (apiErr) {
        // Backend not available in static mode
      }

      if (submitRequestBtn) submitRequestBtn.disabled = false;
      if (reqSpinner) reqSpinner.style.display = "none";

      showRequestConfirmationStep({
        name: nameVal,
        email: emailVal,
        company: companyVal,
        preferredDate: dateVal,
        preferredTime: timeVal,
        timezone: tzVal,
        topic: topicVal,
      });
    } catch (err) {
      if (submitRequestBtn) submitRequestBtn.disabled = false;
      if (reqSpinner) reqSpinner.style.display = "none";
      if (reqFormSubmitError) {
        reqFormSubmitError.textContent =
          "A network error occurred while sending your request. Please try again.";
        reqFormSubmitError.style.display = "block";
      }
    }
  });
}

function showRequestConfirmationStep(req) {
  bookingStepDateTime.style.display = "none";
  bookingStepForm.style.display = "none";
  bookingStepConfirmation.style.display = "none";
  if (bookingStepRequestTime) bookingStepRequestTime.style.display = "none";
  if (bookingStepRequestConfirmation) bookingStepRequestConfirmation.style.display = "block";

  if (bookingModalEyebrow) bookingModalEyebrow.textContent = "Availability Request Received";
  if (bookingModalTitle) bookingModalTitle.textContent = "Request Received";
  if (bookingModalSubtitle) {
    bookingModalSubtitle.textContent =
      "Thanks! I've received your preferred date and time. This is a request, not a confirmed appointment. I'll review my availability and get back to you.";
  }

  let formattedDate = req.preferredDate;
  try {
    const parts = req.preferredDate.split("-");
    if (parts.length === 3) {
      const d = new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
      formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
      }).format(d);
    }
  } catch (e) {}

  if (reqConfirmDatetimeVal) {
    reqConfirmDatetimeVal.textContent = `${formattedDate} · ${req.preferredTime}`;
  }
  if (reqConfirmTzVal) {
    reqConfirmTzVal.textContent = req.timezone;
  }
  if (reqConfirmContactVal) {
    reqConfirmContactVal.textContent = `${req.name} (${req.email})${req.company ? ' · ' + req.company : ''}`;
  }
  if (reqConfirmTopicVal) {
    reqConfirmTopicVal.textContent = req.topic;
  }

  window.setTimeout(() => {
    if (closeRequestConfirmationBtn) closeRequestConfirmationBtn.focus();
  }, 100);
}

if (closeRequestConfirmationBtn) {
  closeRequestConfirmationBtn.addEventListener("click", () => {
    closeBookingModal();
    goToCalendarStep();
    if (requestTimeForm) requestTimeForm.reset();
  });
}

function openBookingModal(triggerEl = null) {
  lastFocusedBookingEl = triggerEl || document.activeElement;
  bookingModal.classList.add("open");
  bookingModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  if (!bookingInitialized) {
    initTimezoneSelector();
    const now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
    fetchBookingConfig().then(() => {
      renderCalendar();
      // Auto select first available day
      const firstAvailable = calendarDays.querySelector(".cal-day-btn:not(:disabled)");
      if (firstAvailable) {
        firstAvailable.click();
      }
    });
    bookingInitialized = true;
  }

  // Trap focus
  window.setTimeout(() => {
    bookingCloseBtn.focus();
  }, 100);
}

function closeBookingModal() {
  bookingModal.classList.remove("open");
  bookingModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusedBookingEl && lastFocusedBookingEl.focus) {
    lastFocusedBookingEl.focus();
  }
}

bookingCloseBtn.addEventListener("click", closeBookingModal);
bookingModal.addEventListener("click", (e) => {
  if (e.target === bookingModal) closeBookingModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && bookingModal.classList.contains("open")) {
    closeBookingModal();
  }
});

// Wire up CTA buttons
const openBookingNavBtn = document.getElementById("openBookingNavBtn");
if (openBookingNavBtn) openBookingNavBtn.addEventListener("click", (e) => openBookingModal(e.currentTarget));

const openBookingMobileBtn = document.getElementById("openBookingMobileBtn");
if (openBookingMobileBtn) {
  openBookingMobileBtn.addEventListener("click", (e) => {
    // Close mobile menu if open
    const navToggle = document.getElementById("navToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    if (navToggle && mobileMenu) {
      navToggle.setAttribute("aria-expanded", "false");
      mobileMenu.classList.remove("open");
    }
    openBookingModal(e.currentTarget);
  });
}

const openBookingHeroBtn = document.getElementById("openBookingHeroBtn");
if (openBookingHeroBtn) openBookingHeroBtn.addEventListener("click", (e) => openBookingModal(e.currentTarget));

const openBookingContactBtn = document.getElementById("openBookingContactBtn");
if (openBookingContactBtn) openBookingContactBtn.addEventListener("click", (e) => openBookingModal(e.currentTarget));

/* ---------- Project Showcase Device Carousels ---------- */
(function initProjectShowcases() {
  const carousels = document.querySelectorAll(".project-carousel[data-carousel-id]");
  if (!carousels.length) return;

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const AUTOPLAY_DELAY = 6000; // 6 seconds per slide

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const chips = Array.from(carousel.querySelectorAll(".carousel-chip"));
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");
    const counterEl = carousel.querySelector("[data-screen-counter]");
    const badgeEl = carousel.querySelector("[data-screen-badge]");
    const titleEl = carousel.querySelector("[data-screen-title]");
    const playToggleBtn = carousel.querySelector("[data-play-toggle]");
    const progressBar = carousel.querySelector("[data-progress-bar]");

    if (!slides.length) return;

    let currentIndex = 0;
    let autoPlayTimer = null;
    let isPlaying = !prefersReduced;
    let isHovered = false;
    let isInView = false;
    let animationFrameId = null;
    let progressStartTime = null;

    // Handle image error fallback and preloading
    slides.forEach((slide) => {
      const img = slide.querySelector(".carousel-img");
      if (img) {
        if (img.complete) {
          if (img.naturalWidth === 0) {
            slide.classList.add("img-load-error");
          } else {
            slide.classList.add("img-loaded");
          }
        } else {
          img.addEventListener("load", () => {
            slide.classList.add("img-loaded");
            slide.classList.remove("img-load-error");
          });
          img.addEventListener("error", () => {
            slide.classList.add("img-load-error");
            slide.classList.remove("img-loaded");
          });
        }
      }
    });

    function updateSlideUI(idx) {
      const total = slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === idx);
      });

      chips.forEach((chip, i) => {
        const isActive = i === idx;
        chip.classList.toggle("is-active", isActive);
        chip.setAttribute("aria-selected", String(isActive));
      });

      const currentSlide = slides[idx];
      if (currentSlide) {
        const screenName = currentSlide.getAttribute("data-screen-name") || "";
        const screenType = currentSlide.getAttribute("data-screen-type") || "";

        if (badgeEl) badgeEl.textContent = screenType;
        if (titleEl) titleEl.textContent = screenName;
      }

      if (counterEl) {
        const currentPad = String(idx + 1).padStart(2, "0");
        const totalPad = String(total).padStart(2, "0");
        counterEl.textContent = `${currentPad} / ${totalPad}`;
      }
    }

    function resetProgressBar() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
      }
      progressStartTime = null;
    }

    function animateProgress(timestamp) {
      if (!progressStartTime) progressStartTime = timestamp;
      const elapsed = timestamp - progressStartTime;
      const progress = Math.min(elapsed / AUTOPLAY_DELAY, 1);

      if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
      }

      if (progress < 1) {
        if (isPlaying && !isHovered && isInView) {
          animationFrameId = requestAnimationFrame(animateProgress);
        }
      } else {
        nextSlide(true);
      }
    }

    function startProgress() {
      resetProgressBar();
      if (isPlaying && !isHovered && isInView && !prefersReduced) {
        animationFrameId = requestAnimationFrame(animateProgress);
      }
    }

    function goToSlide(targetIndex, userTriggered = false) {
      const total = slides.length;
      currentIndex = (targetIndex + total) % total;
      updateSlideUI(currentIndex);

      if (userTriggered) {
        // Restart timer on deliberate user interaction
        startProgress();
      } else {
        startProgress();
      }
    }

    function nextSlide(auto = false) {
      goToSlide(currentIndex + 1, !auto);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1, true);
    }

    function updatePlayButtonUI() {
      if (!playToggleBtn) return;
      const playText = playToggleBtn.querySelector(".play-text");
      if (isPlaying) {
        playToggleBtn.innerHTML = `
          <svg class="play-icon-pause" viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          <span class="play-text">Auto</span>
        `;
        playToggleBtn.setAttribute("aria-label", "Pause slide rotation");
      } else {
        playToggleBtn.innerHTML = `
          <svg class="play-icon-play" viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
          <span class="play-text">Paused</span>
        `;
        playToggleBtn.setAttribute("aria-label", "Resume slide rotation");
      }
    }

    // Chip click events
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const target = parseInt(chip.getAttribute("data-slide-target"), 10);
        if (!isNaN(target)) {
          goToSlide(target, true);
        }
      });
    });

    // Arrow controls
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        prevSlide();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        nextSlide(false);
      });
    }

    // Play / pause toggle
    if (playToggleBtn) {
      playToggleBtn.addEventListener("click", () => {
        isPlaying = !isPlaying;
        updatePlayButtonUI();
        if (isPlaying) {
          startProgress();
        } else {
          resetProgressBar();
        }
      });
    }

    // Hover & focus pausing
    carousel.addEventListener("mouseenter", () => {
      isHovered = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    });

    carousel.addEventListener("mouseleave", () => {
      isHovered = false;
      if (isPlaying && isInView) {
        startProgress();
      }
    });

    // Keyboard navigation when focused inside carousel
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide(false);
      }
    });

    // IntersectionObserver to only animate when carousel is visible on screen
    if ("IntersectionObserver" in window) {
      const carouselObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isInView = entry.isIntersecting;
            if (isInView) {
              if (isPlaying && !isHovered) {
                startProgress();
              }
            } else {
              resetProgressBar();
            }
          });
        },
        { threshold: 0.2 }
      );
      carouselObserver.observe(carousel);
    } else {
      isInView = true;
      startProgress();
    }

    // Initialize initial state
    updateSlideUI(0);
    updatePlayButtonUI();
  });

  // Wire up "Discuss Similar System" CTA buttons
  const projectCtaBtns = document.querySelectorAll(".project-cta-btn");
  const projectTopics = {
    daymate: "AI Productivity & Personal Assistant (DayMate architecture)",
    glucosense: "Personal Tracking & Health Analytics (GlucoSense architecture)",
    tummytrack: "Gamified Habit Tracker & Wellness System (TummyTrack architecture)",
    crm: "Custom Small Business CRM & Workspace Hub"
  };

  projectCtaBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectKey = btn.getAttribute("data-project-target");
      const defaultTopic = projectTopics[projectKey] || "Custom Software Architecture Inquiry";

      // Prefill booking topic if empty or user clicked project CTA
      const bookTopicInput = document.getElementById("bookTopic");
      if (bookTopicInput && !bookTopicInput.value) {
        bookTopicInput.value = defaultTopic;
      }

      const reqTopicInput = document.getElementById("reqTopic");
      if (reqTopicInput && !reqTopicInput.value) {
        reqTopicInput.value = defaultTopic;
      }

      if (typeof openBookingModal === "function") {
        openBookingModal(btn);
      }
    });
  });
})();
