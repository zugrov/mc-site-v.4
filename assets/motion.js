/* Линия денег, появление, шапка, пауза бегущей строки, копирование, квиз-форма. */
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function nums(d) {
    return d.match(/-?\d*\.?\d+/g).map(Number);
  }

  function rebuild(template, values) {
    var i = 0;
    return template.replace(/-?\d*\.?\d+/g, function () {
      var v = values[i++];
      return (Math.round(v * 10) / 10).toString();
    });
  }

  document.querySelectorAll("[data-morph]").forEach(function (path) {
    if (reduced) return;
    var from = path.getAttribute("data-from");
    var to = path.getAttribute("data-final");
    if (!from || !to) return;
    var a = nums(from);
    var b = nums(to);
    if (a.length !== b.length) return;
    var t0 = performance.now();
    var dur = 900;
    function frame(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var mix = a.map(function (v, i) { return v + (b[i] - v) * e; });
      path.setAttribute("d", rebuild(to, mix));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });

  if (!reduced && "IntersectionObserver" in window) {
    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    document.querySelectorAll(".reveal").forEach(function (node) { reveal.observe(node); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (node) { node.classList.add("is-visible"); });
  }

  document.querySelectorAll("[data-pause]").forEach(function (btn) {
    var ticker = btn.closest(".ticker");
    if (!ticker) return;
    btn.addEventListener("click", function () {
      var paused = ticker.classList.toggle("is-paused");
      btn.setAttribute("aria-pressed", paused ? "true" : "false");
      btn.textContent = paused ? "Пуск" : "Пауза";
    });
  });

  var header = document.querySelector("[data-header]");
  if (header) {
    var last = window.scrollY;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        header.classList.toggle("is-compact", y > 24);
        if (!reduced) header.classList.toggle("is-hidden", y > last && y > 120);
        last = y;
        ticking = false;
      });
    }, { passive: true });
  }

  var toggle = document.getElementById("menuToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-faq]").forEach(function (item) {
    var btn = item.querySelector("button");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var open = item.classList.contains("faq-item--open");
      document.querySelectorAll("[data-faq]").forEach(function (other) {
        other.classList.remove("faq-item--open");
        var b = other.querySelector("button");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("faq-item--open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  var toast = document.querySelector("[data-toast]");
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      var done = function () {
        if (!toast) return;
        toast.hidden = false;
        toast.textContent = "Скопировано";
        clearTimeout(done._t);
        done._t = setTimeout(function () { toast.hidden = true; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    });
  });

  document.querySelectorAll("[data-wizard]").forEach(function (form) {
    var next = form.querySelector("[data-wizard-next]");
    var step2 = form.querySelector("[data-wizard-step='2']");
    if (!next || !step2) return;
    next.addEventListener("click", function () {
      var ok = true;
      form.querySelectorAll("[data-wizard-step='1'] [required]").forEach(function (field) {
        if (!field.value || !field.value.trim()) {
          ok = false;
          field.setAttribute("aria-invalid", "true");
        }
      });
      if (!ok) return;
      step2.hidden = false;
      next.hidden = true;
      var focusable = step2.querySelector("select, textarea, input");
      if (focusable) focusable.focus();
    });
  });

  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var scroller = root.querySelector(".quotes");
    if (!scroller) return;
    root.querySelectorAll("[data-carousel-dir]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = Number(btn.getAttribute("data-carousel-dir"));
        scroller.scrollBy({ left: dir * 360, behavior: reduced ? "auto" : "smooth" });
      });
    });
  });

  document.querySelectorAll("[data-view-toggle]").forEach(function (bar) {
    var target = document.querySelector(bar.getAttribute("data-view-toggle"));
    if (!target) return;
    bar.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.getAttribute("data-view");
        target.classList.toggle("is-list", mode === "list");
        bar.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
      });
    });
  });

  var progress = document.querySelector("[data-reading-progress]");
  var article = document.querySelector("[data-reading]");
  if (progress && article) {
    progress.hidden = false;
    var onScroll = function () {
      var rect = article.getBoundingClientRect();
      var total = article.offsetHeight - window.innerHeight;
      var passed = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      progress.style.width = (passed / Math.max(total, 1) * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function startWaves() {
    if (reduced) return;
    if (navigator.connection && navigator.connection.saveData) return;
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return;
    if (window.matchMedia("(max-width: 900px)").matches) return;
    var canvas = document.querySelector("[data-waves]");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var running = true;
    var start = performance.now();
    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    }
    resize();
    window.addEventListener("resize", resize);
    canvas.classList.add("is-on");
    canvas.setAttribute("aria-hidden", "true");
    function draw(now) {
      if (!running) return;
      var frameStart = performance.now();
      var t = (now - start) / 1000;
      var w = canvas.width;
      var h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      var lines = w < 700 ? 48 : 80;
      for (var i = 0; i < lines; i++) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(94, 234, 212, " + (0.04 + (i % 5) * 0.015) + ")";
        for (var x = 0; x <= w; x += 8) {
          var y = h * 0.55 + Math.sin(x * 0.01 + t + i * 0.15) * (8 + i * 0.35) + (i - lines / 2) * (h / lines);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      if (performance.now() - frameStart > 12) return;
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", function () {
      running = document.visibilityState === "visible";
      if (running) requestAnimationFrame(draw);
    });
  }

  window.addEventListener("load", function () {
    var run = function () { startWaves(); };
    if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 1200 });
    else setTimeout(run, 300);
  });
})();
