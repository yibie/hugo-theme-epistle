// ── 斑驳叶影（Dappled Shadows）：SVG 渲染 ──
// 参照真实叶影照片提炼的规律：
//   1. 主体是叶片剪影：尖椭圆叶沿细梗成簇，自画面边缘垂入，中央留白
//   2. 多层焦平面：远层大叶团重糊 → 中层叶簇 → 少量近层清晰叶尖
//   3. 低对比灰影压在亮底上；光池是成串的圆形 bokeh 光斑（叶隙太阳像）
//   4. 风 = 整体慢摇 + 叶枝独立摆动（阵风节奏），噪声位移仅做静态的形状有机化
// 五个主题各有场景：
//   default 叶影浮动 / warm 夕照叶影 / sky 云影悠悠 / night 月下梅影 / spring 春柳拂风
(function () {
  if (document.body.dataset.dappled === 'off') return;
  var sL = document.getElementById('dappled-shadows');
  var bL = document.getElementById('dappled-bokeh');
  if (!sL || !bL) return;

  var seed = 42;
  function R() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function rr(a, b) { return a + R() * (b - a); }

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = window.matchMedia('(max-width: 768px)').matches;

  var NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // viewBox 160×100，slice 裁切，坐标 ≈ 视口百分比
  var VW = 160, VH = 100;
  var svg = el('svg', {
    'class': 'dappled-svg',
    viewBox: '0 0 ' + VW + ' ' + VH,
    preserveAspectRatio: 'xMidYMid slice'
  });

  // ── 滤镜：静态噪声位移（形状有机化）+ 三档焦平面模糊 ──
  var defs = el('defs', {}, svg);
  var windF = el('filter', { id: 'dw-wind', x: '-15%', y: '-15%', width: '130%', height: '130%' }, defs);
  el('feTurbulence', {
    type: 'fractalNoise', baseFrequency: '0.012 0.009', numOctaves: '2', seed: '3', result: 'noise'
  }, windF);
  el('feDisplacementMap', {
    'in': 'SourceGraphic', in2: 'noise', scale: '8', xChannelSelector: 'R', yChannelSelector: 'G'
  }, windF);
  // filter region 必须盖满整个画布（userSpaceOnUse）：
  // 若按元素 bbox 百分比留边，重模糊的雾晕会被区域边界直切，露出方形色块
  function blurFilter(id, dev) {
    var f = el('filter', {
      id: id, filterUnits: 'userSpaceOnUse',
      x: '-40', y: '-40', width: (VW + 80) + '', height: (VH + 80) + ''
    }, defs);
    el('feGaussianBlur', { stdDeviation: dev }, f);
  }
  blurFilter('dw-sharp', '0.22'); // 近焦：锐利枝影
  blurFilter('dw-mid', '0.7');    // 中焦
  blurFilter('dw-soft', '1.5');   // 远焦：糊而有形（再重就成雾斑了）
  blurFilter('dw-cloud', '1.1');  // 云：轮廓可辨的软边

  function sway(gEl, ox, oy, name, dur) {
    if (reducedMotion) return;
    gEl.style.transformBox = 'view-box';
    gEl.style.transformOrigin = ox.toFixed(0) + 'px ' + oy.toFixed(0) + 'px';
    gEl.style.animation = name + ' ' + dur.toFixed(1) + 's ease-in-out -' + (R() * dur).toFixed(1) + 's infinite';
  }

  // 场景主色：默认为影色；night 改用月光色"描枝"（暗底上深影不可读）
  var sceneColor = 'var(--dappled-shadow-color)';

  function strokeGroup(op, filter) {
    return el('g', {
      fill: 'none',
      'fill-opacity': op.toFixed(2),
      stroke: sceneColor,
      'stroke-linecap': 'round',
      'stroke-opacity': op.toFixed(2),
      filter: 'url(#' + filter + ')'
    }, svg);
  }

  // 半影重影：克隆整组，偏移少许，重模糊低透明——远枝投影
  function ghost(g, dx, dy, op) {
    var c = g.cloneNode(true);
    c.setAttribute('stroke-opacity', op.toFixed(2));
    c.setAttribute('filter', 'url(#dw-soft)');
    c.setAttribute('transform', 'translate(' + dx + ' ' + dy + ')');
    svg.appendChild(c);
  }

  // 全画布淡影铺底：光池在它上面才有"透光"感
  function shadeWash(op) {
    el('rect', {
      x: '-12', y: '-12', width: (VW + 24) + '', height: (VH + 24) + '',
      fill: 'var(--dappled-shadow-color)', 'fill-opacity': op.toFixed(2)
    }, svg);
  }

  function mkSpot(cx, cy, size, op) {
    var d = document.createElement('div');
    d.className = 'dappled-bokeh';
    d.style.cssText = 'width:' + size + 'vw;height:' + size + 'vw;left:' + cx + '%;top:' + cy + '%;opacity:' + op.toFixed(2);
    bL.appendChild(d);
  }

  // 光池安置在叶团旁的"叶隙"处（光影互相咬合，而非随机散布）
  // 仅在中深色底上启用：近白底上光斑无法"发亮"，只会显成污渍
  function glowNear(cx, cy, op1, op2) {
    if (!P.glow) return;
    var n = 2 + Math.floor(R() * 2);
    for (var i = 0; i < n; i++) {
      mkSpot((cx + rr(-14, 14)) * 100 / VW, cy + rr(-4, 16), rr(5, 10), rr(op1, op2));
    }
  }

  // ── 曲枝：二次贝塞尔递归，逐级变细（乔木）──
  function branch(g, x, y, ang, len, w, depth, maxDepth) {
    var nx = x + Math.cos(ang) * len;
    var ny = y + Math.sin(ang) * len;
    var curv = (R() - 0.5) * len * 0.55;
    var mx = x + Math.cos(ang) * len * 0.5 - Math.sin(ang) * curv;
    var my = y + Math.sin(ang) * len * 0.5 + Math.cos(ang) * curv;
    el('path', {
      d: 'M' + x.toFixed(1) + ' ' + y.toFixed(1) +
         'Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + nx.toFixed(1) + ' ' + ny.toFixed(1),
      'stroke-width': w.toFixed(2)
    }, g);

    if (depth >= maxDepth) return { x: nx, y: ny, ang: ang };

    var kids = depth < 2 ? 2 : (R() < 0.6 ? 2 : 1);
    for (var k = 0; k < kids; k++) {
      var spread = (k % 2 === 0 ? 1 : -1) * rr(0.18, 0.5) + (R() - 0.5) * 0.35;
      branch(g, nx, ny, ang + spread, len * rr(0.62, 0.82), w * rr(0.6, 0.72), depth + 1, maxDepth);
    }
    if (depth >= 1 && R() < 0.55) {
      var t = rr(0.35, 0.75);
      branch(g, x + (nx - x) * t, y + (ny - y) * t,
        ang + (R() < 0.5 ? -1 : 1) * rr(0.5, 0.95), len * rr(0.3, 0.5), w * 0.45, maxDepth, maxDepth);
    }
    return { x: nx, y: ny, ang: ang };
  }

  // ── 一棵乔木：根部 + 数条一级枝（各自独立摆动）──
  function tree(opts) {
    var g = strokeGroup(opts.op, opts.filter || 'dw-sharp');
    var arms = opts.arms || 3;
    for (var a = 0; a < arms; a++) {
      var ga = el('g', {}, g);
      var ang = opts.ang + (a - (arms - 1) / 2) * rr(0.28, 0.42) + (R() - 0.5) * 0.2;
      branch(ga, opts.x, opts.y, ang, opts.len * rr(0.85, 1.1), opts.w, 0, opts.depth);
      sway(ga, opts.x, opts.y, 'branchSway', rr(5, 9));
    }
    sway(g, opts.x, opts.y, 'treeSway', rr(10, 16));
    return g;
  }

  // ── 尖椭圆叶片：叶影的基本单元（两侧宽度不对称，避免图形感）──
  function leafShape(g, x, y, ang, len, wid) {
    var tx = x + Math.cos(ang) * len, ty = y + Math.sin(ang) * len;
    var mx = (x + tx) / 2, my = (y + ty) / 2;
    var w1 = wid * rr(0.7, 1.15), w2 = wid * rr(0.7, 1.15);
    var ux = -Math.sin(ang), uy = Math.cos(ang);
    el('path', {
      d: 'M' + x.toFixed(1) + ' ' + y.toFixed(1) +
         'Q' + (mx + ux * w1).toFixed(1) + ' ' + (my + uy * w1).toFixed(1) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1) +
         'Q' + (mx - ux * w2).toFixed(1) + ' ' + (my - uy * w2).toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + 'Z',
      fill: sceneColor, stroke: 'none'
    }, g);
  }

  // ── 叶枝：细梗蜿蜒，叶片密集地交替两侧展开 ──
  function sprig(g, x, y, ang, segs, scale) {
    var gs = el('g', {}, g);
    var px = x, py = y, side = R() < 0.5 ? 1 : -1;
    for (var i = 0; i < segs; i++) {
      ang += rr(-0.18, 0.18);
      var len = rr(2.4, 3.6) * scale;
      var nx = px + Math.cos(ang) * len, ny = py + Math.sin(ang) * len;
      el('path', {
        d: 'M' + px.toFixed(1) + ' ' + py.toFixed(1) + 'L' + nx.toFixed(1) + ' ' + ny.toFixed(1),
        'stroke-width': (0.22 * scale).toFixed(2),
        stroke: sceneColor, fill: 'none'
      }, gs);
      // 节上叶片：大小错落，常两侧对生
      var la = ang + side * rr(0.55, 1.05);
      var ll = rr(3, 6) * scale * rr(0.75, 1.3);
      leafShape(gs, nx, ny, la, ll, ll * rr(0.26, 0.36));
      if (R() < 0.55) {
        var lb = ang - side * rr(0.55, 1.05);
        var l2 = rr(2.8, 5.2) * scale;
        leafShape(gs, nx, ny, lb, l2, l2 * rr(0.26, 0.36));
      }
      side = -side;
      px = nx; py = ny;
    }
    leafShape(gs, px, py, ang + rr(-0.2, 0.2), rr(3.5, 5.5) * scale, rr(1.1, 1.6) * scale);
    sway(gs, x, y, 'branchSway', rr(3.2, 6));
    return gs;
  }

  // ── 叶团：一条长弧形主梗，沿途密布叶枝与散叶——真实叶影总是成团出现 ──
  function clump(cx, cy, mainAng, size, op, filter) {
    var g = el('g', {
      fill: sceneColor, 'fill-opacity': op.toFixed(2),
      stroke: 'none', 'stroke-opacity': (op * 0.8).toFixed(2),
      filter: 'url(#' + filter + ')'
    }, svg);
    // 重糊的远层叶团必须"疏叶大叶"：叶片密了模糊后会融并成疙瘩状色斑
    var sparse = filter === 'dw-soft';
    var px = cx, py = cy, ang = mainAng;
    var nodes = (sparse ? 3 : 4) + Math.floor(R() * 2);
    for (var i = 0; i < nodes; i++) {
      ang += rr(-0.22, 0.28);
      var len = rr(sparse ? 7 : 5, sparse ? 11 : 8) * size;
      var nx = px + Math.cos(ang) * len, ny = py + Math.sin(ang) * len;
      el('path', {
        d: 'M' + px.toFixed(1) + ' ' + py.toFixed(1) + 'L' + nx.toFixed(1) + ' ' + ny.toFixed(1),
        'stroke-width': (0.3 * size).toFixed(2),
        stroke: sceneColor, fill: 'none'
      }, g);
      if (sparse) {
        // 疏叶：每节只散 2-3 枚大叶，彼此拉开
        var big = 2 + Math.floor(R() * 2);
        for (var b = 0; b < big; b++) {
          var bl = rr(4.5, 7) * size;
          leafShape(g, nx + rr(-6, 6) * size, ny + rr(-4, 6) * size, rr(0, Math.PI * 2), bl, bl * rr(0.3, 0.4));
        }
      } else {
        var sprigs = 1 + (R() < 0.6 ? 1 : 0);
        for (var s = 0; s < sprigs; s++) {
          sprig(g, nx, ny, ang + (R() < 0.5 ? -1 : 1) * rr(0.4, 1.1), 3 + Math.floor(R() * 3), size * rr(0.75, 1.05));
        }
        for (var l = 0; l < 2; l++) {
          if (R() < 0.7) {
            var ll = rr(3, 5.5) * size;
            leafShape(g, nx + rr(-3, 3) * size, ny + rr(-2, 3) * size, rr(0, Math.PI * 2), ll, ll * rr(0.26, 0.36));
          }
        }
      }
      px = nx; py = ny;
    }
    sway(g, cx, cy, 'treeSway', rr(9, 15));
    return g;
  }

  // ── 白云：经典积云轮廓——宽平的底 + 顶部一排大小渐变的圆拱（sky 用）──
  // 天蓝底上云必须是亮色；深色团块会读作污渍
  function cloud(cx, cy, size, op) {
    var g = el('g', {
      fill: 'rgba(255, 255, 255, 0.96)', 'fill-opacity': op.toFixed(2), stroke: 'none',
      filter: 'url(#dw-cloud)'
    }, svg);
    // 云底淡影：一道体积感
    el('ellipse', {
      cx: (cx + size * 0.12).toFixed(1), cy: (cy + size * rr(0.16, 0.24)).toFixed(1),
      rx: (size * 0.85).toFixed(1), ry: (size * 0.2).toFixed(1),
      fill: 'var(--dappled-shadow-color)', 'fill-opacity': '0.45'
    }, g);
    // 平底
    var baseRy = size * rr(0.3, 0.38);
    el('ellipse', {
      cx: cx.toFixed(1), cy: cy.toFixed(1),
      rx: size.toFixed(1), ry: baseRy.toFixed(1)
    }, g);
    // 顶部圆拱：中间最大，向两侧递减
    var domes = 3 + Math.floor(R() * 3);
    for (var i = 0; i < domes; i++) {
      var t = domes === 1 ? 0 : i / (domes - 1) - 0.5;      // -0.5..0.5
      var r = size * (0.5 - Math.abs(t) * 0.42) * rr(0.85, 1.1);
      el('circle', {
        cx: (cx + t * size * rr(1.2, 1.5)).toFixed(1),
        cy: (cy - baseRy * 0.5 - r * rr(0.35, 0.6)).toFixed(1),
        r: r.toFixed(1)
      }, g);
    }
    if (!reducedMotion) {
      g.style.transformBox = 'view-box';
      var dur = rr(38, 70);
      g.style.animation = 'cloudDrift ' + dur.toFixed(0) + 's ease-in-out -' + (R() * dur).toFixed(0) + 's infinite alternate';
    }
    return g;
  }


  // ── 梅：曲折虬枝（硬折角）+ 梢头花簇 ──
  function plumBranch(g, x, y, ang, len, w, depth, maxDepth) {
    var nx = x + Math.cos(ang) * len;
    var ny = y + Math.sin(ang) * len;
    el('path', {
      d: 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'L' + nx.toFixed(1) + ' ' + ny.toFixed(1),
      'stroke-width': w.toFixed(2)
    }, g);
    // 花簇：梢头必开，中途偶开
    if (depth >= maxDepth || (depth >= 2 && R() < 0.25)) {
      var gb = el('g', { fill: sceneColor, 'fill-opacity': '0.32', stroke: 'none' }, g);
      var petals = 4 + Math.floor(R() * 3);
      for (var p = 0; p < petals; p++) {
        var pa = rr(0, Math.PI * 2), pd = rr(0.6, 1.2);
        el('circle', {
          cx: (nx + Math.cos(pa) * pd).toFixed(1), cy: (ny + Math.sin(pa) * pd).toFixed(1),
          r: rr(0.4, 0.75).toFixed(2)
        }, gb);
      }
    }
    if (depth >= maxDepth) return;
    var kids = R() < 0.55 ? 2 : 1;
    for (var k = 0; k < kids; k++) {
      // 硬折角是梅枝的辨识特征
      var kink = (k % 2 === 0 ? 1 : -1) * rr(0.35, 0.85);
      plumBranch(g, nx, ny, ang + kink, len * rr(0.6, 0.85), w * 0.7, depth + 1, maxDepth);
    }
  }

  function plumTree(opts) {
    var g = strokeGroup(opts.op, opts.filter);
    var arms = opts.arms || 2;
    for (var a = 0; a < arms; a++) {
      var ga = el('g', {}, g);
      plumBranch(ga, opts.x, opts.y, opts.ang + (a - (arms - 1) / 2) * rr(0.3, 0.5), rr(9, 13), 1.1, 0, opts.depth);
      sway(ga, opts.x, opts.y, 'branchSway', rr(6, 10));
    }
    sway(g, opts.x, opts.y, 'treeSway', rr(11, 17));
    return g;
  }

  // ── 柳：顶部垂下的柔条 + 沿途细叶 ──
  function willowCanopy(ax, ay, strands, op, filter) {
    var g = strokeGroup(op, filter);
    for (var s = 0; s < strands; s++) {
      var gs = el('g', {}, g);
      var ang = Math.PI / 2 + rr(-0.25, 0.25);
      var px = ax + rr(-4, 4), py = ay;
      var w = rr(0.5, 0.7);
      var segs = 7, side = R() < 0.5 ? 1 : -1;
      for (var i = 0; i < segs; i++) {
        var len = rr(8, 11);
        // 逐段向垂直回摆，端部微曲
        ang += (Math.PI / 2 - ang) * 0.3 + rr(-0.06, 0.1);
        var nx = px + Math.cos(ang) * len, ny = py + Math.sin(ang) * len;
        var mx = (px + nx) / 2 - Math.sin(ang) * rr(-1, 1);
        var my = (py + ny) / 2 + Math.cos(ang) * rr(-1, 1);
        el('path', {
          d: 'M' + px.toFixed(1) + ' ' + py.toFixed(1) +
             'Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + nx.toFixed(1) + ' ' + ny.toFixed(1),
          'stroke-width': w.toFixed(2)
        }, gs);
        // 柳叶：狭长尖椭圆，交替两侧，偶发对生
        var la = ang + side * rr(0.5, 1.0);
        var ll = rr(2.4, 3.8);
        leafShape(gs, nx, ny, la, ll, ll * 0.18);
        if (R() < 0.45) {
          var lb = ang - side * rr(0.5, 1.0);
          leafShape(gs, nx, ny, lb, rr(2.2, 3.4), rr(0.4, 0.62));
        }
        side = -side;
        px = nx; py = ny; w *= 0.92;
      }
      sway(gs, ax, ay, 'strandSway', rr(4.5, 7.5));
    }
    sway(g, ax, ay, 'treeSway', rr(9, 14));
    return g;
  }

  // ═══ 场景 ═══

  // default 白纸蓝墨 → 叶影浮动：叶团从四角/边缘探入，团内密集重叠、团间大片留白
  // （远层大团重糊 → 中层主团 → 一小簇近焦叶尖）
  function sceneFoliage(P) {
    shadeWash(0.06);
    // 远层：两大团，重糊
    clump(rr(-6, 8), rr(-8, 2), rr(0.5, 0.9), rr(1.5, 1.8), P.op2 * 0.9, 'dw-soft');
    clump(VW * rr(0.72, 0.85), rr(-10, -2), rr(2.2, 2.7), rr(1.5, 1.8), P.op2 * 0.85, 'dw-soft');
    // 中层：主团——右上、左缘（光池贴着这些叶团的叶隙）
    var a1 = [VW * rr(0.62, 0.75), rr(-8, 0)];
    clump(a1[0], a1[1], rr(2.1, 2.6), rr(1, 1.2), P.op1 * 0.85, 'dw-mid');
    glowNear(a1[0] - 8, a1[1] + 14, P.spotOp[0], P.spotOp[1]);
    var a2 = [rr(-8, -2), rr(20, 40)];
    clump(a2[0], a2[1], rr(-0.3, 0.25), rr(0.95, 1.15), P.op1 * 0.8, 'dw-mid');
    glowNear(a2[0] + 12, a2[1] + 6, P.spotOp[0], P.spotOp[1]);
    if (!mobile) {
      var a3 = [VW * rr(0.9, 1), rr(25, 45)];
      clump(a3[0], a3[1], rr(2.6, 3.1), rr(0.9, 1.1), P.op1 * 0.75, 'dw-mid');
      glowNear(a3[0] - 10, a3[1] + 8, P.spotOp[0], P.spotOp[1]);
    }
    // 补几团：顶部中段与下方两角，让叶影更满
    clump(VW * rr(0.28, 0.42), rr(-9, -3), rr(1.9, 2.4), rr(0.95, 1.1), P.op1 * 0.8, 'dw-mid');
    if (!mobile) {
      clump(rr(-6, 4), rr(58, 72), rr(-0.6, -0.1), rr(0.9, 1.05), P.op1 * 0.7, 'dw-mid');
      clump(VW * rr(0.92, 1.02), rr(60, 75), rr(3.2, 3.7), rr(0.85, 1), P.op2, 'dw-soft');
    }
    // 近层：一小簇清晰叶尖作视觉锚点
    clump(VW * rr(0.35, 0.5), rr(-10, -4), rr(1.9, 2.3), 0.85, P.op1, 'dw-sharp');
  }

  // warm 暖 → 夕照叶影：叶团更密更清晰，暖色光池又大又亮（黄昏斜阳）
  function sceneDusk(P) {
    shadeWash(0.09);
    clump(rr(-6, 10), rr(-8, 2), rr(0.5, 0.9), rr(1.6, 1.9), P.op2, 'dw-soft');
    clump(VW * rr(0.7, 0.85), rr(-10, -2), rr(2.2, 2.7), rr(1.5, 1.8), P.op2 * 0.9, 'dw-soft');
    clump(VW * rr(0.55, 0.7), rr(-8, 0), rr(2.1, 2.6), rr(1.05, 1.25), P.op1 * 0.9, 'dw-mid');
    clump(rr(-8, -2), rr(18, 38), rr(-0.3, 0.25), 1.05, P.op1 * 0.85, 'dw-mid');
    if (!mobile) {
      clump(VW * rr(0.88, 0.98), rr(20, 40), rr(2.6, 3.1), 1, P.op1 * 0.8, 'dw-mid');
      clump(rr(10, 25), rr(60, 75), rr(-0.5, 0), 0.9, P.op1 * 0.75, 'dw-mid');
    }
    clump(VW * rr(0.3, 0.45), rr(-10, -4), rr(1.9, 2.3), 0.9, P.op1, 'dw-sharp');
  }

  // sky 天空 → 云影悠悠：积云剪影重糊慢移，两层视差
  function sceneClouds(P) {
    // 信纸是半透明毛玻璃：云从其下方经过即可，无须避让——自然满幅布局
    cloud(rr(15, 55), rr(6, 18), rr(14, 19), rr(0.75, 0.9));
    cloud(rr(90, 140), rr(14, 30), rr(11, 16), rr(0.7, 0.85));
    cloud(rr(50, 110), rr(34, 48), rr(8, 12), rr(0.5, 0.65));
    if (!mobile) {
      cloud(rr(0, 40), rr(50, 68), rr(7, 10), rr(0.45, 0.6));
      cloud(rr(120, 160), rr(55, 72), rr(7, 10), rr(0.45, 0.6));
      cloud(rr(60, 100), rr(2, 8), rr(5, 8), rr(0.4, 0.55));
    }
  }

  // night 夜 → 月下梅影：月色描枝——淡青月光勾出虬枝与梢头花簇
  function scenePlum(P, depth) {
    sceneColor = 'var(--dappled-bokeh-color)';
    var t1 = plumTree({ x: VW * rr(0.76, 0.94), y: -6, ang: rr(1.95, 2.3), depth: depth, op: P.op1, arms: 2, filter: 'dw-sharp' });
    ghost(t1, -1.8, 1.4, P.ghostOp);
    if (!mobile) {
      plumTree({ x: -5, y: rr(25, 45), ang: rr(-0.2, 0.15), depth: depth - 1, op: P.op2, arms: 2, filter: 'dw-mid' });
    }
  }

  // spring 春 → 春柳拂风：柔条自上垂落，细叶随风大幅拂动
  function sceneWillow(P) {
    var anchors = mobile ? 2 : 3;
    var first = null;
    for (var i = 0; i < anchors; i++) {
      var ax = rr(15, 145), ay = rr(-8, -3);
      var g = willowCanopy(ax, ay, mobile ? 4 : rr(5, 7) | 0, i % 2 === 0 ? P.op1 : P.op2, i % 2 === 0 ? 'dw-sharp' : 'dw-mid');
      if (!first) first = g;
    }
    ghost(first, 2, 1.6, P.ghostOp);
  }

  // ── Dispatch ──
  var style = document.body.dataset.style || 'default';
  var P = {
    'default': { op1: 0.42, op2: 0.3, ghostOp: 0.2, glow: false, spotOp: [0, 0] },
    warm:      { op1: 0.46, op2: 0.34, ghostOp: 0.24, glow: true, spotOp: [0.35, 0.5] },
    sky:       { op1: 0.5, op2: 0.32, ghostOp: 0.17, glow: false, spotOp: [0, 0] },
    night:     { op1: 0.7, op2: 0.45, ghostOp: 0.16, glow: true, spotOp: [0.3, 0.5] },
    spring:    { op1: 0.44, op2: 0.32, ghostOp: 0.18, glow: true, spotOp: [0.18, 0.28] }
  }[style] || { op1: 0.42, op2: 0.3, ghostOp: 0.2, glow: false, spotOp: [0, 0] };

  var depth = mobile ? 4 : 5;

  switch (style) {
    case 'warm':   sceneDusk(P); break;
    case 'sky':    sceneClouds(P); break;
    case 'night':  scenePlum(P, depth); break;
    case 'spring': sceneWillow(P); break;
    default:       sceneFoliage(P); break;
  }

  sL.appendChild(svg);

  // 补充光池：一簇游离的小光斑 + 一片大光晕（叶隙光池已贴着叶团生成）
  if (P.glow) {
    var ccx = rr(8, 70), ccy = rr(5, 55);
    for (var si = 0; si < 2 + Math.floor(R() * 2); si++) {
      mkSpot(ccx + rr(-9, 9), ccy + rr(-8, 8), rr(5, 11), rr(P.spotOp[0], P.spotOp[1]));
    }
    mkSpot(rr(30, 70), rr(10, 50), rr(20, 32), rr(0.25, 0.4));
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
