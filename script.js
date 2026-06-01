document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active-page'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active-page');

        navButtons.forEach(btn => {
            const btnPage = btn.getAttribute('data-page');
            if (btnPage === pageId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageId = btn.getAttribute('data-page');
            if (pageId) showPage(pageId);
        });
    });

    // Ensure default active page
    const activeBtn = document.querySelector('.nav-btn.active');
    if (activeBtn) {
        const defaultPage = activeBtn.getAttribute('data-page');
        showPage(defaultPage);
    } else {
        showPage('about');
    }
});
