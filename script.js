document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.snap-section');
    const navBtns = document.querySelectorAll('.nav-btn');
    const scrollContainer = document.querySelector('.main-content-scrollable');

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

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.getAttribute('data-section');
            const targetSection = document.querySelector(`.snap-section[data-section="${sectionId}"]`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    scrollContainer.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveNav);
    });

    updateActiveNav();
});
