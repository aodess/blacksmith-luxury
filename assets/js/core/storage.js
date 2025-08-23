// BLACKSMITH Storage Module - Единое хранилище для админки и сайта
window.BlacksmithStorage = (function() {
    'use strict';
    
    const STORAGE_KEY = 'blacksmithData';
    const BACKGROUNDS_KEY = 'blacksmithBackgrounds';
    const UPDATE_EVENT = 'blacksmith-data-update';
    
    // Структура данных по умолчанию
    const defaultData = {
        services: [
            {id: 1, icon: '💆', title: 'Классический массаж', desc: 'Расслабляющий массаж всего тела', price: '350'},
            {id: 2, icon: '', title: 'Спортивный массаж', desc: 'Глубокая проработка мышц', price: '450'},
            {id: 3, icon: '', title: 'Горячие камни', desc: 'Массаж с базальтовыми камнями', price: '₪500'},
            {id: 4, icon: '🧘', title: 'Тайский массаж', desc: 'Традиционная тайская техника', price: '550'}
        ],
        masters: [
            {id: 1, name: 'Александр Петров', spec: 'Мастер спортивного массажа', experience: '15 лет опыта', rating: '⭐⭐⭐⭐⭐', photo: null},
            {id: 2, name: 'Михаил Чен', spec: 'Специалист тайского массажа', experience: '12 лет опыта', rating: '', photo: null},
            {id: 3, name: 'Давид Коваленко', spec: 'Классический и лечебный массаж', experience: '10 лет опыта', rating: '', photo: null}
        ],
        gallery: [],
        bookings: [],
        settings: {
            phone: '+972 50-123-4567',
            email: 'info@blacksmith-massage.com',
            address: 'Rothschild Blvd 50, Tel Aviv',
            hours: 'Пн-Сб: 9:00-21:00\nВс: 10:00-20:00'
        }
    };
    
    const defaultBackgrounds = {
        hero: { images: [], effect: 'parallax', duration: 5000, overlay: { color: '#000', opacity: 0.5 } },
        services: { image: null, caption: '', effect: 'fade' },
        masters: { image: null, caption: '', effect: 'fade' },
        gallery: { image: null, caption: '', effect: 'fade' },
        booking: { image: null, caption: '', effect: 'fade' },
        contact: { image: null, caption: '', effect: 'fade' }
    };
    
    // Загрузка данных
    function loadData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : defaultData;
        } catch (e) {
            console.error('Error loading data:', e);
            return defaultData;
        }
    }
    
    // Загрузка фонов
    function loadBackgrounds() {
        try {
            const saved = localStorage.getItem(BACKGROUNDS_KEY);
            return saved ? JSON.parse(saved) : defaultBackgrounds;
        } catch (e) {
            console.error('Error loading backgrounds:', e);
            return defaultBackgrounds;
        }
    }
    
    // Сохранение данных
    function saveData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            // Отправляем событие обновления
            window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: data }));
            // Обновляем другие вкладки
            broadcastUpdate();
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    }
    
    // Сохранение фонов
    function saveBackgrounds(backgrounds) {
        try {
            localStorage.setItem(BACKGROUNDS_KEY, JSON.stringify(backgrounds));
            window.dispatchEvent(new CustomEvent('backgrounds-update', { detail: backgrounds }));
            broadcastUpdate();
            return true;
        } catch (e) {
            console.error('Error saving backgrounds:', e);
            return false;
        }
    }
    
    // Синхронизация между вкладками
    function broadcastUpdate() {
        const channel = new BroadcastChannel('blacksmith-sync');
        channel.postMessage({ type: 'data-updated', timestamp: Date.now() });
        channel.close();
    }
    
    // Слушаем обновления из других вкладок
    const syncChannel = new BroadcastChannel('blacksmith-sync');
    syncChannel.onmessage = function(e) {
        if (e.data.type === 'data-updated') {
            window.location.reload();
        }
    };
    
    // API
    return {
        getData: loadData,
        getBackgrounds: loadBackgrounds,
        saveData: saveData,
        saveBackgrounds: saveBackgrounds,
        updateService: function(id, data) {
            const allData = loadData();
            const index = allData.services.findIndex(s => s.id === id);
            if (index !== -1) {
                allData.services[index] = { ...allData.services[index], ...data };
                return saveData(allData);
            }
            return false;
        },
        updateMaster: function(id, data) {
            const allData = loadData();
            const index = allData.masters.findIndex(m => m.id === id);
            if (index !== -1) {
                allData.masters[index] = { ...allData.masters[index], ...data };
                return saveData(allData);
            }
            return false;
        },
        updateGallery: function(gallery) {
            const allData = loadData();
            allData.gallery = gallery;
            return saveData(allData);
        },
        updateSettings: function(settings) {
            const allData = loadData();
            allData.settings = { ...allData.settings, ...settings };
            return saveData(allData);
        },
        addBooking: function(booking) {
            const allData = loadData();
            booking.id = Date.now();
            booking.date = new Date().toISOString();
            allData.bookings.push(booking);
            return saveData(allData);
        },
        onUpdate: function(callback) {
            window.addEventListener(UPDATE_EVENT, (e) => callback(e.detail));
        },
        onBackgroundsUpdate: function(callback) {
            window.addEventListener('backgrounds-update', (e) => callback(e.detail));
        }
    };
})();
