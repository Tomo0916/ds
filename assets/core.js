/* core.js — language handling shared by every page.
 * Same 11 languages and order as the SQL practice app.
 * {漢字|かんじ} = furigana (used in easy.json). {name} = value inserted by the page. */
window.AI = (function () {
  const LANGS = [
    ["ja", "日本語 (Japanese)", "ja-JP"],
    ["easy", "やさしい にほんご (Easy Japanese)", "ja-JP"],
    ["en", "English", "en"],
    ["ne", "नेपाली (Nepali)", "ne"],
    ["fr", "Français", "fr"],
    ["my", "မြန်မာ (Burmese)", "my"],
    ["bn", "বাংলা (Bengali)", "bn"],
    ["si", "සිංහල (Sinhala)", "si"],
    ["id", "Bahasa Indonesia", "id"],
    ["vi", "Tiếng Việt", "vi"],
    ["zh", "中文 (Chinese)", "zh-CN"]
  ];
  const CODES = LANGS.map(l => l[0]);
  const KEY = "ai-class-lang";
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rb = s => esc(s).replace(/\{([^{}|]+)\|([^{}]+)\}/g, "<ruby>$1<rt>$2</rt></ruby>");
  const plain = s => String(s).replace(/\{([^{}|]+)\|([^{}]+)\}/g, "$1");
  const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => (v && v[k] !== undefined ? v[k] : m));
  const store = {
    get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  };
  function detect() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && CODES.includes(q)) return q;
    const s = store.get();
    if (s && CODES.includes(s)) return s;
    const nav = (navigator.languages || [navigator.language || "ja"]).map(x => String(x).slice(0, 2).toLowerCase());
    return nav.find(c => CODES.includes(c)) || "ja";
  }
  const cache = {};
  async function load(path) {
    if (!cache[path]) {
      const r = await fetch(path);
      if (!r.ok) throw new Error(path);
      cache[path] = await r.json();
    }
    return cache[path];
  }
  /* Load each base path's <lang>.json, falling back to Japanese. */
  async function loadAll(bases, lang) {
    try { return await Promise.all(bases.map(b => load(`${b}/${lang}.json`))); }
    catch (e) { if (lang !== "ja") return loadAll(bases, "ja"); throw e; }
  }
  function langSelect(sel, current, onChange) {
    sel.innerHTML = LANGS.map(l => `<option value="${l[0]}">${esc(l[1])}</option>`).join("");
    sel.value = current;
    sel.addEventListener("change", () => onChange(sel.value));
  }
  function apply(lang) {
    store.set(lang);
    const l = LANGS.find(x => x[0] === lang) || LANGS[0];
    document.documentElement.lang = l[2];
    const u = new URL(location.href);
    u.searchParams.set("lang", lang);
    try { history.replaceState(null, "", u); } catch (e) {}
  }
  /* Fill every [data-t="key"] element with ui[key] (ruby allowed). */
  function fillText(ui, root) {
    (root || document).querySelectorAll("[data-t]").forEach(el => {
      const v = ui[el.dataset.t];
      if (v !== undefined) el.innerHTML = rb(v);
    });
  }
  const locale = lang => (LANGS.find(x => x[0] === lang) || LANGS[0])[2];
  return { LANGS, CODES, esc, rb, plain, fill, detect, load, loadAll, langSelect, apply, fillText, locale };
})();
