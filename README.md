# Rising Skills Pathways Initiative — website (risingskills.org)

Programmes on the site: **Rising Techies** (girls-in-tech school outreach) and **Rising Studio** (bilingual YouTube & social content).

## File structure

```
index.html          Home
about.html          About
programs.html       Programs
gallery.html        Gallery (photos + YouTube videos)
contact.html        Contact
404.html            "Page not found" page (GitHub Pages uses it automatically)
header.html         ← shared nav, loaded into every page automatically
footer.html         ← shared footer, loaded into every page automatically
site.js             ← loads header/footer, mobile menu, animations, video cards, contact form
styles.css
responsive.css
CNAME               ← tells GitHub Pages the site lives at risingskills.org (don't delete)
.nojekyll           ← tells GitHub Pages to serve files as-is (don't delete)
favicon.ico, favicon.svg, apple-touch-icon.png,
android-chrome-192x192.png, android-chrome-512x512.png, site.webmanifest
                    ← browser-tab and phone home-screen icons (from the logo pack; keep them in this top folder)
assets/RSP-symbol-colour.svg      ← logo symbol in the header and the "page not found" page
assets/RSP-symbol-reversed.svg    ← logo symbol in the dark footer
assets/RSP-logo-colour-1024px.png/.webp  ← full logo on the About page
assets/link-preview-1200x630.png  ← image shown when the site is shared on WhatsApp, Facebook, LinkedIn
assets/outreach-*.jpg             ← outreach photos on the Gallery page
```

## Editing the site

- **Nav, footer (email, social links, copyright):** edit `header.html` or `footer.html` ONCE — every page picks it up.
- **Page content:** edit that page's own `.html` file.
- **Colors, fonts, spacing:** `styles.css` (colours come from the logo pack; the list is at the top of the file). **Mobile breakpoints:** `responsive.css`.

### Adding a YouTube video (gallery.html)
Paste the video link into `data-youtube=""` on a video card, e.g.
`data-youtube="https://youtu.be/XXXXXXXXXXX"`. The thumbnail and link fill in automatically.
Empty slots link to the channel (youtube.com/@risingtechies).

### Adding a photo (gallery.html)
See the comment above the gallery grid. Put photos in `assets/`, keep them under ~300 KB each
(resize to about 1200px wide) so the page loads fast on mobile data.

### Contact form (contact.html)
The form uses **Formspree** (free) because GitHub Pages can't receive form submissions itself.
1. Sign up at formspree.io using info@risingskills.org
2. Create a form and copy its ID (looks like `xyzabcde`)
3. In `contact.html`, replace `YOUR_FORM_ID` with it
Until then, pressing "Send message" opens the visitor's email app addressed to info@risingskills.org.

## Previewing locally

The header and footer load with JavaScript (`fetch`), so double-clicking `index.html` shows a blank nav and footer.
Run a small local server instead:

```
python3 -m http.server 8000
```
then open http://localhost:8000 — or use VS Code's "Live Server" extension.

## Hosting on GitHub Pages with risingskills.org

1. Create a free GitHub account (ideally with info@risingskills.org) and a **public** repository, e.g. `risingskills-website`.
2. Upload every file in this folder (including `CNAME`, `.nojekyll` and the `assets` folder) to the repository.
3. In the repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. In **Namecheap → Domain List → risingskills.org → Advanced DNS**, add:
   - Four `A` records, host `@`, values: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One `CNAME` record, host `www`, value `<your-github-username>.github.io.`
   - Keep the existing MX/TXT records for Private Email — don't delete them, or email will stop working.
5. Back in **Settings → Pages**, the custom domain should show `risingskills.org`. Once the DNS check passes (minutes to a few hours), tick **Enforce HTTPS**.
