// BLACKSMITH ADMIN PANEL - Enhanced Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing admin panel...');
    
    // Загружаем данные
    let adminData = BlacksmithStorage.getData();
    let backgrounds = BlacksmithStorage.getBackgrounds();
    
    // Инициализация
    updateUI();
    initDragAndDrop();
    initBackgroundsManager();
    
    // Обновляем UI
    function updateUI() {
        updateStats();
        loadServices();
        loadMasters();
        loadGallery();
        loadBookings();
        loadSettings();
        loadBackgrounds();
    }
    
    // Статистика
    function updateStats() {
        document.getElementById('statBookings').textContent = adminData.bookings.length;
        document.getElementById('statServices').textContent = adminData.services.length;
        document.getElementById('statMasters').textContent = adminData.masters.length;
        document.getElementById('statPhotos').textContent = adminData.gallery.length;
    }
    
    // Переключение вкладок
    window.switchTab = function(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        event.target.classList.add('active');
        document.getElementById('tab-' + tabName).classList.add('active');
    };
    
    // УСЛУГИ
    function loadServices() {
        const container = document.getElementById('servicesList');
        container.innerHTML = adminData.services.map(service => `
            <div class="service-item" data-id="${service.id}">
                <input type="text" class="service-icon-input" value="${service.icon || ''}" 
                       placeholder="Иконка (эмодзи)" title="Введите эмодзи для иконки услуги">
                <div class="service-details">
                    <input type="text" value="${service.title}" placeholder="Название услуги" 
                           title="Введите название услуги">
                    <input type="text" value="${service.desc}" placeholder="Описание услуги" 
                           title="Краткое описание услуги">
                </div>
                <input type="text" value="${service.price}" placeholder="Цена ()" 
                       title="Цена услуги в шекелях" style="width: 100px;">
                <button onclick="removeService(${service.id})" class="btn-remove" 
                        style="background: #8B0000; color: white; border: none; padding: 8px 15px; 
                               border-radius: 5px; cursor: pointer;"></button>
            </div>
        `).join('');
    }
    
    window.addService = function() {
        const newService = {
            id: Date.now(),
            icon: '✨',
            title: 'Новая услуга',
            desc: 'Описание услуги',
            price: '₪400'
        };
        adminData.services.push(newService);
        loadServices();
        Toast.info('Добавлена новая услуга. Не забудьте сохранить!');
    };
    
    window.removeService = function(id) {
        if (confirm('Удалить эту услугу?')) {
            adminData.services = adminData.services.filter(s => s.id !== id);
            loadServices();
            Toast.warning('Услуга удалена');
        }
    };
    
    window.saveServices = function() {
        const items = document.querySelectorAll('.service-item');
        adminData.services = Array.from(items).map(item => {
            const inputs = item.querySelectorAll('input');
            return {
                id: parseInt(item.dataset.id),
                icon: inputs[0].value,
                title: inputs[1].value,
                desc: inputs[2].value,
                price: inputs[3].value
            };
        });
        
        if (BlacksmithStorage.saveData(adminData)) {
            Toast.success(' Услуги успешно сохранены!');
        } else {
            Toast.error(' Ошибка сохранения');
        }
    };
    
    // МАСТЕРА
    function loadMasters() {
        const container = document.getElementById('mastersGrid');
        container.innerHTML = adminData.masters.map(master => `
            <div class="master-card-edit" data-id="${master.id}">
                <div class="master-photo-upload" onclick="uploadMasterPhoto(${master.id})" 
                     title="Нажмите для загрузки фото">
                    ${master.photo ? 
                        `<img src="${master.photo}" alt="${master.name}">` :
                        `<div class="master-photo-placeholder"></div>`
                    }
                    <div class="photo-overlay"> Изменить фото</div>
                </div>
                <input type="file" id="masterPhoto${master.id}" accept="image/*" 
                       style="display: none;" onchange="handleMasterPhoto(${master.id})">
                <div class="form-group">
                    <input type="text" value="${master.name}" placeholder="Имя мастера" 
                           title="Полное имя мастера">
                </div>
                <div class="form-group">
                    <input type="text" value="${master.spec}" placeholder="Специализация" 
                           title="Основная специализация">
                </div>
                <div class="form-group">
                    <input type="text" value="${master.experience}" placeholder="Опыт работы" 
                           title="Например: 10 лет опыта">
                </div>
                <button onclick="removeMaster(${master.id})" class="btn-remove" 
                        style="background: #8B0000; color: white; border: none; 
                               padding: 8px 15px; border-radius: 5px; cursor: pointer; 
                               width: 100%; margin-top: 10px;">Удалить мастера</button>
            </div>
        `).join('');
    }
    
    window.uploadMasterPhoto = function(masterId) {
        document.getElementById('masterPhoto' + masterId).click();
    };
    
    window.handleMasterPhoto = function(masterId) {
        const input = document.getElementById('masterPhoto' + masterId);
        const file = input.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                Toast.error('Файл слишком большой. Максимум 5 МБ');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const master = adminData.masters.find(m => m.id === masterId);
                if (master) {
                    master.photo = e.target.result;
                    loadMasters();
                    Toast.success('Фото мастера загружено');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    window.removeMaster = function(id) {
        if (confirm('Удалить этого мастера?')) {
            adminData.masters = adminData.masters.filter(m => m.id !== id);
            loadMasters();
            Toast.warning('Мастер удален');
        }
    };
    
    window.saveMasters = function() {
        const cards = document.querySelectorAll('.master-card-edit');
        cards.forEach(card => {
            const id = parseInt(card.dataset.id);
            const inputs = card.querySelectorAll('input[type="text"]');
            const master = adminData.masters.find(m => m.id === id);
            if (master) {
                master.name = inputs[0].value;
                master.spec = inputs[1].value;
                master.experience = inputs[2].value;
            }
        });
        
        if (BlacksmithStorage.saveData(adminData)) {
            Toast.success(' Мастера успешно сохранены!');
        } else {
            Toast.error(' Ошибка сохранения');
        }
    };
    
    // ГАЛЕРЕЯ с Drag & Drop
    function initDragAndDrop() {
        const galleryUpload = document.getElementById('galleryUpload');
        const galleryInput = document.getElementById('galleryInput');
        
        if (!galleryUpload || !galleryInput) return;
        
        // Обновляем индикатор
        galleryUpload.innerHTML = `
            <input type="file" id="galleryInput" accept="image/*" multiple style="display: none;">
            <div class="upload-icon"></div>
            <div style="font-size: 1.2rem; margin: 10px 0;">Перетащите фото сюда</div>
            <div style="color: rgba(255,255,255,0.5); font-size: 0.9rem;">
                или нажмите для выбора<br>
                Можно загрузить несколько фото сразу (макс. 5 МБ каждое)
            </div>
        `;
        
        galleryUpload.addEventListener('click', () => galleryInput.click());
        
        galleryUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            galleryUpload.classList.add('dragover');
            galleryUpload.style.borderColor = '#D4AF37';
            galleryUpload.style.background = 'rgba(212, 175, 55, 0.1)';
        });
        
        galleryUpload.addEventListener('dragleave', () => {
            galleryUpload.classList.remove('dragover');
            galleryUpload.style.borderColor = '';
            galleryUpload.style.background = '';
        });
        
        galleryUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            galleryUpload.classList.remove('dragover');
            galleryUpload.style.borderColor = '';
            galleryUpload.style.background = '';
            handleGalleryFiles(e.dataTransfer.files);
        });
        
        galleryInput.addEventListener('change', (e) => {
            handleGalleryFiles(e.target.files);
        });
    }
    
    function handleGalleryFiles(files) {
        let loaded = 0;
        const total = files.length;
        
        Toast.info(`Загружаю ${total} фото...`);
        
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                Toast.error(`${file.name} - не изображение`);
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                Toast.error(`${file.name} - слишком большой (макс. 5 МБ)`);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                adminData.gallery.push({
                    id: Date.now() + Math.random(),
                    url: e.target.result,
                    title: file.name
                });
                loaded++;
                
                if (loaded === total) {
                    loadGallery();
                    Toast.success(` Загружено ${loaded} фото`);
                }
            };
            reader.readAsDataURL(file);
        });
    }
    
    function loadGallery() {
        const preview = document.getElementById('galleryPreview');
        preview.innerHTML = adminData.gallery.map((img, index) => `
            <div class="preview-item" style="position: relative;">
                <img src="${img.url}" alt="${img.title}" style="width: 100%; height: 100%; object-fit: cover;">
                <button class="remove-btn" onclick="removeGalleryImage(${index})" 
                        style="position: absolute; top: 5px; right: 5px; width: 30px; height: 30px; 
                               background: rgba(255,0,0,0.8); color: white; border: none; 
                               border-radius: 50%; cursor: pointer; display: none;"></button>
            </div>
        `).join('');
        
        // Показываем кнопку удаления при наведении
        preview.querySelectorAll('.preview-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.querySelector('.remove-btn').style.display = 'flex';
            });
            item.addEventListener('mouseleave', () => {
                item.querySelector('.remove-btn').style.display = 'none';
            });
        });
    }
    
    window.removeGalleryImage = function(index) {
        adminData.gallery.splice(index, 1);
        loadGallery();
        Toast.info('Фото удалено из галереи');
    };
    
    window.saveGallery = function() {
        if (BlacksmithStorage.updateGallery(adminData.gallery)) {
            Toast.success(' Галерея успешно сохранена!');
        } else {
            Toast.error(' Ошибка сохранения галереи');
        }
    };
    
    window.clearGallery = function() {
        if (confirm('Удалить все фото из галереи?')) {
            adminData.gallery = [];
            loadGallery();
            Toast.warning('Галерея очищена');
        }
    };
    
    // ФОНЫ СЕКЦИЙ
    function initBackgroundsManager() {
        // Функции для Hero слайдшоу
        window.addHeroImage = function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (!backgrounds.hero.images) backgrounds.hero.images = [];
                        backgrounds.hero.images.push(e.target.result);
                        loadBackgrounds();
                        Toast.success('Фото добавлено в Hero слайдшоу');
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };
        
        window.removeHeroImage = function(index) {
            backgrounds.hero.images.splice(index, 1);
            loadBackgrounds();
            Toast.info('Фото удалено из слайдшоу');
        };
    }
    
    function loadBackgrounds() {
        // Hero слайдшоу
        const heroContainer = document.getElementById('hero-images');
        if (heroContainer && backgrounds.hero) {
            heroContainer.innerHTML = (backgrounds.hero.images || []).map((img, i) => `
                <div style="position: relative; width: 100px; height: 60px; display: inline-block; margin: 5px;">
                    <img src="${img}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 5px;">
                    <button onclick="removeHeroImage(${i})" 
                            style="position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; 
                                   background: red; color: white; border: none; border-radius: 50%; 
                                   cursor: pointer; font-size: 12px;"></button>
                </div>
            `).join('');
        }
        
        // Остальные секции
        ['services', 'masters', 'gallery', 'booking', 'contact'].forEach(section => {
            const preview = document.getElementById('preview-' + section);
            if (preview && backgrounds[section] && backgrounds[section].image) {
                preview.innerHTML = `<img src="${backgrounds[section].image}" style="width:100%;height:100%;object-fit:cover;">`;
            }
        });
    }
    
    window.uploadBgImage = function(section, input) {
        const file = input.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (!backgrounds[section]) backgrounds[section] = {};
                backgrounds[section].image = e.target.result;
                backgrounds[section].caption = document.getElementById('caption-' + section)?.value || '';
                loadBackgrounds();
                Toast.success(`Фон для секции "${section}" загружен`);
            };
            reader.readAsDataURL(file);
        }
    };
    
    window.saveAllBackgrounds = function() {
        // Сохраняем все подписи
        ['services', 'masters', 'gallery', 'booking', 'contact'].forEach(section => {
            const caption = document.getElementById('caption-' + section);
            if (caption && backgrounds[section]) {
                backgrounds[section].caption = caption.value;
            }
        });
        
        if (BlacksmithStorage.saveBackgrounds(backgrounds)) {
            Toast.success(' Все фоны сохранены!');
        } else {
            Toast.error(' Ошибка сохранения фонов');
        }
    };
    
    window.clearAllBackgrounds = function() {
        if (confirm('Удалить все фоновые изображения?')) {
            backgrounds = BlacksmithStorage.getBackgrounds();
            Object.keys(backgrounds).forEach(key => {
                if (key === 'hero') {
                    backgrounds[key].images = [];
                } else {
                    backgrounds[key] = { image: null, caption: '' };
                }
            });
            BlacksmithStorage.saveBackgrounds(backgrounds);
            loadBackgrounds();
            Toast.warning('Все фоны удалены');
            window.location.reload();
        }
    };
    
    // ЗАПИСИ
    function loadBookings() {
        const table = document.getElementById('bookingsTable');
        if (adminData.bookings.length > 0) {
            table.innerHTML = adminData.bookings.map(booking => `
                <tr>
                    <td>${new Date(booking.date).toLocaleDateString('ru-RU')}</td>
                    <td>${booking.name}</td>
                    <td>${booking.phone}</td>
                    <td>${getServiceName(booking.service)}</td>
                    <td>${getMasterName(booking.master)}</td>
                    <td><span style="color: #4CAF50;"> Новая</span></td>
                </tr>
            `).join('');
        } else {
            table.innerHTML = '<tr><td colspan="6" style="text-align: center; color: rgba(255,255,255,0.5);">Пока нет записей</td></tr>';
        }
    }
    
    function getServiceName(id) {
        const service = adminData.services.find(s => s.id == id);
        return service ? service.title : 'Не выбрано';
    }
    
    function getMasterName(id) {
        const master = adminData.masters.find(m => m.id == id);
        return master ? master.name : 'Любой мастер';
    }
    
    // НАСТРОЙКИ
    function loadSettings() {
        document.getElementById('settingsPhone').value = adminData.settings.phone || '';
        document.getElementById('settingsEmail').value = adminData.settings.email || '';
        document.getElementById('settingsAddress').value = adminData.settings.address || '';
        document.getElementById('settingsHours').value = adminData.settings.hours || '';
    }
    
    window.saveSettings = function() {
        adminData.settings = {
            phone: document.getElementById('settingsPhone').value,
            email: document.getElementById('settingsEmail').value,
            address: document.getElementById('settingsAddress').value,
            hours: document.getElementById('settingsHours').value
        };
        
        if (BlacksmithStorage.updateSettings(adminData.settings)) {
            Toast.success(' Настройки сохранены!');
        } else {
            Toast.error(' Ошибка сохранения настроек');
        }
    };
});
