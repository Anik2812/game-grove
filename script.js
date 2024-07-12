document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = loginModal.querySelector('.close');
    const loginForm = document.getElementById('loginForm');
    const mainNav = document.getElementById('mainNav');
    const logoutBtn = document.getElementById('logoutBtn');

    let isLoggedIn = false;

    function showLoginModal() {
        loginModal.style.display = 'block';
    }

    function hideLoginModal() {
        loginModal.style.display = 'none';
    }

    function updateLoginState(loggedIn) {
        isLoggedIn = loggedIn;
        mainNav.style.display = loggedIn ? 'block' : 'none';
        loginBtn.style.display = loggedIn ? 'none' : 'block';
    }

    loginBtn.addEventListener('click', showLoginModal);

    closeBtn.addEventListener('click', hideLoginModal);

    window.addEventListener('click', function(event) {
        if (event.target == loginModal) {
            hideLoginModal();
        }
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically validate the login credentials
        updateLoginState(true);
        hideLoginModal();
    });

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        updateLoginState(false);
    });

    // Handle clicks on elements that require login
    document.querySelectorAll('[data-requires-login]').forEach(element => {
        element.addEventListener('click', function(e) {
            if (!isLoggedIn) {
                e.preventDefault();
                showLoginModal();
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});