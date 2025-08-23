// Data Storage Module - Централизованное хранилище данных
class DataStorage {
    constructor() {
        this.storageKey = 'blacksmithData';
        this.backgroundsKey = 'blacksmithBackgrounds';
        this.data = this.loadData();
        this.listeners = [];
    }
    
    loadData() {
        const defaults = {
            services: [
                {id: 1, title: 'Classic Massage', titleRu: 'Классический массаж', titleHe: 'עיסוי קלאסי', 
                 desc: 'Full body relaxation', descRu: 'Расслабление всего тела', descHe: 'הרפיה לכל הגוף',
                 price: 350, duration: 60, active: true},
                {id: 2, title: 'Sports Massage', titleRu: 'Спортивный массаж', titleHe: 'עיסוי ספורט',
                 desc: 'Deep tissue therapy', descRu: 'Глубокая проработка мышц', descHe: 'טיפול רקמות עמוק',
                 price: 450, duration: 90, active: true},
                {id: 3, title: 'Hot Stones', titleRu: 'Горячие камни', titleHe: 'אבנים חמות',
                 desc: 'Heated stone therapy', descRu: 'Массаж горячими камнями', descHe: 'טיפול באבנים חמות',
                 price: 500, duration: 75, active: true},
                {id: 4, title: 'Thai Massage', titleRu: 'Тайский массаж', titleHe: 'עיסוי תאילנדי',
                 desc: 'Traditional technique', descRu: 'Традиционная техника', descHe: 'טכניקה מסורתית',
                 price: 550, duration: 90, active: true}
            ],
            masters: [
                {id: 1, name: 'Alexander Petrov', nameRu: 'Александр Петров', nameHe: 'אלכסנדר פטרוב',
                 spec: 'Sports massage expert', specRu: 'Эксперт спортивного массажа', specHe: 'מומחה לעיסוי ספורט',
                 experience: 15, photo: null, rating: 4.9, active: true},
                {id: 2, name: 'Michael Chen', nameRu: 'Михаил Чен', nameHe: 'מיכאל חן',
                 spec: 'Thai massage specialist', specRu: 'Специалист тайского массажа', specHe: 'מומחה לעיסוי תאילנדי',
                 experience: 12, photo: null, rating: 4.8, active: true},
                {id: 3, name: 'David Kovalenko', nameRu: 'Давид Коваленко', nameHe: 'דוד קובלנקו',
                 spec: 'Classic & therapeutic', specRu: 'Классический и лечебный', specHe: 'קלאסי וטיפולי',
                 experience: 10, photo: null, rating: 4.7, active: true}
            ],
            gallery: [],
            bookings: [],
            settings: {
                phone: '+972 50-123-4567',
                email: 'info@blacksmith-massage.com',
                address: 'Rothschild Blvd 50, Tel Aviv',
                addressRu: 'Ротшильд 50, Тель-Авив',
                addressHe: 'רוטשילד 50, תל אביב',
                hours: {
                    weekdays: '09:00-21:00',
                    saturday: '10:00-20:00',
                    sunday: '10:00-20:00'
                },
                social: {
                    facebook: 'https://facebook.com/blacksmith',
                    instagram: 'https://instagram.com/blacksmith',
                    whatsapp: '972501234567'
                },
                currency: '₪',
                language: 'en'
            },
            backgrounds: {
                hero: { image: null, video: null, caption: '' },
                services: { image: null, caption: '' },
                masters: { image: null, caption: '' },
                gallery: { image: null, caption: '' },
                booking: { image: null, caption: '' },
                contact: { image: null, caption: '' }
            }
        };
        
        try {
            const saved = localStorage.getItem(this.storageKey);
            const backgrounds = localStorage.getItem(this.backgroundsKey);
            
            if (saved) {
                const parsed = JSON.parse(saved);
                Object.assign(defaults, parsed);
            }
            
            if (backgrounds) {
                defaults.backgrounds = JSON.parse(backgrounds);
            }
            
            return defaults;
        } catch (e) {
            console.error('Error loading data:', e);
            return defaults;
        }
    }
    
    saveData() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            localStorage.setItem(this.backgroundsKey, JSON.stringify(this.data.backgrounds));
            this.notifyListeners();
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    }
    
    subscribe(callback) {
        this.listeners.push(callback);
    }
    
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.data));
    }
    
    // API methods
    getServices() { return this.data.services; }
    getMasters() { return this.data.masters; }
    getGallery() { return this.data.gallery; }
    getSettings() { return this.data.settings; }
    getBackgrounds() { return this.data.backgrounds; }
    getBookings() { return this.data.bookings; }
    
    updateService(id, updates) {
        const service = this.data.services.find(s => s.id === id);
        if (service) {
            Object.assign(service, updates);
            this.saveData();
        }
    }
    
    updateMaster(id, updates) {
        const master = this.data.masters.find(m => m.id === id);
        if (master) {
            Object.assign(master, updates);
            this.saveData();
        }
    }
    
    addGalleryImage(image) {
        this.data.gallery.push({
            id: Date.now(),
            url: image.url,
            title: image.title || '',
            category: image.category || 'general',
            active: true
        });
        this.saveData();
    }
    
    removeGalleryImage(id) {
        this.data.gallery = this.data.gallery.filter(img => img.id !== id);
        this.saveData();
    }
    
    updateBackground(section, data) {
        if (this.data.backgrounds[section]) {
            Object.assign(this.data.backgrounds[section], data);
            this.saveData();
        }
    }
    
    updateSettings(settings) {
        Object.assign(this.data.settings, settings);
        this.saveData();
    }
    
    addBooking(booking) {
        booking.id = Date.now();
        booking.status = 'pending';
        booking.createdAt = new Date().toISOString();
        this.data.bookings.push(booking);
        this.saveData();
        return booking.id;
    }
}

// Export for use
window.DataStorage = DataStorage;
window.dataStorage = new DataStorage();
