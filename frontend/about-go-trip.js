
/* ==========================================
   GO TRIP — ABOUT PAGE JAVASCRIPT
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // 1. MOBILE NAVIGATION
    // ======================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    function closeMobileMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
        menuToggle.setAttribute("aria-label", "Open navigation");
    }

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("is-open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        // Close menu after selecting a link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeMobileMenu);
        });

        // Close menu when clicking outside navbar
        document.addEventListener("click", event => {
            const navbar = document.querySelector(".about-nav");

            if (
                navLinks.classList.contains("is-open") &&
                navbar &&
                !navbar.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        // Close menu with Escape key
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        });

        // Reset mobile menu on desktop
        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) {
                closeMobileMenu();
            }
        });
    }


    // ======================================
    // 2. FAQ ACCORDION
    // ======================================

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(currentItem => {

        currentItem.addEventListener("toggle", () => {

            if (currentItem.open) {
                faqItems.forEach(otherItem => {
                    if (otherItem !== currentItem) {
                        otherItem.open = false;
                    }
                });
            }

        });

    });


    // ======================================
    // 3. AUTOMATIC COPYRIGHT YEAR
    // ======================================

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    // ======================================
    // 4. BACK TO TOP
    // ======================================

    const backToTop = document.getElementById("backToTop");

    if (backToTop) {

        backToTop.addEventListener("click", event => {
            event.preventDefault();

            window.scrollTo({
                top: 0,
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "instant" : "smooth"
            });
        });

    }


    // ======================================
    // 5. ACTIVE NAVIGATION LINK
    // ======================================

    const sectionLinks = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    const sections = Array.from(sectionLinks)
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if ("IntersectionObserver" in window && sections.length) {

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                sectionLinks.forEach(link => {

                    const isActive =
                        link.getAttribute("href") ===
                        `#${entry.target.id}`;

                    if (isActive) {
                        link.setAttribute("aria-current", "location");
                    } else {
                        link.removeAttribute("aria-current");
                    }

                });

            });

        }, {
            rootMargin: "-25% 0px -60% 0px",
            threshold: 0
        });

        sections.forEach(section => observer.observe(section));
    }


    console.log("Go Trip About Page loaded successfully!");

});
