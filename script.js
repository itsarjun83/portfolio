// Page navigation logic
document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');

    function switchPage(pageId) {
        // Hide all pages
        pages.forEach(page => {
            page.classList.remove('active-page');
        });
        // Show selected page
        const activePage = document.getElementById(pageId);
        if (activePage) activePage.classList.add('active-page');

        // Update active button style
        navBtns.forEach(btn => {
            const btnPage = btn.getAttribute('data-page');
            if (btnPage === pageId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageId = btn.getAttribute('data-page');
            if (pageId) switchPage(pageId);
        });
    });

    // Set default (in case of any mismatch)
    const currentActive = document.querySelector('.nav-btn.active');
    if (currentActive) {
        const defaultPage = currentActive.getAttribute('data-page');
        switchPage(defaultPage);
    } else {
        switchPage('about');
    }
});
