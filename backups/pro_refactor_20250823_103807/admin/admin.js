// BLACKSMITH Admin Panel JavaScript
let adminData = {
    services: [],
    masters: [],
    gallery: [],
    backgrounds: {},
    bookings: [],
    settings: {},
    currentLang: 'en'
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAllData();
    setupEventListeners();
});

// Load all data from localStorage
function loadAllData() {
    const saved = localStorage.getItem('blacksmithData');
    if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(adminData, parsed);
    } else {
        // Default data
        adminData = {
            services: [
                {id: 1, title: 'Classic Massage', desc: 'Full body relaxation', price: '350'},
                {id: 2, title: 'Sports Massage', desc: 'Deep tissue work', price: '450'},
                {id: 3, title: 'Hot Stones', desc: 'Basalt stone therapy', price: '500'},
                {id: 4, title: 'Thai Massage', desc: 'Traditional technique', price: '550'}
            ],
            masters: [
                {id: 1, name: 'Alexander Petrov', spec: 'Sports massage expert', experience: '15 years'},
                {id: 2, name: 'Michael Chen', spec: 'Thai massage specialist', experience: '12 years'},
                {id: 3, name: 'David Kovalenko', spec: 'Classic & therapeutic', experience: '10 years'}
            ],
            gallery: [],
            backgrounds: {},
            bookings: [],
            settings: {
                phone: '+972 50-123-4567',
                email: 'info@blacksmith-massage.com',
                address: 'Rothschild Blvd 50, Tel Aviv',
                facebook: '',
                instagram: '',
                whatsapp: '972501234567'
            },
            currentLang: 'en'
        };
    }
    
    // Load backgrounds separately
    const bgSaved = localStorage.getItem('sectionBackgrounds');
    if (bgSaved) {
        adminData.backgrounds = JSON.parse(bgSaved);
        displayBackgrounds();
    }
    
    updateStats();
    renderServices();
    renderMasters();
    renderGallery();
    loadSettings();
}

// Save data
function saveData() {
    localStorage.setItem('blacksmithData', JSON.stringify(adminData));
}

// Tab switching
window.switchTab = function(tabName) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');
}

// Update statistics
function updateStats() {
    document.getElementById('statBookings').textContent = adminData.bookings.length;
    document.getElementById('statServices').textContent = adminData.services.length;
    document.getElementById('statMasters').textContent = adminData.masters.length;
    document.getElementById('statPhotos').textContent = adminData.gallery.length;
}

// Services
function renderServices() {
    const container = document.getElementById('servicesList');
    if (!container) return;
    
    container.innerHTML = adminData.services.map(service => `
        <div style="margin-bottom: 20px; padding: 15px; background: rgba(10,10,10,0.5); border-radius: 5px;">
            <input type="text" value="${service.title}" placeholder="Title" style="width: 100%; margin-bottom: 10px;">
            <input type="text" value="${service.desc}" placeholder="Description" style="width: 100%; margin-bottom: 10px;">
            <input type="text" value="${service.price}" placeholder="Price" style="width: 200px;">
        </div>
    `).join('');
}

window.saveServices = function() {
    showSuccess('servicesSuccess');
    saveData();
}

// Masters
function renderMasters() {
    const container = document.getElementById('mastersList');
    if (!container) return;
    
    container.innerHTML = adminData.masters.map(master => `
        <div style="margin-bottom: 20px; padding: 15px; background: rgba(10,10,10,0.5); border-radius: 5px;">
            <input type="text" value="${master.name}" placeholder="Name" style="width: 100%; margin-bottom: 10px;">
            <input type="text" value="${master.spec}" placeholder="Specialization" style="width: 100%; margin-bottom: 10px;">
            <input type="text" value="${master.experience}" placeholder="Experience" style="width: 100%;">
        </div>
    `).join('');
}

window.saveMasters = function() {
    showSuccess('mastersSuccess');
    saveData();
}

// Gallery
function setupEventListeners() {
    const galleryUpload = document.getElementById('galleryUpload');
    const galleryInput = document.getElementById('galleryInput');
    
    if (galleryUpload && galleryInput) {
        galleryUpload.addEventListener('click', () => galleryInput.click());
        
        galleryUpload.addEventListener('dragover', (e) => {
            e.preventDefault();
            galleryUpload.style.borderColor = '#D4AF37';
        });
        
        galleryUpload.addEventListener('dragleave', () => {
            galleryUpload.style.borderColor = 'rgba(212, 175, 55, 0.3)';
        });
        
        galleryUpload.addEventListener('drop', (e) => {
            e.preventDefault();
            galleryUpload.style.borderColor = 'rgba(212, 175, 55, 0.3)';
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
                renderGallery();
            };
            reader.readAsDataURL(file);
        }
    });
}

function renderGallery() {
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
    renderGallery();
}

window.saveGallery = function() {
    saveData();
    showSuccess('gallerySuccess');
}

window.clearGallery = function() {
    if (confirm('Clear all gallery images?')) {
        adminData.gallery = [];
        renderGallery();
    }
}

// Backgrounds
window.uploadBackground = function(section, input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (!adminData.backgrounds) adminData.backgrounds = {};
            adminData.backgrounds[section] = {
                image: e.target.result,
                caption: ''
            };
            
            const preview = document.getElementById('preview-' + (section === 'gallery' ? 'gallery-bg' : section));
            if (preview) {
                preview.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover;">';
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function displayBackgrounds() {
    if (!adminData.backgrounds) return;
    
    Object.keys(adminData.backgrounds).forEach(section => {
        if (adminData.backgrounds[section] && adminData.backgrounds[section].image) {
            const preview = document.getElementById('preview-' + (section === 'gallery' ? 'gallery-bg' : section));
            if (preview) {
                preview.innerHTML = '<img src="' + adminData.backgrounds[section].image + '" style="width:100%;height:100%;object-fit:cover;">';
            }
            const caption = document.getElementById('caption-' + section);
            if (caption && adminData.backgrounds[section].caption) {
                caption.value = adminData.backgrounds[section].caption;
            }
        }
    });
}

window.saveBackgrounds = function() {
    // Collect captions
    ['services', 'masters', 'gallery', 'booking', 'contact'].forEach(section => {
        const captionInput = document.getElementById('caption-' + section);
        if (captionInput && adminData.backgrounds[section]) {
            adminData.backgrounds[section].caption = captionInput.value;
        }
    });
    
    localStorage.setItem('sectionBackgrounds', JSON.stringify(adminData.backgrounds));
    showSuccess('backgroundsSuccess');
}

window.clearBackgrounds = function() {
    if (confirm('Clear all backgrounds?')) {
        adminData.backgrounds = {};
        ['services', 'masters', 'gallery', 'booking', 'contact'].forEach(section => {
            const preview = document.getElementById('preview-' + (section === 'gallery' ? 'gallery-bg' : section));
            if (preview) preview.innerHTML = 'No image';
            const caption = document.getElementById('caption-' + section);
            if (caption) caption.value = '';
            const input = document.getElementById('bg-' + section);
            if (input) input.value = '';
        });
        localStorage.removeItem('sectionBackgrounds');
    }
}

// Settings
function loadSettings() {
    if (!adminData.settings) return;
    
    document.getElementById('settingsPhone').value = adminData.settings.phone || '';
    document.getElementById('settingsEmail').value = adminData.settings.email || '';
    document.getElementById('settingsAddress').value = adminData.settings.address || '';
    document.getElementById('settingsFacebook').value = adminData.settings.facebook || '';
    document.getElementById('settingsInstagram').value = adminData.settings.instagram || '';
    document.getElementById('settingsWhatsapp').value = adminData.settings.whatsapp || '';
}

window.saveSettings = function() {
    adminData.settings = {
        phone: document.getElementById('settingsPhone').value,
        email: document.getElementById('settingsEmail').value,
        address: document.getElementById('settingsAddress').value,
        facebook: document.getElementById('settingsFacebook').value,
        instagram: document.getElementById('settingsInstagram').value,
        whatsapp: document.getElementById('settingsWhatsapp').value
    };
    saveData();
    showSuccess('settingsSuccess');
}

// Language
window.setLanguage = function(lang) {
    adminData.currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    // Here you would translate UI elements
}

// Helper
function showSuccess(id) {
    const msg = document.getElementById(id);
    if (msg) {
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 3000);
    }
}
