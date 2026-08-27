(function () {
  var EMPTY = 'rgb(227, 222, 213)';

  function ready(fn) {
    var t = setInterval(function () {
      var sc = document.querySelector('.pres-scroll');
      if (sc && sc.querySelectorAll('[data-waffle]').length) { clearInterval(t); fn(sc); }
    }, 120);
  }

  ready(function (sc) {
    var shown = [];

    function arm() {
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        if (shown.indexOf(el) >= 0) return;
        el.style.transition = 'opacity 900ms ease, transform 900ms ease';
        el.style.transitionDelay = (el.getAttribute('data-reveal-delay') || '0') + 'ms';
        el.style.opacity = '0';
        el.style.transform = 'translateY(26px)';
      });
    }
    arm();

    function inView(el) {
      var r = el.getBoundingClientRect(), h = window.innerHeight || sc.clientHeight;
      return r.top < h * 0.85 && r.bottom > h * 0.15;
    }

    var waffleRan = false;
    function runWaffles() {
      if (waffleRan) return;
      waffleRan = true;
      var waffles = [].map.call(document.querySelectorAll('[data-waffle]'), function (grid) {
        var cells = [].slice.call(grid.children), color = null, filled = 0;
        cells.forEach(function (c) {
          var bg = getComputedStyle(c).backgroundColor;
          if (bg !== EMPTY) { filled++; if (!color) color = bg; }
        });
        cells.forEach(function (c) { c.style.background = EMPTY; });
        return { cells: cells, color: color || '#B25444', filled: filled };
      });
      var t0 = Date.now(), dur = 1700;
      var id = setInterval(function () {
        var k = Math.min(1, (Date.now() - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        waffles.forEach(function (w) {
          var n = Math.round(w.filled * e);
          for (var i = 0; i < w.cells.length; i++) w.cells[i].style.background = i < n ? w.color : EMPTY;
        });
        if (k >= 1) clearInterval(id);
      }, 40);
    }

    setInterval(function () {
      arm();
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        if (shown.indexOf(el) < 0 && inView(el)) {
          shown.push(el);
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
      var zone = document.querySelector('[data-waffle-zone]');
      if (zone && inView(zone)) runWaffles();
    }, 180);
  });
})();
