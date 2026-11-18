(() => {
  'use strict';
  const doc = document;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const nav = doc.getElementById('nav');
  const menuBtn = doc.getElementById('menuBtn');
  const header = doc.querySelector('.site-header');
  const progress = doc.getElementById('scrollProgress');
  const topBtn = doc.getElementById('backToTop');
  const year = doc.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  menuBtn?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open') ?? false;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? '✕' : '☰';
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn?.setAttribute('aria-expanded', 'false');
    if (menuBtn) menuBtn.textContent = '☰';
  }));

  // Activate transitions only if IntersectionObserver is available.
  const animated = [...doc.querySelectorAll('[data-animate]')];
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    doc.body.classList.add('js-motion');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.09, rootMargin: '0px 0px -30px 0px' });
    animated.forEach(el => revealObserver.observe(el));
  } else {
    animated.forEach(el => el.classList.add('is-visible'));
  }

  // Read-only scroll measurement, batched in requestAnimationFrame.
  let ticking = false;
  const updateScroll = () => {
    const y = window.scrollY || 0;
    const max = Math.max(1, doc.documentElement.scrollHeight - window.innerHeight);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
    header?.classList.toggle('is-scrolled', y > 18);
    topBtn?.classList.toggle('is-visible', y > 650);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScroll);
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  topBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });

  // Highlight the section the visitor is currently reading.
  if ('IntersectionObserver' in window && nav) {
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const sections = [...byId.keys()].map(id => doc.getElementById(id)).filter(Boolean);
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting);
      if (!visible.length) return;
      visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const current = visible[0].target.id;
      links.forEach(link => link.removeAttribute('aria-current'));
      byId.get(current)?.setAttribute('aria-current', 'location');
    }, { rootMargin: '-20% 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5] });
    sections.forEach(section => sectionObserver.observe(section));
  }

  reducedMotion.addEventListener?.('change', event => {
    if (event.matches) {
      doc.body.classList.remove('js-motion');
      animated.forEach(el => el.classList.add('is-visible'));
    }
  });
})();

/* Portfolio V3 interactions. No network request is made by the contact form. */
(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  const toggle = document.getElementById('themeToggle');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const storageKey = 'sj-portfolio-theme-v3';
  let stored = null;
  try { stored = localStorage.getItem(storageKey); } catch (_) {}
  // Light is the design default; OS preference is honored if no explicit selection.
  const initial = stored === 'dark' || stored === 'light' ? stored : 'light';
  function setTheme(theme) {
    body.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (toggle) {
      toggle.querySelector('.theme-icon')?.replaceChildren(document.createTextNode(theme === 'dark' ? '☀' : '☾'));
      if (!toggle.querySelector('.theme-icon')) toggle.textContent = theme === 'dark' ? '☀' : '☾';
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111a16' : '#f7f8f5');
  }
  setTheme(initial);
  toggle?.addEventListener('click', () => {
    const next = body.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem(storageKey, next); } catch (_) {}
  });
  media.addEventListener?.('change', e => {
    let pref = null;
    try { pref = localStorage.getItem(storageKey); } catch (_) {}
    if (!pref) setTheme('light');
  });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projectCards = [...document.querySelectorAll('.project-card[data-category]')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(b => {
      const selected = b === button;
      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    projectCards.forEach(card => {
      card.hidden = filter !== 'All' && card.dataset.category !== filter;
    });
  }));

  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get('website') || '').trim()) return;
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const subject = String(data.get('subject') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !subject || !message) return;
    const bodyText = `Hello Jasikaran,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`;
    const href = `mailto:jasi40094@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    const status = document.getElementById('formStatus');
    if (status) status.textContent = 'Opening your email app. Please press Send there to deliver your message.';
    window.location.href = href;
  });

  const timeline = document.querySelector('.draw-timeline');
  if (timeline && !reduced.matches) {
    let pending = false;
    const update = () => {
      const rect = timeline.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (window.innerHeight * .72 - rect.top) / Math.max(1, rect.height)));
      timeline.style.setProperty('--timeline-progress', fraction.toFixed(3));
      pending = false;
    };
    window.addEventListener('scroll', () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    }, {passive:true});
    update();
  } else if (timeline) timeline.style.setProperty('--timeline-progress', 1);


  // Subtle magnetic hover for pointer devices only (no touch hijacking).
  if (!reduced.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.hero-buttons .button, .case-next .button').forEach(button => {
      button.addEventListener('pointermove', e => {
        const r = button.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * .09;
        const dy = (e.clientY - r.top - r.height / 2) * .09;
        button.style.translate = `${dx}px ${dy}px`;
      });
      button.addEventListener('pointerleave', () => { button.style.translate = ''; });
    });
  }
  // Progressive text reveal: preserves the heading if JavaScript or animations fail.
  if (!reduced.matches && 'IntersectionObserver' in window) {
    document.querySelectorAll('.section-heading h2').forEach(heading => {
      const observer = new IntersectionObserver(entries => {
        if (!entries[0]?.isIntersecting) return;
        heading.classList.add('heading-revealed');
        observer.disconnect();
      }, {threshold:.25});
      heading.classList.add('heading-reveal');
      observer.observe(heading);
    });
  }

  // Optional GSAP enhancements; core page remains fully usable without CDN access.
  if (!reduced.matches && window.gsap && window.ScrollTrigger) {
    try {
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.gsap.fromTo('.bento-decor', {rotation:-25, y:70}, {
        rotation:20, y:-50, ease:'none',
        scrollTrigger:{trigger:'.bento-feature',start:'top bottom',end:'bottom top',scrub:1}
      });
      window.gsap.fromTo('.ticker-inner', {x:0}, {
        x:-40,ease:'none',scrollTrigger:{trigger:'.ticker',start:'top bottom',end:'bottom top',scrub:1}
      });
    } catch (_) { /* CSS/IntersectionObserver fallback remains */ }
  }
})();

// V4 accessible rotating role headline (pauses on hidden tabs and reduced motion).
(() => {
  const target=document.getElementById('roleText');
  if(!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const roles=['Full-Stack Developer','Software Engineer','SaaS Builder'];
  let index=0;
  window.setInterval(()=>{if(document.hidden)return;index=(index+1)%roles.length;target.textContent=roles[index];},3200);
})();
