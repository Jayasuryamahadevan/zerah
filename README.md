# Zerah Labs — Company Website

Premium, manufacturing-first website for **Zerah Labs**.

**Brand:** Your data. We automate. You improve.

## Who it's for

Coimbatore manufacturers: pumps and motors, foundries and castings, auto components, textile machinery, and engineering/fabrication businesses. Messaging speaks to purchase, accounts, stores and operations teams, with concrete terms like supplier invoices, purchase orders, GRNs, GST details, ERP entries, and approval steps.

## What's included

- Responsive, accessible, editorial landing page with a distinct industrial-inspired design
- Lightweight HTML/CSS/JavaScript — no runtime framework or build step
- Invoice-to-ERP illustrated workflow, services, process, industries, FAQs, and contact
- Live links to [Maya Agent](https://maya-agent.pages.dev/), [StockSpeak](https://stockspeak.pages.dev/) and [Levy Agent](https://levyagent.pages.dev/)
- Cloudflare Pages form endpoint that sends enquiries through Resend (after configuration)
- Mobile navigation, semantic landmarks, keyboard focus states, reduced-motion support
- Search and social metadata and custom SVG brand assets

### Quick start

Open `index.html` in a browser or run:

```bash
python3 -m http.server 8080
```

For the form and Pages Functions, deploy through **Cloudflare Pages** rather than opening the HTML file locally.

### Cloudflare Pages deployment

1. Create a Cloudflare Pages project and connect `Jayasuryamahadevan/zerah`.
2. Set production branch to `main`.
3. Framework preset: **None**. Build command: **leave empty**. Build output directory: **/** (repository root).
4. In **Settings → Variables and Secrets**, set the following values:
   - `RESEND_API_KEY` — your Resend API key, as a **secret**
   - `LEADS_TO_EMAIL` — the verified Zerah Labs inbox that should receive enquiries
   - `LEADS_FROM_EMAIL` — a sender address on a domain verified in Resend, such as `website@your-verified-domain.example`
5. Deploy and test the website form end-to-end before advertising the contact page.

**Important:** The lead form intentionally returns an error until these three variables are configured. The site does not pretend an enquiry was sent. Do **not** publish a guessed company email address. Add an actual verified public email address to the contact section once confirmed.

**Privacy:** The contact form collects name, business, email and optional description. It sends them to your configured Resend inbox; it does not store them in the site. Publish an appropriate privacy notice before enabling the live lead form. Add Turnstile/rate limiting if the endpoint receives unwanted submissions.

### Design system

- Typeface: Manrope for headlines, DM Sans for UI/body, with system fallbacks.
- Palette: deep industrial green, warm paper, muted botanical green, soft lime.
- Layout: spacious hierarchy, strong left alignment, restrained illustration and motion.
- Accessibility: labelled inputs, semantic headings, keyboard-operable FAQ, visible focus states, mobile navigation, reduced motion, comfortable touch controls.
- Visuals are **illustrative**, not fabricated screenshots or claims of actual customer integrations.

The approach draws on Apple's design guidance about hierarchy, typography, adaptable layout, and accessibility, **not** Apple branding or direct visual copying:
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout)
- [Apple Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

Manufacturing audience reference:
- [Coimbatore District — Economy](https://coimbatore.nic.in/economy/)
- [Coimbatore District — About District](https://coimbatore.nic.in/about-district/)

## Product descriptions

The three product URLs are linked as provided. Their page content was not accessible during development, so the cards deliberately **do not** make unverified feature claims. Replace the neutral card descriptions with vetted product positioning when available.

## Files

```text
index.html
styles.css
script.js
assets/favicon.svg
assets/og-cover.svg
functions/api/inquiry.js
_headers
robots.txt
README.md
```
