/* AXYS — Visual Direction v1 · interactive prototype */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  /* ------------------------------------------------------------------ icons */
  const ICONS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    bluetooth: '<path d="M7 7l10 10-5 4V3l5 4L7 17"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    refresh: '<path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7"/>',
    chevron: '<path d="M9 6l6 6-6 6"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    speaker: '<path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/>',
    haptic: '<rect x="8" y="3" width="8" height="18" rx="2"/><path d="M4 8v8M20 8v8M1.5 10v4M22.5 10v4"/>',
    flame: '<path d="M12 3c1 4 5 5.5 5 10a5 5 0 01-10 0c0-2.5 1.5-3.5 2-5.5 1 1 1.5 2 1.5 3 1-1.5 1.5-4 1.5-7.5z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 01-8 0zM8 6H4.5a3 3 0 003.5 4M16 6h3.5a3 3 0 01-3.5 4M12 13v4M8 20h8M9.5 17h5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
    settings: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
    chart: '<path d="M5 20V11M11 20V5M17 20v-6M3 20h18"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
    crown: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    hand: '<path d="M7 12V6a1.5 1.5 0 013 0v5M10 11V4.5a1.5 1.5 0 013 0V11M13 11V5.5a1.5 1.5 0 013 0V12M16 9.5a1.5 1.5 0 013 0V14a7 7 0 01-7 7h-1a6 6 0 01-5-3l-2.5-4a1.5 1.5 0 012.5-1.5L7 14"/>',
    activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    calendar: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    arrowup: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    flag: '<path d="M6 21V3l12 4.5L6 12"/>',
    logout: '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>',
  };
  const icon = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
  const hydrateIcons = (root = document) =>
    $$("i[data-icon]", root).forEach((i) => { if (!i.firstChild) i.innerHTML = icon(i.dataset.icon); });

  const LOGO = `<svg viewBox="0 0 32 32" fill="none"><path d="M7 7l18 18M25 7L7 25" stroke="#eef2f4" stroke-width="3.4" stroke-linecap="round"/><circle cx="16" cy="16" r="13.5" stroke="#2ee6ff" stroke-opacity=".45" stroke-width="1.2" stroke-dasharray="3 3"/><circle cx="16" cy="16" r="3.6" fill="#c8ff2e"/></svg>`;
  $$("[data-logo]").forEach((l) => (l.innerHTML = LOGO + "<span>AXYS</span>"));

  /* ---------------------------------------------------------- phone chrome */
  const NAV = [
    ["home", "home", "Home"],
    ["training", "flag", "Training"],
    ["drills", "target", "Drills"],
    ["history", "activity", "Swing history"],
    ["academy", "video", "Academy"],
    ["profile", "user", "Profile"],
    ["system", "chip", "System"],
    ["calibration", "settings", "Calibration"],
  ];
  const SIGNAL = '<svg viewBox="0 0 18 12" fill="#eef2f4"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>';
  const WIFI = '<svg viewBox="0 0 16 12" fill="#eef2f4"><path d="M8 12l2.3-2.8a3.6 3.6 0 00-4.6 0zM8 5.6c1.9 0 3.6.7 4.9 1.8l1.6-1.9A10 10 0 008 3.1a10 10 0 00-6.5 2.4l1.6 1.9A7.4 7.4 0 018 5.6zM8 0C5 0 2.2 1.1 0 3l1.6 1.9A9.9 9.9 0 018 2.5c2.4 0 4.6.9 6.4 2.4L16 3a12.4 12.4 0 00-8-3z"/></svg>';
  const PHONEBATT = '<svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="23" height="11" rx="3" fill="none" stroke="#eef2f4" stroke-opacity=".4"/><rect x="2" y="2" width="17" height="8" rx="1.6" fill="#eef2f4"/><rect x="24.5" y="4" width="1.6" height="4" rx=".8" fill="#eef2f4" fill-opacity=".4"/></svg>';

  $$(".phone").forEach((phone) => {
    const content = $(".content", phone);
    const screen = document.createElement("div");
    screen.className = "screen";
    screen.innerHTML = `
      <div class="statusbar"><span>9:41</span><span class="island"></span><span class="sys">${SIGNAL}${WIFI}${PHONEBATT}</span></div>
      <header class="appbar">
        <button class="icon-btn menu-btn" aria-label="Menu"><i data-icon="menu"></i></button>
        <span class="logo sm">${LOGO}<span>AXYS</span></span>
        <span class="batt-pill" title="Sensor battery"><span class="s-dot"></span>82%<span class="batt"><i style="width:82%"></i></span></span>
      </header>`;
    phone.insertBefore(screen, content);
    screen.appendChild(content);
    const drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.innerHTML = `
      <div class="scrim"></div>
      <nav class="panel">
        <div class="me"><div class="av"><div class="photo" style="width:100%;height:100%">${AVATAR_PHOTO()}</div></div><div><b>Jordan Ellis</b><span>Standard · HCP 18</span></div></div>
        ${NAV.map(([id, ic, label]) => `<button class="nav-item ${phone.dataset.nav === id ? "active" : ""}"><i data-icon="${ic}"></i>${label}${id === "system" ? '<span class="tag">UPDATE</span>' : ""}</button>`).join("")}
        <button class="nav-item" style="margin-top:8px"><i data-icon="logout"></i>Sign out</button>
        <div class="foot">AXYS v1.0 · FW 2.3.1</div>
      </nav>`;
    screen.appendChild(drawer);
    const home = document.createElement("div");
    home.className = "home-ind";
    screen.appendChild(home);
    $(".menu-btn", screen).addEventListener("click", () => drawer.classList.add("open"));
    $(".scrim", drawer).addEventListener("click", () => drawer.classList.remove("open"));
    $$(".nav-item", drawer).forEach((n) => n.addEventListener("click", () => setTimeout(() => drawer.classList.remove("open"), 220)));
  });

  function AVATAR_PHOTO() {
    return `<svg viewBox="0 0 84 84" width="100%" height="100%"><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5c68"/><stop offset="1" stop-color="#1a2229"/></linearGradient></defs><rect width="84" height="84" fill="url(#pg)"/><circle cx="42" cy="34" r="15" fill="#c9a58a"/><path d="M26 30c0-11 8-16 16-16s17 4 16 15c-4-5-10-6-16-6s-12 2-16 7z" fill="#2a2522"/><path d="M27 26c3-6 9-9 15-9s13 3 16 9c-4-2-10-3-16-3s-12 1-15 3z" fill="#e9eef1"/><rect x="25" y="24" width="34" height="4" rx="2" fill="#c8ff2e"/><path d="M12 84c2-17 15-26 30-26s28 9 30 26z" fill="#d7dee2"/><path d="M36 58l6 8 6-8" fill="none" stroke="#9aa7af" stroke-width="2"/></svg>`;
  }
  $("#photo").innerHTML = AVATAR_PHOTO();

  hydrateIcons();

  /* ------------------------------------------- pressed state: pulse + haptic */
  const PRESSABLE = ".btn, .icon-btn, .nav-item, .play, .big-play, .ble-toggle, .seg button, .phase-chips button";
  document.addEventListener("pointerdown", (e) => {
    const b = e.target.closest(PRESSABLE);
    if (!b || b.disabled || b.classList.contains("static")) return;
    const r = b.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    for (const kind of ["fill", "ring"]) {
      const s = document.createElement("span");
      s.className = "ripple " + kind;
      s.style.left = x + "px";
      s.style.top = y + "px";
      b.appendChild(s);
      setTimeout(() => s.remove(), 700);
    }
    b.classList.add("is-pressed");
    const up = () => { setTimeout(() => b.classList.remove("is-pressed"), 90); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointerup", up);
    if (b.matches(".btn-primary, .btn-pro, .play, .big-play")) buzz(b.closest(".phone"));
  });
  function buzz(phone) {
    if (!phone) return;
    phone.classList.remove("buzz");
    void phone.offsetWidth;
    phone.classList.add("buzz");
    if (navigator.vibrate) navigator.vibrate(12);
  }

  /* ------------------------------------------------------------- poses */
  const H = (p) => {
    const o = { ...p };
    if (p.hand) {
      o.handL = [p.hand[0] + 2, p.hand[1]];
      o.handR = [p.hand[0] - 2, p.hand[1] + 1];
      delete o.hand;
    }
    return o;
  };
  const LEGS = { hipL: [111, 146], hipR: [89, 146], knL: [115, 196], knR: [85, 196], anL: [121, 246], anR: [79, 246] };
  const ADDRESS = H({ head: [100, 50], neck: [100, 70], shL: [117, 78], shR: [83, 80], elL: [109, 108], elR: [91, 108], hand: [100, 134], ...LEGS, club: [106, 252] });
  const TAKEAWAY = H({ head: [99, 50], neck: [99, 70], shL: [114, 79], shR: [84, 78], elL: [100, 108], elR: [82, 106], hand: [80, 130], ...LEGS, hipL: [110, 146], hipR: [88, 146], club: [36, 142] });
  const TOP = H({ head: [98, 50], neck: [98, 70], shL: [106, 82], shR: [90, 76], elL: [86, 92], elR: [68, 84], hand: [66, 62], ...LEGS, hipL: [108, 146], hipR: [89, 145], knL: [110, 198], club: [118, 46] });
  const DOWN = H({ head: [98, 51], neck: [98, 71], shL: [110, 80], shR: [86, 79], elL: [96, 100], elR: [80, 94], hand: [82, 106], ...LEGS, hipL: [113, 146], hipR: [91, 146], knL: [117, 197], club: [70, 48] });
  const DOWN_IDEAL = H({ head: [98, 51], neck: [98, 71], shL: [112, 80], shR: [86, 79], elL: [98, 106], elR: [78, 104], hand: [74, 118], ...LEGS, hipL: [116, 146], hipR: [94, 146], knL: [118, 197], knR: [88, 197], club: [40, 82] });
  const IMPACT = H({ head: [97, 51], neck: [99, 71], shL: [117, 79], shR: [85, 81], elL: [112, 108], elR: [95, 110], hand: [106, 136], ...LEGS, hipL: [119, 145], hipR: [96, 147], knL: [120, 197], knR: [90, 198], club: [104, 252] });
  const FINISH = H({ head: [110, 50], neck: [107, 70], shL: [116, 80], shR: [96, 80], elL: [128, 84], elR: [116, 90], hand: [130, 56], ...LEGS, hipL: [118, 146], hipR: [100, 147], knL: [122, 197], knR: [102, 200], anR: [90, 244], club: [78, 40] });
  const NEUTRAL = { head: [100, 48], neck: [100, 68], shL: [119, 77], shR: [81, 77], elL: [125, 110], elR: [75, 110], handL: [127, 142], handR: [73, 142], hipL: [111, 146], hipR: [89, 146], knL: [113, 196], knR: [87, 196], anL: [116, 246], anR: [84, 246], club: null };
  const TPOSE = { ...NEUTRAL, elL: [149, 77], elR: [51, 77], handL: [178, 77], handR: [22, 77] };

  const lerpPose = (a, b, t) => {
    const o = {};
    for (const k in a) {
      if (k === "club" || k === "clubA") continue;
      o[k] = [lerp(a[k][0], b[k][0], t), lerp(a[k][1], b[k][1], t)];
    }
    const ca = a.club ? (a.clubA ?? 1) : 0, cb = b.club ? (b.clubA ?? 1) : 0;
    const pa = a.club || b.club, pb = b.club || a.club;
    o.club = pa ? [lerp(pa[0], pb[0], t), lerp(pa[1], pb[1], t)] : null;
    o.clubA = lerp(ca, cb, t);
    return o;
  };
  const sampleKeys = (keys, t) => {
    t = clamp(t, 0, 1);
    for (let i = 0; i < keys.length - 1; i++) {
      const [t0, p0] = keys[i], [t1, p1] = keys[i + 1];
      if (t <= t1) return lerpPose(p0, p1, ease((t - t0) / (t1 - t0 || 1)));
    }
    return lerpPose(keys[keys.length - 1][1], keys[keys.length - 1][1], 0);
  };
  const SWING = [[0, ADDRESS], [0.26, TAKEAWAY], [0.58, TOP], [0.72, DOWN], [0.8, IMPACT], [1, FINISH]];
  const SWING_IDEAL = [[0, ADDRESS], [0.26, TAKEAWAY], [0.58, TOP], [0.72, DOWN_IDEAL], [0.8, IMPACT], [1, FINISH]];

  /* ------------------------------------------------------------- figure */
  const BONES = [["hipL", "knL"], ["knL", "anL"], ["hipR", "knR"], ["knR", "anR"], ["shL", "elL"], ["elL", "handL"], ["shR", "elR"], ["elR", "handR"]];
  const JOINTS = ["shL", "shR", "elL", "elR", "handL", "handR", "hipL", "hipR", "knL", "knR", "anL", "anR"];
  class Figure {
    constructor(svg, cls = "") {
      this.g = svgEl("g", { class: "fig " + cls }, svg);
      this.shadow = svgEl("ellipse", { class: "fig-shadow", rx: 46, ry: 7 }, this.g);
      this.torso = svgEl("path", { class: "fig-torso" }, this.g);
      this.chest = svgEl("path", { class: "fig-chest" }, this.g);
      this.neck = svgEl("line", { class: "fig-bone" }, this.g);
      this.feet = [svgEl("line", { class: "fig-bone" }, this.g), svgEl("line", { class: "fig-bone" }, this.g)];
      this.bones = BONES.map((b) => ({ b, o: svgEl("line", { class: "fig-bone" }, this.g), h: svgEl("line", { class: "fig-bone-hi" }, this.g) }));
      this.head = svgEl("circle", { class: "fig-head", r: 12 }, this.g);
      this.club = svgEl("line", { class: "fig-club" }, this.g);
      this.clubHead = svgEl("circle", { class: "fig-clubhead", r: 3.4 }, this.g);
      this.joints = JOINTS.map((j) => ({ j, c: svgEl("circle", { class: "fig-joint", r: 2.6 }, this.g) }));
    }
    set(p) {
      const L = (el, a, b) => { el.setAttribute("x1", a[0]); el.setAttribute("y1", a[1]); el.setAttribute("x2", b[0]); el.setAttribute("y2", b[1]); };
      this.torso.setAttribute("d", `M${p.shL}L${p.shR}L${p.hipR}L${p.hipL}Z`);
      const mid = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
      const cl = mid(p.shL, p.hipL, 0.45), cr = mid(p.shR, p.hipR, 0.45), cn = mid(p.neck, mid(p.hipL, p.hipR, 0.5), 0.5);
      this.chest.setAttribute("d", `M${cr}Q${cn[0]} ${cn[1] + 6} ${cl}M${mid(p.hipR, p.hipL, 0.5)}L${cn}`);
      this.shadow.setAttribute("cx", (p.anL[0] + p.anR[0]) / 2);
      this.shadow.setAttribute("cy", Math.max(p.anL[1], p.anR[1]) + 4);
      L(this.neck, p.neck, [p.head[0], p.head[1] + 6]);
      L(this.feet[0], p.anL, [p.anL[0] + 7, p.anL[1] + 2]);
      L(this.feet[1], p.anR, [p.anR[0] - 7, p.anR[1] + 2]);
      this.bones.forEach(({ b, o, h }) => { L(o, p[b[0]], p[b[1]]); L(h, p[b[0]], p[b[1]]); });
      this.head.setAttribute("cx", p.head[0]);
      this.head.setAttribute("cy", p.head[1]);
      const hand = [(p.handL[0] + p.handR[0]) / 2, (p.handL[1] + p.handR[1]) / 2];
      const a = p.clubA ?? (p.club ? 1 : 0);
      if (p.club) {
        L(this.club, hand, p.club);
        this.clubHead.setAttribute("cx", p.club[0]);
        this.clubHead.setAttribute("cy", p.club[1]);
      }
      this.club.style.opacity = a;
      this.clubHead.style.opacity = a;
      this.joints.forEach(({ j, c }) => { c.setAttribute("cx", p[j][0]); c.setAttribute("cy", p[j][1]); });
    }
  }

  /* ------------------------------------------------------------- loop */
  const tickers = [];
  let last = performance.now();
  const loop = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    tickers.forEach((f) => f(dt, now / 1000));
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* ================================================================ 01 SYSTEM */
  (() => {
    const map = $("#sensor-map");
    const fig = new Figure(map, "dim");
    fig.set({ ...NEUTRAL, club: null, clubA: 0 });
    fig.g.setAttribute("transform", "translate(14 6) scale(.95)");
    const T = (p) => [14 + p[0] * 0.95, 6 + p[1] * 0.95];
    const SENSORS = [
      { id: "M", name: "Master · Chest", pos: T([100, 96]), master: true, batt: 82, lab: "MASTER", lx: 14, ly: -10 },
      { id: "S1", name: "Lead wrist", pos: T(NEUTRAL.handL), batt: 76, lab: "S1", lx: 10, ly: 3 },
      { id: "S2", name: "Trail wrist", pos: T(NEUTRAL.handR), batt: 79, lab: "S2", lx: -20, ly: 3 },
      { id: "S3", name: "Pelvis", pos: T([100, 150]), batt: 88, lab: "S3", lx: 10, ly: 14 },
    ];
    const m = SENSORS[0].pos;
    const phoneP = [26, 34];
    svgEl("path", { class: "link-ble", d: `M${phoneP[0] + 10} ${phoneP[1] + 4} Q ${m[0] - 30} ${phoneP[1] - 4} ${m[0]} ${m[1]}` }, map);
    const brk = svgEl("g", { class: "break", transform: `translate(${(phoneP[0] + m[0]) / 2 - 4} ${(phoneP[1] + m[1]) / 2 - 18})` }, map);
    svgEl("circle", { r: 7, fill: "#07090b", stroke: "#ff4d5e", "stroke-width": 1.2 }, brk);
    svgEl("path", { d: "M-3 -3L3 3M3 -3L-3 3", stroke: "#ff4d5e", "stroke-width": 1.6, "stroke-linecap": "round" }, brk);
    svgEl("rect", { class: "phone-glyph", x: phoneP[0] - 8, y: phoneP[1] - 14, width: 16, height: 28, rx: 3.5 }, map);
    svgEl("text", { x: phoneP[0] - 10, y: phoneP[1] + 26 }, map).textContent = "PHONE";
    SENSORS.slice(1).forEach((s) => {
      const mid = [(m[0] + s.pos[0]) / 2 + (s.pos[0] - m[0]) * 0.1, (m[1] + s.pos[1]) / 2 - 8];
      svgEl("path", { class: "link", d: `M${m[0]} ${m[1]} Q ${mid[0]} ${mid[1]} ${s.pos[0]} ${s.pos[1]}` }, map);
    });
    SENSORS.forEach((s) => {
      const c = s.master ? " master" : "";
      svgEl("circle", { class: "halo" + c, cx: s.pos[0], cy: s.pos[1], r: s.master ? 8 : 6, style: `animation-delay:${Math.random()}s` }, map);
      svgEl("circle", { class: "node" + c, cx: s.pos[0], cy: s.pos[1], r: s.master ? 8 : 6 }, map);
      svgEl("circle", { class: "node-core" + c, cx: s.pos[0], cy: s.pos[1], r: s.master ? 3.5 : 2.5 }, map);
      svgEl("text", { x: s.pos[0] + s.lx, y: s.pos[1] + s.ly }, map).textContent = s.lab;
    });
    $("#sensor-legend").innerHTML = SENSORS.map((s) => `
      <div class="s-row"><span class="tag ${s.master ? "m" : ""}">${s.id}</span><span class="nm">${s.name}</span>
      <span class="batt" style="width:20px;height:10px"><i style="width:${s.batt}%"></i></span><span class="pc">${s.batt}%</span></div>`).join("");

    const card = $("#sensor-card"), pill = $("#sys-pill"), lbl = $("#ble-toggle span");
    const setBle = (on) => {
      card.classList.toggle("offline", !on);
      lbl.textContent = on ? "Connected" : "Not connected";
      pill.className = "status-pill" + (on ? "" : " bad");
      $("span", pill).textContent = on ? "All systems ready" : "Sensors offline";
      $$(".s-row .pc", card).forEach((p, i) => (p.textContent = on ? SENSORS[i].batt + "%" : "—"));
    };
    let ble = true;
    $("#ble-toggle").addEventListener("click", () => setBle((ble = !ble)));
    $("#reconnect").addEventListener("click", (e) => {
      const b = e.currentTarget;
      b.classList.add("is-loading");
      setTimeout(() => { b.classList.remove("is-loading"); setBle((ble = true)); }, 1400);
    });

    // firmware
    const fw = $("#fw-card"), fwBtn = $("#fw-btn"), bar = $("#fw-bar");
    fwBtn.addEventListener("click", () => {
      if (fw.classList.contains("updating") || fw.classList.contains("done")) return;
      fw.classList.add("updating");
      fwBtn.classList.add("is-loading");
      $("#fw-ver").textContent = "Installing v2.4.0 · keep sensors close";
      let p = 0;
      const id = setInterval(() => {
        p += 2 + Math.random() * 4;
        bar.style.width = Math.min(p, 100) + "%";
        if (p >= 100) {
          clearInterval(id);
          fw.classList.remove("updating");
          fw.classList.add("done");
          fwBtn.classList.remove("is-loading", "btn-primary");
          fwBtn.classList.add("is-success");
          fwBtn.innerHTML = icon("check").replace("<svg", '<svg width="20" height="20"') + "Up to date";
          $("#fw-ver").textContent = "v2.4.0 installed";
          $("#fw-badge").className = "badge volt";
          $("#fw-badge").textContent = "Latest";
          $("#fw-ico").className = "ico-tile volt";
          setTimeout(resetFw, 5000);
        }
      }, 80);
    });
    function resetFw() {
      fw.classList.remove("done");
      bar.style.width = "0";
      fwBtn.className = "btn btn-primary";
      fwBtn.innerHTML = '<i data-icon="download"></i>Update now';
      hydrateIcons(fwBtn);
      $("#fw-ver").textContent = "v2.3.1 installed";
      $("#fw-badge").className = "badge amber";
      $("#fw-badge").textContent = "v2.4.0 ready";
      $("#fw-ico").className = "ico-tile amber";
    }

    // camera
    const vf = new Figure($("#vf-svg"), "steel");
    vf.set(ADDRESS);
    const cam = $("#cam-card"), hint = $("#cam-hint"), sw = $("#cam-switch");
    let wrong = false;
    $("#viewfinder").addEventListener("click", () => {
      if (cam.classList.contains("camoff")) return;
      wrong = !wrong;
      cam.classList.toggle("wrong", wrong);
      hint.innerHTML = wrong ? icon("alert").replace("<svg", '<svg width="13" height="13"') + "Tilt up · step back 1 m" : icon("check").replace("<svg", '<svg width="13" height="13"') + "Position correct";
    });
    sw.addEventListener("click", () => {
      const on = sw.classList.toggle("on");
      cam.classList.toggle("camoff", !on);
      $("#cam-sub").textContent = on ? "Recording · 240 fps" : "Off · sensors only";
    });
  })();

  /* ================================================================ 02 PROFILE */
  $$("#hand-seg button").forEach((b) =>
    b.addEventListener("click", () => {
      $$("#hand-seg button").forEach((x) => x.classList.toggle("on", x === b));
    })
  );

  /* ================================================================ 03 CALIBRATION */
  (() => {
    const svg = $("#calib-svg");
    const ghost = new Figure(svg, "ghost");
    const user = new Figure(svg, "user");
    const STEPS = [
      { title: "Stand tall", pose: NEUTRAL, cap: "Stand tall, feet shoulder-width apart, arms relaxed by your sides." },
      { title: "Arms out — T-pose", pose: TPOSE, cap: "Raise both arms out to the side until they're level with your shoulders." },
      { title: "Take your address", pose: ADDRESS, cap: "Now grip the club and settle into your normal address position." },
    ];
    const steps = $$("#calib-steps i");
    const arc = $("#match-arc"), mv = $("#match-v"), hap = $("#haptic"), flash = $("#lock-flash");
    const done = $("#calib-done"), cap = $("#calib-cap");
    const phone = svg.closest(".phone");
    let step = 0, phase = "intro", t = 0, from = { ...NEUTRAL, elL: [120, 112], elR: [80, 112], handL: [116, 140], handR: [84, 140] };

    const setStep = (i) => {
      step = i; t = 0; phase = "intro";
      $("#calib-eyebrow").textContent = `Step ${i + 1} of 3`;
      $("#calib-title").textContent = STEPS[i].title;
      cap.classList.add("fade");
      setTimeout(() => { cap.textContent = STEPS[i].cap; cap.classList.remove("fade"); }, 250);
      steps.forEach((s, k) => { s.classList.toggle("done", k < i); $("b", s).style.width = k < i ? "100%" : "0"; });
      user.g.classList.remove("matched");
    };
    const restart = () => {
      done.classList.remove("show");
      from = { ...NEUTRAL, elL: [120, 112], elR: [80, 112], handL: [116, 140], handR: [84, 140] };
      setStep(0);
    };
    $("#calib-replay").addEventListener("click", restart);
    $("#calib-skip").addEventListener("click", restart);
    setStep(0);

    tickers.push((dt, now) => {
      t += dt;
      const target = STEPS[step].pose;
      ghost.set(lerpPose(target, target, 0));
      let prog;
      if (phase === "intro") {
        prog = 0;
        if (t > 1.4) { phase = "move"; t = 0; }
      } else if (phase === "move") {
        prog = clamp(t / 2.6, 0, 1);
        if (prog >= 1) { phase = "locked"; t = 0; lock(); }
      } else if (phase === "locked") {
        prog = 1;
        if (t > 1.6) {
          from = STEPS[step].pose;
          if (step < 2) setStep(step + 1);
          else { phase = "done"; t = 0; done.classList.add("show"); steps.forEach((s) => { s.classList.add("done"); $("b", s).style.width = "100%"; }); }
        }
      } else {
        prog = 1;
        if (t > 7) restart();
      }
      const e = ease(prog);
      const wob = (1 - e) * 3;
      const p = lerpPose(from, target, e);
      for (const k of JOINTS) p[k] = [p[k][0] + Math.sin(now * 3 + k.length) * wob, p[k][1] + Math.cos(now * 2.4 + k.length) * wob];
      user.set(p);
      const pct = Math.round(phase === "intro" ? 0 : e * 100);
      mv.textContent = pct;
      arc.setAttribute("stroke-dasharray", `${(pct / 100) * 188.5} 189`);
      arc.setAttribute("stroke", pct >= 100 ? "#c8ff2e" : "#ffb020");
      if (phase === "move") $("b", steps[step]).style.width = pct + "%";
    });

    function lock() {
      user.g.classList.add("matched");
      hap.classList.remove("fire"); void hap.offsetWidth; hap.classList.add("fire");
      flash.classList.remove("on"); void flash.offsetWidth; flash.classList.add("on");
      buzz(phone);
      setTimeout(() => hap.classList.remove("fire"), 900);
    }
  })();

  /* ================================================================ 04 DRILL */
  (() => {
    const fig = new Figure($("#drill-svg"));
    const dial = $("#dial-svg");
    svgEl("circle", { cx: 40, cy: 40, r: 34, fill: "none", stroke: "#1c242b", "stroke-width": 1 }, dial);
    svgEl("circle", { cx: 40, cy: 40, r: 22, fill: "none", stroke: "#1c242b", "stroke-width": 1, "stroke-dasharray": "2 3" }, dial);
    const wedge = svgEl("path", { fill: "rgba(200,255,46,.18)" }, dial);
    const hipL = svgEl("line", { stroke: "#c8ff2e", "stroke-width": 4, "stroke-linecap": "round" }, dial);
    const shL = svgEl("line", { stroke: "#2ee6ff", "stroke-width": 4, "stroke-linecap": "round" }, dial);
    svgEl("circle", { cx: 40, cy: 40, r: 5, fill: "#dfe6ea" }, dial);
    svgEl("path", { d: "M40 2l3 5h-6z", fill: "#56626b" }, dial);

    const ROT_SH = [[0, 0], [0.26, 30], [0.58, 92], [0.72, 40], [0.8, -10], [1, -80]];
    const ROT_HIP = [[0, 0], [0.26, 10], [0.58, 46], [0.72, 10], [0.8, -35], [1, -80]];
    const sampleNum = (keys, t) => {
      for (let i = 0; i < keys.length - 1; i++) if (t <= keys[i + 1][0]) return lerp(keys[i][1], keys[i + 1][1], ease((t - keys[i][0]) / (keys[i + 1][0] - keys[i][0])));
      return keys[keys.length - 1][1];
    };
    const PH = [[0, "Address", "Set up tall. Feel your hips and chest square to the ball."], [0.15, "Takeaway", "Keep your hips quiet as your shoulders turn."], [0.45, "Top", "Feel the stretch — that's your separation."], [0.62, "Downswing", "Hips lead. Let the torso follow."], [0.76, "Impact", "Chest and hips open together through the ball."]];
    let speed = 0.75, t = 0, hold = 0;
    const cap = $("#drill-cap"), phEl = $("#drill-phase"), xf = $("#xf");
    let lastPh = "";
    const line = (el, deg, len) => {
      const r = ((deg - 90) * Math.PI) / 180, x = Math.cos(r) * len, y = Math.sin(r) * len;
      el.setAttribute("x1", 40 - x); el.setAttribute("y1", 40 - y); el.setAttribute("x2", 40 + x); el.setAttribute("y2", 40 + y);
    };
    tickers.push((dt) => {
      if (hold > 0) hold -= dt;
      else t += dt * 0.14 * speed;
      if (t > 0.86) { t = 0; hold = 0.8; }
      fig.set(sampleKeys(SWING, t));
      const s = sampleNum(ROT_SH, t), h = sampleNum(ROT_HIP, t);
      line(shL, 90 + s, 32);
      line(hipL, 90 + h, 22);
      const a0 = (h * Math.PI) / 180, a1 = (s * Math.PI) / 180;
      const R = 30, big = Math.abs(s - h) > 180 ? 1 : 0, sweep = s > h ? 1 : 0;
      wedge.setAttribute("d", `M40 40 L${40 + Math.cos(a0) * R} ${40 + Math.sin(a0) * R} A${R} ${R} 0 ${big} ${sweep} ${40 + Math.cos(a1) * R} ${40 + Math.sin(a1) * R}Z`);
      xf.textContent = Math.round(Math.abs(s - h));
      let cur = PH[0];
      for (const p of PH) if (t >= p[0]) cur = p;
      if (cur[1] !== lastPh) {
        lastPh = cur[1];
        phEl.textContent = cur[1];
        cap.classList.add("fade");
        setTimeout(() => { cap.textContent = cur[2]; cap.classList.remove("fade"); }, 250);
      }
    });

    const tin = $("#tempo-in"), tv = $("#tempo-v"), tf = $("#tempo-fill"), tk = $("#tempo-knob"), st = $("#drill-speed");
    const setTempo = () => {
      const v = +tin.value, pct = ((v - 25) / 75) * 100;
      speed = v / 100;
      tv.textContent = v + "%";
      st.textContent = v + "% tempo";
      tf.style.width = pct + "%";
      tk.style.left = `calc(${pct}% + ${12 - pct * 0.24}px)`;
    };
    tin.addEventListener("input", setTempo);
    tin.addEventListener("pointerdown", () => $("#tempo").classList.add("drag"));
    window.addEventListener("pointerup", () => $("#tempo").classList.remove("drag"));
    setTempo();

    let reps = 10;
    const setReps = () => {
      $("#rep-v").textContent = reps;
      $("#rep-dots").innerHTML = Array.from({ length: Math.min(reps, 15) }, () => "<i></i>").join("");
    };
    $("#rep-minus").addEventListener("click", () => { reps = Math.max(1, reps - 1); setReps(); });
    $("#rep-plus").addEventListener("click", () => { reps = Math.min(30, reps + 1); setReps(); });
    setReps();
  })();

  /* ================================================================ 05 SHOT TAKING */
  (() => {
    const svg = $("#shot-svg"), TOTAL = 10, C = 130, R = 112;
    const arcs = [];
    const polar = (a, r) => [C + Math.cos(a) * r, C + Math.sin(a) * r];
    for (let i = 0; i < TOTAL; i++) {
      const gap = 0.12, a0 = -Math.PI / 2 + (i / TOTAL) * Math.PI * 2 + gap / 2, a1 = -Math.PI / 2 + ((i + 1) / TOTAL) * Math.PI * 2 - gap / 2;
      const p0 = polar(a0, R), p1 = polar(a1, R);
      arcs.push(svgEl("path", { class: "seg-arc", d: `M${p0} A${R} ${R} 0 0 1 ${p1}` }, svg));
    }
    svgEl("circle", { cx: C, cy: C, r: 92, fill: "none", stroke: "#1c242b", "stroke-width": 1, "stroke-dasharray": "2 5" }, svg);
    const ring = $("#shot-ring"), nEl = $("#shot-n"), lbl = $("#shot-lbl"), log = $("#shot-log"), listen = $("#listen-txt");
    let n = 3, spike = 0, timer = 0;
    const render = () => {
      nEl.textContent = n;
      arcs.forEach((a, i) => { a.classList.toggle("done", i < n); a.classList.toggle("next", i === n); });
    };
    const seed = [[1, 93, "3.0", 0], [2, 95, "3.1", 1], [3, 92, "2.9", 0]];
    seed.forEach(([i, mph, tmp, f]) => addLog(i, mph, tmp, f));
    function addLog(i, mph, tmp, f) {
      const s = document.createElement("span");
      if (f) s.className = "f";
      s.innerHTML = `#${i} <b>${mph}</b> · ${tmp}:1`;
      log.prepend(s);
      while (log.children.length > 4) log.lastChild.remove();
    }
    const flash = (id, v) => { const el = $(id); el.textContent = v; el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); };
    render();

    tickers.push((dt) => {
      timer += dt;
      if (n >= TOTAL) {
        if (timer > 3) { n = 0; timer = 0; log.innerHTML = ""; lbl.textContent = "Shots registered"; listen.textContent = "Listening for your swing…"; render(); }
        return;
      }
      if (timer > 3.2) {
        timer = 0;
        n++;
        spike = 1;
        const mph = 90 + Math.round(Math.random() * 8), tmp = (2.8 + Math.random() * 0.4).toFixed(1), sep = 36 + Math.round(Math.random() * 10);
        flash("#m-speed", mph); flash("#m-tempo", tmp + ":1"); flash("#m-sep", sep + "°");
        addLog(n, mph, tmp, sep < 40);
        ring.classList.remove("hit"); void ring.offsetWidth; ring.classList.add("hit");
        buzz(ring.closest(".phone"));
        render();
        if (n >= TOTAL) { lbl.textContent = "Set complete"; listen.textContent = "Great set — analysing…"; }
      }
    });

    const path = $("#live-path"), pts = Array(80).fill(27);
    let acc = 0, ph = 0;
    tickers.push((dt) => {
      acc += dt;
      if (acc < 0.03) return;
      acc = 0; ph += 0.35;
      spike *= 0.86;
      const v = 27 + Math.sin(ph) * 2 + (Math.random() - 0.5) * 3 + (spike > 0.05 ? Math.sin(ph * 4) * spike * 24 : 0);
      pts.shift(); pts.push(v);
      path.setAttribute("d", pts.map((y, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * 320} ${y.toFixed(1)}`).join(""));
    });
  })();

  /* ================================================================ 07 OVERVIEW */
  (() => {
    const svg = $("#ov-svg");
    const trailIdeal = svgEl("path", { class: "trail", style: "stroke:rgba(46,230,255,.25);stroke-dasharray:3 4;display:none" }, svg);
    const trail = svgEl("path", { class: "trail" }, svg);
    const ghost = new Figure(svg, "ghost");
    const user = new Figure(svg);
    ghost.g.style.display = "none";
    const PHASES = [
      { name: "Address", t: 0, s: "ok", title: "Solid setup", desc: "Spine tilt and ball position are within your ideal range." },
      { name: "Takeaway", t: 0.1, s: "ok", title: "One-piece takeaway", desc: "Club, hands and chest moved together through the first 30°." },
      { name: "Top", t: 0.45, s: "warn", title: "Short shoulder turn", desc: "78° of shoulder rotation, 12° short of your target. This limits stored power." },
      { name: "Downswing", t: 0.62, s: "bad", title: "Over the top", desc: "Shoulders unwind before the hips and push the club outside the plane. This is the main cause of your pull-slice." },
      { name: "Impact", t: 0.76, s: "ok", title: "Square face", desc: "Hands slightly ahead with 4° of shaft lean. Good compression." },
      { name: "Follow-through", t: 0.84, s: "ok", title: "Balanced finish", desc: "90% of your weight on the lead side, held for 2 seconds." },
    ];
    const SHORT = ["Address", "Takeaway", "Top", "Down", "Impact", "Finish"];
    const chips = $("#phase-chips"), scrub = $("#scrub"), sin = $("#scrub-in"), prog = $("#scrub-prog"), knob = $("#scrub-knob");
    PHASES.forEach((p, i) => {
      const b = document.createElement("button");
      b.textContent = SHORT[i];
      if (p.s !== "ok") b.classList.add(p.s);
      b.addEventListener("click", () => { playing = false; setPlayIcon(); go(p.t + 0.03); });
      chips.appendChild(b);
      const tk = document.createElement("i");
      tk.className = "tick " + (p.s !== "ok" ? p.s : "");
      tk.style.left = p.t * 100 + "%";
      scrub.insertBefore(tk, sin);
      if (p.s !== "ok") {
        const f = document.createElement("span");
        f.className = "flag " + p.s;
        f.textContent = "!";
        f.style.left = (p.t + 0.07) * 100 + "%";
        scrub.insertBefore(f, sin);
      }
    });
    const chipEls = $$("button", chips);
    let t = 0, playing = true, speed = 0.5, cur = -1, hold = 0;
    const fault = $("#fault"), fT = $("#f-title"), fD = $("#f-desc"), fB = $("#f-badge");
    const go = (v) => { t = clamp(v, 0, 1); render(); };
    const trailPath = (keys, upto) => {
      let d = "";
      for (let i = 0; i <= 60; i++) {
        const tt = (i / 60) * upto;
        const c = sampleKeys(keys, tt).club;
        d += (i ? "L" : "M") + c[0].toFixed(1) + " " + c[1].toFixed(1);
      }
      return d;
    };
    function render() {
      user.set(sampleKeys(SWING, t));
      ghost.set(sampleKeys(SWING_IDEAL, t));
      trail.setAttribute("d", trailPath(SWING, t));
      trailIdeal.setAttribute("d", trailPath(SWING_IDEAL, t));
      sin.value = Math.round(t * 1000);
      prog.style.width = t * 100 + "%";
      knob.style.left = `calc(${t * 100}% + ${12 - t * 24}px)`;
      $("#ov-ts").textContent = (t * 1.42).toFixed(2) + "s";
      let i = 0;
      PHASES.forEach((p, k) => { if (t >= p.t) i = k; });
      if (i !== cur) {
        cur = i;
        const p = PHASES[i];
        $("#ov-phase").textContent = p.name;
        $("#ov-idx").textContent = `${i + 1} / 6`;
        chipEls.forEach((c, k) => c.classList.toggle("on", k === i));
        fault.className = "card fault " + (p.s === "ok" ? "" : p.s);
        fT.textContent = p.title;
        fD.textContent = p.desc;
        fB.className = "badge " + ({ ok: "volt", warn: "amber", bad: "red" })[p.s];
        fB.textContent = ({ ok: "On target", warn: "Watch", bad: "Fault" })[p.s];
      }
    }
    const playBtn = $("#ov-play");
    const setPlayIcon = () => { playBtn.innerHTML = icon(playing ? "pause" : "play"); $("svg", playBtn).style.width = "20px"; };
    playBtn.addEventListener("click", () => { playing = !playing; if (playing && t >= 1) t = 0; setPlayIcon(); });
    setPlayIcon();
    sin.addEventListener("input", () => { playing = false; setPlayIcon(); go(sin.value / 1000); });
    sin.addEventListener("pointerdown", () => scrub.classList.add("drag"));
    window.addEventListener("pointerup", () => scrub.classList.remove("drag"));
    $$("#ov-speed button").forEach((b) => b.addEventListener("click", () => {
      speed = +b.dataset.s;
      $$("#ov-speed button").forEach((x) => x.classList.toggle("on", x === b));
    }));
    const isw = $("#ideal-switch");
    isw.addEventListener("click", () => {
      const on = isw.classList.toggle("on");
      ghost.g.style.display = on ? "" : "none";
      trailIdeal.style.display = on ? "" : "none";
    });
    tickers.push((dt) => {
      if (!playing) return;
      if (hold > 0) { hold -= dt; if (hold <= 0) t = 0; return; }
      t += dt * 0.32 * speed;
      if (t >= 1) { t = 1; hold = 1.2; }
      render();
    });
    render();
  })();

  /* ================================================================ 08 EXPLAINER */
  (() => {
    const fig = new Figure($("#vid-svg"));
    const DOWN_P = sampleKeys(SWING_IDEAL, 0.7);
    fig.set(DOWN_P);
    const video = $("#video"), bar = $("#vid-bar"), dur = $("#vid-dur"), cc = $("#vid-cc"), btn = $("#to-drill"), note = $("#drill-note");
    const chs = $$("#chapters .chapter");
    const CC = [[0, "Over the top: the club leaves the plane early…"], [0.34, "Start the downswing from the ground up — hips first."], [0.7, "Now let's groove it with your drill."]];
    const TOTAL = 134, LEN = 9;
    let p = 0, playing = false, unlocked = false, st = 0;
    const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
    $("#big-play").addEventListener("click", () => { if (p >= 1) p = 0; playing = true; video.classList.add("playing"); });
    $("#vpause").addEventListener("click", () => { playing = false; video.classList.remove("playing"); });
    tickers.push((dt) => {
      if (!playing) return;
      p = Math.min(1, p + dt / LEN);
      st = (st + dt * 0.55) % 1;
      fig.set(sampleKeys(SWING_IDEAL, st));
      bar.style.width = p * 100 + "%";
      dur.textContent = fmt(p * TOTAL) + " / 2:14";
      let c = CC[0][1];
      CC.forEach(([at, txt]) => { if (p >= at) c = txt; });
      if (cc.textContent !== c) cc.textContent = c;
      chs.forEach((ch, i) => {
        const a = +ch.dataset.at, b = i < chs.length - 1 ? +chs[i + 1].dataset.at : 1;
        ch.classList.toggle("on", p >= a && p < b);
        ch.classList.toggle("done", p >= b);
        $(".t", ch).style.setProperty("--p", clamp((p - a) / (b - a), 0, 1) * 100 + "%");
      });
      if (p >= 1) {
        playing = false;
        video.classList.remove("playing");
        fig.set(DOWN_P);
        dur.textContent = "Replay · 2:14";
        if (!unlocked) unlock();
      }
    });
    function unlock() {
      unlocked = true;
      btn.disabled = false;
      btn.innerHTML = '<i data-icon="play"></i>Go to drill';
      hydrateIcons(btn);
      btn.classList.add("unlocked");
      note.innerHTML = icon("check").replace("<svg", '<svg width="13" height="13"') + "Video complete · drill unlocked";
      note.style.color = "var(--volt)";
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.innerHTML = icon("check").replace("<svg", '<svg width="20" height="20"') + "Drill 04 unlocked — Arm & Torso Separation";
      $(".screen", video.closest(".phone")).appendChild(toast);
      requestAnimationFrame(() => toast.classList.add("show"));
      buzz(video.closest(".phone"));
      setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 400); }, 2600);
    }
  })();
})();
