// Light/Dark Mode Toggle with Local Storage
const modeToggle = document.getElementById('mode-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.body.classList.add(currentTheme);
    modeToggle.textContent = currentTheme === 'dark-mode' ? '🌙' : '🌞';
} else {
    modeToggle.textContent = '🌞';
}

modeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    let theme = 'light-mode';
    if (document.body.classList.contains('dark-mode')) {
        theme = 'dark-mode';
        this.textContent = '🌙';
    } else {
        this.textContent = '🌞';
    }
    localStorage.setItem('theme', theme);
});

// Character Animation for Name
const nameElement = document.getElementById('name');
const nameText = 'Harjot Singh Tathgur';
nameElement.innerHTML = '';

const spans = [];

// Split the name into characters, including spaces, and wrap each in a span
nameText.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.textContent = char;
    nameElement.appendChild(span);
    spans.push(span);
});

const frequency = 0.0075; // Adjust this value to change speed (increase for faster)
const amplitude = 5; // Adjust this value to change amplitude

function animateName(timestamp) {
    spans.forEach((span, index) => {
        const y = Math.sin((timestamp * frequency) + (index * 0.5)) * amplitude;
        span.style.transform = `translateY(${y}px)`;
    });
    requestAnimationFrame(animateName);
}

requestAnimationFrame(animateName);

// Sliding-in Animations for Sections
const sections = document.querySelectorAll('section');
const options = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});

// Sliding-in Animations for Experience Items
const experienceItems = document.querySelectorAll('.experience-item');

experienceItems.forEach(item => {
    observer.observe(item);
});

// Back to Top Button fade in/out
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const menuOverlay = document.querySelector('.menu-overlay');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuOverlay.classList.toggle('open');
    document.body.classList.toggle('menu-open');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.classList.remove('menu-open');
    });
});

// Close menu when clicking on the overlay
menuOverlay.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.classList.remove('menu-open');
});

