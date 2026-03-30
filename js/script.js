// ===================================
// Theme Toggle Functionality
// ===================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = htmlElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ===================================
// Smooth Scroll & Active Navigation
// ===================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            }
        }
    });
});

// Update active nav link on scroll
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===================================
// Typing Animation
// ===================================
const typedTextElement = document.getElementById('typedText');
const texts = [
    'Web & Software Developer',
    'Programmer',
    'Software Engineer at SSL Wireless'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function typeText() {
    const currentText = texts[textIndex];

    if (isDeleting) {
        typedTextElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 100;
    } else {
        typedTextElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
    }

    if (!isDeleting && charIndex === currentText.length) {
        // Pause at end of text
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
    }

    setTimeout(typeText, typingSpeed);
}

// Start typing animation
setTimeout(typeText, 1000);

// ===================================
// Scroll Animations (Intersection Observer)
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');

            // Animate skill bars when skills section is visible
            if (entry.target.closest('#skills')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
const animatedElements = document.querySelectorAll('[data-aos]');
animatedElements.forEach(el => observer.observe(el));

// ===================================
// Skill Bar Animation
// ===================================
let skillsAnimated = false;

function animateSkillBars() {
    if (skillsAnimated) return;

    const skillBars = document.querySelectorAll('.skill-progress');

    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.setProperty('--progress-width', progress + '%');

        // Add animate class to trigger animation
        setTimeout(() => {
            bar.parentElement.parentElement.classList.add('animate');
            bar.style.width = progress + '%';
        }, 100);
    });

    skillsAnimated = true;
}

// ===================================
// Navbar Scroll Effect
// ===================================
const navbar = document.getElementById('mainNav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 4px 30px var(--shadow)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 2px 20px var(--shadow)';
    }

    lastScroll = currentScroll;
});

// ===================================
// Contact Form Handling
// ===================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Basic validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Here you would typically send the form data to a server
    // For now, we'll just show a success message
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    contactForm.reset();
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--warning)'};
        color: #fff;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Profile Image Error Handling
// ===================================
const profileImg = document.getElementById('profileImg');

profileImg.addEventListener('error', function () {
    // If image fails to load, create a gradient placeholder
    this.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: var(--accent-gradient);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 5rem;
        color: #fff;
        font-weight: 800;
    `;
    placeholder.textContent = 'RD';
    this.parentElement.appendChild(placeholder);
});

// ===================================
// Project Images Error Handling
// ===================================
const projectImages = document.querySelectorAll('.project-image img');

projectImages.forEach((img, index) => {
    img.addEventListener('error', function () {
        // Create gradient placeholder for project images
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 100%;
            background: var(--${index % 2 === 0 ? 'accent' : 'purple'}-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            color: #fff;
            font-weight: 800;
        `;
        placeholder.innerHTML = '<i class="bi bi-image"></i>';
        this.parentElement.appendChild(placeholder);
        this.style.display = 'none';
    });
});

// ===================================
// About Image Error Handling
// ===================================
const aboutImage = document.querySelector('.about-img-wrapper img');

if (aboutImage) {
    aboutImage.addEventListener('error', function () {
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            height: 400px;
            background: var(--purple-gradient);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 5rem;
            color: #fff;
            border-radius: 20px;
        `;
        placeholder.innerHTML = '<i class="bi bi-person-circle"></i>';
        this.parentElement.appendChild(placeholder);
        this.style.display = 'none';
    });
}

// ===================================
// Preloader (Optional)
// ===================================
window.addEventListener('load', () => {
    // Add any preloader logic here if needed
    document.body.classList.add('loaded');
});

// ===================================
// Scroll to Top Button (Optional Enhancement)
// ===================================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--accent-gradient);
    border: none;
    border-radius: 50%;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 999;
    box-shadow: 0 4px 15px var(--shadow);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.visibility = 'visible';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.visibility = 'hidden';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-5px) scale(1.1)';
    this.style.boxShadow = '0 8px 25px var(--glow)';
});

scrollTopBtn.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0) scale(1)';
    this.style.boxShadow = '0 4px 15px var(--shadow)';
});

// ===================================
// Console Message (Easter Egg)
// ===================================
console.log('%c👋 Hello Developer!', 'color: #00d4aa; font-size: 20px; font-weight: bold;');
console.log('%cLooking for something? Feel free to reach out!', 'color: #6366f1; font-size: 14px;');
console.log('%c📧 reday.datta@example.com', 'color: #00ffc6; font-size: 12px;');

// ===================================
// Project Modal — reads from <template id="modal-tpl-N"> in index.html
// Works with file:// — no server required
// ===================================
const modalBackdrop = document.getElementById('projectModalBackdrop');
const modalClose = document.getElementById('projectModalClose');
const modalBody = document.getElementById('projectModalBody');

function openProjectModal(projectId) {
    const tpl = document.getElementById(`modal-tpl-${projectId}`);
    if (!tpl) {
        console.warn(`No template found for project ${projectId}`);
        return;
    }

    // Clone the template content and inject it
    modalBody.innerHTML = '';
    modalBody.appendChild(tpl.content.cloneNode(true));

    // Show modal
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
}

// Attach listeners to every view button
document.querySelectorAll('.project-view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProjectModal(btn.getAttribute('data-project'));
    });
});

// Close on × button
modalClose.addEventListener('click', closeProjectModal);

// Close on backdrop click (outside modal box)
modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeProjectModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
        closeProjectModal();
    }
});
