// src/components/Modal.js
// Modern Modal Component

import React, { useState, useEffect } from 'react';
import { X, Plus, Zap, FolderPlus } from 'lucide-react';
import { validateIdea, validateTask, ToastManager, formatCharCount } from '../utils/validation';

// Ana Modal Container
export const Modal = ({ isOpen, onClose, children, title, maxWidth = '500px' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Alt Fikir Ekleme Modal'ı
export const AddSubIdeaModal = ({ isOpen, onClose, onSubmit, parentTitle }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateIdea(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      ToastManager.show('Lütfen form hatalarını düzeltin', 'error');
      return;
    }

    onSubmit(formData.title.trim(), formData.description.trim());
    setFormData({ title: '', description: '' });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({ title: '', description: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Alt Fikir Ekle" maxWidth="600px">
      <div className="modal-info">
        <p><strong>Ana Fikir:</strong> {parentTitle}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Alt Fikir Başlığı *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, title: e.target.value }));
              if (errors.title) {
                setErrors(prev => ({ ...prev, title: null }));
              }
            }}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Alt fikrinizin başlığını yazın..."
            autoFocus
          />
          {errors.title && <div className="error-message">{errors.title}</div>}
          <div className="char-count">{formatCharCount(formData.title.length, 100).text}</div>
        </div>

        <div className="form-group">
          <label>Açıklama</label>
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, description: e.target.value }));
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: null }));
              }
            }}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Alt fikrinizi detaylı olarak açıklayın..."
            rows={3}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
          <div className="char-count">{formatCharCount(formData.description.length, 500).text}</div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={handleClose} className="btn btn-secondary">
            İptal
          </button>
          <button type="submit" className="btn btn-primary">
            <FolderPlus size={16} />
            Alt Fikir Ekle
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Görev Ekleme Modal'ı
export const AddTaskModal = ({ isOpen, onClose, onSubmit, ideaTitle }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimatedHours: ''
  });
  const [errors, setErrors] = useState({});

  const priorityOptions = [
    { id: 'low', name: 'Düşük', icon: '⬇️' },
    { id: 'medium', name: 'Orta', icon: '➡️' },
    { id: 'high', name: 'Yüksek', icon: '⬆️' },
    { id: 'urgent', name: 'Acil', icon: '🚨' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateTask(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      ToastManager.show('Lütfen form hatalarını düzeltin', 'error');
      return;
    }

    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      estimatedHours: parseInt(formData.estimatedHours) || 0
    };

    onSubmit(taskData);
    setFormData({ title: '', description: '', priority: 'medium', estimatedHours: '' });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({ title: '', description: '', priority: 'medium', estimatedHours: '' });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Görev Ekle" maxWidth="600px">
      <div className="modal-info">
        <p><strong>Fikir:</strong> {ideaTitle}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Görev Başlığı *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, title: e.target.value }));
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: null }));
                }
              }}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Görevinizin başlığını yazın..."
              autoFocus
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
            <div className="char-count">{formatCharCount(formData.title.length, 80).text}</div>
          </div>

          <div className="form-group">
            <label>Öncelik</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="form-select"
            >
              {priorityOptions.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.icon} {priority.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Açıklama</label>
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, description: e.target.value }));
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: null }));
              }
            }}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Görevi detaylı olarak açıklayın..."
            rows={3}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
          <div className="char-count">{formatCharCount(formData.description.length, 300).text}</div>
        </div>

        <div className="form-group">
          <label>Tahmini Süre (Saat)</label>
          <input
            type="number"
            value={formData.estimatedHours}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
            className="form-input"
            placeholder="Örn: 8"
            min="0"
            max="1000"
          />
        </div>

        <div className="modal-actions">
          <button type="button" onClick={handleClose} className="btn btn-secondary">
            İptal
          </button>
          <button type="submit" className="btn btn-success">
            <Zap size={16} />
            Görev Ekle
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Export/Import Modal'ı
export const ExportImportModal = ({ isOpen, onClose, onExport, stats }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Veri Yönetimi">
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <h4>Export Sistemi</h4>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '20px 0' }}>
          <button onClick={() => onExport('json')} className="btn btn-primary">
            JSON İndir
          </button>
          <button onClick={() => onExport('csv')} className="btn btn-secondary">
            CSV İndir
          </button>
        </div>
        <div>
          <p>Toplam Fikir: {stats.totalIdeas}</p>
          <p>Toplam Görev: {stats.totalTasks}</p>
        </div>
      </div>
    </Modal>
  );
};

// Account/Profile Modal
export const AccountModal = ({ isOpen, onClose, stats }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({
    name: 'Kullanıcı',
    email: 'kullanici@idetree.com',
    joinDate: '2024-09-15',
    totalIdeas: stats.totalIdeas,
    avatar: null
  });
  
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    autoSave: true,
    language: 'tr'
  });

  const handleClose = () => {
    setActiveTab('profile');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Hesabım" maxWidth="600px">
      <div className="export-import-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profil
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Ayarlar
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 İstatistikler
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="tab-content">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              color: 'white',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>{userData.name}</h3>
            <p style={{ color: '#6b7280', margin: '0' }}>{userData.email}</p>
          </div>

          <div className="profile-info">
            <div className="form-group">
              <label>Ad Soyad</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
                placeholder="Adınızı girin"
              />
            </div>
            
            <div className="form-group">
              <label>E-posta</label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                className="form-input"
                placeholder="E-posta adresiniz"
              />
            </div>

            <div style={{ 
              background: '#f9fafb', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              padding: '15px',
              marginTop: '20px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#374151' }}>Hesap Bilgileri</h4>
              <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#6b7280' }}>
                <strong>Katılım Tarihi:</strong> {new Date(userData.joinDate).toLocaleDateString('tr-TR')}
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#6b7280' }}>
                <strong>Toplam Fikir:</strong> {userData.totalIdeas}
              </p>
              <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#6b7280' }}>
                <strong>Hesap Tipi:</strong> Premium Kullanıcı
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="tab-content">
          <h4>Uygulama Ayarları</h4>
          
          <div className="settings-group">
            <div className="form-group">
              <label>Tema</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                className="form-select"
              >
                <option value="light">🌞 Açık Tema</option>
                <option value="dark">🌙 Koyu Tema</option>
                <option value="auto">🔄 Otomatik</option>
              </select>
            </div>

            <div className="form-group">
              <label>Dil</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="form-select"
              >
                <option value="tr">🇹🇷 Türkçe</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px 0',
              borderTop: '1px solid #e5e7eb',
              marginTop: '15px'
            }}>
              <div>
                <strong>Bildirimler</strong>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0' }}>
                  Yeni özellikler ve güncellemeler
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings(prev => ({ ...prev, notifications: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '10px 0',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div>
                <strong>Otomatik Kaydetme</strong>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: '0' }}>
                  Değişiklikleri otomatik olarak kaydet
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="tab-content">
          <h4>Detaylı İstatistikler</h4>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-number">{stats.totalIdeas}</div>
              <div className="stat-label">Toplam Fikir</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.totalTasks}</div>
              <div className="stat-label">Toplam Görev</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">{stats.completedIdeas}</div>
              <div className="stat-label">Tamamlanan Fikir</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">%{stats.avgProgress}</div>
              <div className="stat-label">Ortalama İlerleme</div>
            </div>
          </div>

          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #bae6fd', 
            borderRadius: '8px', 
            padding: '15px',
            marginTop: '20px'
          }}>
            <h5 style={{ margin: '0 0 10px 0', color: '#1e40af' }}>Bu Ay</h5>
            <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
              🎯 <strong>3 fikir</strong> eklendi
            </p>
            <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
              ✅ <strong>7 görev</strong> tamamlandı  
            </p>
            <p style={{ margin: '5px 0', fontSize: '0.9rem' }}>
              📈 <strong>%25</strong> ilerleme artışı
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};