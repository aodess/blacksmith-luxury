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
