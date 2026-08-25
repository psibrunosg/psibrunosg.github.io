// ── Nav: escurece ao rolar ────────────────────
(function () {
    var nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
})();

// ── Parallax no hero background ──────────────
(function () {
    var bg = document.getElementById('hero-bg');
    if (!bg) return;

    function onScroll() {
        var scrollY = window.scrollY;
        // Move o bg para cima conforme o usuário rola (efeito parallax)
        bg.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)';
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // aplica no load
})();

// ── Scroll suave para âncoras internas ───────
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        var target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ── Reveal ao rolar (IntersectionObserver) ───
(function () {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
})();
