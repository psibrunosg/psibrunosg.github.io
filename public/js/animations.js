// Nav: adiciona classe .scrolled ao rolar
(function () {
    var nav = document.getElementById('nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
})();

// Scroll suave para âncoras internas
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Reveal ao rolar (IntersectionObserver)
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
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
})();
