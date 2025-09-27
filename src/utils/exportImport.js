// src/utils/exportImport.js
// Woorkzi Veri Export/Import Sistemi

// JSON formatında veri export etme
export const exportToJSON = (ideas, tasks) => {
  const exportData = {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    appName: "Woorkzi",
    data: {
      ideas,
      tasks,
      totalIdeas: ideas.length,
      totalTasks: tasks.length
    }
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `woorkzi_backup_${new Date().toISOString().slice(0,10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  return { success: true, filename: exportFileDefaultName };
};

// CSV formatında fikir listesi export etme
export const exportToCSV = (ideas) => {
  const headers = [
    'ID',
    'Başlık', 
    'Açıklama',
    'Kategori',
    'Durum',
    'Öncelik',
    'Tamamlanma %',
    'Tahmini Saat',
    'Oluşturma Tarihi',
    'Alt Fikir Sayısı',
    'Görev Sayısı',
    'Etiketler'
  ];

  const csvContent = [
    headers.join(','),
    ...ideas.map(idea => [
      idea.id,
      `"${idea.title.replace(/"/g, '""')}"`,
      `"${idea.description.replace(/"/g, '""')}"`,
      idea.category,
      idea.status,
      idea.priority,
      idea.completionPercentage,
      idea.estimatedHours,
      new Date(idea.createdAt).toLocaleDateString('tr-TR'),
      idea.subIdeas.length,
      idea.tasks.length,
      `"${idea.tags.join(', ')}"`
    ].join(','))
  ].join('\n');

  const dataUri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvContent);
  const exportFileDefaultName = `idetree_fikirler_${new Date().toISOString().slice(0,10)}.csv`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  return { success: true, filename: exportFileDefaultName };
};

// JSON dosyası import etme
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // Veri format kontrolü
        if (!importData.data || !importData.data.ideas || !importData.data.tasks) {
          throw new Error('Geçersiz dosya formatı');
        }
        
        // Version kontrolü
        if (!importData.version) {
          console.warn('Versiyon bilgisi bulunamadı, eski format olabilir');
        }
        
        resolve({
          success: true,
          data: importData.data,
          version: importData.version,
          exportDate: importData.exportDate
        });
      } catch (error) {
        reject({
          success: false,
          error: error.message
        });
      }
    };
    
    reader.onerror = () => {
      reject({
        success: false,
        error: 'Dosya okuma hatası'
      });
    };
    
    reader.readAsText(file);
  });
};

// Veri doğrulama
export const validateImportData = (data) => {
  const errors = [];
  
  if (!Array.isArray(data.ideas)) {
    errors.push('Fikir listesi geçersiz');
  }
  
  if (!Array.isArray(data.tasks)) {
    errors.push('Görev listesi geçersiz');
  }
  
  // Gerekli alanların kontrolü
  data.ideas.forEach((idea, index) => {
    if (!idea.id || !idea.title) {
      errors.push(`Fikir ${index + 1}: ID veya başlık eksik`);
    }
  });
  
  data.tasks.forEach((task, index) => {
    if (!task.id || !task.title) {
      errors.push(`Görev ${index + 1}: ID veya başlık eksik`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Backup oluşturma (LocalStorage)
export const createBackup = (ideas, tasks) => {
  const backup = {
    timestamp: Date.now(),
    date: new Date().toISOString(),
    ideas,
    tasks
  };
  
  const backups = JSON.parse(localStorage.getItem('woorkzi-backups') || '[]');
  backups.unshift(backup); // En yenisi başa
  
  // En fazla 10 backup sakla
  if (backups.length > 10) {
    backups.splice(10);
  }
  
  localStorage.setItem('woorkzi-backups', JSON.stringify(backups));
  return backup;
};

// Backup listesi getirme
export const getBackups = () => {
  return JSON.parse(localStorage.getItem('woorkzi-backups') || '[]');
};

// Backup geri yükleme
export const restoreBackup = (timestamp) => {
  const backups = getBackups();
  const backup = backups.find(b => b.timestamp === timestamp);
  
  if (!backup) {
    throw new Error('Backup bulunamadı');
  }
  
  return {
    ideas: backup.ideas,
    tasks: backup.tasks
  };
};

// İstatistik oluşturma
export const generateStats = (ideas, tasks) => {
  const stats = {
    totalIdeas: ideas.length,
    totalTasks: tasks.length,
    completedIdeas: ideas.filter(i => i.status === 'completed').length,
    activeIdeas: ideas.filter(i => i.status === 'active').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    categories: {},
    avgProgress: 0
  };
  
  // Kategori dağılımı
  ideas.forEach(idea => {
    stats.categories[idea.category] = (stats.categories[idea.category] || 0) + 1;
  });
  
  // Ortalama ilerleme
  if (ideas.length > 0) {
    stats.avgProgress = Math.round(
      ideas.reduce((sum, idea) => sum + idea.completionPercentage, 0) / ideas.length
    );
  }
  
  return stats;
};