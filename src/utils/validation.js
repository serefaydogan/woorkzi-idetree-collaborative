// Woorkzi - Form Validasyon ve Yardımcı Fonksiyonlar

export const validateIdea = (idea) => {
  const errors = {};
  
  // Başlık validasyonu
  if (!idea.title || idea.title.trim().length === 0) {
    errors.title = 'Fikir başlığı zorunludur';
  } else if (idea.title.trim().length < 3) {
    errors.title = 'Başlık en az 3 karakter olmalıdır';
  } else if (idea.title.trim().length > 100) {
    errors.title = 'Başlık en fazla 100 karakter olabilir';
  }
  
  // Açıklama validasyonu
  if (idea.description && idea.description.trim().length > 500) {
    errors.description = 'Açıklama en fazla 500 karakter olabilir';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateTask = (task) => {
  const errors = {};
  
  if (!task.title || task.title.trim().length === 0) {
    errors.title = 'Görev başlığı zorunludur';
  } else if (task.title.trim().length < 2) {
    errors.title = 'Görev başlığı en az 2 karakter olmalıdır';
  } else if (task.title.trim().length > 80) {
    errors.title = 'Görev başlığı en fazla 80 karakter olabilir';
  }
  
  if (task.description && task.description.trim().length > 300) {
    errors.description = 'Görev açıklaması en fazla 300 karakter olabilir';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Karakter sayacı
export const formatCharCount = (current, max) => {
  const remaining = max - current;
  const percentage = (current / max) * 100;
  
  return {
    text: `${current}/${max}`,
    isWarning: percentage > 80,
    isError: percentage > 100,
    remaining
  };
};

// Toast bildirim sistemi
export class ToastManager {
  static show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      fontSize: '14px',
      zIndex: '10000',
      animation: 'slideInRight 0.3s ease-out',
      minWidth: '250px',
      backgroundColor: this.getToastColor(type),
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    });
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
  
  static getToastColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[type] || colors.info;
  }
}

// CSS animasyonları ekle
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}