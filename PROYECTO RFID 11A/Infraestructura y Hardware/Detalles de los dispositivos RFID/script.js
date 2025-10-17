// ===== Main JavaScript for RFID Projects Website =====

// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    initializeSidebar();
    initializeImageModals();
    initializeCodeHighlighting();
    updateActiveNavigation();
});

// ===== Navigation Functions =====
function initializeNavigation() {
    // Update active navigation based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        if ((currentPath === '/' || currentPath === '/index.html') && href === 'index.html') {
            link.classList.add('active');
        } else if (currentPath.includes('raspberry-pi') && href === 'raspberry-pi.html') {
            link.classList.add('active');
        } else if (currentPath.includes('esp32') && href === 'esp32.html') {
            link.classList.add('active');
        }
    });
}

function updateActiveNavigation() {
    // This function can be called when navigating programmatically
    initializeNavigation();
}

// ===== Mobile Menu =====
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isActive = mobileMenu.classList.contains('active');
            
            if (isActive) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            } else {
                mobileMenu.classList.add('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileMenu.querySelectorAll('.nav-link-mobile');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuToggle.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// ===== Sidebar Navigation =====
function initializeSidebar() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Remove active class from all sidebar links
                sidebarLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL hash without triggering scroll
                history.pushState(null, null, '#' + targetId);
            }
        });
    });
    
    // Handle initial hash on page load
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        const targetLink = document.querySelector(`.sidebar-link[href="#${targetId}"]`);
        
        if (targetElement && targetLink) {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            targetLink.classList.add('active');
            
            // Delay scroll to ensure page is fully loaded
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
    
    // Update active sidebar link on scroll
    updateSidebarOnScroll();
}

function updateSidebarOnScroll() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    if (sidebarLinks.length === 0) return;
    
    let currentSection = '';
    
    // Create intersection observer for section visibility
    const observerOptions = {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSection = entry.target.id;
                
                // Update active sidebar link
                sidebarLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === '#' + currentSection) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections that have corresponding sidebar links
    sidebarLinks.forEach(link => {
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            observer.observe(targetElement);
        }
    });
}

// ===== Image Modals =====
function initializeImageModals() {
    const imageThumbnails = document.querySelectorAll('.image-thumbnail');
    
    imageThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const src = this.src || this.querySelector('img')?.src;
            const alt = this.alt || this.querySelector('img')?.alt || 'Image';
            
            if (src) {
                openImageModal(src, alt);
            }
        });
    });
}

function openImageModal(src, alt) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = createImageModal();
    }
    
    const modalImg = modal.querySelector('.modal-image');
    modalImg.src = src;
    modalImg.alt = alt;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close modal on click outside image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeImageModal();
        }
    });
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function createImageModal() {
    const modal = document.createElement('div');
    modal.id = 'imageModal';
    modal.className = 'modal';
    modal.setAttribute('data-testid', 'image-modal');
    
    modal.innerHTML = `
        <button class="modal-close" onclick="closeImageModal()" data-testid="modal-close">&times;</button>
        <img class="modal-image" src="" alt="" data-testid="modal-image">
    `;
    
    document.body.appendChild(modal);
    return modal;
}

// Make closeImageModal globally available for onclick handler
window.closeImageModal = closeImageModal;

// ===== Code Highlighting =====
function initializeCodeHighlighting() {
    // Highlight code when Prism is available
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    
    // Re-highlight when new content is added dynamically
    const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
    codeBlocks.forEach(block => {
        if (typeof Prism !== 'undefined') {
            Prism.highlightElement(block.querySelector('code'));
        }
    });
}

// ===== Utility Functions =====

// Smooth scroll to element by ID
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Update page title
function updatePageTitle(title) {
    document.title = title;
}

// Add loading state to buttons
function addLoadingState(button, text = 'Cargando...') {
    if (button) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = text;
        button.classList.add('loading');
    }
}

function removeLoadingState(button) {
    if (button && button.dataset.originalText) {
        button.disabled = false;
        button.textContent = button.dataset.originalText;
        button.classList.remove('loading');
        delete button.dataset.originalText;
    }
}

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Handle window resize events
window.addEventListener('resize', debounce(function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle?.setAttribute('aria-expanded', 'false');
        }
    }
}, 250));

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    updateActiveNavigation();
    
    // Handle hash changes for sidebar navigation
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        const targetLink = document.querySelector(`.sidebar-link[href="#${targetId}"]`);
        
        if (targetElement && targetLink) {
            const sidebarLinks = document.querySelectorAll('.sidebar-link');
            sidebarLinks.forEach(l => l.classList.remove('active'));
            targetLink.classList.add('active');
            
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
});

// ===== Performance Optimizations =====

// Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Initialize lazy loading if there are lazy images
if (document.querySelectorAll('img[data-src]').length > 0) {
    initializeLazyLoading();
}

// ===== Accessibility Enhancements =====

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeImageModal();
        }
        
        // Close mobile menu with Escape
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            mobileMenuToggle?.setAttribute('aria-expanded', 'false');
        }
    }
});

// Announce page changes for screen readers
function announcePageChange(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add screen reader only styles
const srOnlyStyles = `
.sr-only {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}
`;

if (!document.getElementById('sr-only-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'sr-only-styles';
    styleSheet.textContent = srOnlyStyles;
    document.head.appendChild(styleSheet);
}

// ===== Console Welcome Message =====
console.log('%c🔧 RFID Projects Website', 'color: #4299e1; font-size: 16px; font-weight: bold;');
console.log('%cDocumentación completa de proyectos RFID con Raspberry Pi y ESP32', 'color: #68d391; font-size: 12px;');
console.log('%cVisita: https://pimylifeup.com/raspberry-pi-rfid-attendance-system', 'color: #9ca3af; font-size: 10px;');