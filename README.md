# Widows Sons Masonic Riders Association — Chapter Hellas

## 🌐 LIVE WEBSITE

### 👉 https://nglg-gsec.github.io/WSHellas/

**Open the official Chapter Hellas website:**
https://nglg-gsec.github.io/WSHellas/

---

This is the public website of Chapter Hellas. It covers the organization, dress code and regalia, administration and officers, emblem, constitution and by-laws. It also includes the Chapter's document office.

## Live pages

| Page | Link |
| --- | --- |
| Main website | https://nglg-gsec.github.io/WSHellas/ |
| Officers — Αξιωματικοί | https://nglg-gsec.github.io/WSHellas/officers.html |
| Secretary — document office | https://nglg-gsec.github.io/WSHellas/secretary.html |
| Vest Configurator — Build Your Vest | https://dskiad.github.io/wsvest/ |

## Contents of the main website

| Section | What it covers |
| --- | --- |
| Organization | What the Widows Sons are, and what Chapter Hellas is |
| Dress Code | The black leather vest and the fixed arrangement of its patches |
| Extra Regalia | The pin and its two borders: braided silver and gold edge |
| Administration | The officers of the Chapter and their duties |
| Emblem | The official Chapter Hellas emblem and its symbolism |
| Constitution | The Constitution of Chapter Hellas |
| By-Laws | Regulations and operating rules |
| Visitors' Memo | Gifts and visits from Widows Sons chapters abroad, every item numbered |

## Repository layout

| File | What it is |
| --- | --- |
| `index.html` | The main site. It is self-contained except for the files in `assets/`. |
| `officers.html` | The fifteen officers, with their titles and duties. |
| `secretary.html` | The document office: the founding documents and the documents of the Secretariat. |
| `assets/` | Images, the document office scripts (`ws-docs.js`, `ws-pdf.js`, `ws-office.js`) and vendor libraries. |
| `.github/workflows/pages.yml` | Publishes the site to GitHub Pages on every push to `main`. |

## Publishing

Every push to `main` deploys the site automatically through GitHub Actions.
In the repository settings, **Settings → Pages → Source** must be set to **GitHub Actions**.

## Viewing or editing locally

Open `index.html` in any browser, or serve the folder locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

---

Chapter Hellas · Widows Sons Masonic Riders Association
