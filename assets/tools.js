/* tools.js — small hands-on tools used on reading pages and slides.
 * Each mount function takes (element, ui strings, lang). */
window.Tools = (function () {
  const { rb, esc, fill } = window.AI;

  function binary(el, u) {
    const vals = [128, 64, 32, 16, 8, 4, 2, 1];
    let on = new Array(8).fill(false);
    let target = 13;
    el.innerHTML = `<h3>${rb(u.binTitle)}</h3><p class="help">${rb(u.binHelp)}</p>
      <div class="bits">${vals.map((v, i) => `<button type="button" class="bit" aria-pressed="false" data-i="${i}"><span class="v">${v}</span><span class="b">0</span></button>`).join("")}</div>
      <div class="readout"><span>${rb(u.binBin)}: <b class="o-bin">00000000</b></span><span>${rb(u.binDec)}: <b class="o-dec">0</b></span></div>
      <div class="challenge"><span class="o-ch"></span><span class="okmsg" hidden>${rb(u.binOk)}</span><button type="button" class="btn o-new">${rb(u.binNew)}</button></div>`;
    const btns = [...el.querySelectorAll(".bit")];
    const draw = () => {
      btns.forEach((b, i) => { b.setAttribute("aria-pressed", on[i]); b.querySelector(".b").textContent = on[i] ? "1" : "0"; });
      const dec = on.reduce((a, x, i) => a + (x ? vals[i] : 0), 0);
      el.querySelector(".o-bin").textContent = on.map(x => (x ? "1" : "0")).join("");
      el.querySelector(".o-dec").textContent = dec;
      el.querySelector(".o-ch").innerHTML = rb(fill(u.binChallenge, { n: target }));
      el.querySelector(".okmsg").hidden = dec !== target;
    };
    btns.forEach((b, i) => b.addEventListener("click", () => { on[i] = !on[i]; draw(); }));
    el.querySelector(".o-new").addEventListener("click", () => {
      let n; do { n = 1 + Math.floor(Math.random() * 63); } while (n === target);
      target = n; on = new Array(8).fill(false); draw();
    });
    draw();
  }

  function text(el, u) {
    el.innerHTML = `<h3>${rb(u.txtTitle)}</h3><p class="help">${rb(u.txtHelp)}</p>
      <input type="text" class="o-in" value="AI あ" aria-label="text" style="width:100%">
      <div style="overflow-x:auto"><table class="chars"><thead><tr><th>${rb(u.txtChar)}</th><th>${rb(u.txtCode)}</th><th>${rb(u.txtBytes)}</th></tr></thead><tbody></tbody></table></div>`;
    const inp = el.querySelector(".o-in"), tb = el.querySelector("tbody");
    const enc = new TextEncoder();
    const draw = () => {
      const chars = Array.from(inp.value).slice(0, 12);
      tb.innerHTML = chars.map(ch => {
        const cp = ch.codePointAt(0);
        const bytes = [...enc.encode(ch)].map(b => b.toString(2).padStart(8, "0"));
        const shown = ch === " " ? "␣" : ch;
        return `<tr><td class="c">${esc(shown)}</td><td>${cp}<br><code>U+${cp.toString(16).toUpperCase().padStart(4, "0")}</code></td><td><code>${bytes.join(" ")}</code><br><span class="note">${esc(fill(u.txtN, { n: bytes.length }))}</span></td></tr>`;
      }).join("");
    };
    inp.addEventListener("input", draw);
    draw();
  }

  function pixel(el, u) {
    const start = ["00111100", "01000010", "10100101", "10000001", "10100101", "10011001", "01000010", "00111100"];
    let g = start.map(r => r.split("").map(c => c === "1"));
    el.innerHTML = `<h3>${rb(u.pxTitle)}</h3><p class="help">${rb(u.pxHelp)}</p>
      <div class="pxwrap"><div class="px" role="grid" aria-label="pixels">${g.flat().map((x, i) => `<button type="button" aria-pressed="${x}" data-i="${i}" aria-label="${i % 8 + 1},${Math.floor(i / 8) + 1}"></button>`).join("")}</div>
      <pre class="pxcode"></pre></div>
      <div style="margin-top:10px"><button type="button" class="btn o-clr">${rb(u.pxClear)}</button></div>`;
    const cells = [...el.querySelectorAll(".px button")], code = el.querySelector(".pxcode");
    const draw = () => {
      cells.forEach((b, i) => b.setAttribute("aria-pressed", g[Math.floor(i / 8)][i % 8]));
      code.textContent = g.map(r => r.map(x => (x ? "1" : "0")).join("")).join("\n");
    };
    let painting = null;
    cells.forEach((b, i) => {
      b.addEventListener("pointerdown", e => { e.preventDefault(); const r = Math.floor(i / 8), c = i % 8; painting = !g[r][c]; g[r][c] = painting; draw(); });
      b.addEventListener("pointerenter", () => { if (painting === null) return; g[Math.floor(i / 8)][i % 8] = painting; draw(); });
      b.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const r = Math.floor(i / 8), c = i % 8; g[r][c] = !g[r][c]; draw(); } });
    });
    window.addEventListener("pointerup", () => { painting = null; });
    el.querySelector(".o-clr").addEventListener("click", () => { g = g.map(r => r.map(() => false)); draw(); });
    draw();
  }

  function color(el, u) {
    const v = { r: 255, g: 79, b: 0 };
    el.innerHTML = `<h3>${rb(u.colTitle)}</h3><p class="help">${rb(u.colHelp)}</p>
      <div class="colwrap"><div class="swatch"></div><div class="sliders">
      ${["r", "g", "b"].map(k => `<label><span>${rb(u["col" + k.toUpperCase()])}</span><input type="range" min="0" max="255" value="${v[k]}" data-k="${k}"><output>${v[k]}</output></label>`).join("")}
      <p class="note o-code" style="margin:4px 0 0"></p></div></div>`;
    const sw = el.querySelector(".swatch"), out = el.querySelector(".o-code");
    const draw = () => {
      sw.style.background = `rgb(${v.r},${v.g},${v.b})`;
      out.textContent = `(R, G, B) = (${v.r}, ${v.g}, ${v.b})  →  ${[v.r, v.g, v.b].map(n => n.toString(2).padStart(8, "0")).join(" ")}`;
    };
    el.querySelectorAll("input").forEach(inp => inp.addEventListener("input", () => { v[inp.dataset.k] = +inp.value; inp.nextElementSibling.textContent = inp.value; draw(); }));
    draw();
  }

  function wave(el, u) {
    let n = 8;
    el.innerHTML = `<h3>${rb(u.waveTitle)}</h3><p class="help">${rb(u.waveHelp)}</p>
      <svg viewBox="0 0 600 220" role="img" aria-label="wave"></svg>
      <label class="sliders" style="margin-top:10px;display:block"><span>${rb(u.waveN)}: <b class="o-n">8</b></span><input type="range" min="2" max="40" value="8"></label>`;
    const svg = el.querySelector("svg"), inp = el.querySelector("input"), on = el.querySelector(".o-n");
    const f = x => 0.6 * Math.sin(x * 2 * Math.PI) + 0.3 * Math.sin(x * 6 * Math.PI + 1);
    const W = 600, H = 220, P = 20, Y = y => H / 2 - y * (H / 2 - P);
    const draw = () => {
      const cycles = 2, total = n * cycles;
      let true_ = "";
      for (let i = 0; i <= 300; i++) { const x = i / 300; true_ += (i ? "L" : "M") + (P + x * (W - 2 * P)).toFixed(1) + " " + Y(f(x * cycles)).toFixed(1); }
      let steps = "", dots = "";
      for (let k = 0; k <= total; k++) {
        const x = k / total, px = P + x * (W - 2 * P), py = Y(f(x * cycles));
        const nx = P + Math.min(1, (k + 1) / total) * (W - 2 * P);
        steps += (k ? "L" : "M") + px.toFixed(1) + " " + py.toFixed(1) + "L" + nx.toFixed(1) + " " + py.toFixed(1);
        dots += `<line x1="${px.toFixed(1)}" y1="${(H / 2).toFixed(1)}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="#ff4f00" stroke-width="2"/><circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4" fill="#ff4f00"/>`;
      }
      svg.innerHTML = `<line x1="${P}" y1="${H / 2}" x2="${W - P}" y2="${H / 2}" stroke="currentColor" stroke-opacity=".25"/>
        <path d="${true_}" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-width="3"/>
        <path d="${steps}" fill="none" stroke="#ff4f00" stroke-opacity=".55" stroke-width="2"/>${dots}`;
      on.textContent = n;
    };
    inp.addEventListener("input", () => { n = +inp.value; draw(); });
    draw();
  }

  /* ---------- character encodings ---------- */
  const hex2 = n => n.toString(16).toUpperCase().padStart(2, "0");
  const bin8 = n => n.toString(2).padStart(8, "0");
  /* Reverse tables (character -> bytes) built once from the browser's own decoders. */
  const REV = {};
  function buildRev(label) {
    if (REV[label]) return REV[label];
    const m = new Map();
    let dec;
    try { dec = new TextDecoder(label, { fatal: true }); } catch (e) { REV[label] = m; return m; }
    const put = bytes => {
      let s;
      try { s = dec.decode(new Uint8Array(bytes)); } catch (e) { return; }
      if (!s || s.includes("�") || Array.from(s).length !== 1) return;
      if (!m.has(s)) m.set(s, bytes);
    };
    const single = label === "windows-1252" ? [0, 255] : [0, 0x7f];
    for (let b = single[0]; b <= single[1]; b++) put([b]);
    const two = { shift_jis: [[0x81, 0x9f], [0xe0, 0xfc], [0x40, 0xfc]], "euc-jp": [[0xa1, 0xfe], null, [0xa1, 0xfe]], gbk: [[0x81, 0xfe], null, [0x40, 0xfe]], big5: [[0x81, 0xfe], null, [0x40, 0xfe]] }[label];
    if (label === "shift_jis") for (let b = 0xa1; b <= 0xdf; b++) put([b]);
    if (label === "euc-jp") for (let b = 0xa1; b <= 0xdf; b++) put([0x8e, b]);
    if (two) {
      const leads = [two[0], two[1]].filter(Boolean);
      for (const [a, z] of leads) for (let l = a; l <= z; l++) for (let t = two[2][0]; t <= two[2][1]; t++) put([l, t]);
    }
    REV[label] = m;
    return m;
  }
  const ENCS = [
    { id: "ascii", name: "ASCII", lab: "encEn", enc: ch => { const c = ch.codePointAt(0); return c < 128 ? [c] : null; } },
    { id: "windows-1252", name: "Latin-1 (Windows-1252)", lab: "encWest" },
    { id: "shift_jis", name: "Shift_JIS", lab: "encJa" },
    { id: "euc-jp", name: "EUC-JP", lab: "encJa" },
    { id: "gbk", name: "GBK", lab: "encZhS" },
    { id: "big5", name: "Big5", lab: "encZhT" },
    { id: "utf-8", name: "UTF-8", lab: "encWorld", enc: ch => [...new TextEncoder().encode(ch)] },
    { id: "utf-16be", name: "UTF-16", lab: "encWorld", enc: ch => { const o = []; for (let i = 0; i < ch.length; i++) { const u = ch.charCodeAt(i); o.push(u >> 8, u & 255); } return o; } },
    { id: "utf-32", name: "UTF-32", lab: "encWorld", enc: ch => { const c = ch.codePointAt(0); return [(c >>> 24) & 255, (c >> 16) & 255, (c >> 8) & 255, c & 255]; } }
  ];
  function encodeChar(e, ch) { if (e.enc) return e.enc(ch); const b = buildRev(e.id).get(ch); return b ? b.slice() : null; }

  function enc(el, u) {
    const presets = ["A", "é", "あ", "漢", "中", "क", "ক", "ක", "က", "ệ", "😀"];
    el.innerHTML = `<h3>${rb(u.encTitle)}</h3><p class="help">${rb(u.encHelp)}</p>
      <div class="chips">${presets.map(p => `<button type="button" class="chip" data-c="${esc(p)}">${esc(p)}</button>`).join("")}</div>
      <input type="text" class="o-in" value="あ" aria-label="text" style="width:100%;margin-top:8px">
      <div class="o-out"></div>`;
    const inp = el.querySelector(".o-in"), out = el.querySelector(".o-out");
    const draw = () => {
      const chars = Array.from(inp.value).slice(0, 4);
      out.innerHTML = chars.map(ch => {
        const cp = ch.codePointAt(0);
        const rows = ENCS.map(e => {
          const b = encodeChar(e, ch);
          if (!b) return `<tr class="no"><th>${esc(e.name)}<span>${rb(u[e.lab])}</span></th><td colspan="2">✕ ${rb(u.encNo)}</td></tr>`;
          const num = b.reduce((a, x) => a * 256 + x, 0);
          return `<tr><th>${esc(e.name)}<span>${rb(u[e.lab])}</span></th><td><code class="hx">${b.map(hex2).join(" ")}</code><br><span class="note">${esc(fill(u.txtN, { n: b.length }))} · ${num}</span></td><td><code>${b.map(bin8).join(" ")}</code></td></tr>`;
        }).join("");
        return `<div class="enccard"><div class="encch">${esc(ch === " " ? "␣" : ch)}<span>Unicode U+${cp.toString(16).toUpperCase().padStart(4, "0")} (${cp})</span></div>
          <div style="overflow-x:auto"><table class="chars enc"><thead><tr><th>${rb(u.encName)}</th><th>${rb(u.encHex)}</th><th>${rb(u.encBin)}</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
      }).join("");
    };
    el.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => { inp.value = c.dataset.c; draw(); }));
    inp.addEventListener("input", draw);
    draw();
  }

  function moji(el, u) {
    const opts = ENCS.filter(e => e.id !== "ascii" && e.id !== "utf-32");
    const sel = (cls, v) => `<select class="${cls}">${opts.map(e => `<option value="${e.id}"${e.id === v ? " selected" : ""}>${esc(e.name)}</option>`).join("")}</select>`;
    const presets = [["utf-8", "shift_jis"], ["shift_jis", "utf-8"], ["utf-8", "windows-1252"], ["gbk", "big5"]];
    el.innerHTML = `<h3>${rb(u.mojiTitle)}</h3><p class="help">${rb(u.mojiHelp)}</p>
      <input type="text" class="o-in" value="文字化け" aria-label="text" style="width:100%">
      <div class="mojisel"><label><span>${rb(u.mojiSave)}</span>${sel("o-s", "utf-8")}</label><span class="arrow">→</span><label><span>${rb(u.mojiRead)}</span>${sel("o-r", "shift_jis")}</label></div>
      <div class="chips">${presets.map(p => `<button type="button" class="chip" data-s="${p[0]}" data-r="${p[1]}">${esc(opts.find(e => e.id === p[0]).name)} → ${esc(opts.find(e => e.id === p[1]).name)}</button>`).join("")}</div>
      <div class="mojiout"><div><span class="note">${rb(u.mojiBytes)}</span><code class="o-b"></code></div><div><span class="note">${rb(u.mojiResult)}</span><div class="o-res"></div></div><p class="err o-err" hidden></p></div>`;
    const inp = el.querySelector(".o-in"), s = el.querySelector(".o-s"), r = el.querySelector(".o-r");
    const draw = () => {
      const e = ENCS.find(x => x.id === s.value);
      const bytes = [], miss = [];
      for (const ch of Array.from(inp.value).slice(0, 40)) { const b = encodeChar(e, ch); if (b) bytes.push(...b); else { miss.push(ch); bytes.push(0x3f); } }
      el.querySelector(".o-b").textContent = bytes.map(hex2).join(" ");
      let res = "";
      try { res = new TextDecoder(r.value).decode(new Uint8Array(bytes)); } catch (x) { res = "?"; }
      el.querySelector(".o-res").textContent = res;
      const er = el.querySelector(".o-err");
      er.hidden = !miss.length;
      if (miss.length) er.innerHTML = rb(fill(u.mojiCant, { c: miss.join(" ") }));
    };
    [inp, s, r].forEach(x => x.addEventListener(x === inp ? "input" : "change", draw));
    el.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => { s.value = c.dataset.s; r.value = c.dataset.r; draw(); }));
    draw();
  }

  /* ---------- photo pixels ---------- */
  function photo(el, u) {
    const N = 32;
    el.innerHTML = `<h3>${rb(u.photoTitle)}</h3><p class="help">${rb(u.photoHelp)}</p>
      <div class="chips"><label class="btn primary" style="cursor:pointer">${rb(u.photoPick)}<input type="file" accept="image/*" class="o-file" hidden></label><button type="button" class="btn o-sample">${rb(u.photoSample)}</button></div>
      <div class="photowrap"><canvas class="mosaic" width="${N * 12}" height="${N * 12}" aria-label="pixels"></canvas>
      <div class="pxinfo"><div class="pxsw"></div><table class="chars"><tbody></tbody></table></div></div>`;
    const cv = el.querySelector(".mosaic"), ctx = cv.getContext("2d");
    const small = document.createElement("canvas"), sctx = small.getContext("2d", { willReadFrequently: true });
    let W = N, H = N, sel = [7, 14], data = null;
    const sample = () => {
      W = N; H = 24; small.width = W; small.height = H;
      const g = sctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1e5bd8"); g.addColorStop(0.65, "#9fd3ff");
      sctx.fillStyle = g; sctx.fillRect(0, 0, W, H);
      sctx.fillStyle = "#ffb000"; sctx.beginPath(); sctx.arc(24, 6, 4, 0, 7); sctx.fill();
      sctx.fillStyle = "#2f8f3a"; sctx.fillRect(0, 17, W, 7);
      sctx.fillStyle = "#ff4f00"; sctx.fillRect(6, 12, 8, 6); sctx.fillStyle = "#7a2a10"; sctx.beginPath(); sctx.moveTo(5, 12); sctx.lineTo(10, 8); sctx.lineTo(15, 12); sctx.fill();
      sctx.fillStyle = "#ffffff"; sctx.fillRect(9, 14, 2, 4);
      done();
    };
    const done = () => {
      data = sctx.getImageData(0, 0, W, H).data;
      cv.width = W * 12; cv.height = H * 12;
      sel = [Math.min(sel[0], W - 1), Math.min(sel[1], H - 1)];
      draw();
    };
    const draw = () => {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, W, H, 0, 0, cv.width, cv.height);
      ctx.strokeStyle = "rgba(0,0,0,.15)"; ctx.lineWidth = 1;
      for (let x = 0; x <= W; x++) { ctx.beginPath(); ctx.moveTo(x * 12 + .5, 0); ctx.lineTo(x * 12 + .5, cv.height); ctx.stroke(); }
      for (let y = 0; y <= H; y++) { ctx.beginPath(); ctx.moveTo(0, y * 12 + .5); ctx.lineTo(cv.width, y * 12 + .5); ctx.stroke(); }
      const [x, y] = sel, i = (y * W + x) * 4, rgb = [data[i], data[i + 1], data[i + 2]];
      ctx.lineWidth = 3; ctx.strokeStyle = "#fff"; ctx.strokeRect(x * 12 + 1.5, y * 12 + 1.5, 9, 9); ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.strokeRect(x * 12 + .5, y * 12 + .5, 12, 12);
      const code = "#" + rgb.map(hex2).join("");
      el.querySelector(".pxsw").style.background = code;
      el.querySelector(".pxinfo tbody").innerHTML =
        `<tr><th>${rb(u.photoPos)}</th><td colspan="3">(${x + 1}, ${y + 1})</td></tr>
         <tr><th></th><th>${rb(u.photoDec)}</th><th>${rb(u.photoBin)}</th><th>${rb(u.photoHex)}</th></tr>` +
        rgb.map((v, k) => `<tr><th><span class="ch ch${k}">${"RGB"[k]}</span></th><td>${v}</td><td><code>${bin8(v)}</code></td><td><code>${hex2(v)}</code></td></tr>`).join("") +
        `<tr><th>${rb(u.photoCode)}</th><td colspan="3"><code style="font-size:22px">#<span style="color:#d62828">${hex2(rgb[0])}</span><span style="color:#2a9d3a">${hex2(rgb[1])}</span><span style="color:#1e5bd8">${hex2(rgb[2])}</span></code></td></tr>`;
    };
    const pick = e => {
      const r = cv.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left) / r.width * W), y = Math.floor((e.clientY - r.top) / r.height * H);
      if (x >= 0 && y >= 0 && x < W && y < H) { sel = [x, y]; draw(); }
    };
    cv.addEventListener("pointerdown", e => { pick(e); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener("pointermove", e => { if (e.buttons) pick(e); });
    el.querySelector(".o-file").addEventListener("change", ev => {
      const f = ev.target.files && ev.target.files[0]; if (!f) return;
      const url = URL.createObjectURL(f), img = new Image();
      img.onload = () => {
        const k = N / Math.max(img.width, img.height);
        W = Math.max(1, Math.round(img.width * k)); H = Math.max(1, Math.round(img.height * k));
        small.width = W; small.height = H; sctx.drawImage(img, 0, 0, W, H);
        URL.revokeObjectURL(url); sel = [Math.floor(W / 2), Math.floor(H / 2)]; done();
      };
      img.src = url;
    });
    el.querySelector(".o-sample").addEventListener("click", () => { sel = [7, 14]; sample(); });
    sample();
  }

  /* ---------- horse racing: practice race card (fictional) ---------- */
  function card(el, u) {
    const H = [
      [1, 1, "サクラノカゼ", "牡4", 57, "山本 一郎", "486(+2)", "1着 G3"],
      [2, 2, "ブルーオーシャン", "牝5", 55, "佐藤 花子", "452(-4)", "5着 G2"],
      [3, 3, "テンクウノオウ", "牡6", 58, "鈴木 健", "502(+10)", "12着 G1"],
      [4, 4, "ミドリノヒカリ", "牝4", 55, "田中 美咲", "468(0)", "2着 3勝クラス"],
      [5, 5, "ハヤテマル", "牡3", 56, "高橋 翔", "478(-2)", "1着 3勝クラス"],
      [6, 6, "ゴールドラッシュ", "セ7", 57, "伊藤 大地", "510(+6)", "8着 G3"],
      [7, 7, "ユメミルソラ", "牝3", 54, "渡辺 葵", "440(-8)", "3着 G2"],
      [8, 8, "アカツキボーイ", "牡5", 57, "中村 蓮", "494(+4)", "4着 オープン"]
    ];
    const waku = ["#ffffff", "#222222", "#e53935", "#1e5bd8", "#f2c200", "#2e9d3a", "#f57c00", "#ec6fa8"];
    const wtext = ["#111", "#fff", "#fff", "#fff", "#111", "#fff", "#fff", "#111"];
    el.innerHTML = `<h3>${rb(u.cardTitle)}</h3><p class="help">${rb(u.cardHelp)}</p>
      <div class="racehead"><b>${rb(u.cardRace)}</b><span>${rb(u.cardCond)}</span></div>
      <div style="overflow-x:auto"><table class="chars racecard"><thead><tr>${["cardW", "cardN", "cardName", "cardSexAge", "cardKin", "cardJockey", "cardWeight", "cardLast"].map(k => `<th>${rb(u[k])}</th>`).join("")}</tr></thead>
      <tbody>${H.map(h => `<tr><td><span class="waku" style="background:${waku[h[0] - 1]};color:${wtext[h[0] - 1]}">${h[0]}</span></td><td>${h[1]}</td><td class="hn">${esc(h[2])}</td><td>${esc(h[3])}</td><td>${h[4]}</td><td>${esc(h[5])}</td><td>${esc(h[6])}</td><td>${esc(h[7])}</td></tr>`).join("")}</tbody></table></div>
      <p class="note">${rb(u.cardNote)}</p>`;
  }

  /* ---------- parimutuel odds: money in, odds out ---------- */
  function odds(el, u) {
    const names = ["サクラノカゼ", "ブルーオーシャン", "テンクウノオウ", "ミドリノヒカリ", "ハヤテマル", "ゴールドラッシュ"];
    const bet = [40, 15, 5, 20, 30, 3];
    el.innerHTML = `<h3>${rb(u.oddsTitle)}</h3><p class="help">${rb(u.oddsHelp)}</p>
      <div class="oddsrows">${names.map((n, i) => `<div class="orow"><span class="on">${i + 1}. ${esc(n)}</span><input type="range" min="1" max="60" value="${bet[i]}" data-i="${i}" aria-label="${esc(n)}"><span class="ob"></span><span class="oo"></span><span class="op"></span></div>`).join("")}</div>
      <div class="osum"></div>`;
    const rows = [...el.querySelectorAll(".orow")];
    const draw = () => {
      const total = bet.reduce((a, b) => a + b, 0), pool = total * 0.8;
      const od = bet.map(b => Math.max(1, Math.floor(pool / b * 10) / 10));
      const order = od.map((o, i) => [o, i]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
      rows.forEach((r, i) => {
        r.querySelector(".ob").innerHTML = rb(fill(u.oddsMan, { n: bet[i] }));
        r.querySelector(".oo").textContent = od[i].toFixed(1) + (u.oddsX || "");
        r.querySelector(".op").innerHTML = rb(fill(u.oddsPop, { n: order.indexOf(i) + 1 }));
        r.classList.toggle("fav", order[0] === i);
      });
      el.querySelector(".osum").innerHTML = rb(fill(u.oddsSum, { t: total, p: Math.round(pool * 10) / 10 }));
    };
    el.querySelectorAll("input").forEach(inp => inp.addEventListener("input", () => { bet[+inp.dataset.i] = +inp.value; draw(); }));
    draw();
  }

  const all = { binary, text, pixel, color, wave, enc, moji, photo, card, odds };
  function mount(root, u) { root.querySelectorAll("[data-tool]").forEach(el => { const t = all[el.dataset.tool]; if (t) { el.classList.add("tool"); t(el, u); } }); }
  return { mount };
})();
