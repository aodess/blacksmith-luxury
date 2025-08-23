// BLACKSMITH Toast Notifications
window.Toast = (function() {
    'use strict';
    
    // Создаем контейнер для уведомлений
    function init() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    }
    
    function show(message, type = 'success', duration = 3000) {
        init();
        
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        
        const colors = {
            success: 'linear-gradient(135deg, #4CAF50, #45a049)',
            error: 'linear-gradient(135deg, #f44336, #da190b)',
            warning: 'linear-gradient(135deg, #ff9800, #e68900)',
            info: 'linear-gradient(135deg, #2196F3, #0b7dda)'
        };
        
        const icons = {
            success: '',
            error: '',
            warning: '',
            info: 'ℹ'
        };
        
        toast.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 24px;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
            font-size: 14px;
            min-width: 300px;
            animation: slideIn 0.3s ease-out;
            pointer-events: auto;
            cursor: pointer;
        `;
        
        toast.innerHTML = `
            <span style="font-size: 20px; font-weight: bold;">${icons[type]}</span>
            <span style="flex: 1;">${message}</span>
        `;
        
        toast.onclick = () => removeToast(toast);
        
        document.getElementById('toast-container').appendChild(toast);
        
        setTimeout(() => removeToast(toast), duration);
    }
    
    function removeToast(toast) {
        if (!toast) return;
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
    
    // Добавляем стили анимации
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.innerHTML = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
            .toast { transition: all 0.3s ease; }
            .toast:hover { transform: scale(1.02); }
        `;
        document.head.appendChild(style);
    }
    
    return {
        success: (msg, duration) => show(msg, 'success', duration),
        error: (msg, duration) => show(msg, 'error', duration),
        warning: (msg, duration) => show(msg, 'warning', duration),
        info: (msg, duration) => show(msg, 'info', duration)
    };
})();
