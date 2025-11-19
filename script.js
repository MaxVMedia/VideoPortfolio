// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger icon
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Only handle hash links that start with # and are internal anchors
        if (!href || href === '#' || !href.startsWith('#')) {
            return;
        }

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Throttle function for performance optimization
function throttle(func, wait) {
    let timeout;
    let lastRan;
    return function executedFunction(...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                if ((Date.now() - lastRan) >= wait) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, wait - (Date.now() - lastRan));
        }
    };
}

// Navbar background on scroll - Optimized with throttle and requestAnimationFrame
const navbar = document.querySelector('.navbar');
let ticking = false;
let lastScrollY = 0;

const updateNavbar = () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = 'none';
    }

    ticking = false;
};

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}, { passive: true });

// Video item handlers
const videoItems = document.querySelectorAll('.video-item');

videoItems.forEach(item => {
    const previewVideo = item.querySelector('.preview-video');
    const videoUrl = item.getAttribute('data-video-url');

    // Hover to play preview video
    if (previewVideo) {
        item.addEventListener('mouseenter', () => {
            previewVideo.play().catch(err => {
                console.log('Video play prevented:', err);
            });
        });

        item.addEventListener('mouseleave', () => {
            previewVideo.pause();
            previewVideo.currentTime = 0;
        });
    }

    // Click to open modal with video
    item.addEventListener('click', () => {
        const videoSrc = previewVideo?.querySelector('source')?.src;

        if (videoSrc) {
            openVideoModal(videoSrc, videoUrl);
        } else {
            // Fallback for items without video
            item.style.transform = 'scale(0.98)';
            setTimeout(() => {
                item.style.transform = '';
            }, 200);
            console.log('Video clicked:', item.querySelector('h3').textContent);
        }
    });
});

// Video Modal functionality
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalVideoSource = modalVideo.querySelector('source');
const fullVideoLink = document.getElementById('fullVideoLink');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

function openVideoModal(videoSrc, fullUrl) {
    // Set video source
    modalVideoSource.src = videoSrc;
    modalVideo.load();

    // Set full video link
    if (fullUrl) {
        fullVideoLink.href = fullUrl;
        fullVideoLink.style.display = 'inline-block';
    } else {
        fullVideoLink.style.display = 'none';
    }

    // Show modal
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Play video
    modalVideo.play().catch(err => {
        console.log('Video play prevented:', err);
    });
}

function closeVideoModal() {
    videoModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling

    // Pause and reset video
    modalVideo.pause();
    modalVideo.currentTime = 0;
}

// Close modal when clicking X button
modalClose.addEventListener('click', closeVideoModal);

// Close modal when clicking overlay
modalOverlay.addEventListener('click', closeVideoModal);

// Close modal when pressing ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
    }
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Here you would typically send this data to a server
        // For now, we'll just log it and show a success message
        console.log('Form submitted:', { name, email, subject, message });

        // Show success message
        alert('Thank you for your message! We will get back to you soon.');

        // Reset form
        contactForm.reset();

        // In a real application, you might use:
        // - FormSpree
        // - EmailJS
        // - Your own backend API
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe video items for scroll animation
videoItems.forEach(item => {
    observer.observe(item);
});

// Active navigation link highlighting - Optimized with throttle and caching
const sections = document.querySelectorAll('section[id]');
const navLinkCache = new Map();

// Cache nav links for better performance
sections.forEach(section => {
    const sectionId = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);
    if (link) {
        navLinkCache.set(sectionId, link);
    }
});

const highlightNavigation = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const link = navLinkCache.get(sectionId);

        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
};

// Use throttled version for scroll event
window.addEventListener('scroll', throttle(highlightNavigation, 100), { passive: true });

// Add smooth entrance animation for hero content
window.addEventListener('load', () => {
    const heroContent = document.querySelector('.hero-content');
    heroContent.style.opacity = '1';
});

// Image Modal functionality
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const imageModalClose = imageModal.querySelector('.modal-close');
const imageModalOverlay = imageModal.querySelector('.modal-overlay');

// Get all clickable images
const clickableImages = document.querySelectorAll('.clickable-image img');

function openImageModal(imageSrc, altText) {
    // Set image source and alt
    modalImage.src = imageSrc;
    modalImage.alt = altText || 'Statistics Screenshot';

    // Show modal
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeImageModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling

    // Clear image src after animation completes
    setTimeout(() => {
        if (!imageModal.classList.contains('active')) {
            modalImage.src = '';
        }
    }, 300);
}

// Add click event to all clickable images
clickableImages.forEach(img => {
    img.parentElement.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        const imageSrc = img.getAttribute('data-full-image') || img.src;
        const altText = img.alt;
        openImageModal(imageSrc, altText);
    });
});

// Close modal when clicking X button
imageModalClose.addEventListener('click', closeImageModal);

// Close modal when clicking overlay
imageModalOverlay.addEventListener('click', closeImageModal);

// Close modal when pressing ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        closeImageModal();
    }
});
