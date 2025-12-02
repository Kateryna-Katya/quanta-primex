document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const burgerBtn = document.getElementById('burger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.header__link');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle Icon (Menu <-> X)
            const icon = burgerBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                // Если у нас подключен Lucide, мы можем менять атрибуты или классы
                // Но проще просто переключить класс для анимации, если она есть
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
});