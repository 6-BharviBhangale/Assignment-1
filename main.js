document.addEventListener("DOMContentLoaded", () => {
    // 1. Check for missing library fallbacks
    const hasGSAP = typeof gsap !== 'undefined';
    const hasLenis = typeof Lenis !== 'undefined';
    const hasVanillaTilt = typeof VanillaTilt !== 'undefined';

    if (!hasGSAP) {
        // Fallback: make all opacity-hidden items visible if GSAP failed to load
        document.querySelectorAll('.hero-subtitle, .hero-title, .hero-tagline, .hero-intro, .hero-ctas, .hero-visual').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        console.warn("GSAP libraries not loaded. Fallbacks triggered.");
    }

    // 2. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Custom Cursor Follower (Desktop Only)
    const cursor = document.querySelector(".custom-cursor");
    const follower = document.querySelector(".custom-cursor-follower");

    if (window.innerWidth > 768 && cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the main dot
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        // Smooth follower animation loop
        const updateFollower = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            
            requestAnimationFrame(updateFollower);
        };
        updateFollower();

        // Mouse hover expansions
        const hoverables = document.querySelectorAll("a, button, .timeline-card, .interest-card, .gallery-item, .menu-toggle, .ncc-flow-step, .ncc-gallery-card, .ncc-skill-card, .ncc-achievement-item, .moment-slide");
        hoverables.forEach(item => {
            item.addEventListener("mouseenter", () => {
                cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
                cursor.style.backgroundColor = "rgba(110, 139, 116, 0.15)";
                follower.style.transform = "translate(-50%, -50%) scale(1.4)";
                follower.style.borderColor = "var(--highlight)";
            });
            item.addEventListener("mouseleave", () => {
                cursor.style.transform = "translate(-50%, -50%) scale(1)";
                cursor.style.backgroundColor = "var(--highlight)";
                follower.style.transform = "translate(-50%, -50%) scale(1)";
                follower.style.borderColor = "var(--accent-sage)";
            });
        });
    }

    // 4. Initialize Lenis Smooth Scroll (Safeguarded)
    let lenis;
    if (hasLenis) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 5. Mobile Menu Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navLinksContainer = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navLinksContainer.classList.toggle("active");
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navLinksContainer.classList.remove("active");
            });
        });
    }

    // 6. Header Scroll Effect
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // 7. Active Nav Link sync based on Filename
    let activePath = window.location.pathname.split("/").pop();
    if (activePath === "" || activePath === "index.html") {
        activePath = "index.html";
    }
    
    navLinks.forEach(link => {
        link.classList.remove("active");
        const linkHref = link.getAttribute("href");
        if (linkHref === activePath) {
            link.classList.add("active");
        }
    });

    // 8. GSAP Page Entrance Animations (Immediate Load, No ScrollTrigger Required)
    if (hasGSAP) {
        // Hero Entrance Animation (Home Only)
        if (document.querySelector(".hero-section")) {
            const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
            heroTl.to(".hero-subtitle", { opacity: 1, y: 0, delay: 0.2 })
                  .to(".hero-title", { opacity: 1, y: 0 }, "-=0.8")
                  .to(".hero-tagline", { opacity: 1, y: 0 }, "-=0.8")
                  .to(".hero-intro", { opacity: 1, y: 0 }, "-=0.8")
                  .to(".hero-ctas", { opacity: 1, y: 0 }, "-=0.8")
                  .to(".hero-visual", { opacity: 1, scale: 1 }, "-=0.9");
        }

        // NCC Entrance Animation (NCC Only)
        if (document.querySelector(".ncc-hero-sec")) {
            const nccTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
            nccTl.to(".ncc-hero-text .hero-subtitle", { opacity: 1, y: 0, delay: 0.2 })
                 .to(".ncc-hero-text .hero-title", { opacity: 1, y: 0 }, "-=0.8")
                 .to(".ncc-hero-text .hero-tagline", { opacity: 1, y: 0 }, "-=0.8")
                 .to(".ncc-hero-text .ncc-intro-box", { opacity: 1, y: 0 }, "-=0.8")
                 .to(".ncc-hero-text .ncc-ctas-inline", { opacity: 1, y: 0 }, "-=0.8")
                 .to(".ncc-portrait-container", { opacity: 1, scale: 1 }, "-=0.9");
        }
    }

    // 9. NATIVE INTERSECTION OBSERVER SCROLL REVEALS
    // Completely replaces ScrollTrigger for scroll-based reveals, making them immune to late image loads
    const revealTargets = document.querySelectorAll(
        '.story-heading-block, .story-text-block p, .timeline-card, .interest-card, .skill-item, ' +
        '.ncc-flow-step, .ncc-gallery-card, .ncc-skill-card, .ncc-achievement-item, .moment-slide, ' +
        '.dreams-list li, .quote-card, .gallery-item, .contact-info-item, .contact-form, .ncc-quote-block, .motto-block'
    );

    if ('IntersectionObserver' in window && revealTargets.length > 0) {
        // Set initial invisible styles
        revealTargets.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(35px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        });

        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Trigger fade and slide up
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    
                    // Stop observing once animated
                    obs.unobserve(el);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -40px 0px" // Trigger slightly before crossing the viewport
        });

        revealTargets.forEach(el => revealObserver.observe(el));
    } else {
        // Observer not supported fallback (make all visible immediately)
        revealTargets.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // 10. Skill Bars Width Loading (IntersectionObserver synced)
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if ('IntersectionObserver' in window && skillBars.length > 0) {
        skillBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'width 1.6s cubic-bezier(0.25, 1, 0.5, 1)';
        });

        const barObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.style.width = bar.getAttribute('data-progress');
                    obs.unobserve(bar);
                }
            });
        }, {
            threshold: 0.1
        });

        skillBars.forEach(bar => barObserver.observe(bar));
    } else {
        // Fallback
        skillBars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-progress');
        });
    }

    // 11. Initialize Vanilla Tilt (for cards, safeguarded)
    if (hasVanillaTilt && window.innerWidth > 768) {
        const tiltElements = document.querySelectorAll("[data-tilt]");
        if (tiltElements.length > 0) {
            VanillaTilt.init(Array.from(tiltElements), {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.15,
            });
        }
    }

    // 12. Lenis Anchor scroll overrides (smooth scroll to anchors on same page, safeguarded)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target && lenis) {
                e.preventDefault();
                lenis.scrollTo(target, {
                    offset: -80, // match header offset
                    immediate: false
                });
            }
        });
    });
});
