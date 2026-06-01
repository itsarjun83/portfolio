document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.snap-section');
    const navBtns = document.querySelectorAll('.nav-btn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const scrollContainer = document.querySelector('.main-content-scrollable');

    // Helper: Get current visible section index
    function getCurrentSectionIndex() {
        let currentIndex = 0;
        const containerTop = scrollContainer.scrollTop;
        const containerHeight = scrollContainer.clientHeight;
        sections.forEach((section, idx) => {
            const sectionTop = section.offsetTop;
            if (sectionTop <= containerTop + containerHeight / 3) {
                currentIndex = idx;
            }
        });
        return currentIndex;
    }

    // Update active nav button based on scroll
    function updateActiveNav() {
        const currentIndex = getCurrentSectionIndex();
        const currentSectionId = sections[currentIndex].getAttribute('data-section');
        navBtns.forEach(btn => {
            const btnSection = btn.getAttribute('data-section');
            if (btnSection === currentSectionId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Scroll to a specific section
    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const currentIndex = getCurrentSectionIndex();
            if (currentIndex < sections.length - 1) {
                scrollToSection(currentIndex + 1);
            }
        });
    }

    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const currentIndex = getCurrentSectionIndex();
            if (currentIndex > 0) {
                scrollToSection(currentIndex - 1);
            }
        });
    }

    // Handle nav button clicks – scroll to the matching section
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.getAttribute('data-section');
            const targetSection = document.querySelector(`.snap-section[data-section="${sectionId}"]`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Listen to scroll events to update active nav
    scrollContainer.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveNav);
    });

    // Initial call
    updateActiveNav();
});
