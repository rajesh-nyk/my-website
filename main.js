// Rajesh Nayak — portfolio interactions

document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Current year ---- */
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---- Mobile nav ---- */
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    if (toggle && menu) {
        const closeMenu = () => {
            menu.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Open menu');
        };
        toggle.addEventListener('click', () => {
            const open = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
        menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    }

    /* ---- Reduced motion: show everything immediately ---- */
    if (reduceMotion) {
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
        document.querySelectorAll('.stat__num').forEach((el) => {
            el.textContent = parseInt(el.dataset.count, 10) || 0;
        });
        return;
    }

    /* ---- GSAP unavailable: fall back to CSS transitions ---- */
    if (typeof gsap === 'undefined') {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* ---- Hero entrance ---- */
    gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.hero .eyebrow',  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo('#hero-title',     { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 1.0 }, '-=0.45')
        .fromTo('.hero__role',     { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
        .fromTo('.hero__lede',     { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .fromTo('.hero__meta',     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
        .fromTo('.hero__actions',  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
        .fromTo('.stats',          { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.35');

    /* ---- Scroll reveal (non-hero sections) ---- */
    document.querySelectorAll('.reveal').forEach((el) => {
        if (el.closest('.hero')) return;
        gsap.fromTo(el,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 0.85,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 88%' },
            }
        );
    });

    /* ---- Count-up stats ---- */
    document.querySelectorAll('.stat__num').forEach((el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const proxy = { val: 0 };
        gsap.to(proxy, {
            val: target,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(proxy.val); },
            scrollTrigger: { trigger: el, start: 'top 85%' },
        });
    });

    /* ---- Active nav link on scroll ---- */
    const navLinks = new Map();
    document.querySelectorAll('.nav__menu a[href^="#"]').forEach((a) => {
        navLinks.set(a.getAttribute('href').slice(1), a);
    });
    document.querySelectorAll('main section[id]').forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 55%',
            end: 'bottom 45%',
            onEnter: () => {
                navLinks.forEach((l) => l.classList.remove('is-active'));
                navLinks.get(section.id)?.classList.add('is-active');
            },
            onEnterBack: () => {
                navLinks.forEach((l) => l.classList.remove('is-active'));
                navLinks.get(section.id)?.classList.add('is-active');
            },
        });
    });
});
