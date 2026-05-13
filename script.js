// ============================================
//   BAALI LHOUSSAINE — Security Portfolio JS
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ===== MATRIX CANVAS =====
    (function initMatrix() {
        const canvas = document.getElementById('matrix-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const chars = '0123456789ABCDEF<>{}[]|\\+=/*%$#@!?;:.,^~ΩΨΦΣΠΛΘΔαβγδεζηθ';
        const fontSize = 13;
        let cols = Math.floor(canvas.width / fontSize);
        let drops = Array(cols).fill(1);

        function draw() {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            ctx.fillStyle = isLight ? 'rgba(244,247,245,0.05)' : 'rgba(2, 12, 7, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00ff6a';
            ctx.font = fontSize + 'px Share Tech Mono, monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];
                if (isLight) {
                    ctx.fillStyle = Math.random() > 0.97 ? '#0077aa' : '#007a33';
                } else {
                    ctx.fillStyle = Math.random() > 0.97 ? '#00e5ff' : '#00ff6a';
                }
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }

        setInterval(draw, 55);

        window.addEventListener('resize', () => {
            cols = Math.floor(canvas.width / fontSize);
            drops = Array(cols).fill(1);
        });
    })();

    // ===== SCROLL PROGRESS =====
    const scrollProg = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollProg) scrollProg.style.width = (scrollTop / docH * 100) + '%';
    });



    
    // ===== TYPED COMMAND ANIMATION =====
    (function initTyped() {
        const el = document.getElementById('typedCmd');
        if (!el) return;
        const commands = [
            'cat profil.txt',
            'ls -la ./competences',
            'nmap -sV localhost',
            'openssl genrsa 4096',
            'git log --oneline',
        ];
        let ci = 0, ti = 0, isDeleting = false;

        function type() {
            const cmd = commands[ci];
            if (!isDeleting) {
                el.textContent = cmd.substring(0, ti + 1);
                ti++;
                if (ti === cmd.length) {
                    setTimeout(() => { isDeleting = true; setTimeout(type, 60); }, 1800);
                    return;
                }
            } else {
                el.textContent = cmd.substring(0, ti - 1);
                ti--;
                if (ti === 0) {
                    isDeleting = false;
                    ci = (ci + 1) % commands.length;
                }
            }
            setTimeout(type, isDeleting ? 45 : 80);
        }
        setTimeout(type, 800);
    })();

    // ===== PHOTO CAROUSEL =====
    class PhotoCarousel {
        constructor() {
            this.current = 0;
            this.slides = document.querySelectorAll('.carousel-slide');
            this.indicators = document.querySelectorAll('.carousel-indicator');
            this.prevBtn = document.getElementById('prevBtn');
            this.nextBtn = document.getElementById('nextBtn');
            this.timer = null;
            if (this.slides.length) this.init();
        }
        init() {
            if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
            if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
            this.indicators.forEach((ind, i) => ind.addEventListener('click', () => this.goTo(i)));
            const carousel = document.querySelector('.photo-carousel');
            if (carousel) {
                carousel.addEventListener('mouseenter', () => this.stop());
                carousel.addEventListener('mouseleave', () => this.start());
            }
            this.start();
        }
        goTo(i) {
            this.slides[this.current].classList.remove('active');
            this.indicators[this.current]?.classList.remove('active');
            this.current = i;
            this.slides[this.current].classList.add('active');
            this.indicators[this.current]?.classList.add('active');
        }
        next() { this.goTo((this.current + 1) % this.slides.length); }
        prev() { this.goTo((this.current - 1 + this.slides.length) % this.slides.length); }
        start() { this.timer = setInterval(() => this.next(), 4000); }
        stop() { clearInterval(this.timer); }
    }
    new PhotoCarousel();

    // ===== MOBILE NAV + SMOOTH SCROLL =====
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const NAVBAR_HEIGHT = document.querySelector('.navbar')?.offsetHeight || 70;

    // Hamburger toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Nav link clicks — smooth scroll + close mobile menu
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Close mobile menu
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');

            // External page link — let browser handle normally
            if (!href || !href.startsWith('#')) return;

            e.preventDefault();
            const target = document.getElementById(href.substring(1));
            if (!target) return;
            const top = target.getBoundingClientRect().top + window.pageYOffset - NAVBAR_HEIGHT;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // ===== ACTIVE NAV ON SCROLL =====
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const sp = window.scrollY + 120;
        sections.forEach(s => {
            if (sp >= s.offsetTop && sp < s.offsetTop + s.offsetHeight) {
                navLinks.forEach(l => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === '#' + s.id) l.classList.add('active');
                });
            }
        });
    });

    // ===== FADE IN ON SCROLL =====
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('fade-in-up');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.project-card, .skill-group, .timeline-item, .tl-card, .article-card').forEach(el => observer.observe(el));

    // ===== CONTACT FORM =====
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = form.querySelector('#name').value.trim();
            const email = form.querySelector('#email').value.trim();
            const subject = form.querySelector('#subject').value.trim();
            const message = form.querySelector('#message').value.trim();

            if (!name || !email || !subject || !message) {
                showPopup('Erreur', 'Veuillez remplir tous les champs.', 'error', '⚠');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showPopup('Email invalide', 'Veuillez entrer une adresse email valide.', 'error', '⚠');
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            btn.disabled = true;

            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(form)).toString()
            })
            .then(() => {
                showPopup('Message envoyé !', 'Votre message a bien été envoyé. Je vous répondrai bientôt.', 'success', '✓');
                form.reset();
            })
            .catch(() => {
                showPopup('Message envoyé !', 'Votre message a bien été envoyé.', 'success', '✓');
                form.reset();
            })
            .finally(() => {
                btn.innerHTML = orig;
                btn.disabled = false;
            });
        });
    }

    // ===== POPUP =====
    function showPopup(title, message, type, icon) {
        const overlay = document.getElementById('popupOverlay');
        const popup = document.getElementById('popup');
        const iconEl = document.getElementById('popupIcon');
        const titleEl = document.getElementById('popupTitle');
        const msgEl = document.getElementById('popupMessage');
        const closeBtn = document.getElementById('popupClose');
        const okBtn = document.getElementById('popupOk');

        if (!overlay) return;
        iconEl.textContent = icon;
        iconEl.style.color = type === 'success' ? '#00ff6a' : '#ff3e3e';
        titleEl.textContent = title;
        titleEl.style.color = type === 'success' ? '#00ff6a' : '#ff3e3e';
        msgEl.textContent = message;

        overlay.classList.add('show');
        setTimeout(() => popup.classList.add('show'), 10);

        const close = () => {
            popup.classList.remove('show');
            setTimeout(() => overlay.classList.remove('show'), 300);
        };
        closeBtn.onclick = close;
        okBtn.onclick = close;
        overlay.onclick = e => { if (e.target === overlay) close(); };
        if (type === 'success') setTimeout(close, 4000);
    }

    // ===== THEME TOGGLE =====
    (function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon   = document.getElementById('themeIcon');
        const savedTheme  = localStorage.getItem('theme') || 'dark';
        applyTheme(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                const next = current === 'dark' ? 'light' : 'dark';
                applyTheme(next);
                localStorage.setItem('theme', next);
            });
        }

        function applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            if (themeIcon) {
                themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    })();

    // ===== KEYBOARD NAV =====
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.getElementById('popup')?.classList.remove('show');
            document.getElementById('popupOverlay')?.classList.remove('show');
        }
    });

    console.log('%c[BAALI_SEC_PORTFOLIO] >> Initialized ✓', 'color:#00ff6a; font-family:monospace; font-size:14px;');
});

// ===== GLOBAL: ARTICLE EXPAND/COLLAPSE =====
// Must be global so onclick="toggleArticle(this)" in HTML works
function toggleArticle(card) {
    const body = card.querySelector('.article-body');
    const hint = card.querySelector('.article-toggle-hint');
    const icon = hint ? hint.querySelector('i') : null;
    if (!body) return;
    const isOpen = body.style.display !== 'none';
    body.style.display = isOpen ? 'none' : 'block';
    if (icon) icon.className = isOpen ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    if (hint) hint.style.color = isOpen ? '' : 'var(--green-primary)';
}