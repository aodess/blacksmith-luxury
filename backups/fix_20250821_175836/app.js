// BLACKSMITH APP.JS

// Data Storage
const siteData = {
    services: [
        {
            id: 1,
            icon: '',
            title: 'Классический массаж',
            desc: 'Расслабляющий массаж всего тела с использованием масел',
            price: '350'
        },
        {
            id: 2,
            icon: '',
            title: 'Спортивный массаж',
            desc: 'Глубокая проработка мышц для спортсменов',
            price: '450'
        },
        {
            id: 3,
            icon: '',
            title: 'Горячие камни',
            desc: 'Массаж с использованием базальтовых камней',
            price: '500'
        },
        {
            id: 4,
            icon: '',
            title: 'Тайский массаж',
            desc: 'Традиционная тайская техника с растяжкой',
            price: '550'
        }
    ],
    masters: [
        {
            id: 1,
            name: 'Александр Петров',
            spec: 'Мастер спортивного массажа',
            experience: '15 лет опыта',
            rating: '',
            photo: null
        },
        {
            id: 2,
            name: 'Михаил Чен',
            spec: 'Специалист тайского массажа',
            experience: '12 лет опыта',
            rating: '',
            photo: null
        },
        {
            id: 3,
            name: 'Давид Коваленко',
            spec: 'Классический и лечебный массаж',
            experience: '10 лет опыта',
            rating: '',
            photo: null
        }
    ],
    gallery: [],
    bookings: [],
    settings: {
        phone: '+972 50-123-4567',
        address: 'Rothschild Blvd 50, Tel Aviv',
        hours: 'Пн-Сб: 9:00-21:00<br>Вс: 10:00-20:00',
        email: 'info@blacksmith-massage.com'
    }
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('blacksmithData');
    if (saved) {
        Object.assign(siteData, JSON.parse(saved));
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('blacksmithData', JSON.stringify(siteData));
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initLoader();
    initNavbar();
    initAnimations();
    renderServices();
    renderMasters();
    renderGallery();
    initBooking();
    updateContacts();
    initAOS();
    initTilt();
});

// Loader
function initLoader() {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2000);
}

// Navbar
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navBurger = document.getElementById('navBurger');
    const navMenu = document.getElementById('navMenu');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    navBurger?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navBurger.classList.toggle('active');
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Animations
function initAnimations() {
    // Create animated background
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const animatedBg = document.getElementById('animatedBg');
    
    if (animatedBg) {
        animatedBg.appendChild(canvas);
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Particles
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
}

// Render Services
function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (grid) {
        grid.innerHTML = siteData.services.map(service => `
            <div class="service-card" data-aos="fade-up">
                <div class="service-icon">${service.icon}</div>
                <h3 class="service-title">${service.title}</h3>
                <p class="service-desc">${service.desc}</p>
                <div class="service-price">${service.price}</div>
            </div>
        `).join('');
    }
}

// Render Masters
function renderMasters() {
    const slider = document.getElementById('mastersSlider');
    if (slider) {
        slider.innerHTML = siteData.masters.map(master => `
            <div class="swiper-slide">
                <div class="master-card">
                    <div class="master-photo">
                        ${master.photo ? 
                            `<img src="${master.photo}" alt="${master.name}">` :
                            `<div style="width:100%;height:100%;background:linear-gradient(135deg,#D4AF37,#B8860B);display:flex;align-items:center;justify-content:center;font-size:3rem;"></div>`
                        }
                    </div>
                    <h3 class="master-name">${master.name}</h3>
                    <p class="master-spec">${master.spec}</p>
                    <p class="master-experience">${master.experience}</p>
                    <div class="master-rating">${master.rating}</div>
                </div>
            </div>
        `).join('');
        
        // Initialize Swiper
        new Swiper('.masters-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            breakpoints: {
                640: {
                    slidesPerView: 2
                },
                1024: {
                    slidesPerView: 3
                }
            }
        });
    }
}

// Render Gallery
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (grid) {
        if (siteData.gallery.length > 0) {
            grid.innerHTML = siteData.gallery.map((img, index) => `
                <div class="gallery-item" data-aos="fade-up">
                    <img src="${img.url}" alt="Gallery ${index + 1}">
                    <div class="gallery-overlay">
                        <span class="gallery-title">${img.title || 'Наше пространство'}</span>
                    </div>
                </div>
            `).join('');
        } else {
            // Default gallery
            grid.innerHTML = Array(6).fill(0).map((_, i) => `
                <div class="gallery-item" data-aos="fade-up">
                    <div style="width:100%;height:100%;background:linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.2));display:flex;align-items:center;justify-content:center;font-size:3rem;"></div>
                    <div class="gallery-overlay">
                        <span class="gallery-title">Фото ${i + 1}</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Booking System
function initBooking() {
    const form = document.getElementById('bookingForm');
    const serviceSelect = document.getElementById('serviceSelect');
    const masterSelect = document.getElementById('masterSelect');
    
    // Populate selects
    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="">Выберите услугу</option>' +
            siteData.services.map(s => `<option value="${s.id}">${s.title} - ${s.price}</option>`).join('');
    }
    
    if (masterSelect) {
        masterSelect.innerHTML = '<option value="">Выберите мастера</option>' +
            siteData.masters.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
    }
    
    // Form submission
    form?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const booking = Object.fromEntries(formData);
        booking.id = Date.now();
        booking.status = 'pending';
        
        siteData.bookings.push(booking);
        saveData();
        
        alert('Спасибо за запись! Мы свяжемся с вами для подтверждения.');
        form.reset();
    });
}

// Update Contacts
function updateContacts() {
    const elements = {
        contactPhone: document.getElementById('contactPhone'),
        contactAddress: document.getElementById('contactAddress'),
        contactHours: document.getElementById('contactHours')
    };
    
    if (elements.contactPhone) elements.contactPhone.textContent = siteData.settings.phone;
    if (elements.contactAddress) elements.contactAddress.textContent = siteData.settings.address;
    if (elements.contactHours) elements.contactHours.innerHTML = siteData.settings.hours;
}

// Initialize AOS
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
}

// Initialize Tilt
function initTilt() {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.service-card'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.3
        });
    }
}

// Global functions
window.openBooking = function() {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
};

window.playVideo = function() {
    alert('Видео презентация скоро будет добавлена!');
};


// SVG Icons Collection
const svgIcons = {
    hammer: `<svg class="icon-svg icon-animated" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 19v-2c0-.6.4-1 1-1h3l5-5-4-4 1-1 4 4 4-4h2l1 1v2l-4 4 4 4-1 1-4-4-5 5v3c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1z"/>
        <path d="M17.5 5.5L19 7l-7 7-1.5-1.5 7-7z" opacity="0.8"/>
    </svg>`,
    
    hands: `<svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6c0-1.1-.9-2-2-2s-2 .9-2 2c0 .3.1.6.2.9L12 12l-4.2-5.1c.1-.3.2-.6.2-.9 0-1.1-.9-2-2-2s-2 .9-2 2c0 .7.4 1.4 1 1.7V20c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7.7c.6-.3 1-1 1-1.7z"/>
        <circle cx="12" cy="16" r="2" opacity="0.6"/>
    </svg>`,
    
    dumbell: `<svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 7 5.57l1.43-1.43 1.43 1.43L8.43 7 7 5.57 5.57 7 4.14 5.57 2.71 7l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14L17 18.43l-1.43 1.43L14.14 18.43 15.57 17l1.43 1.43 1.43-1.43L20 18.43z"/>
    </svg>`,
    
    stones: `<svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12" cy="12" rx="8" ry="6" fill="currentColor" opacity="0.8"/>
        <ellipse cx="8" cy="10" rx="4" ry="3" fill="currentColor" opacity="0.6"/>
        <ellipse cx="16" cy="14" rx="3.5" ry="2.5" fill="currentColor" opacity="0.7"/>
        <path d="M6 12c0 1.1 1.3 2 3 2s3-.9 3-2-1.3-2-3-2-3 .9-3 2z" opacity="0.9"/>
    </svg>`,
    
    lotus: `<svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3c-1.5 2-3 5-3 8 0 1.7.7 3.2 1.8 4.2.5-2.7 1.2-4.2 1.2-4.2s.7 1.5 1.2 4.2C14.3 14.2 15 12.7 15 11c0-3-1.5-6-3-8z"/>
        <path d="M7 11c0-2.4.8-4.6 2-6.3C7.2 6 6 8.5 6 11c0 2.2 1.8 4 4 4-.5-.6-.8-1.3-1-2.2C7.8 12.3 7 11.7 7 11z" opacity="0.7"/>
        <path d="M17 11c0-2.5-1.2-5-3-6.3 1.2 1.7 2 3.9 2 6.3 0 .7-.8 1.3-2 1.8-.2.9-.5 1.6-1 2.2 2.2 0 4-1.8 4-4z" opacity="0.7"/>
        <path d="M12 20c2 0 3.5-1 3.5-1s-1 .5-3.5.5-3.5-.5-3.5-.5 1.5 1 3.5 1z"/>
    </svg>`,
    
    location: `<svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>`,
    
    phone: `<svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>`,
    
    clock: `<svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
    </svg>`,
    
    admin: `<svg class="icon-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        <path d="M12 12c1.65 0 3-1.35 3-3s-1.35-3-3-3-3 1.35-3 3 1.35 3 3 3zm0 2c-2 0-6 1-6 3v1h12v-1c0-2-4-3-6-3z" fill="white" opacity="0.9"/>
    </svg>`
};

// Update existing render functions to use SVG icons
const originalRenderServices = window.renderServices;
window.renderServices = function() {
    const grid = document.getElementById('servicesGrid');
    if (grid) {
        grid.innerHTML = siteData.services.map(service => {
            let icon = '';
            if (service.title.includes('Классический')) icon = svgIcons.hands;
            else if (service.title.includes('Спортивный')) icon = svgIcons.dumbell;
            else if (service.title.includes('камни')) icon = svgIcons.stones;
            else if (service.title.includes('Тайский')) icon = svgIcons.lotus;
            else icon = svgIcons.hands;
            
            return `
                <div class="service-card will-animate" data-aos="fade-up">
                    <div class="service-icon">${icon}</div>
                    <h3 class="service-title">${service.title}</h3>
                    <p class="service-desc">${service.desc}</p>
                    <div class="service-price">₪${service.price}</div>
                </div>
            `;
        }).join('');
    }
};

// Apply icons on load
document.addEventListener('DOMContentLoaded', function() {
    // Update logo
    const logoIcon = document.querySelector('.logo-icon');
    if (logoIcon) logoIcon.innerHTML = svgIcons.hammer;
    
    // Update contact icons
    const contactIcons = document.querySelectorAll('.contact-icon');
    contactIcons.forEach((icon, index) => {
        if (index === 0) icon.innerHTML = svgIcons.location;
        else if (index === 1) icon.innerHTML = svgIcons.phone;
        else if (index === 2) icon.innerHTML = svgIcons.clock;
    });
    
    // Update admin button
    const adminBtn = document.querySelector('.admin-btn');
    if (adminBtn) adminBtn.innerHTML = svgIcons.admin;
    
    // Re-render services with icons
    if (window.renderServices) window.renderServices();
});

// Performance optimization for animations
let ticking = false;
function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Animation updates here
    ticking = false;
}

// Throttle scroll events
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(requestTick, 100);
}, { passive: true });

// Lazy load images
document.querySelectorAll('img').forEach(img => {
    img.classList.add('lazy-load');
    img.addEventListener('load', () => img.classList.add('loaded'));
});

console.log(' BLACKSMITH Patch 1: SVG icons and visual enhancements applied!');


// Section Backgrounds Management
const sectionBackgrounds = {
    services: { image: null, caption: '' },
    masters: { image: null, caption: '' },
    gallery: { image: null, caption: '' },
    booking: { image: null, caption: '' },
    contact: { image: null, caption: '' }
};

// Load saved backgrounds
function loadSectionBackgrounds() {
    const saved = localStorage.getItem('sectionBackgrounds');
    if (saved) {
        Object.assign(sectionBackgrounds, JSON.parse(saved));
        
        // Apply to admin previews if in admin
        if (window.location.pathname.includes('/admin')) {
            Object.keys(sectionBackgrounds).forEach(section => {
                if (sectionBackgrounds[section].image) {
                    const preview = document.getElementById('preview-' + section);
                    if (preview) {
                        preview.innerHTML = `<img src="${sectionBackgrounds[section].image}" alt="${section}">`;
                    }
                    const caption = document.getElementById('caption-' + section);
                    if (caption) {
                        caption.value = sectionBackgrounds[section].caption || '';
                    }
                }
            });
        }
        
        // Apply to main site sections
        if (!window.location.pathname.includes('/admin')) {
            applySectionBackgrounds();
        }
    }
}

// Apply backgrounds to sections
function applySectionBackgrounds() {
    Object.keys(sectionBackgrounds).forEach(sectionName => {
        const section = document.getElementById(sectionName === 'services' ? 'services' : sectionName);
        if (section && sectionBackgrounds[sectionName].image) {
            // Remove existing background if any
            const existingBg = section.querySelector('.section-bg');
            if (existingBg) existingBg.remove();
            
            // Create new background
            const bgDiv = document.createElement('div');
            bgDiv.className = 'section-bg';
            bgDiv.innerHTML = `
                <div class="section-bg-image" style="background-image: url('${sectionBackgrounds[sectionName].image}')"></div>
                <div class="section-bg-overlay"></div>
                ${sectionBackgrounds[sectionName].caption ? `<div class="section-bg-caption">${sectionBackgrounds[sectionName].caption}</div>` : ''}
            `;
            section.insertBefore(bgDiv, section.firstChild);
        }
    });
}

// Admin functions
window.selectBgImage = function(section) {
    document.getElementById('bg-' + section).click();
};

window.handleBgUpload = function(section, input) {
    const file = input.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            sectionBackgrounds[section].image = e.target.result;
            const preview = document.getElementById('preview-' + section);
            preview.innerHTML = `<img src="${e.target.result}" alt="${section}">`;
        };
        reader.readAsDataURL(file);
    }
};

window.removeBg = function(section, event) {
    event.stopPropagation();
    sectionBackgrounds[section].image = null;
    sectionBackgrounds[section].caption = '';
    const preview = document.getElementById('preview-' + section);
    preview.innerHTML = '<div class="bg-preview-placeholder">Нажмите для загрузки</div>';
    const caption = document.getElementById('caption-' + section);
    caption.value = '';
};

window.saveSectionBackgrounds = function() {
    // Collect captions
    Object.keys(sectionBackgrounds).forEach(section => {
        const captionInput = document.getElementById('caption-' + section);
        if (captionInput) {
            sectionBackgrounds[section].caption = captionInput.value;
        }
    });
    
    // Save to localStorage
    localStorage.setItem('sectionBackgrounds', JSON.stringify(sectionBackgrounds));
    
    // Show success message
    const successMsg = document.getElementById('backgroundsSuccess');
    if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 3000);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    loadSectionBackgrounds();
});

console.log('Section backgrounds system loaded');


// Section Backgrounds Management
const sectionBackgrounds = {
    services: { image: null, caption: '' },
    masters: { image: null, caption: '' },
    gallery: { image: null, caption: '' },
    booking: { image: null, caption: '' },
    contact: { image: null, caption: '' }
};

// Load saved backgrounds
function loadSectionBackgrounds() {
    const saved = localStorage.getItem('sectionBackgrounds');
    if (saved) {
        Object.assign(sectionBackgrounds, JSON.parse(saved));
        
        // Apply to admin previews if in admin
        if (window.location.pathname.includes('/admin')) {
            Object.keys(sectionBackgrounds).forEach(section => {
                if (sectionBackgrounds[section].image) {
                    const preview = document.getElementById('preview-' + section);
                    if (preview) {
                        preview.innerHTML = `<img src="${sectionBackgrounds[section].image}" alt="${section}">`;
                    }
                    const caption = document.getElementById('caption-' + section);
                    if (caption) {
                        caption.value = sectionBackgrounds[section].caption || '';
                    }
                }
            });
        }
        
        // Apply to main site sections
        if (!window.location.pathname.includes('/admin')) {
            applySectionBackgrounds();
        }
    }
}

// Apply backgrounds to sections
function applySectionBackgrounds() {
    Object.keys(sectionBackgrounds).forEach(sectionName => {
        const section = document.getElementById(sectionName === 'services' ? 'services' : sectionName);
        if (section && sectionBackgrounds[sectionName].image) {
            // Remove existing background if any
            const existingBg = section.querySelector('.section-bg');
            if (existingBg) existingBg.remove();
            
            // Create new background
            const bgDiv = document.createElement('div');
            bgDiv.className = 'section-bg';
            bgDiv.innerHTML = `
                <div class="section-bg-image" style="background-image: url('${sectionBackgrounds[sectionName].image}')"></div>
                <div class="section-bg-overlay"></div>
                ${sectionBackgrounds[sectionName].caption ? `<div class="section-bg-caption">${sectionBackgrounds[sectionName].caption}</div>` : ''}
            `;
            section.insertBefore(bgDiv, section.firstChild);
        }
    });
}

// Admin functions
window.selectBgImage = function(section) {
    document.getElementById('bg-' + section).click();
};

window.handleBgUpload = function(section, input) {
    const file = input.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            sectionBackgrounds[section].image = e.target.result;
            const preview = document.getElementById('preview-' + section);
            preview.innerHTML = `<img src="${e.target.result}" alt="${section}">`;
        };
        reader.readAsDataURL(file);
    }
};

window.removeBg = function(section, event) {
    event.stopPropagation();
    sectionBackgrounds[section].image = null;
    sectionBackgrounds[section].caption = '';
    const preview = document.getElementById('preview-' + section);
    preview.innerHTML = '<div class="bg-preview-placeholder">Нажмите для загрузки</div>';
    const caption = document.getElementById('caption-' + section);
    caption.value = '';
};

window.saveSectionBackgrounds = function() {
    // Collect captions
    Object.keys(sectionBackgrounds).forEach(section => {
        const captionInput = document.getElementById('caption-' + section);
        if (captionInput) {
            sectionBackgrounds[section].caption = captionInput.value;
        }
    });
    
    // Save to localStorage
    localStorage.setItem('sectionBackgrounds', JSON.stringify(sectionBackgrounds));
    
    // Show success message
    const successMsg = document.getElementById('backgroundsSuccess');
    if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 3000);
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    loadSectionBackgrounds();
});

console.log('Section backgrounds system loaded');
