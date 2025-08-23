// BLACKSMITH Main App
document.addEventListener('DOMContentLoaded', function() {
    console.log('BLACKSMITH: Initializing...');
    
    // Hide loader
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }
    }, 1000);
    
    // Load data
    const siteData = {
        services: [
            {id: 1, icon: '', title: 'Классический массаж', desc: 'Расслабляющий массаж всего тела', price: '350'},
            {id: 2, icon: '', title: 'Спортивный массаж', desc: 'Глубокая проработка мышц', price: '450'},
            {id: 3, icon: '', title: 'Горячие камни', desc: 'Массаж с базальтовыми камнями', price: '500'},
            {id: 4, icon: '', title: 'Тайский массаж', desc: 'Традиционная тайская техника', price: '550'}
        ],
        masters: [
            {id: 1, name: 'Александр Петров', spec: 'Мастер спортивного массажа', experience: '15 лет опыта', rating: ''},
            {id: 2, name: 'Михаил Чен', spec: 'Специалист тайского массажа', experience: '12 лет опыта', rating: '⭐⭐⭐⭐⭐'},
            {id: 3, name: 'Давид Коваленко', spec: 'Классический и лечебный массаж', experience: '10 лет опыта', rating: '⭐⭐⭐⭐'}
        ],
        gallery: [],
        settings: {
            phone: '+972 50-123-4567',
            address: 'Rothschild Blvd 50, Tel Aviv',
            hours: 'Пн-Сб: 9:00-21:00\nВс: 10:00-20:00'
        }
    };
    
    // Try to load from localStorage
    try {
        const saved = localStorage.getItem('blacksmithData');
        if (saved) {
            Object.assign(siteData, JSON.parse(saved));
        }
    } catch(e) {
        console.log('Using default data');
    }
    
    // Render services
    const servicesGrid = document.getElementById('servicesGrid');
    if (servicesGrid) {
        servicesGrid.innerHTML = siteData.services.map(service => `
            <div class="service-card">
                <div class="service-icon">${service.icon}</div>
                <h3 class="service-title">${service.title}</h3>
                <p class="service-desc">${service.desc}</p>
                <div class="service-price">${service.price}</div>
            </div>
        `).join('');
    }
    
    // Render masters
    const mastersSlider = document.getElementById('mastersSlider');
    if (mastersSlider) {
        mastersSlider.innerHTML = siteData.masters.map(master => `
            <div class="swiper-slide">
                <div class="master-card">
                    <div class="master-photo">
                        ${master.photo ? 
                            `<img src="${master.photo}" alt="${master.name}">` :
                            `<div style="width:100%;height:100%;background:#D4AF37;display:flex;align-items:center;justify-content:center;font-size:3rem;"></div>`
                        }
                    </div>
                    <h3 class="master-name">${master.name}</h3>
                    <p class="master-spec">${master.spec}</p>
                    <p class="master-experience">${master.experience}</p>
                    <div class="master-rating">${master.rating}</div>
                </div>
            </div>
        `).join('');
        
        // Init Swiper
        if (typeof Swiper !== 'undefined') {
            new Swiper('.masters-slider', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: { delay: 3000 },
                pagination: { el: '.swiper-pagination', clickable: true },
                breakpoints: {
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }
            });
        }
    }
    
    // Render gallery
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        if (siteData.gallery && siteData.gallery.length > 0) {
            galleryGrid.innerHTML = siteData.gallery.map(img => `
                <div class="gallery-item">
                    <img src="${img.url}" alt="${img.title || 'Gallery'}">
                    <div class="gallery-overlay">
                        <span class="gallery-title">${img.title || 'Наше пространство'}</span>
                    </div>
                </div>
            `).join('');
        } else {
            galleryGrid.innerHTML = Array(6).fill(0).map(() => `
                <div class="gallery-item">
                    <div style="width:100%;height:100%;background:rgba(212,175,55,0.1);display:flex;align-items:center;justify-content:center;font-size:3rem;"></div>
                </div>
            `).join('');
        }
    }
    
    // Update contacts
    document.getElementById('contactPhone').textContent = siteData.settings.phone;
    document.getElementById('contactAddress').textContent = siteData.settings.address;
    document.getElementById('contactHours').innerHTML = siteData.settings.hours.replace(/\n/g, '<br>');
    
    // Booking form
    const form = document.getElementById('bookingForm');
    if (form) {
        // Fill selects
        const serviceSelect = document.getElementById('serviceSelect');
        serviceSelect.innerHTML = '<option value="">Выберите услугу</option>' +
            siteData.services.map(s => `<option value="${s.id}">${s.title} - ${s.price}</option>`).join('');
        
        const masterSelect = document.getElementById('masterSelect');
        masterSelect.innerHTML = '<option value="">Любой мастер</option>' +
            siteData.masters.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        
        // Handle submit
        form.onsubmit = function(e) {
            e.preventDefault();
            alert('Спасибо за запись! Мы свяжемся с вами для подтверждения.');
            form.reset();
        };
    }
    
    // Navbar scroll
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // AOS init
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1000, once: true });
    }
});

// Global functions
window.openBooking = function() {
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
};
