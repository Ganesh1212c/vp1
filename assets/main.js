(function () {
  "use strict";

  /* ---------- Header: shadow line on scroll + mobile menu ---------- */
  var header = document.querySelector(".site-header");
  var onScroll = function () {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.textContent = open ? "Close" : "Menu";
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "Menu";
        menuBtn.focus();
      }
    });
  }

  /* ---------- Footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Gallery lightbox (native <dialog>) ---------- */
  var thumbs = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  if (thumbs.length && typeof HTMLDialogElement === "function") {
    var dlg = document.createElement("dialog");
    dlg.className = "lightbox";
    dlg.setAttribute("aria-label", "Photo viewer");
    dlg.innerHTML =
      '<img alt="" referrerpolicy="no-referrer">' +
      '<div class="lightbox__bar">' +
      '<button type="button" data-act="prev">Previous</button>' +
      '<button type="button" data-act="close">Close</button>' +
      '<button type="button" data-act="next">Next</button>' +
      "</div>";
    document.body.appendChild(dlg);
    var bigImg = dlg.querySelector("img");
    var idx = 0;

    var show = function (i) {
      idx = (i + thumbs.length) % thumbs.length;
      var t = thumbs[idx].querySelector("img");
      bigImg.src = t.currentSrc || t.src;
      bigImg.alt = t.alt;
    };

    thumbs.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        show(i);
        dlg.showModal();
      });
    });

    dlg.addEventListener("click", function (e) {
      var act = e.target.getAttribute && e.target.getAttribute("data-act");
      if (act === "close" || e.target === dlg) dlg.close();
      if (act === "next") show(idx + 1);
      if (act === "prev") show(idx - 1);
    });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* ---------- Video: load the player only when asked ---------- */
  document.querySelectorAll("[data-video]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.className = "video-frame";
      f.src = "https://www.youtube-nocookie.com/embed/" + btn.getAttribute("data-video") + "?autoplay=1&rel=0";
      f.title = btn.getAttribute("data-title") || "Company video";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      btn.replaceWith(f);
    });
  });

  /* ---------- Quote form: opens the visitor's email app, addressed to sales ---------- */
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var g = function (n) {
        var el = form.elements[n];
        return el ? el.value.trim() : "";
      };
      var lines = [
        "Name: " + g("name"),
        "Phone: " + g("phone"),
        "Email: " + g("email"),
        "Location: " + g("location"),
        "Interested in: " + g("product"),
        "",
        g("message"),
      ];
      var subject = "Quote request: " + (g("product") || "packaging");
      window.location.href =
        "mailto:sales@vettiyilpackaging.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(lines.join("\n"));
    });
  }
})();
