/* schedule.js — Wednesday classes (class numbers follow the school calendar).
 * Set ready: true when a lesson folder lessons/<id>/ exists. */
window.SCHEDULE = [
  { id: "06", n: 6, date: "2026-11-25", ready: true },
  { id: "07", n: 7, date: "2026-12-02" },
  { id: "08", n: 8, date: "2026-12-09" },
  { id: "09", n: 9, date: "2026-12-16" },
  { id: "10", n: 10, date: "2027-01-13", breakBefore: true },
  { id: "11", n: 11, date: "2027-01-20" },
  { id: "12", n: 12, date: "2027-01-27" },
  { id: "13", n: 13, date: "2027-02-03" },
  { id: "14", n: 14, date: "2027-02-10" },
  { id: "15", n: 15, date: "2027-02-17" },
  { id: "16", n: 16, date: "2027-02-24" }
];
window.fmtDate = function (iso, loc, weekday) {
  const [y, m, d] = iso.split("-").map(Number);
  const o = { month: "short", day: "numeric", timeZone: "UTC" };
  if (weekday !== false) o.weekday = "short";
  try { return new Intl.DateTimeFormat(loc, o).format(new Date(Date.UTC(y, m - 1, d))); } catch (e) { return m + "/" + d; }
};
