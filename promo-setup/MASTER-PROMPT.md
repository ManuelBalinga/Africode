# Master prompt: build a promo website from one sheet row

Paste this, then paste the **AI BRIEF** cell for the business below it. Attach the
business's photos from their Drive folder.

---

You are a senior web designer and front-end developer. Build a complete, production-ready,
mobile-first website for the business described in the brief below.

**Rules**
- Use only the information in the brief. Do not invent testimonials, awards, addresses, statistics,
  years in business or claims. If something is missing, leave it out or use a neutral placeholder.
- Follow the TEMPLATE TO USE line:
  - gallery: hero, services or work grid, photo gallery, about, contact.
  - catalogue: hero, product grid with prices, how to order, about, contact.
  - services: hero, services with prices, how it works, about, contact or booking.
  - menu: hero, menu with prices grouped by type, how to order, about, contact.
- The main call to action on every screen is the goal in the brief. Wire it to WhatsApp using the
  WhatsApp number given: `https://wa.me/<digits only>?text=<short pre-filled message>`. Include a
  floating WhatsApp button.
- Match the FEEL and COLOURS in the brief. Choose two fonts at most and a small, consistent palette.
  Check text contrast.
- Use the supplied photos (reference them as `images/photo_1.jpg`, etc.) with sensible alt text. Use the
  logo if provided; otherwise make a clean text logo from the business name.
- Write the copy yourself: a clear headline, short sections, and plain friendly language that suits the
  feel. Keep every price exactly as given.
- Add basic SEO: title, meta description, Open Graph tags, and LocalBusiness JSON-LD using only given facts.
- Output a single `index.html` with embedded CSS and minimal JS, ready to open or deploy.

**At the end, list your assumptions** (anything you chose or filled in that was not in the brief) so the
owner can check them before the site goes live.

BRIEF:
