# S. Jasikaran Portfolio V3

Premium light-first static portfolio. No production site was changed.

## Run locally
Open `index.html` or run `python -m http.server 8000` from this folder and visit http://localhost:8000.

## Features
- Light theme by default; optional dark theme stored locally.
- Responsive bento highlights, six project case-study pages, project category filters.
- IntersectionObserver scroll reveals, progress bar, timeline draw, optional GSAP ScrollTrigger effects via CDN.
- Contact form opens the visitor's email app. **It does not send messages automatically.** Connect a verified form backend/service for automatic delivery.
- Resume PDF viewer/download, SEO metadata, structured Person JSON-LD, social metadata, keyboard focus styles and reduced-motion support.
- Image assets from original uploaded portfolio; other projects use labeled illustrations instead of fabricated screenshots.

## Before deploying
1. Confirm each project description, date and status.
2. Replace project placeholders with authentic screenshots if available.
3. Confirm GitHub and LinkedIn URLs.
4. Add production-domain-specific canonical URLs, og:image URL and sitemap.xml only after domain is decided.
5. Test on mobile and desktop; verify the form with an installed email client.
6. Consider hosting GSAP locally or removing the optional CDN scripts for offline-only usage.

No backend, database or live domain is changed.
