/* Certification guide data (checked 2026-11). Language-neutral facts only; texts live in i18n/<lang>.json "c.<id>".
   step: 1 = free / start here, 2 = low-cost real exam, 3 = advanced goal
   langs: exam/course languages ("en","ja","more" = other languages too)
   cost: "free" | "low" (≈ up to ¥10,000 / $100) | "mid" (more) ; price: shown as-is
   skills: sql | python | ai | cloud | basics */
window.CERTS = [
  { id: "hr_sql", name: "HackerRank SQL Certification", org: "HackerRank", step: 1, langs: ["en"], cost: "free", price: "$0", fmt: "Basic 30 min · Intermediate 35 min · Advanced", skills: ["sql"], url: "https://www.hackerrank.com/skills-verification" },
  { id: "hr_py", name: "HackerRank Python Certification", org: "HackerRank", step: 1, langs: ["en"], cost: "free", price: "$0", fmt: "online · timed", skills: ["python"], url: "https://www.hackerrank.com/skills-verification" },
  { id: "fcc_db", name: "freeCodeCamp Relational Databases", org: "freeCodeCamp", step: 1, langs: ["en"], cost: "free", price: "$0", fmt: "5 projects + 50-question exam", skills: ["sql"], url: "https://www.freecodecamp.org/learn" },
  { id: "fcc_py", name: "freeCodeCamp Python", org: "freeCodeCamp", step: 1, langs: ["en"], cost: "free", price: "$0", fmt: "projects + final exam", skills: ["python"], url: "https://www.freecodecamp.org/learn" },
  { id: "g_da", name: "Google Data Analytics Professional Certificate", org: "Google / Coursera", step: 2, langs: ["en"], cost: "low", price: "$49 / month (US & Canada)", fmt: "9 courses · ≈150 h", skills: ["basics", "sql", "python"], url: "https://www.coursera.org/professional-certificates/google-data-analytics", course: true },
  { id: "py_intro", name: "Python 3 エンジニア認定入門試験", org: "Pythonエンジニア育成推進協会", step: 2, langs: ["ja"], cost: "low", price: "¥3,300 (student) / ¥6,600", fmt: "40 Q · 60 min · CBT", skills: ["python"], url: "https://cbt.odyssey-com.co.jp/pythonic-exam.html", isNew: true },
  { id: "py_basic", name: "Python 3 エンジニア認定基礎試験", org: "Pythonエンジニア育成推進協会", step: 2, langs: ["ja"], cost: "low", price: "¥5,500 (student) / ¥11,000", fmt: "40 Q · 60 min · CBT · pass 70%", skills: ["python"], url: "https://cbt.odyssey-com.co.jp/pythonic-exam.html" },
  { id: "py_data", name: "Python 3 エンジニア認定データ分析試験", org: "Pythonエンジニア育成推進協会", step: 2, langs: ["ja"], cost: "low", price: "¥5,500 (student) / ¥11,000", fmt: "40 Q · 60 min · CBT · pass 70%", skills: ["python", "basics"], url: "https://cbt.odyssey-com.co.jp/pythonic-exam.html" },
  { id: "dp900", name: "Microsoft Azure Data Fundamentals (DP-900)", org: "Microsoft", step: 2, langs: ["en", "more"], cost: "low", price: "$99 (USA)", fmt: "45 min", skills: ["sql", "cloud", "basics"], url: "https://learn.microsoft.com/credentials/certifications/azure-data-fundamentals/" },
  { id: "aws_aip", name: "AWS Certified AI Practitioner", org: "Amazon Web Services", step: 2, langs: ["en", "ja", "more"], cost: "low", price: "$100", fmt: "65 Q · 90 min", skills: ["ai", "cloud"], url: "https://aws.amazon.com/certification/certified-ai-practitioner/" },
  { id: "aws_mle", name: "AWS Certified Machine Learning Engineer – Associate", org: "Amazon Web Services", step: 3, langs: ["en", "ja", "more"], cost: "mid", price: "—", fmt: "Associate", skills: ["ai", "cloud", "python"], url: "https://aws.amazon.com/certification/" },
  { id: "gcp_mle", name: "Google Cloud Professional Machine Learning Engineer", org: "Google Cloud", step: 3, langs: ["en", "ja"], cost: "mid", price: "$200", fmt: "50–60 Q · 2 h", skills: ["ai", "cloud"], url: "https://cloud.google.com/learn/certification/machine-learning-engineer" }
];
