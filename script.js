/* ==========================================================================
   BADR ALBDULMAJEED — EEE PORTFOLIO · script.js
   Hardening rules enforced in this file:
   - No innerHTML / outerHTML / document.write anywhere (XSS-safe DOM only:
     createElement, textContent, setAttribute, appendChild).
   - No eval / new Function.
   - External anchors always get target="_blank" + rel="noopener noreferrer".
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------- mobile navigation ---------------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------- skills bars: fill when scrolled into view ---------------- */
  var fills = Array.prototype.slice.call(document.querySelectorAll(".bar-fill"));
  if (fills.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          var width = target.getAttribute("data-w");
          if (width) {
            target.style.width = width + "%";
          }
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.4 });
    fills.forEach(function (bar) { observer.observe(bar); });
  } else {
    fills.forEach(function (bar) {
      var width = bar.getAttribute("data-w");
      if (width) { bar.style.width = width + "%"; }
    });
  }

  /* ---------------- project catalog filter tabs ---------------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".ftab"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".cat-card"));
  var emptyNote = document.getElementById("catalogEmpty");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var filter = tab.getAttribute("data-filter");
      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });
      var visible = 0;
      cards.forEach(function (card) {
        var show = filter === "all" || card.getAttribute("data-cat") === filter;
        card.classList.toggle("is-hidden", !show);
        if (show) { visible += 1; }
      });
      if (emptyNote) {
        emptyNote.hidden = visible !== 0;
      }
    });
  });

  /* ---------------- footer year ---------------- */
  var yearNow = document.getElementById("yearNow");
  if (yearNow) {
    yearNow.textContent = String(new Date().getFullYear());
  }
  var yearFooter = document.getElementById("yearFooter");
  if (yearFooter) {
    yearFooter.textContent = String(new Date().getFullYear());
  }
})();
