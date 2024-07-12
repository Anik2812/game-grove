document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.getElementById('mainNav');
    const hamburger = document.querySelector('.hamburger');

    hamburger.addEventListener('click', function() {
        mainNav.querySelector('ul').classList.toggle('show');
        hamburger.classList.toggle('active');
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