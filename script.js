/* Harjot Singh Tathgur — portfolio
   Dependency-free. Handles: theme toggle (persisted), mobile menu,
   scroll reveal (JS-gated, threshold 0), and active nav highlighting. */
(function () {
  "use strict";
  var root = document.documentElement;
  var body = document.body;
  root.classList.add("js");

  /* ---------- Theme ---------- */
  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  var themeBtn = document.getElementById("theme-toggle");

  function currentTheme() {
    var t = root.getAttribute("data-theme");
    return t === "light" || t === "dark" ? t : mq.matches ? "dark" : "light";
  }
  function syncThemeButton() {
    if (!themeBtn) return;
    var dark = currentTheme() === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      syncThemeButton();
    });
  }
  if (mq.addEventListener) mq.addEventListener("change", syncThemeButton);
  syncThemeButton();

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-menu");

  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    body.classList.toggle("menu-open", open);
    // The page behind the menu is inert while it is open.
    Array.prototype.forEach.call(document.querySelectorAll("main, .site-footer, .skip-link"), function (el) {
      if (open) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
    if (open) {
      var first = menu.querySelector("a");
      if (first) first.focus();
    } else if (menu.contains(document.activeElement)) {
      menuBtn.focus();
    }
  }
  function menuFocusables() {
    var header = Array.prototype.slice.call(document.querySelectorAll(".site-header a, .site-header button"));
    var links = Array.prototype.slice.call(menu.querySelectorAll("a"));
    return header.concat(links).filter(function (el) {
      return el.offsetParent !== null;
    });
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (!menu.classList.contains("open")) return;
      if (e.key === "Escape") {
        setMenu(false);
        menuBtn.focus();
        return;
      }
      if (e.key === "Tab") {
        // Keep keyboard focus cycling through the header and the open menu.
        var items = menuFocusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    var desktop = window.matchMedia("(min-width: 900px)");
    var closeOnDesktop = function (ev) {
      if (ev.matches) setMenu(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", closeOnDesktop);
  }

  /* ---------- Scroll reveal ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function show(el, delay) {
    el.style.transitionDelay = delay + "ms";
    el.classList.add("in");
    window.setTimeout(function () {
      el.style.transitionDelay = "";
      el.classList.remove("reveal");
    }, 700 + delay);
  }
  if ("IntersectionObserver" in window && items.length) {
    var io = new IntersectionObserver(
      function (entries) {
        var i = 0;
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          show(entry.target, Math.min(i, 5) * 70);
          i++;
        });
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" }
    );
    items.forEach(function (el) {
      io.observe(el);
    });
  } else {
    items.forEach(function (el) {
      show(el, 0);
    });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  var sections = navLinks
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);
  function setActive(id) {
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window && sections.length) {
    var visible = {};
    var so = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
        });
        var best = null;
        sections.forEach(function (s) {
          if (visible[s.id] && (best === null || visible[s.id] > visible[best])) best = s.id;
        });
        if (best) setActive(best);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach(function (s) {
      so.observe(s);
    });
  }
})();
