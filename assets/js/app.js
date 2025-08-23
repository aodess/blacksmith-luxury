// BLACKSMITH MAIN APP - Synchronized Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('BLACKSMITH: Initializing main site...');
    
    // Загружаем данные из единого хранилища
    let siteData = window.BlacksmithStorage.getData();
    let backgrounds = window.BlacksmithStorage.getBackgrounds();
    
    // Слушаем обновления данных
    window.BlacksmithStorage.onUpdate(function(newData) {
        console.log('Data updated, refreshing...');
        siteData = newData;
        renderAll();
    });
    
    window.BlacksmithStorage.onBackgroundsUpdate(function(newBackgrounds) {
        console.log('Backgrounds updated, refreshing...');
        backgrounds = newBackgrounds;
        applyBackgrounds();
    });
    
    // Инициализация
    hideLoader();
    initNavbar();
    initAnimations();
    renderAll();
    applyBackgrounds();
    
    // Скрываем загрузчик
    function hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }
    
    // Рендерим все компоненты
    function renderAll() {
        renderServices();
        renderMasters();
        renderGallery();
        initBooking();
        updateContacts();
    }
    
    // Навбар
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const navBurger = document.getElementById('navBurger');
        const navMenu = document.getElementById('navMenu');
        
        if (!navbar) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        if (navBurger && navMenu) {
            navBurger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
        
        // Smooth scroll для всех якорных ссылок
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
    
    // Анимации фона
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
                speedY: Math.random() * 1 - 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`;
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
    
    // Рендер услуг
    function renderServices() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;
        
        grid.innerHTML = siteData.services.map(service => `
            <div class="service-card" data-aos="fade-up">
                <div class="service-icon">${service.icon || ''}</div>
                <h3 class="service-title">${service.title}</h3>
                <p class="service-desc">${service.desc}</p>
                <div class="service-price">${service.price}</div>
            </div>
        `).join('');
        
        // Reinit tilt effect
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll('.service-card'), {
                max: 15,
                speed: 400,
                glare: true,
                'max-glare': 0.3
            });
        }
    }
    
    // Рендер мастеров
    function renderMasters() {
        const slider = document.getElementById('mastersSlider');
        if (!slider) return;
        
        slider.innerHTML = siteData.masters.map(master => `
            <div class="swiper-slide">
                <div class="master-card">
                    <div class="master-photo">
                        ${master.photo ? 
                            `<img src="${master.photo}" alt="${master.name}">` :
                            `<div style="width:100%;height:100%;background:linear-gradient(135deg,#D4AF37,#B8860B);
                                        display:flex;align-items:center;justify-content:center;font-size:3rem;"></div>`
                        }
                    </div>
                    <h3 class="master-name">${master.name}</h3>
                    <p class="master-spec">${master.spec}</p>
                    <p class="master-experience">${master.experience}</p>
                    <div class="master-rating">${master.rating || ''}</div>
                </div>
            </div>
        `).join('');
        
        // Переинициализируем Swiper
        if (typeof Swiper !== 'undefined') {
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
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                breakpoints: {
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 }
                }
            });
        }
    }
    
    // Рендер галереи
    function renderGallery() {
        const grid = document.getElementById('galleryGrid');
        if (!grid) return;
        
        if (siteData.gallery && siteData.gallery.length > 0) {
            grid.innerHTML = siteData.gallery.map((img, index) => `
                <div class="gallery-item" data-aos="fade-up" data-aos-delay="${index * 50}">
                    <img src="${img.url}" alt="${img.title || 'Gallery ' + (index + 1)}">
                    <div class="gallery-overlay">
                        <span class="gallery-title">${img.title || 'Наше пространство'}</span>
                    </div>
                </div>
            `).join('');
        } else {
            // Заглушки если нет фото
            grid.innerHTML = Array(6).fill(0).map((_, i) => `
                <div class="gallery-item" data-aos="fade-up" data-aos-delay="${i * 50}">
                    <div style="width:100%;height:100%;background:linear-gradient(135deg,rgba(212,175,55,0.1),rgba(212,175,55,0.2));
                                display:flex;align-items:center;justify-content:center;font-size:3rem;color:rgba(212,175,55,0.3);">
                        
                    </div>
                    <div class="gallery-overlay">
                        <span class="gallery-title">Добавьте фото через админку</span>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Система записи
    function initBooking() {
        const form = document.getElementById('bookingForm');
        const serviceSelect = document.getElementById('serviceSelect');
        const masterSelect = document.getElementById('masterSelect');
        
        if (serviceSelect) {
            serviceSelect.innerHTML = '<option value="">Выберите услугу</option>' +
                siteData.services.map(s => `<option value="${s.id}">${s.title} - ${s.price}</option>`).join('');
        }
        
        if (masterSelect) {
            masterSelect.innerHTML = '<option value="">Любой мастер</option>' +
                siteData.masters.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        }
        
        if (form) {
            form.onsubmit = function(e) {
                e.preventDefault();
                
                const formData = {
                    name: form.name.value,
                    phone: form.phone.value,
                    email: form.email.value,
                    service: form.service.value,
                    master: form.master.value,
                    datetime: form.datetime.value || new Date().toISOString()
                };
                
                window.BlacksmithStorage.addBooking(formData);
                
                // Показываем уведомление
                if (window.Toast) {
                    window.Toast.success('Спасибо за запись! Мы свяжемся с вами для подтверждения.');
                } else {
                    alert('Спасибо за запись! Мы свяжемся с вами для подтверждения.');
                }
                
                form.reset();
            };
        }
    }
    
    // Обновление контактов
    function updateContacts() {
        const elements = {
            contactPhone: document.getElementById('contactPhone'),
            contactAddress: document.getElementById('contactAddress'),
            contactHours: document.getElementById('contactHours')
        };
        
        if (elements.contactPhone) elements.contactPhone.textContent = siteData.settings.phone;
        if (elements.contactAddress) elements.contactAddress.textContent = siteData.settings.address;
        if (elements.contactHours) elements.contactHours.innerHTML = siteData.settings.hours.replace(/\n/g, '<br>');
        
        // Обновляем телефон в навбаре
        const navPhone = document.querySelector('.nav-phone');
        if (navPhone) {
            const phoneNumber = siteData.settings.phone.replace(/[^0-9+]/g, '');
            navPhone.href = `tel:${phoneNumber}`;
            navPhone.textContent = siteData.settings.phone;
        }
        
        // Обновляем WhatsApp
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        if (whatsappBtn) {
            const waNumber = siteData.settings.phone.replace(/[^0-9]/g, '');
            whatsappBtn.href = `https://wa.me/${waNumber}`;
        }
    }
    
    // Применение фоновых изображений
    function applyBackgrounds() {
        // Hero слайдшоу
        if (backgrounds.hero && backgrounds.hero.images && backgrounds.hero.images.length > 0) {
            let currentSlide = 0;
            const heroSection = document.getElementById('hero');
            
            if (heroSection) {
                // Создаем контейнер для слайдов
                let slidesContainer = heroSection.querySelector('.hero-slides');
                if (!slidesContainer) {
                    slidesContainer = document.createElement('div');
                    slidesContainer.className = 'hero-slides';
                    slidesContainer.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: -1;
                    `;
                    heroSection.insertBefore(slidesContainer, heroSection.firstChild);
                }
                
                // Добавляем слайды
                slidesContainer.innerHTML = backgrounds.hero.images.map((img, i) => `
                    <div class="hero-slide" style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: url('${img}') center/cover;
                        opacity: ${i === 0 ? 0.3 : 0};
                        transition: opacity 2s ease;
                    "></div>
                `).join('');
                
                // Запускаем слайдшоу
                const slides = slidesContainer.querySelectorAll('.hero-slide');
                if (slides.length > 1) {
                    setInterval(() => {
                        slides[currentSlide].style.opacity = '0';
                        currentSlide = (currentSlide + 1) % slides.length;
                        slides[currentSlide].style.opacity = '0.3';
                    }, backgrounds.hero.duration || 5000);
                }
            }
        }
        
        // Остальные секции
        ['services', 'masters', 'gallery', 'booking', 'contact'].forEach(section => {
            if (backgrounds[section] && backgrounds[section].image) {
                const sectionEl = document.getElementById(section);
                if (sectionEl) {
                    // Создаем контейнер для фона
                    let bgContainer = sectionEl.querySelector('.section-bg');
                    if (!bgContainer) {
                        bgContainer = document.createElement('div');
                        bgContainer.className = 'section-bg';
                        bgContainer.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            z-index: -1;
                            opacity: 0.15;
                        `;
                        sectionEl.style.position = 'relative';
                        sectionEl.insertBefore(bgContainer, sectionEl.firstChild);
                    }
                    
                    bgContainer.innerHTML = `
                        <div class="section-bg-image" style="
                            position: absolute;
                            width: 110%;
                            height: 110%;
                            top: -5%;
                            left: -5%;
                            background: url('${backgrounds[section].image}') center/cover;
                            animation: bgFloat 20s ease-in-out infinite;
                        "></div>
                        <div class="section-bg-overlay" style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(135deg, 
                                rgba(10, 10, 10, 0.8) 0%, 
                                rgba(10, 10, 10, 0.9) 50%, 
                                rgba(10, 10, 10, 0.8) 100%);
                        "></div>
                        ${backgrounds[section].caption ? `
                            <div class="section-bg-caption" style="
                                position: absolute;
                                bottom: 20px;
                                right: 20px;
                                color: rgba(212, 175, 55, 0.5);
                                font-size: 0.8rem;
                                font-style: italic;
                                z-index: 1;
                            ">${backgrounds[section].caption}</div>
                        ` : ''}
                    `;
                }
            }
        });
    }
    
    // Глобальные функции
    window.openBooking = function() {
        const booking = document.getElementById('booking');
        if (booking) {
            booking.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    window.playVideo = function() {
        if (window.Toast) {
            window.Toast.info('Видео презентация скоро будет добавлена!');
        } else {
            alert('Видео презентация скоро будет добавлена!');
        }
    };
    
    // Инициализация внешних библиотек
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
    
    console.log('BLACKSMITH: Main site initialized successfully!');
});
