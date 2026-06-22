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

    /* ---- Scroll reveal ---- */
    const reveals = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        reveals.forEach((el) => el.classList.add('is-visible'));
    } else {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        reveals.forEach((el) => io.observe(el));
    }

    /* ---- Count-up stats ---- */
    const nums = document.querySelectorAll('.stat__num');
    const runCount = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        if (reduceMotion) { el.textContent = target; return; }
        const duration = 1200;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
        const statIO = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) { runCount(entry.target); statIO.unobserve(entry.target); }
            });
        }, { threshold: 0.6 });
        nums.forEach((el) => statIO.observe(el));
    }

    /* ---- Active nav link on scroll ---- */
    const sections = document.querySelectorAll('main section[id]');
    const links = new Map();
    document.querySelectorAll('.nav__menu a[href^="#"]').forEach((a) => {
        links.set(a.getAttribute('href').slice(1), a);
    });
    if ('IntersectionObserver' in window && sections.length) {
        const navIO = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const link = links.get(entry.target.id);
                if (!link) return;
                if (entry.isIntersecting) {
                    links.forEach((l) => l.classList.remove('is-active'));
                    link.classList.add('is-active');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((s) => navIO.observe(s));
    }
});
