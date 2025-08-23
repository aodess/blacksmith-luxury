// BLACKSMITH Admin Panel Script
console.log('Admin panel initializing...');

// Глобальные переменные
let adminData = {
    services: [],
    masters: [],
    gallery: [],
    bookings: [],
    settings: {
        phone: '+972 50-123-4567',
        email: 'info@blacksmith-massage.com',
        address: 'Rothschild Blvd 50, Tel Aviv',
        addressRu: 'Ротшильд 50, Тель-Авив',
        addressHe: 'רוטשילד 50, תל אביב',
        hours: 'Пн-Сб: 9:00-21:00\nВс: 10:00-20:00'
    }
};

// Загрузка данных при старте
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading admin data...');
    loadData();
    updateUI();
    setupEventHandlers();
});

// Загрузка данных из localStorage
function loadData() {
    try {
        const saved = localStorage.getItem('blacksmithData');
        if (saved) {
            const parsed = JSON.parse(saved);
            adminData = parsed;
            console.log('Data loaded:', adminData);
        } else {
            // Устанавливаем данные по умолчанию
            adminData = {
                services: [
                    {id: 1, icon: '', title: 'Классический массаж', desc: 'Расслабляющий массаж всего тела', price: '350'},
                    {id: 2, icon: '', title: 'Спортивный массаж', desc: 'Глубокая проработка мышц', price: '450'},
                    {id: 3, icon: '', title: 'Горячие камни', desc: 'Массаж с базальтовыми камнями', price: '₪500'},
                    {id: 4, icon: '🧘', title: 'Тайский массаж', desc: 'Традиционная тайская техника', price: '550'}
                ],
                masters: [
                    {id: 1, name: 'Александр Петров', spec: 'Мастер спортивного массажа', experience: '15 лет опыта', rating: '', photo: null},
                    {id: 2, name: 'Михаил Чен', spec: 'Специалист тайского массажа', experience: '12 лет опыта', rating: '⭐⭐⭐⭐⭐', photo: null},
                    {id: 3, name: 'Давид Коваленко', spec: 'Классический и лечебный массаж', experience: '10 лет опыта', rating: '⭐⭐⭐⭐', photo: null}
                ],
                gallery: [],
                bookings: [],
                settings: {
                    phone: '+972 50-123-4567',
                    email: 'info@blacksmith-massage.com',
                    address: 'Rothschild Blvd 50, Tel Aviv',
                    addressRu: 'Ротшильд 50, Тель-Авив',
                    addressHe: 'רוטשילד 50, תל אביב',
                    hours: 'Пн-Сб: 9:00-21:00\nВс: 10:00-20:00'
                }
            };
            saveData();
        }
    } catch (e) {
        console.error('Error loading data:', e);
    }
}

// Сохранение данных
function saveData() {
    try {
        localStorage.setItem('blacksmithData', JSON.stringify(adminData));
        console.log('Data saved successfully');
        return true;
    } catch (e) {
        console.error('Error saving data:', e);
        return false;
    }
}

// Обновление UI
function updateUI() {
    updateStats();
    loadServices();
    loadMasters();
    loadGallery();
    loadBookings();
    loadSettings();
}

// Обновление статистики
function updateStats() {
    const statElements = {
        statBookings: adminData.bookings.length,
        statServices: adminData.services.length,
        statMasters: adminData.masters.length,
        statPhotos: adminData.gallery.length
    };
    
    for (const [id, value] of Object.entries(statElements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

// Переключение вкладок
window.switchTab = function(tabName) {
    // Убираем активные классы
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Активируем нужную вкладку
    event.target.classList.add('active');
    const tabContent = document.getElementById('tab-' + tabName);
    if (tabContent) {
        tabContent.classList.add('active');
    }
};

// УСЛУГИ
function loadServices() {
    const container = document.getElementById('servicesList');
    if (!container) return;
    
    container.innerHTML = adminData.services.map(service => `
        <div class="service-item" data-id="${service.id}">
            <input type="text" class="service-icon-input" value="${service.icon || ''}" placeholder="Эмодзи">
            <div class="service-details">
                <input type="text" value="${service.title}" placeholder="Название услуги">
                <input type="text" value="${service.desc}" placeholder="Описание">
            </div>
            <input type="text" value="${service.price}" placeholder="Цена">
            <button onclick="removeService(${service.id})" style="background: #8B0000; color: white; border: none; padding: 8px; cursor: pointer;"></button>
        </div>
    `).join('');
}

window.addService = function() {
    const newService = {
        id: Date.now(),
        icon: '',
        title: 'Новая услуга',
        desc: 'Описание услуги',
        price: '400'
    };
    adminData.services.push(newService);
    loadServices();
};

window.removeService = function(id) {
    adminData.services = adminData.services.filter(s => s.id !== id);
    loadServices();
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
    
    if (saveData()) {
        showSuccess('servicesSuccess');
    } else {
        alert('Ошибка сохранения!');
    }
};

// МАСТЕРА
function loadMasters() {
    const container = document.getElementById('mastersGrid');
    if (!container) return;
    
    container.innerHTML = adminData.masters.map(master => `
        <div class="master-card-edit" data-id="${master.id}">
            <div class="master-photo-upload" onclick="uploadMasterPhoto(${master.id})">
                ${master.photo ? 
                    `<img src="${master.photo}" alt="${master.name}">` :
                    `<div class="master-photo-placeholder"></div>`
                }
                <div class="photo-overlay"> Изменить фото</div>
            </div>
            <input type="file" id="masterPhoto${master.id}" accept="image/*" style="display: none;" onchange="handleMasterPhoto(${master.id})">
            <div class="form-group">
                <input type="text" value="${master.name}" placeholder="Имя мастера">
            </div>
            <div class="form-group">
                <input type="text" value="${master.spec}" placeholder="Специализация">
            </div>
            <div class="form-group">
                <input type="text" value="${master.experience}" placeholder="Опыт работы">
            </div>
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
        const reader = new FileReader();
        reader.onload = function(e) {
            const master = adminData.masters.find(m => m.id === masterId);
            if (master) {
                master.photo = e.target.result;
                loadMasters();
            }
        };
        reader.readAsDataURL(file);
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
    
    if (saveData()) {
        showSuccess('mastersSuccess');
    } else {
        alert('Ошибка сохранения!');
    }
};

// ГАЛЕРЕЯ
function loadGallery() {
    const preview = document.getElementById('galleryPreview');
    if (!preview) return;
    
    preview.innerHTML = adminData.gallery.map((img, index) => `
        <div class="preview-item">
            <img src="${img.url}" alt="${img.title}">
            <button class="remove-btn" onclick="removeGalleryImage(${index})"></button>
        </div>
    `).join('');
}

window.removeGalleryImage = function(index) {
    adminData.gallery.splice(index, 1);
    loadGallery();
};

window.saveGallery = function() {
    if (saveData()) {
        showSuccess('gallerySuccess');
    } else {
        alert('Ошибка сохранения галереи!');
    }
};

window.clearGallery = function() {
    if (confirm('Удалить все фото из галереи?')) {
        adminData.gallery = [];
        loadGallery();
    }
};

// ЗАПИСИ
function loadBookings() {
    const table = document.getElementById('bookingsTable');
    if (!table) return;
    
    if (adminData.bookings.length > 0) {
        table.innerHTML = adminData.bookings.map(booking => `
            <tr>
                <td>${new Date(booking.date || Date.now()).toLocaleDateString('ru-RU')}</td>
                <td>${booking.name}</td>
                <td>${booking.phone}</td>
                <td>${booking.service}</td>
                <td>${booking.master || 'Любой'}</td>
                <td><span style="color: #4CAF50;"> Новая</span></td>
            </tr>
        `).join('');
    } else {
        table.innerHTML = '<tr><td colspan="6" style="text-align: center; color: rgba(255,255,255,0.5);">Пока нет записей</td></tr>';
    }
}

// НАСТРОЙКИ
function loadSettings() {
    const settingsFields = {
        'settingsPhone': adminData.settings.phone,
        'settingsEmail': adminData.settings.email,
        'settingsAddress': adminData.settings.address,
        'settingsHours': adminData.settings.hours
    };
    
    for (const [id, value] of Object.entries(settingsFields)) {
        const element = document.getElementById(id);
        if (element) {
            element.value = value || '';
        }
    }
}

window.saveSettings = function() {
    adminData.settings = {
        phone: document.getElementById('settingsPhone').value,
        email: document.getElementById('settingsEmail').value,
        address: document.getElementById('settingsAddress').value,
        hours: document.getElementById('settingsHours').value
    };
    
    if (saveData()) {
        showSuccess('settingsSuccess');
    } else {
        alert('Ошибка сохранения настроек!');
    }
};

// Показ сообщения об успехе
function showSuccess(id) {
    const msg = document.getElementById(id);
    if (msg) {
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 3000);
    }
}

// Обработка загрузки файлов галереи
function setupEventHandlers() {
    const galleryUpload = document.getElementById('galleryUpload');
    const galleryInput = document.getElementById('galleryInput');
    
    if (galleryUpload && galleryInput) {
        galleryUpload.addEventListener('click', () => galleryInput.click());
        
        galleryUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            galleryUpload.classList.add('dragover');
        });
        
        galleryUpload.addEventListener('dragleave', () => {
            galleryUpload.classList.remove('dragover');
        });
        
        galleryUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            galleryUpload.classList.remove('dragover');
            handleGalleryFiles(e.dataTransfer.files);
        });
        
        galleryInput.addEventListener('change', (e) => {
            handleGalleryFiles(e.target.files);
        });
    }
}

function handleGalleryFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                adminData.gallery.push({
                    id: Date.now() + Math.random(),
                    url: e.target.result,
                    title: file.name
                });
                loadGallery();
            };
            reader.readAsDataURL(file);
        }
    });
}

// Фоновые изображения
window.uploadBgImage = function(section, input) {
    const file = input.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (!adminData.backgrounds) {
                adminData.backgrounds = {};
            }
            adminData.backgrounds[section] = {
                image: e.target.result,
                caption: document.getElementById('caption-' + section)?.value || ''
            };
            document.getElementById('preview-' + section).innerHTML = 
                `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
        };
        reader.readAsDataURL(file);
    }
};

window.saveAllBackgrounds = function() {
    if (saveData()) {
        document.getElementById('bgSuccessMsg').style.display = 'block';
        setTimeout(() => {
            document.getElementById('bgSuccessMsg').style.display = 'none';
        }, 3000);
    }
};

window.clearAllBackgrounds = function() {
    if (confirm('Удалить все фоновые изображения?')) {
        adminData.backgrounds = {};
        ['services', 'masters', 'gallery', 'booking', 'contact'].forEach(section => {
            document.getElementById('preview-' + section).innerHTML = 'Нет изображения';
            document.getElementById('caption-' + section).value = '';
        });
        saveData();
    }
};

console.log('Admin script loaded successfully');
