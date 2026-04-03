// ── 斑驳光影：per-theme dappled light ──
// 设计原则：大面积明暗区域交替，不画具体的枝条/叶子
// 暗区 = 树冠整体遮挡；亮区 = 光穿过间隙
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

  // ── 大面积暗区（模拟树冠整体遮挡）──
  // 用大椭圆，高模糊，形成柔和的明暗分区
  function shadowMass(layer, cx, cy, w, h, rot, op) {
    mk(layer, 'dappled-mass',
      'width:' + w + 'vw;height:' + h + 'vw;left:' + cx + '%;top:' + cy + '%;opacity:' + op.toFixed(2) + ';transform:rotate(' + rot + 'deg)');
  }

  // ── 亮光斑（光穿过叶隙）──
  function lightSpot(layer, cx, cy, size, op) {
    mk(layer, 'dappled-bokeh',
      'width:' + size + 'vw;height:' + size + 'vw;left:' + cx + '%;top:' + cy + '%;opacity:' + op.toFixed(2));
  }

  // ── 斜向光条 ──
  function lightRays(layer, count, angle, widthRange, lengthRange, opRange) {
    for (var i = 0; i < count; i++) {
      var w = widthRange[0] + R() * (widthRange[1] - widthRange[0]);
      var len = lengthRange[0] + R() * (lengthRange[1] - lengthRange[0]);
      var x = -15 + R() * 75;
      var y = -25 + R() * 65;
      var a = angle + R() * 12 - 6;
      mk(layer, 'dappled-light',
        'width:' + len + '%;height:' + w + 'vw;left:' + x + '%;top:' + y + '%;opacity:' + (opRange[0] + R() * (opRange[1] - opRange[0])).toFixed(2) + ';--light-dir:90deg;transform:rotate(' + a + 'deg);transform-origin:center center');
    }
  }

  // ═══ default: 树冠光影 ═══
  // 大面积暗区（树冠遮挡）+ 亮光斑（叶隙透光）
  function generateCanopy(sF, bF) {
    var angle = -30;
    // ── 暗区：3-4 块大的不规则遮挡 ──
    shadowMass(sF, 5, -15, 55, 40, angle + R()*10, 0.7 + R()*0.25);
    shadowMass(sF, 35, 10, 50, 35, angle - 5 + R()*8, 0.6 + R()*0.25);
    shadowMass(sF, -5, 30, 45, 38, angle + R()*12, 0.55 + R()*0.2);
    shadowMass(sF, 50, 40, 40, 30, angle + 5 + R()*8, 0.5 + R()*0.2);
    // 中等暗块填充间隙
    for (var i = 0; i < 8; i++) {
      var w = 15 + R() * 25, h = 12 + R() * 20;
      shadowMass(sF, R()*90, R()*80, w, h, angle + R()*20 - 10, 0.35 + R()*0.25);
    }

    // ── 亮区：光穿过叶隙的圆形光斑 ──
    for (i = 0; i < 14; i++) {
      var s = 8 + R() * 16;
      lightSpot(bF, 15 + R()*75, R()*80, s, 0.5 + R()*0.45);
    }
    // 右上方向更亮（光源方向）
    for (i = 0; i < 6; i++) {
      lightSpot(bF, 50 + R()*45, R()*40, 10 + R()*14, 0.6 + R()*0.35);
    }
  }

  // ═══ warm: 暖光条穿过树冠 ═══
  function generateBlinds(sF, bF) {
    var angle = -30;
    // ── 暗区：树冠遮挡（偏右上，像窗外的树）──
    shadowMass(sF, 40, -10, 60, 45, angle + R()*8, 0.7 + R()*0.25);
    shadowMass(sF, 55, 20, 50, 35, angle - 3 + R()*6, 0.6 + R()*0.2);
    shadowMass(sF, 30, 40, 45, 30, angle + R()*10, 0.5 + R()*0.2);
    // 中等暗块
    for (var i = 0; i < 6; i++) {
      var w = 12 + R() * 22, h = 10 + R() * 18;
      shadowMass(sF, 30 + R()*60, R()*70, w, h, angle + R()*16 - 8, 0.35 + R()*0.25);
    }

    // ── 亮区：暖色斜光条 + 光斑 ──
    lightRays(bF, 4, angle, [6, 13], [95, 140], [0.6, 0.9]);
    for (i = 0; i < 10; i++) {
      lightSpot(bF, 10 + R()*80, R()*85, 6 + R()*12, 0.5 + R()*0.4);
    }
  }

  // ═══ sky: 窗光穿过 ═══
  function generateFrenchWindow(sF, bF) {
    var angle = -30, i;
    // ── 暗区：轻度遮挡（窗框 + 窗外树影）──
    // 窗框用 bar
    var vx = [26, 52, 78];
    for (i = 0; i < 3; i++) {
      mk(sF, 'dappled-bar',
        'left:' + (vx[i] + R()*2 - 1) + '%;top:-5%;width:' + (0.7 + R()*0.3) + 'vw;height:110%;--bar-dir:180deg;opacity:' + (0.3 + R()*0.2).toFixed(2) + ';transform:rotate(-2deg)');
    }
    var hy = [28, 54, 78];
    for (i = 0; i < 3; i++) {
      mk(sF, 'dappled-bar',
        'top:' + (hy[i] + R()*2) + '%;left:-5%;height:' + (0.5 + R()*0.25) + 'vw;width:110%;--bar-dir:90deg;opacity:' + (0.25 + R()*0.2).toFixed(2) + ';transform:rotate(-4deg)');
    }
    // 窗边暗区（树影轮廓）
    shadowMass(sF, -5, 5, 30, 50, angle + R()*8, 0.3 + R()*0.2);
    shadowMass(sF, 75, 10, 30, 55, angle - 3 + R()*6, 0.3 + R()*0.2);

    // ── 亮区：大面积亮白光条 ──
    lightRays(bF, 5, angle, [9, 18], [100, 150], [0.65, 0.95]);
    for (i = 0; i < 8; i++) {
      lightSpot(bF, 10 + R()*80, R()*85, 7 + R()*14, 0.5 + R()*0.4);
    }
  }

  // ═══ night: 月光散射 ═══
  function generateMoonlight(sF, bF) {
    var angle = -25;
    // ── 暗区：大面积柔和遮挡 ──
    shadowMass(sF, 10, 0, 50, 40, angle + R()*10, 0.25 + R()*0.15);
    shadowMass(sF, 40, 25, 45, 35, angle + R()*8, 0.2 + R()*0.15);
    shadowMass(sF, 20, 50, 40, 30, angle + R()*10, 0.18 + R()*0.12);
    for (var i = 0; i < 5; i++) {
      var w = 15 + R()*20, h = 12 + R()*18;
      shadowMass(sF, R()*85, R()*75, w, h, angle + R()*16 - 8, 0.12 + R()*0.15);
    }

    // ── 亮区：柔和冷色大光斑 ──
    for (i = 0; i < 5; i++) {
      lightSpot(bF, 10 + R()*70, 5 + R()*65, 18 + R()*20, 0.35 + R()*0.3);
    }
  }

  // ═══ spring: 散射光斑 + 细碎遮挡 ═══
  function generateFineLeaves(sF, bF) {
    var angle = -28;
    // ── 暗区：多个中等遮挡（比 default 更碎）──
    for (var i = 0; i < 10; i++) {
      var w = 12 + R()*20, h = 10 + R()*16;
      shadowMass(sF, R()*95, R()*85, w, h, angle + R()*24 - 12, 0.25 + R()*0.2);
    }
    // 几块稍大的
    shadowMass(sF, 15, 10, 35, 28, angle + R()*10, 0.3 + R()*0.2);
    shadowMass(sF, 50, 30, 30, 25, angle + R()*8, 0.28 + R()*0.18);

    // ── 亮区：大量暖色散射光斑 ──
    for (i = 0; i < 22; i++) {
      lightSpot(bF, R()*100, R()*95, 5 + R()*13, 0.5 + R()*0.45);
    }
  }

  // ── Dispatch by theme ──
  var style = document.body.dataset.style || 'default';
  switch (style) {
    case 'warm':   generateBlinds(sL, bL); break;
    case 'sky':    generateFrenchWindow(sL, bL); break;
    case 'night':  generateMoonlight(sL, bL); break;
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
