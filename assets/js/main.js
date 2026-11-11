/* Quick Respond Locksmith 24 Hours — progressive enhancement only.
   The page and its form work fully without JavaScript. */
(function () {
  "use strict";

  var ENDPOINT = "https://vision.leadrai.com/api/forms/ab783cd4729ee31bae7f2f102f134a1d";

  var form     = document.getElementById("leadForm");
  var pageFld  = document.getElementById("pageField");
  var confirm  = document.getElementById("formConfirm");
  var errorBox = document.getElementById("formError");
  var submit   = document.getElementById("submitBtn");

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) { year.textContent = String(new Date().getFullYear()); }

  /* ---------- Record the page the visitor submitted from ---------- */
  if (pageFld) { pageFld.value = window.location.href; }

  /* ---------- Show confirmation after a plain (no-JS) submission ---------- */
  function showConfirmation(scroll) {
    if (!confirm) { return; }
    confirm.hidden = false;
    if (form) { form.hidden = true; }
    if (!scroll) { return; }
    // Moving focus/scroll is a nicety — never let it break the confirmation.
    try {
      confirm.setAttribute("tabindex", "-1");
      if (confirm.focus) { confirm.focus({ preventScroll: true }); }
      if (confirm.scrollIntoView) {
        confirm.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (e) { /* non-fatal */ }
  }

  try {
    if (new URLSearchParams(window.location.search).get("submitted") === "1") {
      showConfirmation(false);
    }
  } catch (e) { /* URLSearchParams unavailable — plain flow still fine */ }

  /* ---------- Client-side validation + fetch submission ---------- */
  if (form) {
    var REQUIRED = [
      { id: "name",     label: "your name" },
      { id: "phone",    label: "a phone number" },
      { id: "service",  label: "the service you need" },
      { id: "location", label: "your location in Hayward" }
    ];

    function clearError(field) {
      field.removeAttribute("aria-invalid");
    }

    REQUIRED.forEach(function (item) {
      var field = document.getElementById(item.id);
      if (field) {
        field.addEventListener("input", function () { clearError(field); });
        field.addEventListener("change", function () { clearError(field); });
      }
    });

    function validate() {
      var missing = [];
      var firstBad = null;

      REQUIRED.forEach(function (item) {
        var field = document.getElementById(item.id);
        if (!field) { return; }
        if (!field.value.trim()) {
          field.setAttribute("aria-invalid", "true");
          missing.push(item.label);
          if (!firstBad) { firstBad = field; }
        } else {
          clearError(field);
        }
      });

      var email = document.getElementById("email");
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        email.setAttribute("aria-invalid", "true");
        missing.push("a valid email address");
        if (!firstBad) { firstBad = email; }
      } else if (email) {
        clearError(email);
      }

      if (missing.length && errorBox) {
        errorBox.textContent = "Please add " + missing.join(", ") + ".";
        errorBox.hidden = false;
      } else if (errorBox) {
        errorBox.hidden = true;
      }

      if (firstBad) { firstBad.focus(); }
      return missing.length === 0;
    }

    var fallingBack = false;

    form.addEventListener("submit", function (event) {
      // A retry after a failed fetch: let the browser do a normal POST.
      if (fallingBack) { return; }

      if (!validate()) {
        event.preventDefault();
        return;
      }

      // Enhanced path: POST as JSON to the same endpoint.
      if (typeof window.fetch !== "function") { return; }
      event.preventDefault();

      if (pageFld) { pageFld.value = window.location.href; }

      var payload = {};
      new FormData(form).forEach(function (value, key) { payload[key] = value; });
      payload._page = window.location.href;

      var original = submit ? submit.textContent : "";
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending…";
      }

      // Once the lead is delivered we must never re-POST it, even if a later
      // cosmetic step throws.
      var delivered = false;

      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) { throw new Error("Request failed: " + response.status); }
          return response.json().catch(function () { return { ok: true }; });
        })
        .then(function (data) {
          if (data && data.ok === false) { throw new Error("Submission rejected"); }
          delivered = true;
          form.reset();
          if (pageFld) { pageFld.value = window.location.href; }
          if (errorBox) { errorBox.hidden = true; }
          showConfirmation(true);
        })
        .catch(function () {
          // The request itself succeeded; don't submit a duplicate.
          if (delivered) { return; }
          if (submit) {
            submit.disabled = false;
            submit.textContent = original;
          }
          // Fall back to a normal browser POST so the lead is never lost.
          fallingBack = true;
          form.submit();
        });
    });
  }

  /* ---------- Smooth in-page links that respect reduced motion ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { return; }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      var id = link.getAttribute("href");
      if (!id || id === "#") { return; }
      var target = document.querySelector(id);
      if (!target) { return; }
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Keep keyboard focus with the visual position
      if (!target.hasAttribute("tabindex")) { target.setAttribute("tabindex", "-1"); }
      target.focus({ preventScroll: true });
      if (history.replaceState) { history.replaceState(null, "", id); }
    });
  });
})();
