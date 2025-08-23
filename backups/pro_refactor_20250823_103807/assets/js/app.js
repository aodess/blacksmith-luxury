// BLACKSMITH Main Application
const siteData = {
    services: [],
    masters: [],
    gallery: [],
    backgrounds: {},
    bookings: [],
    settings: {},
    translations: {
        en: {
            services: 'Services',
            masters: 'Masters',
            gallery: 'Gallery',
            booking: 'Booking',
            contact: 'Contact',
            bookNow: 'Book Now',
            ourServices: 'Our Services',
            ourMasters: 'Our Masters',
            ourGallery: 'Our Gallery',
            onlineBooking: 'Online Booking',
            contactUs: 'Contact Us'
        },
        ru: {
            services: 'Услуги',
            masters: 'Мастера',
            gallery: 'Галерея',
            booking: 'Запись',
            contact: 'Контакты',
            bookNow: 'Записаться',
            ourServices: 'Наши Услуги',
            ourMasters: 'Наши Мастера',
            ourGallery: 'Наша Галерея',
            onlineBooking: 'Онлайн Запись',
            contactUs: 'Контакты'
        },
        he: {
            services: 'שירותים',
            masters: 'מטפלים',
            gallery: 'גלריה',
            booking: 'הזמנה',
            contact: 'צור קשר',
            bookNow: 'להזמין',
            ourServices: 'השירותים שלנו',
            ourMasters: 'המטפלים שלנו',
            ourGallery: 'הגלריה שלנו',
            onlineBooking: 'הזמנה אונליין',
            contactUs: 'צור קשר'
        }
    },
    currentLang: 'en'
};

// Load data
function loadData() {
    const saved = localStorage.getItem('blacksmithData');
    if (saved) {
        Object.assign(siteData, JSON.parse(saved));
    } else {
        // Set defaults
        siteData.services = [
            {id: 1, title: 'Classic Massage', desc: 'Full body relaxation massage', price: '350'},
            {id: 2, title: 'Sports Massage', desc: 'Deep tissue therapy', price: '450'},
            {id: 3, title: 'Hot Stones', desc: 'Heated stone therapy', price: '500'},
            {id: 4, title: 'Thai Massage', desc: 'Traditional Thai technique', price: '550'}
        ];
        siteData.masters = [
            {id: 1, name: 'Alexander Petrov', spec: 'Sports massage', experience: '15 years'},
            {id: 2, name: 'Michael Chen', spec: 'Thai massage', experience: '12 years'},
            {id: 3, name: 'David Kovalenko', spec: 'Classic massage', experience: '10 years'}
        ];
        siteData.settings = {
            phone: '+972 50-123-4567',
            email: 'info@blacksmith-massage.com',
            address: 'Rothschild Blvd 50, Tel Aviv',
            hours: 'Mon-Sat: 9:00-21:00<br>Sun: 10:00-20:00',
            facebook: 'https://facebook.com/blacksmith',
            instagram: 'https://instagram.com/blacksmith',
            whatsapp: '972501234567'
        };
    }
    
    // Load backgrounds
    const bgSaved = localStorage.getItem('sectionBackgrounds');
    if (bgSaved) {
        siteData.backgrounds = JSON.parse(bgSaved);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    hideLoader();
    initNavbar();
    initAnimations();
    renderServices();
    renderMasters();
    renderGallery();
    renderBackgrounds();
    initBooking();
    updateContacts();
    addSocialButtons();
    
    // Initialize libraries
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true, offset: 100 });
    }
    
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.service-card'), {
            max: 15, speed: 400, glare: true, 'max-glare': 0.3
        });
    }
});

// Hide loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

// Navbar
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Canvas animation
function initAnimations() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const animatedBg = document.getElementById('animatedBg');
    
    if (!animatedBg || !ctx) return;
    
    animatedBg.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    for (let i = 0; i < 30; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5
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
}

// Render services
function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    
    grid.innerHTML = siteData.services.map(service => `
        <div class="service-card" data-aos="fade-up">
            <h3 class="service-title">${service.title}</h3>
            <p class="service-desc">${service.desc}</p>
            <div class="service-price">${service.price}</div>
        </div>
    `).join('');
}

// Render masters
function renderMasters() {
    const slider = document.getElementById('mastersSlider');
    if (!slider) return;
    
    slider.innerHTML = siteData.masters.map(master => `
        <div class="swiper-slide">
            <div class="master-card">
                <div class="master-photo">
                    <div style="width:100%;height:100%;background:linear-gradient(135deg,#D4AF37,#B8860B);"></div>
                </div>
                <h3 class="master-name">${master.name}</h3>
                <p class="master-spec">${master.spec}</p>
                <p class="master-experience">${master.experience}</p>
            </div>
        </div>
    `).join('');
    
    if (typeof Swiper !== 'undefined') {
        new Swiper('.masters-slider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: { delay: 3000, disableOnInteraction: false },
            pagination: { el: '.swiper-pagination', clickable: true },
            breakpoints: {
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
            }
        });
    }
}

// Render gallery
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    if (siteData.gallery && siteData.gallery.length > 0) {
        grid.innerHTML = siteData.gallery.map((img, index) => `
            <div class="gallery-item" data-aos="fade-up">
                <img src="${img.url}" alt="${img.title || 'Gallery ' + (index + 1)}">
                <div class="gallery-overlay">
                    <span class="gallery-title">${img.title || 'Our Space'}</span>
                </div>
            </div>
        `).join('');
    } else {
        // Default placeholders
        grid.innerHTML = Array(6).fill(0).map((_, i) => `
            <div class="gallery-item" data-aos="fade-up">
                <div style="width:100%;height:100%;background:linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.2));display:flex;align-items:center;justify-content:center;color:rgba(212,175,55,0.5);">Photo ${i + 1}</div>
            </div>
        `).join('');
    }
}

// Render backgrounds
function renderBackgrounds() {
    if (!siteData.backgrounds) return;
    
    ['services', 'masters', 'gallery', 'booking', 'contact'].forEach(section => {
        const sectionEl = document.getElementById(section);
        if (sectionEl && siteData.backgrounds[section] && siteData.backgrounds[section].image) {
            const bgDiv = document.createElement('div');
            bgDiv.className = 'section-bg';
            bgDiv.innerHTML = `
                <div class="section-bg-image" style="background-image: url('${siteData.backgrounds[section].image}')"></div>
                <div class="section-bg-overlay"></div>
                ${siteData.backgrounds[section].caption ? `<div class="section-bg-caption">${siteData.backgrounds[section].caption}</div>` : ''}
            `;
            sectionEl.insertBefore(bgDiv, sectionEl.firstChild);
        }
    });
}

// Booking
function initBooking() {
    const form = document.getElementById('bookingForm');
    const serviceSelect = document.getElementById('serviceSelect');
    const masterSelect = document.getElementById('masterSelect');
    
    if (serviceSelect) {
        serviceSelect.innerHTML = '<option value="">Select service</option>' +
            siteData.services.map(s => `<option value="${s.id}">${s.title} - ${s.price}</option>`).join('');
    }
    
    if (masterSelect) {
        masterSelect.innerHTML = '<option value="">Select master</option>' +
            siteData.masters.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
    }
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for booking! We will contact you soon.');
            form.reset();
        });
    }
}

// Update contacts
function updateContacts() {
    if (!siteData.settings) return;
    
    const phone = document.getElementById('contactPhone');
    const address = document.getElementById('contactAddress');
    const hours = document.getElementById('contactHours');
    
    if (phone) phone.textContent = siteData.settings.phone;
    if (address) address.textContent = siteData.settings.address;
    if (hours) hours.innerHTML = siteData.settings.hours;
}

// Add social buttons
function addSocialButtons() {
    const hero = document.querySelector('.hero-content');
    if (!hero || !siteData.settings) return;
    
    const socialDiv = document.createElement('div');
    socialDiv.className = 'social-buttons';
    socialDiv.style.cssText = 'margin-top: 30px; display: flex; gap: 15px; justify-content: center;';
    
    if (siteData.settings.facebook) {
        socialDiv.innerHTML += `<a href="${siteData.settings.facebook}" target="_blank" style="width:40px;height:40px;background:#3b5998;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;text-decoration:none;">f</a>`;
    }
    
    if (siteData.settings.instagram) {
        socialDiv.innerHTML += `<a href="${siteData.settings.instagram}" target="_blank" style="width:40px;height:40px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;text-decoration:none;">ig</a>`;
    }
    
    if (siteData.settings.whatsapp) {
        socialDiv.innerHTML += `<a href="https://wa.me/${siteData.settings.whatsapp}" target="_blank" style="width:40px;height:40px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;text-decoration:none;">wa</a>`;
    }
    
    hero.appendChild(socialDiv);
}

// Global functions
window.openBooking = function() {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
};

window.playVideo = function() {
    alert('Video coming soon!');
};

// Language switcher
window.setLanguage = function(lang) {
    siteData.currentLang = lang;
    // Update UI texts based on language
    const t = siteData.translations[lang];
    // Update navigation
    document.querySelectorAll('.nav-link').forEach((link, i) => {
        const keys = ['services', 'masters', 'gallery', 'booking', 'contact'];
        link.textContent = t[keys[i]];
    });
};
