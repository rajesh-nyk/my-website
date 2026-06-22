/* =========================================================
   Rajesh Nayak — Liquid Glass portfolio interactions
   Lenis smooth scroll · GSAP text motion · animated "a"
   ========================================================= */

(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGSAP = typeof window.gsap !== 'undefined';

    const ready = (fn) =>
        document.readyState !== 'loading'
            ? fn()
            : document.addEventListener('DOMContentLoaded', fn);

    ready(() => {
        const root = document.documentElement;

        /* ---- Current year ---- */
        const year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();

        /* ---- Wrap every "a" in an iridescent glass glyph ---- */
        const wrapLetterA = (el) => {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            const nodes = [];
            while (walker.nextNode()) nodes.push(walker.currentNode);
            nodes.forEach((node) => {
                if (!/[aA]/.test(node.nodeValue)) return;
                const frag = document.createDocumentFragment();
                node.nodeValue.split(/(?=[aA])|(?<=[aA])/).forEach((part) => {
                    if (part === 'a' || part === 'A') {
                        const s = document.createElement('span');
                        s.className = 'lg-a';
                        s.textContent = part;
                        frag.appendChild(s);
                    } else if (part) {
                        frag.appendChild(document.createTextNode(part));
                    }
                });
                node.parentNode.replaceChild(frag, node);
            });
        };
        document.querySelectorAll('[data-a]').forEach(wrapLetterA);

        /* ---- Split headlines into characters (tagging the a's) ---- */
        const splitChars = (el) => {
            const text = el.textContent;
            el.textContent = '';
            const chars = [];
            [...text].forEach((ch) => {
                if (ch === ' ') {
                    el.appendChild(document.createTextNode(' '));
                    return;
                }
                const span = document.createElement('span');
                span.className = 'char' + (ch === 'a' || ch === 'A' ? ' lg-a' : '');
                span.textContent = ch;
                el.appendChild(span);
                chars.push(span);
            });
            return chars;
        };

        /* ---- Mobile nav ---- */
        const nav = document.querySelector('.nav');
        const toggle = document.getElementById('navToggle');
        if (nav && toggle) {
            const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); };
            toggle.addEventListener('click', () => {
                const open = nav.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', String(open));
            });
            nav.querySelectorAll('.nav__links a, .nav__cta').forEach((a) => a.addEventListener('click', close));
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
        }

        /* ---- Pointer-tracked specular highlight on lit glass ---- */
        if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
            document.querySelectorAll('.glass--lit').forEach((card) => {
                card.addEventListener('pointermove', (e) => {
                    const r = card.getBoundingClientRect();
                    card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
                    card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
                });
            });
        }

        /* ---- No GSAP (CDN blocked) → reveal everything, keep the glass ---- */
        if (!hasGSAP || reduceMotion) {
            root.classList.remove('js');
            return;
        }

        const { gsap } = window;
        if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

        /* ---- Lenis smooth scroll, synced to GSAP ---- */
        if (typeof window.Lenis !== 'undefined') {
            const lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
            lenis.on('scroll', () => window.ScrollTrigger && window.ScrollTrigger.update());
            gsap.ticker.add((t) => lenis.raf(t * 1000));
            gsap.ticker.lagSmoothing(0);
            document.querySelectorAll('a[href^="#"]').forEach((a) => {
                a.addEventListener('click', (e) => {
                    const target = document.querySelector(a.getAttribute('href'));
                    if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -20 }); }
                });
            });
        }

        /* ---- Hero load sequence ----
           The iridescent color-sweep on every "a" runs in CSS (so it shows even
           if GSAP is slow or blocked); GSAP layers transform + glow on top. */
        const nameChars = splitChars(document.querySelector('.hero__name'));
        const aGlyphs = nameChars.filter((c) => c.classList.contains('lg-a'));
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

        /* hero items are pre-hidden by CSS, so animate TO the visible state */
        tl.fromTo('.hero__eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
          .from(nameChars, {
              yPercent: 120, opacity: 0, rotateX: -55,
              transformOrigin: '50% 100%',
              duration: 1, stagger: 0.04,
          }, '-=0.35')
          .fromTo('.hero__role', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
          .fromTo('.hero__lede', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.55')
          .fromTo('.hero__actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.5')
          .fromTo('.hero__card', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.5')
          .fromTo('.hero__scroll', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3');

        /* Once the name lands, its "a" glyphs come alive: bob up, grow, and
           pulse an iridescent glow. Uses y (px) + scale so it never fights the
           entrance tween (which animates yPercent). */
        aGlyphs.forEach((a, i) => {
            const start = 2.1 + i * 0.18;
            gsap.to(a, {
                y: -16, scale: 1.18, duration: 1.5, delay: start,
                ease: 'sine.inOut', repeat: -1, yoyo: true,
            });
            gsap.fromTo(a,
                { filter: 'drop-shadow(0 0 2px rgba(149, 176, 255, 0))' },
                {
                    filter: 'drop-shadow(0 0 18px rgba(149, 176, 255, 0.9))',
                    duration: 1.5, delay: start, ease: 'sine.inOut',
                    repeat: -1, yoyo: true,
                });
        });

        /* ---- Ambient blob drift ---- */
        gsap.to('.blob--1', { xPercent: 12, yPercent: 16, duration: 18, ease: 'sine.inOut', repeat: -1, yoyo: true });
        gsap.to('.blob--2', { xPercent: -14, yPercent: -10, duration: 22, ease: 'sine.inOut', repeat: -1, yoyo: true });
        gsap.to('.blob--3', { xPercent: 10, yPercent: -14, duration: 26, ease: 'sine.inOut', repeat: -1, yoyo: true });

        if (!window.ScrollTrigger) return;
        const ST = window.ScrollTrigger;

        /* ---- Scroll reveals ---- */
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
            gsap.to(el, {
                y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 86%' },
            });
        });

        /* ---- Count-up metrics ---- */
        gsap.utils.toArray('.metric__num').forEach((el) => {
            const target = parseFloat(el.dataset.count) || 0;
            const suffix = el.dataset.suffix || '';
            const proxy = { v: 0 };
            gsap.to(proxy, {
                v: target, duration: 1.8, ease: 'power2.out',
                onUpdate() { el.textContent = Math.round(proxy.v) + suffix; },
                scrollTrigger: { trigger: el, start: 'top 88%' },
            });
        });

        /* ---- Connect headline: split + reveal on scroll ---- */
        const connectTitle = document.querySelector('[data-split-sm]');
        if (connectTitle) {
            const cChars = splitChars(connectTitle);
            gsap.from(cChars, {
                yPercent: 110, opacity: 0, duration: 0.8, ease: 'power4.out', stagger: 0.02,
                scrollTrigger: { trigger: connectTitle, start: 'top 82%' },
            });
        }

        /* ---- Active nav link tracking ---- */
        const links = new Map();
        document.querySelectorAll('.nav__links a[href^="#"]').forEach((a) =>
            links.set(a.getAttribute('href').slice(1), a));
        document.querySelectorAll('main section[id]').forEach((section) => {
            ST.create({
                trigger: section, start: 'top 50%', end: 'bottom 50%',
                onToggle: (self) => {
                    if (!self.isActive) return;
                    links.forEach((l) => l.classList.remove('is-active'));
                    links.get(section.id)?.classList.add('is-active');
                },
            });
        });
    });
})();
