# my-skills

Personal portfolio for **Rajesh Nayak** — Apple "Liquid Glass" aesthetic, dark theme,
bright minimal iridescent accents, GSAP-driven text animation, and Lenis smooth scroll.

A static site, no build step. Just three files:

- `index.html`
- `styles.css`
- `main.js`

Phone number and email are intentionally omitted; the only contact path is LinkedIn.

## Make it its own live repo

This folder lives inside `my-website` only because the build environment could not
create a separate repository automatically. To give it its own home and a live URL:

1. Create a new **public** repo named `my-skills` on GitHub (empty, no README).
2. From this folder:
   ```bash
   git init && git add . && git commit -m "Liquid Glass portfolio"
   git branch -M main
   git remote add origin https://github.com/rajesh-nyk/my-skills.git
   git push -u origin main
   ```
3. In the repo: **Settings → Pages → Source: Deploy from a branch → `main` / root**.
4. The site goes live at `https://rajesh-nyk.github.io/my-skills/`.

## Notes

- The LinkedIn button points to `https://www.linkedin.com/` — swap in the real profile URL.
- Animations respect `prefers-reduced-motion`. If the GSAP/Lenis CDNs are blocked,
  the page falls back to a fully visible, static layout with the glass styling intact.
