(function () {
  "use strict";

  // Spinner
  var spinner = document.getElementById("spinner");
  if (spinner) {
    window.addEventListener("load", function () {
      setTimeout(function () { spinner.classList.remove("show"); }, 300);
    });
    // Fallback in case load already fired
    setTimeout(function () { spinner.classList.remove("show"); }, 1200);
  }

  // Typed effect
  var typedOutput = document.querySelector(".typed-text-output");
  var typedSource = document.querySelector(".typed-text");
  if (typedOutput && typedSource) {
    var strings = typedSource.textContent.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    var si = 0, ci = 0, deleting = false;
    function tick() {
      var current = strings[si];
      if (!deleting) {
        ci++;
        typedOutput.textContent = current.slice(0, ci);
        if (ci === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        ci--;
        typedOutput.textContent = current.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          si = (si + 1) % strings.length;
        }
      }
      setTimeout(tick, deleting ? 24 : 90);
    }
    tick();
  }

  // Skill bars fill when scrolled into view
  var bars = document.querySelectorAll(".progress .progress-bar");
  if (bars.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.style.width = el.getAttribute("aria-valuenow") + "%";
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    bars.forEach(function (b) { observer.observe(b); });
  } else {
    bars.forEach(function (b) {
      b.style.width = b.getAttribute("aria-valuenow") + "%";
    });
  }

  // Portfolio filter
  var filters = document.querySelectorAll("#portfolio-flters li");
  var items = document.querySelectorAll(".portfolio-item");
  filters.forEach(function (f) {
    f.addEventListener("click", function () {
      filters.forEach(function (x) { x.classList.remove("active"); });
      f.classList.add("active");
      var filter = f.getAttribute("data-filter");
      items.forEach(function (item) {
        var show = filter === "*" || item.classList.contains(filter.slice(1));
        item.style.display = show ? "" : "none";
      });
    });
  });

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var hash = a.getAttribute("href");
      if (hash.length > 1) {
        var target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  // Back to top
  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 100) {
        backToTop.style.display = "block";
      } else {
        backToTop.style.display = "none";
      }
    });
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
