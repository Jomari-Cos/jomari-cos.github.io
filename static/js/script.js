document.addEventListener('DOMContentLoaded', () => {
      initThemeToggle();
      initHamburgerMenu();
      initBackToTop();
      initCarousel();
      initImageCarousels();
      initScrollAnimations();
      initContactForm();
      initTypingAnimation();
  });

function initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        toggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
}

function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.project-card');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (!track) return;

    let currentIndex = 0;
    let autoAdvanceInterval;

    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 32;
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Reset auto-advance timer when manually changing slides
        resetAutoAdvance();
    }

    function startAutoAdvance() {
        // Clear any existing interval
        clearInterval(autoAdvanceInterval);
        // Set new interval to advance every 6 seconds for smoother experience
        autoAdvanceInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }, 6000);
    }

    function resetAutoAdvance() {
        // Clear and restart the auto-advance timer directly
        clearInterval(autoAdvanceInterval);
        autoAdvanceInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }, 6000);
    }

    prevBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    });

    nextBtn?.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    let startX, endX;
    track.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', e => {
        endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        } else if (endX - startX > 50) {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        }
    });
    
    // Start auto-advance when the page loads
    startAutoAdvance();
    
    // Pause auto-advance when user hovers over the carousel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoAdvanceInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoAdvance();
        });
    }
}

function initImageCarousels() {
    const carouselWrappers = document.querySelectorAll('.project-image-carousel');
    
    carouselWrappers.forEach(wrapper => {
        const track = wrapper.querySelector('.image-carousel-track');
        const images = wrapper.querySelectorAll('.image-carousel-track img');
        const prevBtn = wrapper.querySelector('.image-carousel-btn.prev');
        const nextBtn = wrapper.querySelector('.image-carousel-btn.next');
        const dots = wrapper.querySelectorAll('.image-carousel-dots .dot');
        
        if (!track || images.length === 0) return;
        
        let currentIndex = 0;
        let autoAdvanceInterval;
        
        function updateImageCarousel() {
            const imageWidth = images[0].offsetWidth;
            track.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        function startAutoAdvance() {
            // Clear any existing interval
            clearInterval(autoAdvanceInterval);
            // Set new interval to advance every 4 seconds for smoother experience
            autoAdvanceInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                updateImageCarousel();
            }, 4000);
        }
        
        function resetAutoAdvance() {
            // Clear and restart the auto-advance timer directly
            clearInterval(autoAdvanceInterval);
            autoAdvanceInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                updateImageCarousel();
            }, 4000);
        }
        
        prevBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImageCarousel();
        });
        
        nextBtn?.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImageCarousel();
        });
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateImageCarousel();
            });
        });
        
        let startX, endX;
        track.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchend', e => {
            endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) {
                currentIndex = (currentIndex + 1) % images.length;
                updateImageCarousel();
            } else if (endX - startX > 50) {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateImageCarousel();
            }
        });
        
        // Start auto-advance when the page loads
        startAutoAdvance();
        
        // Pause auto-advance when user hovers over the image carousel
        wrapper.addEventListener('mouseenter', () => {
            clearInterval(autoAdvanceInterval);
        });
        
        wrapper.addEventListener('mouseleave', () => {
            startAutoAdvance();
        });
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass-card, .section-title').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const name = formData.get('name');

        alert(`Thanks ${name}! Your message has been sent.`);
        form.reset();
    });
}

function initTypingAnimation() {
    const element = document.querySelector('.typing-text');
    if (!element) return;

    const text = element.textContent;
    element.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    setTimeout(typeWriter, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});