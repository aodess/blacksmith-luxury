// BLACKSMITH Professional Admin JavaScript
console.log('Admin panel initializing...');

// State
let currentTab = 'dashboard';
let currentLang = 'en';
let unsavedChanges = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing admin...');
    
    // Check if modules loaded
    if (!window.dataStorage) {
        console.error('DataStorage module not loaded!');
        return;
    }
    
    if (!window.notifications) {
        console.error('Notifications module not loaded!');
        return;
    }
    
    initializeAdmin();
    loadAllData();
    setupEventListeners();
    
    // Subscribe to data changes
    window.dataStorage.subscribe(onDataChanged);
    
    notifications.success('Admin panel loaded successfully');
});

// Initialize
function initializeAdmin() {
    updateStats();
    setupNavigation();
    setupBackgroundUploads();
    setupGalleryUpload();
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentLang = btn.dataset.lang;
            dataStorage.data.settings.language = currentLang;
        });
    });
}

// Switch tabs
function switchTab(tab) {
    currentTab = tab;
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === tab);
    });
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tab);
    });
    
    // Update title
    const titles = {
        dashboard: 'Dashboard',
        services: 'Services Management',
        masters: 'Masters Management',
        gallery: 'Gallery Management',
        backgrounds: 'Background Management',
        bookings: 'Bookings',
        settings: 'Settings'
    };
    document.getElementById('page-title').textContent = titles[tab] || 'Dashboard';
    
    // Load tab data
    switch(tab) {
        case 'services': loadServices(); break;
        case 'masters': loadMasters(); break;
        case 'gallery': loadGallery(); break;
        case 'backgrounds': loadBackgrounds(); break;
        case 'bookings': loadBookings(); break;
        case 'settings': loadSettings(); break;
    }
}

// Update statistics
function updateStats() {
    const data = dataStorage.data;
    document.getElementById('stat-services').textContent = data.services.filter(s => s.active).length;
    document.getElementById('stat-masters').textContent = data.masters.filter(m => m.active).length;
    document.getElementById('stat-gallery').textContent = data.gallery.length;
    document.getElementById('stat-bookings').textContent = data.bookings.filter(b => b.status === 'pending').length;
}

// Load all data
function loadAllData() {
    updateStats();
    loadBackgrounds();
    loadSettings();
}

// Services
function loadServices() {
    const container = document.getElementById('services-list');
    const services = dataStorage.getServices();
    
    container.innerHTML = services.map(service => `
        <div class="service-card" data-id="${service.id}">
            <div class="service-header">
                <input type="text" value="${service.title}" placeholder="Service title" 
                       onchange="updateService(${service.id}, 'title', this.value)">
                <label class="switch">
                    <input type="checkbox" ${service.active ? 'checked' : ''} 
                           onchange="updateService(${service.id}, 'active', this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
            <textarea placeholder="Description" 
                      onchange="updateService(${service.id}, 'desc', this.value)">${service.desc}</textarea>
            <div class="service-footer">
                <input type="number" value="${service.price}" placeholder="Price" 
                       onchange="updateService(${service.id}, 'price', this.value)">
                <input type="number" value="${service.duration}" placeholder="Duration (min)" 
                       onchange="updateService(${service.id}, 'duration', this.value)">
            </div>
        </div>
    `).join('');
}

window.updateService = function(id, field, value) {
    dataStorage.updateService(id, { [field]: value });
    notifications.info('Service updated');
    unsavedChanges = true;
};

// Masters
function loadMasters() {
    const container = document.getElementById('masters-list');
    const masters = dataStorage.getMasters();
    
    container.innerHTML = masters.map(master => `
        <div class="master-card" data-id="${master.id}">
            <div class="master-photo">
                ${master.photo ? 
                    `<img src="${master.photo}" alt="${master.name}">` :
                    `<div class="photo-placeholder"></div>`
                }
                <input type="file" id="master-photo-${master.id}" accept="image/*" style="display:none;"
                       onchange="uploadMasterPhoto(${master.id}, this)">
                <button onclick="document.getElementById('master-photo-${master.id}').click()">
                    Change Photo
                </button>
            </div>
            <input type="text" value="${master.name}" placeholder="Master name"
                   onchange="updateMaster(${master.id}, 'name', this.value)">
            <input type="text" value="${master.spec}" placeholder="Specialization"
                   onchange="updateMaster(${master.id}, 'spec', this.value)">
            <input type="number" value="${master.experience}" placeholder="Years of experience"
                   onchange="updateMaster(${master.id}, 'experience', this.value)">
        </div>
    `).join('');
}

window.updateMaster = function(id, field, value) {
    dataStorage.updateMaster(id, { [field]: value });
    notifications.info('Master updated');
    unsavedChanges = true;
};

window.uploadMasterPhoto = function(id, input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            dataStorage.updateMaster(id, { photo: e.target.result });
            loadMasters();
            notifications.success('Photo uploaded');
        };
        reader.readAsDataURL(input.files[0]);
    }
};

// Gallery
function setupGalleryUpload() {
    const dropzone = document.getElementById('gallery-dropzone');
    const input = document.getElementById('gallery-upload');
    
    if (!dropzone || !input) return;
    
    // Click to upload
    dropzone.addEventListener('click', () => input.click());
    
    // Drag and drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragging');
    });
    
    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragging');
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragging');
        handleGalleryFiles(e.dataTransfer.files);
    });
    
    // File input change
    input.addEventListener('change', (e) => {
        handleGalleryFiles(e.target.files);
    });
}

function handleGalleryFiles(files) {
    const loading = notifications.loading('Uploading photos...');
    let uploaded = 0;
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                dataStorage.addGalleryImage({
                    url: e.target.result,
                    title: file.name.replace(/\.[^/.]+$/, ''),
                    category: 'general'
                });
                uploaded++;
                
                if (uploaded === files.length) {
                    notifications.remove(loading);
                    notifications.success(`${uploaded} photos uploaded successfully`);
                    loadGallery();
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

function loadGallery() {
    const container = document.getElementById('gallery-grid');
    const gallery = dataStorage.getGallery();
    
    container.innerHTML = gallery.map(img => `
        <div class="gallery-item">
            <img src="${img.url}" alt="${img.title}">
            <div class="gallery-overlay">
                <button onclick="removeGalleryImage(${img.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

window.removeGalleryImage = function(id) {
    if (confirm('Delete this image?')) {
        dataStorage.removeGalleryImage(id);
        loadGallery();
        notifications.success('Image deleted');
    }
};

// Backgrounds
function setupBackgroundUploads() {
    const sections = ['hero', 'services', 'masters', 'gallery', 'booking', 'contact'];
    
    sections.forEach(section => {
        const input = document.getElementById(`bg-${section}`);
        if (input) {
            input.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const preview = document.getElementById(`bg-${section}-preview`);
                        const isVideo = e.target.files[0].type.startsWith('video/');
                        
                        if (isVideo && section === 'hero') {
                            preview.innerHTML = `<video src="${event.target.result}" autoplay muted loop style="width:100%;height:100%;object-fit:cover;"></video>`;
                            dataStorage.updateBackground(section, { video: event.target.result });
                        } else {
                            preview.innerHTML = `<img src="${event.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
                            dataStorage.updateBackground(section, { image: event.target.result });
                        }
                        
                        notifications.success(`Background uploaded for ${section}`);
                        unsavedChanges = true;
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }
        
        // Caption input
        const captionInput = document.getElementById(`bg-${section}-caption`);
        if (captionInput) {
            captionInput.addEventListener('change', (e) => {
                dataStorage.updateBackground(section, { caption: e.target.value });
                unsavedChanges = true;
            });
        }
    });
}

function loadBackgrounds() {
    const backgrounds = dataStorage.getBackgrounds();
    
    Object.keys(backgrounds).forEach(section => {
        const bg = backgrounds[section];
        const preview = document.getElementById(`bg-${section}-preview`);
        const caption = document.getElementById(`bg-${section}-caption`);
        
        if (preview) {
            if (bg.video && section === 'hero') {
                preview.innerHTML = `<video src="${bg.video}" autoplay muted loop style="width:100%;height:100%;object-fit:cover;"></video>`;
            } else if (bg.image) {
                preview.innerHTML = `<img src="${bg.image}" style="width:100%;height:100%;object-fit:cover;">`;
            } else {
                preview.innerHTML = '<span class="placeholder">No background</span>';
            }
        }
        
        if (caption && bg.caption) {
            caption.value = bg.caption;
        }
    });
}

window.clearBackground = function(section) {
    if (confirm(`Clear background for ${section}?`)) {
        dataStorage.updateBackground(section, { image: null, video: null, caption: '' });
        loadBackgrounds();
        notifications.success('Background cleared');
    }
};

// Settings
function loadSettings() {
    const settings = dataStorage.getSettings();
    
    // Contact info
    document.getElementById('settings-phone').value = settings.phone || '';
    document.getElementById('settings-email').value = settings.email || '';
    document.getElementById('settings-address').value = settings.address || '';
    document.getElementById('settings-address-ru').value = settings.addressRu || '';
    document.getElementById('settings-address-he').value = settings.addressHe || '';
    
    // Hours
    document.getElementById('settings-weekdays').value = settings.hours?.weekdays || '';
    document.getElementById('settings-saturday').value = settings.hours?.saturday || '';
    document.getElementById('settings-sunday').value = settings.hours?.sunday || '';
    
    // Social
    document.getElementById('settings-facebook').value = settings.social?.facebook || '';
    document.getElementById('settings-instagram').value = settings.social?.instagram || '';
    document.getElementById('settings-whatsapp').value = settings.social?.whatsapp || '';
}

window.saveSettings = function() {
    const settings = {
        phone: document.getElementById('settings-phone').value,
        email: document.getElementById('settings-email').value,
        address: document.getElementById('settings-address').value,
        addressRu: document.getElementById('settings-address-ru').value,
        addressHe: document.getElementById('settings-address-he').value,
        hours: {
            weekdays: document.getElementById('settings-weekdays').value,
            saturday: document.getElementById('settings-saturday').value,
            sunday: document.getElementById('settings-sunday').value
        },
        social: {
            facebook: document.getElementById('settings-facebook').value,
            instagram: document.getElementById('settings-instagram').value,
            whatsapp: document.getElementById('settings-whatsapp').value
        }
    };
    
    dataStorage.updateSettings(settings);
    notifications.success('Settings saved successfully');
    unsavedChanges = false;
};

// Bookings
function loadBookings() {
    const container = document.getElementById('bookings-table');
    const bookings = dataStorage.getBookings();
    
    if (bookings.length === 0) {
        container.innerHTML = '<p style="text-align:center; color: var(--gray);">No bookings yet</p>';
        return;
    }
    
    container.innerHTML = `
        <table style="width:100%;">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Service</th>
                    <th>Master</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${bookings.map(booking => `
                    <tr>
                        <td>${new Date(booking.createdAt).toLocaleDateString()}</td>
                        <td>${booking.name}</td>
                        <td>${booking.phone}</td>
                        <td>${booking.service}</td>
                        <td>${booking.master || 'Any'}</td>
                        <td><span class="status-${booking.status}">${booking.status}</span></td>
                        <td>
                            <button onclick="updateBookingStatus(${booking.id}, 'confirmed')">Confirm</button>
                            <button onclick="updateBookingStatus(${booking.id}, 'cancelled')">Cancel</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Save all changes
window.saveAllChanges = function() {
    const saved = dataStorage.saveData();
    if (saved) {
        notifications.success('All changes saved successfully!');
        unsavedChanges = false;
    } else {
        notifications.error('Error saving changes');
    }
};

// Event listeners
function setupEventListeners() {
    // Warn before leaving with unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (unsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// Data changed callback
function onDataChanged(data) {
    console.log('Data changed:', data);
    updateStats();
}

// Quick actions
window.quickAddService = function() {
    switchTab('services');
};

window.quickAddMaster = function() {
    switchTab('masters');
};

window.quickUploadGallery = function() {
    switchTab('gallery');
    document.getElementById('gallery-upload').click();
};

window.exportData = function() {
    const data = JSON.stringify(dataStorage.data, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blacksmith-data.json';
    a.click();
    notifications.success('Data exported successfully');
};

window.previewBackgrounds = function() {
    window.open('../', '_blank');
};
