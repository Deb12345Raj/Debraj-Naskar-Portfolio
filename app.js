// Optimized Portfolio Website JavaScript

// Global variables - reduced scope
let heroScene = null;
let globalMouse = { x: 0, y: 0 };
let cursorTrails = [];
let isScrolling = false;
let scrollTimeout;

// Performance settings
const PERFORMANCE_CONFIG = {
    maxNodes: 40, // Reduced from 60-70
    connectionDistance: 6, // Reduced from 8-10
    connectionUpdateInterval: 200, // Increased from 80-100ms
    animationQuality: 'auto' // auto, low, medium, high
};

// Detect device performance
function getPerformanceLevel() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'low';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer.includes('Intel') || renderer.includes('Software')) {
            return 'low';
        }
    }
    
    // Check if mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return 'low';
    }
    
    return window.devicePixelRatio > 1 ? 'high' : 'medium';
}

// Adjust settings based on performance
function initPerformanceSettings() {
    const level = getPerformanceLevel();
    
    switch(level) {
        case 'low':
            PERFORMANCE_CONFIG.maxNodes = 25;
            PERFORMANCE_CONFIG.connectionDistance = 4;
            PERFORMANCE_CONFIG.connectionUpdateInterval = 400;
            break;
        case 'medium':
            PERFORMANCE_CONFIG.maxNodes = 35;
            PERFORMANCE_CONFIG.connectionDistance = 5;
            PERFORMANCE_CONFIG.connectionUpdateInterval = 250;
            break;
        case 'high':
            PERFORMANCE_CONFIG.maxNodes = 50;
            PERFORMANCE_CONFIG.connectionDistance = 7;
            PERFORMANCE_CONFIG.connectionUpdateInterval = 150;
            break;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initPerformanceSettings();
    initNotificationSystem();
    initOptimizedCursorEffects();
    initSingleHeroBackground(); // Only hero gets 3D background
    initNavigation();
    initMobileMenu();
    initProjectFiltering();
    initContactForm();
    initBackToTop();
    initCharts();
    initScrollAnimations();
    initSmoothScrolling();
    
    console.log('Optimized Portfolio loaded successfully!');
});

// Optimized cursor effects with throttling
function initOptimizedCursorEffects() {
    const cursorDot = document.getElementById('cursor-dot');
    const trailElements = document.querySelectorAll('.cursor-trail');
    
    if (!cursorDot || trailElements.length === 0) return;
    
    // Limit trail elements for performance
    const maxTrails = Math.min(trailElements.length, 3);
    const activeTrails = Array.from(trailElements).slice(0, maxTrails);
    
    // Hide unused trails
    for (let i = maxTrails; i < trailElements.length; i++) {
        trailElements[i].style.display = 'none';
    }
    
    // Initialize trail positions
    for (let i = 0; i < maxTrails; i++) {
        cursorTrails.push({ x: 0, y: 0 });
    }
    
    // Throttled mouse tracking
    let mouseUpdateFrame;
    document.addEventListener('mousemove', (e) => {
        if (mouseUpdateFrame) return;
        
        mouseUpdateFrame = requestAnimationFrame(() => {
            globalMouse.x = e.clientX;
            globalMouse.y = e.clientY;
            
            cursorDot.style.transform = `translate(${globalMouse.x - 10}px, ${globalMouse.y - 10}px)`;
            mouseUpdateFrame = null;
        });
    });
    
    // Optimized cursor trails animation
    function animateCursorTrails() {
        let targetX = globalMouse.x;
        let targetY = globalMouse.y;
        
        activeTrails.forEach((trail, index) => {
            const trail_obj = cursorTrails[index];
            
            // Reduced interpolation calculations
            const lerp = 0.2 - index * 0.03;
            trail_obj.x += (targetX - trail_obj.x) * lerp;
            trail_obj.y += (targetY - trail_obj.y) * lerp;
            
            trail.style.transform = `translate(${trail_obj.x - 4}px, ${trail_obj.y - 4}px)`;
            
            targetX = trail_obj.x;
            targetY = trail_obj.y;
        });
        
        requestAnimationFrame(animateCursorTrails);
    }
    
    animateCursorTrails();
}

// Single optimized 3D background for hero only
function initSingleHeroBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true,
        antialias: false, // Disable for better performance
        powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    
    // Optimized mouse tracking
    let target = { x: 0, y: 0 };
    
    // Create fewer, reusable geometries and materials
    const nodeGeometry = new THREE.SphereGeometry(0.05, 8, 8); // Reduced segments
    const nodeMaterials = {
        default: new THREE.MeshBasicMaterial({ 
            color: 0x32b8d9,
            transparent: true,
            opacity: 0.8
        }),
        highlight: new THREE.MeshBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 1.0
        })
    };
    
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x32b8d9, 
        opacity: 0.2, 
        transparent: true 
    });
    
    // Create optimized nodes
    const nodes = [];
    const maxNodes = PERFORMANCE_CONFIG.maxNodes;
    
    for (let i = 0; i < maxNodes; i++) {
        const node = new THREE.Mesh(nodeGeometry, nodeMaterials.default);
        node.position.set(
            (Math.random() - 0.5) * 25,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 15
        );
        
        // Simplified user data
        node.userData = {
            originalPos: node.position.clone(),
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.02
        };
        
        scene.add(node);
        nodes.push(node);
    }
    
    // Pre-allocated connection pool
    const connectionPool = [];
    const activeConnections = [];
    
    // Create connection pool
    for (let i = 0; i < 50; i++) {
        const geometry = new THREE.BufferGeometry();
        const line = new THREE.Line(geometry, lineMaterial);
        line.visible = false;
        scene.add(line);
        connectionPool.push(line);
    }
    
    // Optimized connection updates
    function updateConnections() {
        // Hide all active connections
        activeConnections.forEach(conn => conn.visible = false);
        activeConnections.length = 0;
        
        let poolIndex = 0;
        const maxDistance = PERFORMANCE_CONFIG.connectionDistance;
        
        for (let i = 0; i < nodes.length && poolIndex < connectionPool.length; i++) {
            for (let j = i + 1; j < nodes.length && poolIndex < connectionPool.length; j++) {
                const distance = nodes[i].position.distanceTo(nodes[j].position);
                
                if (distance < maxDistance) {
                    const line = connectionPool[poolIndex++];
                    const positions = [
                        nodes[i].position.x, nodes[i].position.y, nodes[i].position.z,
                        nodes[j].position.x, nodes[j].position.y, nodes[j].position.z
                    ];
                    
                    line.geometry.setAttribute('position', 
                        new THREE.Float32BufferAttribute(positions, 3));
                    line.material.opacity = Math.max(0.05, 0.3 - (distance / maxDistance) * 0.25);
                    line.visible = true;
                    activeConnections.push(line);
                }
            }
        }
    }
    
    // Throttled mouse interaction
    canvas.addEventListener('mousemove', (event) => {
        if (isScrolling) return; // Skip during scroll
        
        const rect = canvas.getBoundingClientRect();
        target.x = ((event.clientX - rect.left) / rect.width) * 8 - 4;
        target.y = -((event.clientY - rect.top) / rect.height) * 8 + 4;
    });
    
    camera.position.z = 15;
    heroScene = { scene, camera, renderer };
    
    let lastConnectionUpdate = 0;
    let frameCount = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        
        frameCount++;
        const time = Date.now() * 0.001;
        
        // Skip expensive operations on alternate frames for lower performance
        const skipFrame = PERFORMANCE_CONFIG.animationQuality === 'low' && frameCount % 2 === 0;
        
        if (!skipFrame) {
            // Animate nodes with reduced calculations
            nodes.forEach((node, index) => {
                const userData = node.userData;
                
                // Simplified mouse interaction
                const mouseInfluence = 0.015;
                node.position.lerp({
                    x: userData.originalPos.x + target.x * mouseInfluence,
                    y: userData.originalPos.y + target.y * mouseInfluence,
                    z: userData.originalPos.z
                }, 0.03);
                
                // Reduced pulsing calculation
                if (index % 3 === frameCount % 3) { // Stagger updates
                    const pulse = Math.sin(time * userData.pulseSpeed + userData.pulsePhase) * 0.2 + 1;
                    node.scale.setScalar(pulse);
                }
                
                // Simplified rotation
                node.rotation.x += 0.005;
                node.rotation.y += 0.008;
            });
        }
        
        // Update connections less frequently
        if (time - lastConnectionUpdate > PERFORMANCE_CONFIG.connectionUpdateInterval * 0.001) {
            updateConnections();
            lastConnectionUpdate = time;
        }
        
        // Slower scene rotation
        scene.rotation.y += 0.0008;
        
        renderer.render(scene, camera);
    }
    
    updateConnections();
    animate();
}

// Simplified notification system
function initNotificationSystem() {
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

// Optimized navigation with scroll throttling
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    let ticking = false;
    
    function updateActiveNav() {
        if (!ticking) {
            requestAnimationFrame(() => {
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
                    link.classList.toggle('active', 
                        link.getAttribute('href') === `#${current}`);
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Throttled scroll listener
    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        
        updateActiveNav();
        
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 150);
    });
    
    updateActiveNav();
    
    // Navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Keep other essential functions but remove redundant 3D backgrounds
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open');
        });
        
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('open');
                mobileToggle.classList.remove('open');
            }
        });
    }
}

function initProjectFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                card.classList.toggle('hidden', !shouldShow);
                if (shouldShow) {
                    card.style.animation = 'fadeInUp 0.4s ease-out';
                }
            });
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            if (!validateContactForm(data)) return;
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success', 5000);
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
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
        showNotification('Please fix the following errors:\n• ' + errors.join('\n• '), 'error', 6000);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const shouldShow = window.pageYOffset > 300;
                    backToTopBtn.classList.toggle('hidden', !shouldShow);
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Simplified chart initialization
function initCharts() {
    const ctx = document.getElementById('projectChart');
    if (!ctx || typeof Chart === 'undefined') return;
    
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
                borderWidth: 2,
                borderColor: '#1a1f2e'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1000 },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#e2e8f0', font: { size: 12 } }
                }
            }
        }
    });
}

// Optimized scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.project-card, .skill-category, .experience-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Simplified notification function
function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.style.cssText = `
        background: var(--color-primary);
        color: white;
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 0.5rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        pointer-events: auto;
    `;
    
    notification.textContent = message;
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    if (duration > 0) {
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// Add basic CSS
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    .fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Optimized resize handler
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (heroScene) {
            heroScene.camera.aspect = window.innerWidth / window.innerHeight;
            heroScene.camera.updateProjectionMatrix();
            heroScene.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }, 250);
});

// Cleanup on unload
window.addEventListener('beforeunload', function() {
    if (heroScene) {
        heroScene.renderer.dispose();
        heroScene.scene.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }
});

console.log('Optimized Portfolio loaded - Performance level:', getPerformanceLevel());