(() => {
  const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxqEaWNij_RsYZsTfFCCJia1zEjtUtskasuRzFs51vO2YwJcYlNUv3Lak86RVZwV7Ir/exec";

  const form = document.getElementById("referralForm");
  const statusEl = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");
  const successOverlay = document.getElementById("rfSuccessOverlay");
  const courseSelect = document.getElementById("course");
  const courseLink = document.getElementById("courseLink");

  if (!form || !statusEl || !submitBtn) return;

  const setStatus = (message, type) => {
    statusEl.textContent = message;
    statusEl.classList.remove("status--ok", "status--error");
    if (type === "ok") statusEl.classList.add("status--ok");
    if (type === "error") statusEl.classList.add("status--error");
  };

  const updateCourseLink = () => {
    if (!courseSelect || !courseLink) return;

    const selected = courseSelect.options[courseSelect.selectedIndex];
    const url = selected?.getAttribute?.("data-url") || "";

    if (!url) {
      courseLink.setAttribute("href", "#");
      courseLink.setAttribute("aria-disabled", "true");
      return;
    }

    courseLink.setAttribute("href", url);
    courseLink.setAttribute("aria-disabled", "false");
  };

  if (courseSelect) {
    courseSelect.addEventListener("change", updateCourseLink);
    updateCourseLink();
  }

  const showSuccessAndRedirect = () => {
    if (successOverlay) {
      successOverlay.classList.add("is-visible");
      successOverlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("rf-overlay-open");
    }

    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 1400);
  };

  const validate = (data) => {
    const requiredKeys = [
      "referrer_name",
      "referrer_email",
      "referrer_phone",
      "referral_name",
      "referral_email",
      "referral_phone",
      "course",
    ];

    for (const key of requiredKeys) {
      const value = (data[key] ?? "").toString().trim();
      if (!value) return `Please fill ${key.replace(/_/g, " ")}.`;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.referrer_email)) return "Please enter a valid referrer email.";
    if (!emailRegex.test(data.referral_email)) return "Please enter a valid referral email.";

    return null;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!APPS_SCRIPT_WEB_APP_URL || APPS_SCRIPT_WEB_APP_URL.includes("PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE")) {
      setStatus("Missing Apps Script URL. Please paste your deployed web app URL in js/referral-form.js", "error");
      return;
    }

    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    fd.append("submitted_at", new Date().toISOString());
    fd.append("user_agent", navigator.userAgent);
    fd.append("page_url", window.location.href);

    const err = validate(payload);
    if (err) {
      setStatus(err, "error");
      return;
    }

    submitBtn.disabled = true;
    setStatus("Submitting...", "");

    try {
      const res = await fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        body: fd,
      });

      if (res.type === "opaque") {
        setStatus("Submitted successfully. Thank you!", "ok");
        form.reset();
        updateCourseLink();
        showSuccessAndRedirect();
        return;
      }

      setStatus("Submitted. If you don't see the row in Google Sheets, check your Apps Script deployment access.", "ok");
      form.reset();
      updateCourseLink();
      showSuccessAndRedirect();
    } catch (error) {
      setStatus(`Network error: ${error?.message || error}`, "error");
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
