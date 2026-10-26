# PTE Decode Academy website

A multi-page website for PTE Decode Academy, with the Student and Teacher portals built in. It's designed for GitHub Pages and uses your existing Google Sheet (Apps Script) as its online storage.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | Home |
| `pte-academic.html`, `pte-core.html` | Exam pages: about the exam, format, scores, courses, results, FAQ |
| `results.html` | Student certificates, which you upload from the Teacher Portal |
| `about.html`, `faq.html`, `contact.html` | About, FAQ and contact (the enquiry form opens WhatsApp) |
| `payments.html` | Card payment (Visa and Mastercard), CliQ and bank transfer |
| `portal.html` | Student Portal (`portal.html`) and Teacher Portal (`portal.html#teacher`) |
| `assets/config.js` | **The only file you edit:** paste your Apps Script Web app URL |
| `assets/site.css`, `assets/site.js`, `assets/logo*.{png,jpg}` | Shared design, behaviour and logo |

Never upload `Code-gs-COPY-ME.txt` to GitHub. It contains your teacher password.

## Setup

1. **Update the Apps Script.** Paste `Code-gs-COPY-ME.txt` into Apps Script and set `TEACHER_PASSWORD`. Then click **Deploy → Manage deployments → ✏️ → New version → Deploy**. Your Web app URL should now show `"version":5`.
2. **Connect the website.** In `assets/config.js`, paste your Web app URL into `apiUrl: ""`.
3. **Upload to GitHub.** Create a repository, e.g. `ptedecode-website`, and click **Add file → Upload files**. Drag in **everything in this folder, including the `assets` folder**, then click **Commit changes**.
4. **Turn on GitHub Pages.** Go to **Settings → Pages → Deploy from a branch → main / (root)**.
5. **Fill in the Website tab.** Open `…/portal.html#teacher`, sign in and open the **Website** tab. Add:
   - your WhatsApp number and Instagram link
   - prices, card payment links and CliQ details
   - auto-reply topics
   - student results

## Card payments (Visa and Mastercard)

The website never handles card numbers. Each **Pay by card** button opens a secure payment page from your payment provider.

1. Open a merchant account with a provider that serves Jordan, for example your bank's e-commerce gateway, HyperPay, PayTabs, Network International (N-Genius) or MEPS.
2. In the provider's dashboard, create a **payment link** (sometimes called a "pay-by-link" or invoice link) for each course.
3. Paste each link into **Teacher Portal → Website → Prices & card payments**.

Until a link is added, that course shows **Request a card payment link**, which opens WhatsApp. CliQ and bank transfer details are shown when you add them.

## WhatsApp auto-replies

- **On the website:** the green WhatsApp button opens an assistant with instant answers. Edit the topics in **Teacher Portal → Website → WhatsApp auto-replies**. Type `{prices}` in an answer to insert the live price list.
- **In the WhatsApp Business app:** under **Settings → Business tools**, turn on a **Greeting message** and an **Away message**, and add **Quick replies** (e.g. `/prices`, `/pay`).

## Moving the Student Portal from the old repository

1. Tell students to submit any unsent practice answers first. Unsent answers stay in their browser at the old address.
2. In the old `pte-core-practice` repository, replace `index.html` with `old-practice-repo/index.html`. Edit the `NEW_PORTAL` address in that file first. Old invite links then forward to the new portal.
3. Students sign in once more with the same access code. Their codes, submitted work and feedback are unchanged.

## Custom domain

Follow the launch plan:
- Set **Settings → Pages → Custom domain** to `www.yourdomain.com`.
- Add the A and CNAME records at your domain provider.
- Tick **Enforce HTTPS**.
