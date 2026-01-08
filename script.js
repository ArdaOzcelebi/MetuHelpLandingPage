// METU HELP Landing Page JavaScript

// Create toast notification function
function showToast(message, type = 'success') {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Trigger animation using requestAnimationFrame for better performance
    // Double requestAnimationFrame ensures the element is fully rendered before animating
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    });
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, 4000);
}

/**
 * Debounce helper function for performance optimization
 * Delays function execution until after wait time has elapsed since last call
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Constants
const SCROLL_DEBOUNCE_MS = 10;

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const navbar = document.querySelector('.navbar');
    const animatedElements = document.querySelectorAll('.feature-card, .flow-step');
    
    // Handle smooth scrolling for anchor links (event delegation)
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });

    // Add scroll animation effect with IntersectionObserver (more efficient than scroll listeners)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe feature cards and flow steps
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Navbar scroll effect with debouncing and CSS classes
    const handleScroll = debounce(function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }, SCROLL_DEBOUNCE_MS);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
});
