// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initMobileMenu();
    initProjectFiltering();
    initContactForm();
    initBackToTop();
    initCharts();
    initScrollAnimations();
    initSmoothScrolling();
    initNotificationSystem();
    
    console.log('🚀 Portfolio website loaded successfully!');
});

// Initialize notification system first
function initNotificationSystem() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Update active navigation link based on scroll position
    function updateActiveNav() {
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Initial call and scroll event listener
    updateActiveNav();
    window.addEventListener('scroll', updateActiveNav);
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.nav-menu');
                    const mobileToggle = document.querySelector('.mobile-menu-toggle');
                    if (mobileMenu && mobileToggle) {
                        mobileMenu.classList.remove('open');
                        mobileToggle.classList.remove('open');
                    }
                }
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('open');
                mobileToggle.classList.remove('open');
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                mobileToggle.classList.remove('open');
            }
        });
    }
}

// Project filtering functionality
function initProjectFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter project cards
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    // Add entrance animation
                    card.style.animation = 'none';
                    card.offsetHeight; // Trigger reflow
                    card.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    card.classList.add('hidden');
                }
            });
            
            // Update projects count display if needed
            updateProjectsCount(filter);
        });
    });
}

function updateProjectsCount(filter) {
    const projectCards = document.querySelectorAll('.project-card:not(.hidden)');
    const countElements = document.querySelectorAll('[data-project-count]');
    
    countElements.forEach(element => {
        const countType = element.getAttribute('data-project-count');
        let count = 0;
        
        if (countType === 'total') {
            count = document.querySelectorAll('.project-card').length;
        } else if (countType === 'visible') {
            count = projectCards.length;
        }
        
        if (element.textContent.includes(':')) {
            const parts = element.textContent.split(':');
            element.textContent = parts[0] + ': ' + count;
        } else {
            element.textContent = count.toString();
        }
    });
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Validate form data
            if (!validateContactForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Show success notification
                showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success', 6000);
                contactForm.reset();
                
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Remove validation classes
                const inputs = contactForm.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.classList.remove('error', 'valid');
                    if (input.parentElement) {
                        input.parentElement.classList.remove('focused');
                    }
                });
            }, 1500);
        });
    }
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject || data.subject.trim().length < 5) {
        errors.push('Subject must be at least 5 characters long');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showNotification('❌ Please fix the following errors:\n• ' + errors.join('\n• '), 'error', 8000);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        });
        
        // Scroll to top on click
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Chart initialization
function initCharts() {
    initProjectChart();
}

function initProjectChart() {
    const ctx = document.getElementById('projectChart');
    if (!ctx) return;
    
    // Project statistics data
    const projectData = {
        categories: ['AI/ML Projects', 'Cloud/DevOps', 'Live Demos', 'Enterprise-Grade'],
        values: [6, 3, 4, 10],
        colors: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F']
    };
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: projectData.categories,
            datasets: [{
                data: projectData.values,
                backgroundColor: projectData.colors,
                borderWidth: 3,
                borderColor: '#1a1f2e',
                hoverBorderWidth: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e2e8f0',
                        font: {
                            size: 12,
                            family: "'FKGroteskNeue', 'Geist', 'Inter', sans-serif"
                        },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: '#1a1f2e',
                    titleColor: '#e2e8f0',
                    bodyColor: '#e2e8f0',
                    borderColor: '#1FB8CD',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((context.parsed / total) * 100);
                            return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    // Create intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                
                // Special handling for stat items with staggered animation
                if (entry.target.classList.contains('hero-stats')) {
                    animateStats(entry.target);
                }
                
                // Special handling for project cards
                if (entry.target.classList.contains('projects-grid')) {
                    animateProjectCards(entry.target);
                }
                
                // Special handling for skill categories
                if (entry.target.classList.contains('skills-grid')) {
                    animateSkillCategories(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .hero-stats,
        .about-content,
        .project-stats,
        .projects-grid,
        .skills-grid,
        .experience-item,
        .contact-content
    `);
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function animateStats(statsContainer) {
    const statItems = statsContainer.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) scale(0.9)';
            item.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
                
                // Animate the stat value
                animateNumber(item.querySelector('.stat-value'));
            }, 50);
        }, index * 150);
    });
}

function animateProjectCards(projectsGrid) {
    const projectCards = projectsGrid.querySelectorAll('.project-card:not(.hidden)');
    projectCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
}

function animateSkillCategories(skillsGrid) {
    const skillCategories = skillsGrid.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        setTimeout(() => {
            category.style.opacity = '0';
            category.style.transform = 'translateX(-30px)';
            category.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            
            setTimeout(() => {
                category.style.opacity = '1';
                category.style.transform = 'translateX(0)';
                
                // Animate skill tags
                animateSkillTags(category);
            }, 50);
        }, index * 200);
    });
}

function animateSkillTags(category) {
    const skillTags = category.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            tag.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'scale(1)';
            }, 50);
        }, index * 50);
    });
}

function animateNumber(element) {
    if (!element) return;
    
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasDollar = text.includes('$');
    const hasPlus = text.includes('+');
    
    // Extract number from text
    let targetNumber = parseFloat(text.replace(/[^\d.]/g, ''));
    if (isNaN(targetNumber)) return;
    
    let currentNumber = 0;
    const increment = targetNumber / 60; // 60 frames for 1 second animation
    const duration = 2000;
    const frameRate = 1000 / 60;
    
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            clearInterval(timer);
        }
        
        let displayValue = currentNumber;
        if (targetNumber < 1) {
            displayValue = currentNumber.toFixed(1);
        } else if (targetNumber < 10) {
            displayValue = currentNumber.toFixed(1);
        } else {
            displayValue = Math.floor(currentNumber);
        }
        
        let displayText = displayValue.toString();
        if (hasDollar) displayText = '$' + displayText;
        if (hasPercent) displayText += '%';
        if (hasPlus) displayText += '+';
        
        element.textContent = displayText;
    }, frameRate);
}

// Smooth scrolling for all internal links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced notification system
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    if (!container) {
        console.error('Notification container not found');
        return;
    }
    
    // Remove existing notifications of the same type
    const existingNotifications = container.querySelectorAll('.notification');
    existingNotifications.forEach(notif => {
        notif.style.transform = 'translateX(400px)';
        setTimeout(() => notif.remove(), 300);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    const typeStyles = {
        success: { 
            bg: 'var(--color-success)', 
            text: 'var(--color-btn-primary-text)',
            border: 'var(--color-success)'
        },
        error: { 
            bg: 'var(--color-error)', 
            text: 'var(--color-btn-primary-text)',
            border: 'var(--color-error)'
        },
        warning: { 
            bg: 'var(--color-warning)', 
            text: 'var(--color-btn-primary-text)',
            border: 'var(--color-warning)'
        },
        info: { 
            bg: 'var(--color-primary)', 
            text: 'var(--color-btn-primary-text)',
            border: 'var(--color-primary)'
        }
    };
    
    const style = typeStyles[type] || typeStyles.info;
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    // Apply styles
    notification.style.cssText = `
        background: ${style.bg};
        color: ${style.text};
        border: 2px solid ${style.border};
        border-radius: var(--radius-lg);
        padding: var(--space-16) var(--space-20);
        margin-bottom: var(--space-12);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: auto;
        font-weight: 500;
        position: relative;
        overflow: hidden;
    `;
    
    // Style the notification content
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: flex-start;
        gap: var(--space-12);
        position: relative;
        z-index: 2;
    `;
    
    const messageEl = notification.querySelector('.notification-message');
    messageEl.style.cssText = `
        flex: 1;
        font-size: var(--font-size-sm);
        line-height: 1.5;
        white-space: pre-line;
        font-weight: 500;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: ${style.text};
        font-size: var(--font-size-lg);
        cursor: pointer;
        padding: var(--space-4);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;
        flex-shrink: 0;
        opacity: 0.8;
        font-weight: bold;
        line-height: 1;
    `;
    
    // Add subtle animation background
    const animBg = document.createElement('div');
    animBg.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: shimmer 2s ease-in-out infinite;
        z-index: 1;
    `;
    notification.appendChild(animBg);
    
    // Add shimmer animation
    if (!document.getElementById('shimmer-keyframes')) {
        const shimmerStyle = document.createElement('style');
        shimmerStyle.id = 'shimmer-keyframes';
        shimmerStyle.textContent = `
            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(shimmerStyle);
    }
    
    // Add to container
    container.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Add close functionality
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Hover effects
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '1';
        closeBtn.style.transform = 'scale(1.1)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.8';
        closeBtn.style.transform = 'scale(1)';
    });
    
    // Auto-hide after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
}

// Add CSS for fade-in animations
const fadeInCSS = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Add CSS to document
const style = document.createElement('style');
style.textContent = fadeInCSS;
document.head.appendChild(style);

// Project card interactions
document.addEventListener('click', function(e) {
    // Handle "View Details" buttons
    if (e.target.textContent === 'View Details') {
        e.preventDefault();
        const projectCard = e.target.closest('.project-card');
        const projectTitle = projectCard.querySelector('.project-title').textContent;
        showNotification(`📋 Detailed information for "${projectTitle}" would be displayed in a modal or separate page.`, 'info');
    }
    
    // Handle "Request Demo" buttons
    if (e.target.textContent === 'Request Demo') {
        e.preventDefault();
        const projectCard = e.target.closest('.project-card');
        const projectTitle = projectCard.querySelector('.project-title').textContent;
        showNotification(`🎯 Demo request submitted for "${projectTitle}". I'll contact you soon to schedule a demonstration.`, 'success');
        
        // Scroll to contact section
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 2000);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + number keys for quick navigation
    if (e.altKey) {
        const shortcuts = {
            '1': '#home',
            '2': '#about',
            '3': '#projects',
            '4': '#skills',
            '5': '#experience',
            '6': '#contact'
        };
        
        const target = shortcuts[e.key];
        if (target) {
            e.preventDefault();
            const section = document.querySelector(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                showNotification(`🧭 Navigated to ${target.replace('#', '')} section`, 'info', 2000);
            }
        }
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenu && mobileToggle && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            mobileToggle.classList.remove('open');
        }
    }
});

// Performance optimization: Lazy load images when implemented
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Header scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        header.style.background = 'rgba(var(--color-surface-rgb, 255, 255, 255), 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--color-surface)';
        header.style.backdropFilter = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// Initialize tech orbit hover effects
document.addEventListener('DOMContentLoaded', function() {
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform += ' scale(1.1)';
            this.style.zIndex = '20';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.1)', '');
            this.style.zIndex = '1';
        });
    });
});

// Contact form enhancements
function initContactFormEnhancements() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Real-time validation
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    switch(field.name) {
        case 'name':
            isValid = value.length >= 2;
            message = isValid ? '' : 'Name must be at least 2 characters';
            break;
        case 'email':
            isValid = isValidEmail(value);
            message = isValid ? '' : 'Please enter a valid email';
            break;
        case 'subject':
            isValid = value.length >= 5;
            message = isValid ? '' : 'Subject must be at least 5 characters';
            break;
        case 'message':
            isValid = value.length >= 10;
            message = isValid ? '' : 'Message must be at least 10 characters';
            break;
    }
    
    // Update field appearance
    if (value) {
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            field.classList.add('error');
            field.classList.remove('valid');
        }
    } else {
        field.classList.remove('error', 'valid');
    }
    
    return isValid;
}

// Initialize enhanced contact form
setTimeout(initContactFormEnhancements, 100);

console.log('🎯 Portfolio JavaScript loaded successfully!');
console.log('✨ Features: Navigation, Mobile menu, Project filtering, Contact form, Animations');
console.log('⌨️ Keyboard shortcuts: Alt+1-6 for navigation, Escape to close modals');