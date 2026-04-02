// ── 斑驳光影：per-theme dappled light ──
// All shadows cast by oblique sunlight (upper-right → lower-left, ~-30deg)
(function () {
  if (document.body.dataset.dappled === 'off') return;
  var sL = document.getElementById('dappled-shadows');
  var bL = document.getElementById('dappled-bokeh');
  if (!sL || !bL) return;

  var seed = 42;
  function R() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  function mk(parent, cls, css) {
    var el = document.createElement('div');
    el.className = cls;
    el.style.cssText = css;
    parent.appendChild(el);
  }

  function bokeh(layer, count, xBias, yBias) {
    for (var i = 0; i < count; i++) {
      var s = 6 + R() * 18;
      var x = xBias + R() * (100 - xBias);
      var y = R() * yBias;
      if (R() > 0.6) { x = R() * 100; y = R() * 90; }
      mk(layer, 'dappled-bokeh',
        'width:' + s + 'vw;height:' + s + 'vw;left:' + x + '%;top:' + y + '%;opacity:' + (0.45 + R() * 0.5).toFixed(2));
    }
  }

  // ═══ default: Tree canopy — branches + elliptical leaf clusters ═══
  function generateCanopy(sF, bF) {
    var angle = -30, i;
    // Branches: 5-7 long diagonal strips
    for (i = 0; i < 5 + Math.floor(R() * 3); i++) {
      var bw = 35 + R() * 45, bh = 0.5 + R() * 1.4;
      var bx = 10 + R() * 50, by = -5 + R() * 55;
      var br = angle + R() * 20 - 10;
      mk(sF, 'dappled-branch',
        'width:' + bw + 'vw;height:' + bh + 'vw;left:' + bx + '%;top:' + by + '%;opacity:' + (0.55 + R() * 0.4).toFixed(2) + ';transform:rotate(' + br + 'deg)');
    }
    // Leaf clusters: 35 elliptical shadows, all rotated along sun angle
    for (i = 0; i < 35; i++) {
      var lh = 3 + R() * 9, lw = lh * (1.3 + R() * 1.3);
      var lx = R() * 110 - 5, ly = R() * 110 - 5;
      if (R() > 0.4) { lx = 10 + R() * 75; ly = 5 + R() * 65; }
      var lr = angle + R() * 30 - 15;
      mk(sF, 'dappled-shadow',
        'width:' + lw + 'vw;height:' + lh + 'vw;left:' + lx + '%;top:' + ly + '%;opacity:' + (0.4 + R() * 0.5).toFixed(2) + ';transform:rotate(' + lr + 'deg)');
    }
    bokeh(bF, 14, 30, 70);
  }

  // ═══ warm: Blinds (百叶窗) — repeating diagonal light stripes ═══
  // Like reference photo: entire area in shadow, diagonal light bands cut through
  function generateBlinds(sF, bF) {
    // One CSS repeating-linear-gradient element covers the viewport
    mk(sF, 'dappled-blinds',
      '--blinds-angle:-32deg;--blinds-gap:22px;--blinds-width:12px;opacity:0.85');
    // Vertical window frame bar
    mk(sF, 'dappled-bar',
      'left:62%;top:-5%;width:1.6vw;height:110%;--bar-dir:180deg;opacity:0.7;transform:rotate(-2deg)');
    // Leaf shadows on right side (foliage outside window)
    for (var i = 0; i < 12; i++) {
      var lh = 2.5 + R() * 6, lw = lh * (1.2 + R() * 1);
      var lx = 45 + R() * 55, ly = R() * 80;
      mk(sF, 'dappled-shadow',
        'width:' + lw + 'vw;height:' + lh + 'vw;left:' + lx + '%;top:' + ly + '%;opacity:' + (0.3 + R() * 0.35).toFixed(2) + ';transform:rotate(' + (-30 + R() * 20 - 10) + 'deg)');
    }
    bokeh(bF, 10, 20, 85);
  }

  // ═══ sky: French window (法式高窗) — grid bars, oblique projection ═══
  function generateFrenchWindow(sF, bF) {
    var i;
    // 3 vertical bars — slightly tilted by oblique sun
    var vx = [24, 50, 76];
    for (i = 0; i < 3; i++) {
      mk(sF, 'dappled-bar',
        'left:' + (vx[i] + R() * 3 - 1.5) + '%;top:-5%;width:' + (1.0 + R() * 0.5) + 'vw;height:110%;--bar-dir:180deg;opacity:' + (0.6 + R() * 0.3).toFixed(2) + ';transform:rotate(-2deg)');
    }
    // 3 horizontal bars — angled by oblique sun projection
    var hy = [25, 50, 75];
    for (i = 0; i < 3; i++) {
      mk(sF, 'dappled-bar',
        'top:' + (hy[i] + R() * 3) + '%;left:-5%;height:' + (0.8 + R() * 0.4) + 'vw;width:110%;--bar-dir:90deg;opacity:' + (0.5 + R() * 0.3).toFixed(2) + ';transform:rotate(-4deg)');
    }
    // Sill at bottom
    mk(sF, 'dappled-bar',
      'bottom:6%;left:-5%;height:2.5vw;width:110%;--bar-dir:90deg;opacity:0.45;transform:rotate(-3deg)');
    // Leaf shadows at edges (foliage outside)
    for (i = 0; i < 10; i++) {
      var fx = R() > 0.5 ? R() * 20 : 80 + R() * 20;
      var fs = 2.5 + R() * 5;
      mk(sF, 'dappled-shadow',
        'width:' + (fs * 1.3) + 'vw;height:' + fs + 'vw;left:' + fx + '%;top:' + (R() * 95) + '%;opacity:' + (0.35 + R() * 0.3).toFixed(2) + ';transform:rotate(' + (-35 + R() * 20) + 'deg)');
    }
    bokeh(bF, 16, 15, 85);
  }

  // ═══ night: Cross-pane window (十字窗) — moonlight, oblique cross ═══
  function generateCrossPane(sF, bF) {
    // Vertical bar — slightly tilted
    mk(sF, 'dappled-bar',
      'left:' + (44 + R() * 10) + '%;top:-5%;width:' + (2.2 + R() * 1) + 'vw;height:110%;--bar-dir:180deg;opacity:' + (0.65 + R() * 0.2).toFixed(2) + ';transform:rotate(-2deg)');
    // Horizontal bar — angled by oblique projection
    mk(sF, 'dappled-bar',
      'top:' + (34 + R() * 8) + '%;left:-5%;height:' + (1.8 + R() * 0.8) + 'vw;width:110%;--bar-dir:90deg;opacity:' + (0.6 + R() * 0.2).toFixed(2) + ';transform:rotate(-3deg)');
    // Faint frame edges
    mk(sF, 'dappled-bar', 'top:-2%;left:-5%;height:1.2vw;width:110%;--bar-dir:90deg;opacity:0.25');
    mk(sF, 'dappled-bar', 'bottom:4%;left:-5%;height:1.2vw;width:110%;--bar-dir:90deg;opacity:0.2');
    // Subtle ambient
    for (var i = 0; i < 6; i++) {
      var as = 10 + R() * 16;
      mk(sF, 'dappled-shadow',
        'width:' + as + 'vw;height:' + as + 'vw;left:' + (R() * 100) + '%;top:' + (R() * 100) + '%;opacity:' + (0.1 + R() * 0.15).toFixed(2));
    }
    bokeh(bF, 6, 20, 80);
  }

  // ═══ spring: Fine leaves (细碎叶影) — dense, oblique sun angle ═══
  function generateFineLeaves(sF, bF) {
    var angle = -28, i;
    // 3 thin branches
    for (i = 0; i < 3; i++) {
      var bw = 25 + R() * 35, bh = 0.3 + R() * 0.6;
      mk(sF, 'dappled-branch',
        'width:' + bw + 'vw;height:' + bh + 'vw;left:' + (18 + R() * 50) + '%;top:' + (3 + R() * 45) + '%;opacity:' + (0.4 + R() * 0.3).toFixed(2) + ';transform:rotate(' + (angle + R() * 16 - 8) + 'deg)');
    }
    // 55 small leaf fragments — all following oblique sun angle
    for (i = 0; i < 55; i++) {
      var lh = 1.5 + R() * 4, lw = lh * (1.1 + R() * 0.8);
      var lx = R() * 110 - 5, ly = R() * 110 - 5;
      if (R() > 0.35) { lx = 5 + R() * 88; ly = 2 + R() * 78; }
      mk(sF, 'dappled-shadow',
        'width:' + lw + 'vw;height:' + lh + 'vw;left:' + lx + '%;top:' + ly + '%;opacity:' + (0.3 + R() * 0.45).toFixed(2) + ';transform:rotate(' + (angle + R() * 36 - 18) + 'deg)');
    }
    bokeh(bF, 20, 15, 85);
  }

  // ── Dispatch by theme ──
  var style = document.body.dataset.style || 'default';
  switch (style) {
    case 'warm':   generateBlinds(sL, bL); break;
    case 'sky':    generateFrenchWindow(sL, bL); break;
    case 'night':  generateCrossPane(sL, bL); break;
    case 'spring': generateFineLeaves(sL, bL); break;
    default:       generateCanopy(sL, bL); break;
  }
})();

// ── 侧边栏：信笺索引 ──
const toggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

function openSidebar() {
  sidebar.classList.add('is-open');
  overlay.classList.add('is-visible');
  toggle.classList.add('is-active');
  toggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  sidebar.classList.remove('is-open');
  overlay.classList.remove('is-visible');
  toggle.classList.remove('is-active');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (toggle && sidebar && overlay) {
  toggle.addEventListener('click', () => {
    sidebar.classList.contains('is-open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);
}

// ── 侧边栏：年份折叠 ──
document.querySelectorAll('.year-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const list = btn.nextElementSibling;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    list.hidden = expanded;
  });
});
