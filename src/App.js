import React, { useState, useContext, createContext, useEffect, useCallback, useMemo } from 'react';
import { Search, Plus, ChevronRight, ChevronDown, Users, Clock, MessageCircle, CheckSquare, User, X, Send, AlertTriangle, Calendar, Activity, Award } from 'lucide-react';

// Mock data
const initialData = {
  ideas: [
    {
      id: 1,
      title: "E-Ticaret Mobil Uygulaması",
      description: "Kullanıcı dostu arayüzü olan modern bir e-ticaret uygulaması geliştirmek",
      category: "Teknoloji",
      status: "Devam Ediyor",
      priority: "Yüksek",
      tags: ["mobil", "e-ticaret", "react-native"],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      assignedTo: ["Ahmet Y.", "Zeynep K."],
      progress: 65,
      tasks: [
        {
          id: 101,
          title: "UI/UX Tasarım",
          description: "Ana sayfa ve ürün sayfası tasarımları",
          status: "Tamamlandı",
          priority: "Yüksek",
          assignedTo: "Zeynep K.",
          dueDate: "2024-01-25",
          comments: [
            { id: 1, author: "Zeynep K.", text: "Mockup'lar hazırlandı", date: "2024-01-22" },
            { id: 2, author: "Ahmet Y.", text: "Harika görünüyor!", date: "2024-01-23" }
          ],
          checklist: [
            { id: 1, text: "Ana sayfa wireframe", completed: true },
            { id: 2, text: "Ürün detay sayfası", completed: true },
            { id: 3, text: "Sepet sayfası", completed: false }
          ]
        },
        {
          id: 102,
          title: "Backend API Geliştirme",
          description: "Ürün ve kullanıcı yönetimi API'leri",
          status: "Devam Ediyor",
          priority: "Yüksek",
          assignedTo: "Ahmet Y.",
          dueDate: "2024-02-01",
          comments: [],
          checklist: []
        }
      ]
    },
    {
      id: 2,
      title: "Şirket Web Sitesi Yenileme",
      description: "Modern tasarım ve SEO optimizasyonu ile web sitesi güncellemesi",
      category: "Tasarım",
      status: "Planlanan",
      priority: "Orta",
      tags: ["web", "seo", "tasarım"],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
      assignedTo: ["Mehmet S."],
      progress: 25,
      tasks: [
        {
          id: 201,
          title: "SEO Analizi",
          description: "Mevcut site SEO durumu analizi",
          status: "Beklemede",
          priority: "Orta",
          assignedTo: "Mehmet S.",
          dueDate: "2024-01-30",
          comments: [],
          checklist: []
        }
      ]
    }
  ]
};

function App() {
  const handleButtonClick = (callback) => {
    return (e) => {
      e.target.style.transform = 'scale(0.95)';
      setTimeout(() => {
        e.target.style.transform = '';
        callback();
      }, 100);
    };
  };

  // State management
  const [expandedIdeas, setExpandedIdeas] = useState({});
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewIdeaModalOpen, setIsNewIdeaModalOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isTaskAssignmentModalOpen, setIsTaskAssignmentModalOpen] = useState(false);
  const [selectedTaskForAssignment, setSelectedTaskForAssignment] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedIdeaForTask, setSelectedIdeaForTask] = useState(null);
  const [ideas, setIdeas] = useState(initialData.ideas);
  
  // Arama ve filtreleme state'leri
  const [draggedIdea, setDraggedIdea] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  // User Profile Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Loading simülasyonu - filteredIdeas'dan ÖNCE ekleyin
useEffect(() => {
  // Sayfa yüklendiğinde 2 saniye loading göster
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);

    // Dashboard metrikleri hesaplamaları - useEffect'in altına ekleyin
const dashboardMetrics = useMemo(() => {
  const totalIdeas = ideas.length;
  const completedIdeas = ideas.filter(idea => idea.status === 'Tamamlandı').length;
  const inProgressIdeas = ideas.filter(idea => idea.status === 'Devam Ediyor').length;
  const pendingIdeas = ideas.filter(idea => idea.status === 'Beklemede').length;
  
  // Tüm görevleri say
  const allTasks = ideas.reduce((acc, idea) => acc + (idea.tasks ? idea.tasks.length : 0), 0);
  const completedTasks = ideas.reduce((acc, idea) => 
    acc + (idea.tasks ? idea.tasks.filter(task => task.status === 'Tamamlandı').length : 0), 0);
  
  // Bu ay eklenen fikirler (basit simülasyon)
  const thisMonthIdeas = ideas.filter(idea => {
    const ideaDate = new Date(idea.createdAt);
    const now = new Date();
    return ideaDate.getMonth() === now.getMonth() && ideaDate.getFullYear() === now.getFullYear();
  }).length;
  
  // Kategori dağılımı
  const categoryStats = ideas.reduce((acc, idea) => {
    acc[idea.category] = (acc[idea.category] || 0) + 1;
    return acc;
  }, {});
  
  // Ortalama ilerleme
  const avgProgress = ideas.reduce((acc, idea) => acc + (idea.progress || 0), 0) / totalIdeas;
  
  return {
    totalIdeas,
    completedIdeas,
    inProgressIdeas,
    pendingIdeas,
    allTasks,
    completedTasks,
    thisMonthIdeas,
    categoryStats,
    avgProgress: Math.round(avgProgress)
  };
}, [ideas]);    

// Chart data hazırlama - dashboardMetrics'in altına ekleyin
const chartData = useMemo(() => {
  // Line Chart Data - Aylık trend (son 6 ay)
  const monthlyData = [];
  const months = ['Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const values = [3, 5, 8, 6, 4, 7]; // Simulated data
  
  months.forEach((month, index) => {
    monthlyData.push({
      month,
      ideas: values[index],
      tasks: values[index] * 2
    });
  });

  // Donut Chart Data - Kategori dağılımı
  const categoryData = Object.entries(dashboardMetrics.categoryStats).map(([category, count]) => ({
    name: category,
    value: count,
    percentage: Math.round((count / dashboardMetrics.totalIdeas) * 100)
  }));

  // Bar Chart Data - Durum dağılımı  
  const statusData = [
    {
      status: 'Tamamlandı',
      count: dashboardMetrics.completedIdeas,
      color: '#10b981'
    },
    {
      status: 'Devam Ediyor', 
      count: dashboardMetrics.inProgressIdeas,
      color: '#3b82f6'
    },
    {
      status: 'Beklemede',
      count: dashboardMetrics.pendingIdeas,
      color: '#f59e0b'
    }
  ];

  return {
    monthlyData,
    categoryData,
    statusData
  };
}, [dashboardMetrics]);
// User Management System - chartData'nın altına ekleyin
const usersData = useMemo(() => {
  return {
    "ahmet-y": {
      id: "ahmet-y",
      name: "Ahmet Yılmaz",
      email: "ahmet@company.com",
      role: "Backend Developer",
      avatar: "👨‍💻",
      skills: ["Node.js", "React", "Database"],
      status: "available", // available, busy, away
      joinDate: "2023-06-15",
      completedTasks: 12,
      activeTasks: 2,
      recentActivity: [
      { id: 1, type: "task_completed", title: "Backend API Geliştirme", date: "2024-01-20" },
      { id: 2, type: "comment_added", title: "E-Ticaret projesine yorum", date: "2024-01-19" },
      { id: 3, type: "task_started", title: "Database optimizasyonu", date: "2024-01-18" }
    ],
    assignedProjects: ["E-Ticaret Mobil Uygulaması", "API Gateway Projesi"],
    performance: 85
    },
    "zeynep-k": {
      id: "zeynep-k", 
      name: "Zeynep Kaya",
      email: "zeynep@company.com",
      role: "UI/UX Designer",
      avatar: "👩‍🎨",
      skills: ["Figma", "Photoshop", "User Research"],
      status: "busy",
      joinDate: "2023-04-20",
      completedTasks: 8,
      activeTasks: 3,
      recentActivity: [
      { id: 1, type: "task_completed", title: "UI/UX Tasarım", date: "2024-01-21" },
      { id: 2, type: "comment_added", title: "Tasarım review toplantısı", date: "2024-01-20" },
      { id: 3, type: "task_started", title: "Ana sayfa wireframe", date: "2024-01-19" }
    ],
    assignedProjects: ["E-Ticaret Mobil Uygulaması", "Web Sitesi Yenileme"],
    performance: 92
    },
    "mehmet-s": {
      id: "mehmet-s",
      name: "Mehmet Sert", 
      email: "mehmet@company.com",
      role: "SEO Specialist",
      avatar: "👨‍💼",
      skills: ["SEO", "Analytics", "Content Strategy"],
      status: "available",
      joinDate: "2023-08-10",
      completedTasks: 5,
      activeTasks: 1,
      recentActivity: [
      { id: 1, type: "task_completed", title: "SEO Analizi", date: "2024-01-20" },
      { id: 2, type: "comment_added", title: "Anahtar kelime araştırması", date: "2024-01-18" },
      { id: 3, type: "task_started", title: "İçerik optimizasyonu", date: "2024-01-17" }
    ],
    assignedProjects: ["Şirket Web Sitesi Yenileme"],
    performance: 78
    }
  };
}, []);
// Deadline hesaplamaları - chartData'nın altına ekleyin
const deadlineAnalysis = useMemo(() => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Tüm görevleri topla ve deadline'larını analiz et
  const allTasks = ideas.reduce((acc, idea) => {
    if (idea.tasks) {
      const tasksWithIdea = idea.tasks.map(task => ({
        ...task,
        ideaTitle: idea.title,
        ideaId: idea.id
      }));
      acc.push(...tasksWithIdea);
    }
    return acc;
  }, []);
  
  // Deadline durumlarını kategorize et
  const overdueTasks = allTasks.filter(task => {
    if (!task.dueDate || task.status === 'Tamamlandı') return false;
    return task.dueDate < todayStr;
  });
  
  const dueSoonTasks = allTasks.filter(task => {
    if (!task.dueDate || task.status === 'Tamamlandı') return false;
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7; // Sonraki 7 gün içinde
  });
  
  const completedThisWeek = allTasks.filter(task => {
    if (task.status !== 'Tamamlandı') return false;
    // Basit simülasyon - gerçek uygulamada completedDate kullanılır
    return true;
  });
  
  return {
    allTasks,
    overdueTasks,
    dueSoonTasks,
    completedThisWeek,
    totalOverdue: overdueTasks.length,
    totalDueSoon: dueSoonTasks.length
  };
}, [ideas]);

  // Arama ve filtreleme fonksiyonu
  const filteredIdeas = useMemo(() => {
    return ideas.filter(idea => {
      // Metin arama (başlık, açıklama, etiketler)
      const searchMatch = searchTerm === '' || 
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Durum filtresi
      const statusMatch = statusFilter === 'all' || idea.status === statusFilter;
      
      // Öncelik filtresi  
      const priorityMatch = priorityFilter === 'all' || idea.priority === priorityFilter;
      
      // Kategori filtresi
      const categoryMatch = categoryFilter === 'all' || idea.category === categoryFilter;

      return searchMatch && statusMatch && priorityMatch && categoryMatch;
    });
  }, [ideas, searchTerm, statusFilter, priorityFilter, categoryFilter]);
  // Drag & Drop fonksiyonları - mevcut fonksiyonlarınızın ALTINA ekleyin

const handleDragStart = (e, idea, index) => {
  console.log('Drag başladı:', idea.title, index);
  setDraggedIdea({ idea, originalIndex: index });
  e.dataTransfer.effectAllowed = 'move';
  
  // Sürüklenen elementi biraz saydam yap
  setTimeout(() => {
    e.target.style.opacity = '0.5';
  }, 0);
};

const handleDragEnd = (e) => {
  console.log('Drag bitti');
  e.target.style.opacity = '1';
  setDraggedIdea(null);
  setDragOverIndex(null);
};

const handleDragOver = (e, index) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  setDragOverIndex(index);
};

const handleDragLeave = () => {
  setDragOverIndex(null);
};

const handleDrop = (e, dropIndex) => {
  e.preventDefault();
  
  if (!draggedIdea || draggedIdea.originalIndex === dropIndex) {
    setDragOverIndex(null);
    return;
  }

  console.log('Drop edildi - Eski index:', draggedIdea.originalIndex, 'Yeni index:', dropIndex);
  
  // Array'i yeniden sırala
  const newIdeas = [...ideas];
  const [movedIdea] = newIdeas.splice(draggedIdea.originalIndex, 1);
  newIdeas.splice(dropIndex, 0, movedIdea);
  
  setIdeas(newIdeas);
  setDraggedIdea(null);
  setDragOverIndex(null);
  
  console.log('Sıralama tamamlandı!');
};
// PDF Report Generation - drag & drop fonksiyonlarının altına ekleyin
const generatePDFReport = () => {
  const today = new Date().toLocaleDateString('tr-TR');
  
  // PDF içeriğini HTML olarak oluştur
  const reportContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>İdetree - Proje Raporu</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          margin: 40px;
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
        }
        .logo { 
          color: #3b82f6; 
          font-size: 28px; 
          font-weight: bold; 
          margin-bottom: 10px;
        }
        .date { 
          color: #666; 
          font-size: 14px;
        }
        .metrics { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 20px; 
          margin: 30px 0;
        }
        .metric-card { 
          border: 1px solid #e5e7eb; 
          border-radius: 8px; 
          padding: 20px; 
          text-align: center;
        }
        .metric-value { 
          font-size: 24px; 
          font-weight: bold; 
          color: #3b82f6;
        }
        .metric-label { 
          color: #666; 
          font-size: 12px; 
          text-transform: uppercase;
        }
        .section { 
          margin: 30px 0;
        }
        .section-title { 
          font-size: 18px; 
          font-weight: bold; 
          margin-bottom: 15px;
          color: #1f2937;
        }
        .task-item { 
          background: #f9fafb; 
          border-left: 4px solid #ef4444; 
          padding: 10px 15px; 
          margin-bottom: 10px;
        }
        .task-title { 
          font-weight: bold;
        }
        .task-subtitle { 
          font-size: 12px; 
          color: #666;
        }
        .idea-item {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .idea-title {
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 5px;
        }
        .idea-desc {
          color: #64748b;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🌱 idetree</div>
        <div class="date">Proje Raporu - ${today}</div>
      </div>
      
      <div class="metrics">
        <div class="metric-card">
          <div class="metric-value">${dashboardMetrics.totalIdeas}</div>
          <div class="metric-label">Toplam Fikirler</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${dashboardMetrics.completedTasks}/${dashboardMetrics.allTasks}</div>
          <div class="metric-label">Tamamlanan Görevler</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${deadlineAnalysis.totalOverdue}</div>
          <div class="metric-label">Geciken Görevler</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${deadlineAnalysis.totalDueSoon}</div>
          <div class="metric-label">Yaklaşan Deadline'lar</div>
        </div>
      </div>
      
      ${deadlineAnalysis.totalOverdue > 0 ? `
        <div class="section">
          <div class="section-title">🚨 Acil Durumda Olan Görevler</div>
          ${deadlineAnalysis.overdueTasks.map(task => `
            <div class="task-item">
              <div class="task-title">${task.title}</div>
              <div class="task-subtitle">${task.ideaTitle} - Son Tarih: ${task.dueDate}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">📋 Tüm Projeler</div>
        ${ideas.map(idea => `
          <div class="idea-item">
            <div class="idea-title">${idea.title}</div>
            <div class="idea-desc">${idea.description}</div>
            <div style="margin-top: 10px;">
              <span style="background: #3b82f6; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">
                ${idea.category}
              </span>
              <span style="background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 8px;">
                ${idea.status}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
      
    </body>
    </html>
  `;

  // PDF'i yeni pencerede aç
  const printWindow = window.open('', '_blank');
  printWindow.document.write(reportContent);
  printWindow.document.close();
  
  // Print dialog'u aç
  setTimeout(() => {
    printWindow.print();
  }, 100);
  
  console.log('PDF Raporu oluşturuldu!');
};

// CSV Export Function
const exportToCSV = () => {
  const today = new Date().toLocaleDateString('tr-TR');
  
  // CSV header
  const BOM = '\uFEFF'; // Byte Order Mark
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += BOM; // BOM ekle
  
  // Dashboard Metrics
  csvContent += "DASHBOARD METRİKLERİ\n";
  csvContent += "Metrik,Değer\n";
  csvContent += `Toplam Fikirler,${dashboardMetrics.totalIdeas}\n`;
  csvContent += `Tamamlanan Görevler,${dashboardMetrics.completedTasks}\n`;
  csvContent += `Toplam Görevler,${dashboardMetrics.allTasks}\n`;
  csvContent += `Geciken Görevler,${deadlineAnalysis.totalOverdue}\n`;
  csvContent += `Yaklaşan Deadline'lar,${deadlineAnalysis.totalDueSoon}\n`;
  csvContent += `Bu Ay Eklenen Fikirler,${dashboardMetrics.thisMonthIdeas}\n\n`;
  
  // Projeler
  csvContent += "PROJELER\n";
  csvContent += "Başlık,Açıklama,Kategori,Durum,Öncelik,Etiketler,Oluşturma Tarihi,Güncelleme Tarihi\n";
  
  ideas.forEach(idea => {
    const tags = idea.tags ? idea.tags.join(';') : '';
    csvContent += `"${idea.title}","${idea.description}","${idea.category}","${idea.status}","${idea.priority}","${tags}","${idea.createdAt}","${idea.updatedAt}"\n`;
  });
  
  csvContent += "\n";
  
  // Görevler  
  csvContent += "GÖREVLER\n";
  csvContent += "Proje,Görev,Açıklama,Durum,Öncelik,Atanan Kişi,Son Tarih\n";
  
  ideas.forEach(idea => {
    if (idea.tasks) {
      idea.tasks.forEach(task => {
        csvContent += `"${idea.title}","${task.title}","${task.description}","${task.status}","${task.priority}","${task.assignedTo}","${task.dueDate || ''}"\n`;
      });
    }
  });
  
  // Geciken görevler
  if (deadlineAnalysis.totalOverdue > 0) {
    csvContent += "\nGECİKEN GÖREVLER\n";
    csvContent += "Görev,Proje,Son Tarih,Durum\n";
    deadlineAnalysis.overdueTasks.forEach(task => {
      csvContent += `"${task.title}","${task.ideaTitle}","${task.dueDate}","${task.status}"\n`;
    });
  }
  
  // Download CSV
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `idetree-rapor-${today.replace(/\./g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('CSV dosyası indirildi!');
};
// User Profile Modal Functions
const openUserModal = (userId) => {
  const user = usersData[userId];
  console.log('openUserModal çağrıldı. userId:', userId, 'user:', user);
  if (user) {
    setSelectedUser(user);
    setIsUserModalOpen(true);
    console.log('State güncellendi. Modal açık olmalı.');
  }
};

const closeUserModal = () => {
  setSelectedUser(null);
  setIsUserModalOpen(false);
};

const handleTeamOverview = () => {
  console.log('Takım genel bakış açıldı');
  alert('Takım Genel Bakış\n\nToplam: 3 üye\nMüsait: 2\nMeşgul: 1\n\nDetaylı takım analizi için yakında!');
};

const handleQuickTaskAssign = () => {
  console.log('Hızlı görev atama açıldı');
  alert('Hızlı Görev Atama\n\nEn müsait ekip üyesi: Mehmet Sert (İş yükü: %25)\n\nDetaylı görev atama sistemi yakında!');
};

// User Modal Actions - handleQuickTaskAssign fonksiyonundan sonra ekleyin
const handleSendMessage = (user) => {
  console.log('Mesaj gönderiliyor:', user.name);
  alert(`${user.name} ile mesajlaşma başlatıldı!\n\n💬 Mesaj: "Merhaba ${user.name.split(' ')[0]}, projen hakkında konuşabilir miyiz?"\n\n📧 ${user.email} adresine bildirim gönderildi.`);
};

const handleAssignTaskToUser = (user) => {
  console.log('Görev atanıyor:', user.name);
  alert(`${user.name} için yeni görev oluşturuluyor!\n\n📋 Kullanılabilir kapasite: ${((user.workloadCapacity || 8) - user.activeTasks)} görev\n⚡ Önerilen öncelik: ${user.activeTasks > 4 ? 'Düşük' : 'Orta'}\n\nDetaylı görev atama formu yakında!`);
};

// Task Assignment Functions - handleAssignTaskToUser fonksiyonundan sonra ekleyin
const openTaskAssignmentModal = () => {
  console.log('Task Assignment Modal açılıyor');
  setIsTaskAssignmentModalOpen(true);
};

const closeTaskAssignmentModal = () => {
  setIsTaskAssignmentModalOpen(false);
  setSelectedTaskForAssignment(null);
  setDraggedTask(null);
};

const handleTaskDragStart = (e, task) => {
  setDraggedTask(task);
  e.dataTransfer.effectAllowed = 'move';
};

const handleTaskDragEnd = () => {
  setDraggedTask(null);
};

const handleUserDropZone = (e, userId) => {
  e.preventDefault();
  if (draggedTask) {
    console.log('Görev atanıyor:', draggedTask.title, 'kullanıcıya:', userId);
    // Burada görev atama mantığı işlenecek
    alert(`"${draggedTask.title}" görevi ${usersData[userId].name} kullanıcısına atandı!`);
    setDraggedTask(null);
  }
};
  const toggleIdea = (ideaId) => {
    setExpandedIdeas(prev => ({
      ...prev,
      [ideaId]: !prev[ideaId]
    }));
  };

  const openTaskModal = (task) => {
    console.log('🚪 Modal açılıyor, task:', task);
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Görev güncelleme fonksiyonu
  const updateTask = useCallback((taskId, updatedTask) => {
    console.log('🔧 updateTask çağrıldı:', { taskId, updatedTask });
    
    setIdeas(prev => {
      const newIdeas = prev.map(idea => ({
        ...idea,
        tasks: idea.tasks.map(task => {
          if (task.id === taskId) {
            console.log('✅ Görev bulundu ve güncelleniyor:', task.id);
            return { ...task, ...updatedTask };
          }
          return task;
        })
      }));
      console.log('🔄 Yeni ideas state:', newIdeas);
      return newIdeas;
    });
    
    // Seçili task'ı da güncelle
    if (selectedTask && selectedTask.id === taskId) {
      console.log('🎯 selectedTask güncelleniyor');
      setSelectedTask(prev => {
        const updated = { ...prev, ...updatedTask };
        console.log('📝 Yeni selectedTask:', updated);
        return updated;
      });
    }
  }, [selectedTask]);

  const openNewTaskModal = (ideaId) => {
    setSelectedIdeaForTask(ideaId);
    setIsNewTaskModalOpen(true);
  };

  const addNewIdea = (ideaData) => {
    const newIdea = {
      id: Date.now(),
      ...ideaData,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      tasks: [],
      progress: 0
    };
    setIdeas(prev => [...prev, newIdea]);
    setIsNewIdeaModalOpen(false);
  };

  const addNewTask = (taskData) => {
    setIdeas(prev => prev.map(idea => {
      if (idea.id === selectedIdeaForTask) {
        const newTask = {
          id: Date.now(),
          ...taskData,
          comments: [],
          checklist: []
        };
        return {
          ...idea,
          tasks: [...idea.tasks, newTask]
        };
      }
      return idea;
    }));
    setIsNewTaskModalOpen(false);
    setSelectedIdeaForTask(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>
        {`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .slide-in {
          animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .bounce-in {
          animation: bounceIn 0.6s ease-out;
        }

        @keyframes bounceIn {
          0% { transform: scale(0.3) rotate(-45deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(10deg); }
          70% { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .modal-content {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
          border-radius: 20px;
          padding: 0;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow: hidden;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .modal-header {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 20px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-body {
          padding: 30px;
          max-height: calc(80vh - 140px);
          overflow-y: auto;
        }

        .idea-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateY(0);
        }

        .idea-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .idea-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .idea-card:hover::before {
          left: 100%;
        }

        .task-item {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 14px 18px;
          margin: 8px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .task-item:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08));
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateX(4px);
        }

        .task-item::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 100%;
          background: var(--accent-gradient);
          transform: scaleY(0);
          transition: transform 0.2s ease;
        }

        .task-item:hover::after {
          transform: scaleY(1);
        }

        .header-button {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 20px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .header-button:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .header-button:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .priority-high { color: #ff6b6b; }
        .priority-medium { color: #ffd93d; }
        .priority-low { color: #6bcf7f; }

        .status-completed { color: #6bcf7f; }
        .status-in-progress { color: #4ecdc4; }
        .status-pending { color: #ffd93d; }
        .status-planning { color: #a8a8a8; }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #667eea;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: #f8f9fa;
          color: #333;
          border: 2px solid #e1e5e9;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background: #e9ecef;
        }
                /* Drag & Drop CSS Stilleri - CSS'inizin SONUNA ekleyin */

        /* Drag over effect */
        .idea-card.drag-over {
        border-top: 3px solid #10b981;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }

        /* Draggable cursor */
        .idea-card[draggable="true"] {
        cursor: move;
        }

        /* Drag handle (sol tarafta 6 nokta için) */
        .drag-handle {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        background: 
            radial-gradient(circle, #94a3b8 2px, transparent 2px),
            radial-gradient(circle, #94a3b8 2px, transparent 2px);
        background-size: 6px 6px;
        background-position: 0 0, 0 6px, 6px 0, 6px 6px;
        opacity: 0;
        transition: opacity 0.2s;
        cursor: grab;
        }

        .idea-card:hover .drag-handle {
        opacity: 0.7;
        }

        .drag-handle:active {
        cursor: grabbing;
        }

        /* Smooth transitions */
        .idea-card {
        transition: all 0.2s ease;
        position: relative;
        padding-left: 35px; /* Drag handle için yer açalım */
        }  

        /* Skeleton Loading Effects */
        .skeleton-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          animation: skeleton-loading 1.5s infinite ease-in-out;
        }

        @keyframes skeleton-loading {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }

        .skeleton-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .skeleton-title {
          width: 70%;
          height: 24px;
          background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
          background-size: 200% 100%;
          border-radius: 6px;
          animation: shimmer 2s infinite;
        }

        .skeleton-badge {
          width: 80px;
          height: 20px;
          background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
          background-size: 200% 100%;
          border-radius: 10px;
          animation: shimmer 2s infinite;
        }

        .skeleton-description {
          width: 100%;
          height: 16px;
          background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          margin-bottom: 12px;
          animation: shimmer 2s infinite;
        }

        .skeleton-description.short {
          width: 60%;
        }

        .skeleton-footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
        }

        .skeleton-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
          background-size: 200% 100%;
          border-radius: 50%;
          animation: shimmer 2s infinite;
        }

        .skeleton-progress {
          flex: 1;
          height: 6px;
          background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
          background-size: 200% 100%;
          border-radius: 3px;
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

                /* Micro-interactions - Hover Effects */
        .idea-card:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        border-color: rgba(59, 130, 246, 0.3);
        }

        /* Button hover animations */
        .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
        }

        .btn-secondary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        /* Search input focus effect */
        .search-input:focus {
        transform: scale(1.02);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Filter button hover */
        .filter-btn:hover {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        transform: translateY(-1px);
        }

        /* Icon hover animations */
        .idea-card .lucide:hover {
        transform: scale(1.1);
        color: #3b82f6;
        }

        /* Smooth transitions for all interactive elements */
        .idea-card, .btn-primary, .btn-secondary, .search-input, .filter-btn, .lucide {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

                /* Enhanced Drag & Drop Visuals */

        /* Drag handle her zaman görünür olsun */
        .drag-handle {
        position: absolute;
        left: 12px;
        top: 20px;
        width: 16px;
        height: 40px;
        background-image: 
            radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px),
            radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px),
            radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px);
        background-size: 8px 8px;
        background-position: 0 0, 0 8px, 0 16px;
        opacity: 0.4;
        transition: all 0.2s ease;
        cursor: grab;
        border-radius: 3px;
        }

        .idea-card:hover .drag-handle {
        opacity: 0.8;
        background-color: rgba(59, 130, 246, 0.1);
        }

        .drag-handle:active {
        cursor: grabbing;
        opacity: 1;
        }

        /* Drag sırasında kart efekti */
        .idea-card[draggable="true"]:active {
        transform: rotate(3deg) scale(0.95);
        opacity: 0.7;
        z-index: 1000;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        }

        /* Drop indicator güçlendirme */
        .idea-card.drag-over {
        border-top: 4px solid #10b981;
        transform: translateY(-3px);
        box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%);
        }

        /* Pulse animasyonu drop sırasında */
        @keyframes dragPulse {
        0% { box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4); }
        50% { box-shadow: 0 16px 40px rgba(16, 185, 129, 0.6); }
        100% { box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4); }
        }

        .idea-card.drag-over {
        animation: dragPulse 1s infinite ease-in-out;
        }

        /* Drag handle'a gerçekçi görünüm */
        .drag-handle::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.3) 100%);
        border-radius: 3px;
        }

        /* Dashboard Metrics CSS */
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.metric-card.primary { border-left: 4px solid #3b82f6; }
.metric-card.success { border-left: 4px solid #10b981; }
.metric-card.warning { border-left: 4px solid #f59e0b; }
.metric-card.info { border-left: 4px solid #8b5cf6; }

.metric-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  display: block;
}

.metric-content h3 {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 10px 0;
  line-height: 1;
}

.metric-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  margin-top: 5px;
}

/* Circular Progress */
.metric-progress {
  position: absolute;
  top: 20px;
  right: 20px;
}

.circular-progress {
  position: relative;
  width: 60px;
  height: 60px;
}

.circular-progress svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circular-progress circle {
  transition: stroke-dasharray 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .metric-card {
    text-align: center;
  }
  
  .metric-progress {
    position: static;
    margin-top: 15px;
    display: flex;
    justify-content: center;
  }
}
/* Print-Friendly Styles */
@media print {
  body {
    background: white !important;
    color: black !important;
  }
  
  .app {
    background: white !important;
  }
  
  /* Header'ı gizle */
  .header, header {
    display: none !important;
  }
  
  /* Dashboard kartlarını print için optimize et */
  .metric-card {
    background: white !important;
    border: 1px solid #ccc !important;
    color: black !important;
    break-inside: avoid;
  }
  
  /* Fikir kartları */
  .idea-card {
    background: white !important;
    border: 1px solid #ccc !important;
    color: black !important;
    break-inside: avoid;
    margin-bottom: 20px;
  }
  
  /* Charts bölümü */
  .charts-section {
    background: white !important;
    color: black !important;
  }
}                
        `}
      </style>

    {/* Dashboard Metrics - BURAYA EKLEYİN */}
      {!isLoading && (
        <div className="dashboard">
          <div className="dashboard-grid">
            {/* Toplam Fikirler */}
            <div className="metric-card primary">
              <div className="metric-icon">💡</div>
              <div className="metric-content">
                <h3>Toplam Fikirler</h3>
                <div className="metric-value">{dashboardMetrics.totalIdeas}</div>
                <div className="metric-subtitle">Aktif projeler</div>
              </div>
              <div className="metric-progress">
                <div className="circular-progress">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none"/>
                    <circle 
                      cx="50" cy="50" r="45" 
                      stroke="#3b82f6" 
                      strokeWidth="8" 
                      fill="none"
                      strokeDasharray={`${dashboardMetrics.avgProgress * 2.83} 283`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <span className="progress-text">{dashboardMetrics.avgProgress}%</span>
                </div>
              </div>
            </div>

            {/* Tamamlanan Görevler */}
            <div className="metric-card success">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <h3>Tamamlanan Görevler</h3>
                <div className="metric-value">
                  {dashboardMetrics.completedTasks}/{dashboardMetrics.allTasks}
                </div>
                <div className="metric-subtitle">
                  %{Math.round((dashboardMetrics.completedTasks / dashboardMetrics.allTasks) * 100)} tamamlandı
                </div>
              </div>
            </div>

            {/* Bu Ay Eklenen */}
            <div className="metric-card warning">
              <div className="metric-icon">📅</div>
              <div className="metric-content">
                <h3>Bu Ay Eklenen</h3>
                <div className="metric-value">{dashboardMetrics.thisMonthIdeas}</div>
                <div className="metric-subtitle">Yeni fikirler</div>
              </div>
            </div>

            {/* Aktif Projeler */}
            <div className="metric-card info">
              <div className="metric-icon">🚀</div>
              <div className="metric-content">
                <h3>Aktif Projeler</h3>
                <div className="metric-value">{dashboardMetrics.inProgressIdeas}</div>
                <div className="metric-subtitle">Devam ediyor</div>
              </div>
            </div>
          </div>
          <div style={{marginTop: '30px', color: 'white'}}>
            <h2 style={{textAlign: 'center', marginBottom: '20px'}}>📊 İstatistikler</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px'}}>
              <div style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px'}}>
                <h3>Kategori Dağılımı</h3>
                <p>Teknoloji: {dashboardMetrics.categoryStats.Teknoloji || 0}</p>
                <p>Tasarım: {dashboardMetrics.categoryStats.Tasarım || 0}</p>
              </div>
              <div style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px'}}>
                <h3>Aylık Trend</h3>
                <p>Bu ay: {dashboardMetrics.thisMonthIdeas} yeni fikir</p>
                <p>Toplam: {dashboardMetrics.totalIdeas} fikir</p>
              </div>
              <div style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', color: 'white'}}>
                <h3>Deadline Durumu</h3>
                <div style={{marginBottom: '15px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                    <span style={{fontSize: '14px'}}>Geciken Görevler</span>
                    <span style={{
                      background: deadlineAnalysis.totalOverdue > 0 ? '#ef4444' : '#10b981',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {deadlineAnalysis.totalOverdue}
                    </span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                    <span style={{fontSize: '14px'}}>Bu Hafta Bitenler</span>
                    <span style={{
                      background: deadlineAnalysis.totalDueSoon > 0 ? '#f59e0b' : '#6b7280',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {deadlineAnalysis.totalDueSoon}
                    </span>
                  </div>
                </div>
                
                {/* Acil Görevler Listesi */}
                {deadlineAnalysis.totalOverdue > 0 && (
                  <div style={{marginTop: '15px'}}>
                    <h4 style={{fontSize: '12px', color: '#ef4444', marginBottom: '8px', textTransform: 'uppercase'}}>
                      🚨 Acil Görevler
                    </h4>
                    {deadlineAnalysis.overdueTasks.slice(0, 2).map((task, i) => (
                      <div key={i} style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        padding: '8px',
                        marginBottom: '6px',
                        fontSize: '12px'
                      }}>
                        <div style={{fontWeight: 'bold'}}>{task.title}</div>
                        <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '11px'}}>
                          {task.ideaTitle}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Yaklaşan Deadline'lar */}
                {deadlineAnalysis.totalDueSoon > 0 && (
                  <div style={{marginTop: '15px'}}>
                    <h4 style={{fontSize: '12px', color: '#f59e0b', marginBottom: '8px', textTransform: 'uppercase'}}>
                      ⏰ Bu Hafta
                    </h4>
                    {deadlineAnalysis.dueSoonTasks.slice(0, 2).map((task, i) => (
                      <div key={i} style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '6px',
                        padding: '8px',
                        marginBottom: '6px',
                        fontSize: '12px'
                      }}>
                        <div style={{fontWeight: 'bold'}}>{task.title}</div>
                        <div style={{color: 'rgba(255,255,255,0.7)', fontSize: '11px'}}>
                          {task.ideaTitle} - {task.dueDate}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div> 
        )}
        {/* Team Management Dashboard */}
        {!isLoading && (
          <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 30px 30px 30px'}}>
            <h2 style={{textAlign: 'center', marginBottom: '20px', color: 'white'}}>👥 Takım Yönetimi</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px'}}>
              
              {/* Team Overview Card */}
              <div style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'}}>
                <h3 style={{color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Users size={20} />
                  Takım Durumu
                </h3>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981'}}>
                      {Object.values(usersData).filter(u => u.status === 'available').length}
                    </div>
                    <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.7)'}}>Müsait</div>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: '#ef4444'}}>
                      {Object.values(usersData).filter(u => u.status === 'busy').length}
                    </div>
                    <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.7)'}}>Meşgul</div>
                  </div>
                </div>
                
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  <button
                   onClick={handleTeamOverview}
                   style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '8px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <User size={14} />
                    Tüm Takım
                  </button>
                  <button 
                  onClick={openTaskAssignmentModal}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    padding: '8px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Plus size={14} />
                    Görev Ata
                  </button>
                </div>
              </div>

              {/* Workload Distribution Card */}
              <div style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'}}>
                <h3 style={{color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Activity size={20} />
                  İş Yükü Dağılımı
                </h3>
                {Object.values(usersData).map((user, idx) => (
                  <div key={idx} style={{marginBottom: '12px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                      <span style={{color: 'white', fontSize: '13px'}}>{user.name}</span>
                      <span style={{color: 'rgba(255,255,255,0.8)', fontSize: '12px'}}>
                        {user.activeTasks}/{user.workloadCapacity || 8}
                      </span>
                    </div>
                    <div style={{
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      height: '6px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        background: user.activeTasks > 6 ? '#ef4444' : user.activeTasks > 3 ? '#f59e0b' : '#10b981',
                        width: `${(user.activeTasks / (user.workloadCapacity || 8)) * 100}%`,
                        height: '100%',
                        borderRadius: '6px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Performance Overview Card */}
              <div style={{background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'}}>
                <h3 style={{color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Award size={20} />
                  Performans Özeti
                </h3>
                {Object.values(usersData).map((user, idx) => (
                  <div key={idx} style={{
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '10px',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px'
                  }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                      <span style={{fontSize: '20px'}}>{user.avatar}</span>
                      <span style={{color: 'white', fontSize: '13px'}}>{user.name.split(' ')[0]}</span>
                    </div>
                    <div style={{
                      color: user.performance >= 90 ? '#10b981' : 
                             user.performance >= 80 ? '#3b82f6' :
                             user.performance >= 70 ? '#f59e0b' : '#ef4444',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>
                      %{user.performance || 85}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px 30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div className="app-title">
                <div style={{ 
                  display: 'inline-block',
                  marginRight: '15px',
                  width: '40px',
                  height: '40px',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg fill='%23667eea'%3E%3Ccircle cx='50' cy='15' r='6'/%3E%3Cpath d='M50 25v50M35 40l15-5 15 5M30 50l20-5 20 5M25 60l25-5 25 5M40 70l10-5 10 5'/%3E%3Cpath d='M50 75v10'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  verticalAlign: 'middle'
                }} />
                idetree
              </div>
              <p className="app-subtitle">
                Fikirlerinizi organize edin, projelerinizi hayata geçirin
              </p>
            </div>
            
            <div style={{ position: 'relative', width: '250px'}}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }} />
              <input
                type="text"
                className="search-input"
                placeholder="Fikirlerinizde arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '12px 12px 12px 44px',
                  color: '#ffffff',
                  fontSize: '14px',
                  width: '100%',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1))';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              className="header-button pulse-animation" 
              onClick={handleButtonClick(() => setIsNewIdeaModalOpen(true))}
            >
              <Plus size={20} />
              Yeni Fikir
            </button>
            
            <button className="header-button">
              <Users size={20} />
              Takım
            </button>
            <button 
              className="header-button"
              onClick={() => generatePDFReport()}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              Rapor İndir
            </button>
            <button 
              className="header-button"
              onClick={() => exportToCSV()}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <rect x="8" y="13" width="8" height="1"/>
                <rect x="8" y="17" width="8" height="1"/>
              </svg>
              CSV İndir
            </button>
            
            {/* Filtreleme butonları */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}></div>
            
            {/* Filtreleme butonları */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Filtrele:</span>
              
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '6px 8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <option value="all" style={{background: '#333', color: 'white'}}>Tüm Durumlar</option>
                <option value="Devam Ediyor" style={{background: '#333', color: 'white'}}>Devam Ediyor</option>
                <option value="Planlanan" style={{background: '#333', color: 'white'}}>Planlanan</option>
                <option value="Tamamlandı" style={{background: '#333', color: 'white'}}>Tamamlandı</option>
              </select>
              
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '6px 8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <option value="all" style={{background: '#333', color: 'white'}}>Tüm Öncelikler</option>
                <option value="Yüksek" style={{background: '#333', color: 'white'}}>Yüksek</option>
                <option value="Orta" style={{background: '#333', color: 'white'}}>Orta</option>
                <option value="Düşük" style={{background: '#333', color: 'white'}}>Düşük</option>
              </select>
              
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '6px 8px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <option value="all" style={{background: '#333', color: 'white'}}>Tüm Kategoriler</option>
                <option value="Teknoloji" style={{background: '#333', color: 'white'}}>Teknoloji</option>
                <option value="Tasarım" style={{background: '#333', color: 'white'}}>Tasarım</option>
                <option value="Pazarlama" style={{background: '#333', color: 'white'}}>Pazarlama</option>
                <option value="Operasyon" style={{background: '#333', color: 'white'}}>Operasyon</option>
                <option value="Strateji" style={{background: '#333', color: 'white'}}>Strateji</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px' }}>
        {/* Sonuç bilgisi */}
        <div style={{ 
          color: 'rgba(255,255,255,0.8)', 
          marginBottom: '20px', 
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            {filteredIdeas.length} fikir bulundu
            {searchTerm && ` "${searchTerm}" için`}
            {statusFilter !== 'all' && ` • ${statusFilter}`}
            {priorityFilter !== 'all' && ` • ${priorityFilter} öncelik`}
            {categoryFilter !== 'all' && ` • ${categoryFilter}`}
          </span>
          
          {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('all');
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'rgba(255,255,255,0.8)',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              Filtreleri Temizle ×
            </button>
          )}
        </div>

{/* Loading durumu */}
{isLoading ? (
  // Skeleton kartları göster
  [1, 2, 3, 4, 5].map((skeletonId) => (
    <div key={`skeleton-${skeletonId}`} className="idea-card skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-title"></div>
        <div className="skeleton-badge"></div>
      </div>
      <div className="skeleton-description"></div>
      <div className="skeleton-description short"></div>
      <div className="skeleton-footer">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-avatar"></div>
        <div className="skeleton-progress"></div>
      </div>
    </div>
  ))
) : filteredIdeas.length === 0 ? (
  <div className="no-results">
    <Search className="no-results-icon" />
    <p>Aradığınız kriterlere uygun fikir bulunamadı.</p>
    <button className="btn-primary" onClick={clearFilters}>
      Filtreleri Temizle
    </button>
  </div>
) : (
              filteredIdeas.map((idea, index) => (
          <div 
            key={idea.id} 
            className={`idea-card fade-in ${dragOverIndex === index ? 'drag-over' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, idea, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', gap: '20px'  }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <button 
                    onClick={() => toggleIdea(idea.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    className="bounce-in"
                  >
                    {expandedIdeas[idea.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  <h3 style={{ color: '#ffffff', fontSize: '20px', margin: '0 0 0 8px' }}>{idea.title}</h3>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '12px', lineHeight: '1.5' }}>
                  {idea.description}
                </p>
                
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    📁 {idea.category}
                  </span>
                  
                  <span className={`status-${idea.status.toLowerCase().replace(' ', '-')}`} style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    🔄 {idea.status}
                  </span>
                  
                  <span className={`priority-${idea.priority.toLowerCase()}`} style={{
                    background: 'rgba(255,255,255,0.1)',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    ⚡ {idea.priority}
                  </span>
                  
                  <span style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    📊 %{idea.progress}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {idea.assignedTo.map((person, idx) => (
                <div key={idx} 
                    onClick={() => {
                      const userId = person === 'Ahmet Y.' ? 'ahmet-y' : 
                                    person === 'Zeynep K.' ? 'zeynep-k' : 
                                    person === 'Mehmet S.' ? 'mehmet-s' : null;
                      if (userId) openUserModal(userId);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '20px',
                      padding: '6px 12px',
                      color: '#ffffff',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                  >
                    <User size={14} />
                    {person}
                  </div>
                                ))}
              </div>
            </div>

            {expandedIdeas[idea.id] && (
              <div className="fade-in" style={{ marginTop: '20px' }}>
                <h4 style={{ color: '#64b5f6', marginBottom: '12px', fontSize: '16px' }}>📋 Görevler ({idea.tasks.length})</h4>
                {idea.tasks.map((task, index) => (
                  <div key={task.id} className={`task-item slide-in`} style={{animationDelay: `${index * 50}ms`}} onClick={() => openTaskModal(task)}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#ffffff', marginBottom: '4px' }}>{task.title}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span className={`status-${task.status.toLowerCase().replace(' ', '-')}`}>🔄 {task.status}</span>
                        <span className={`priority-${task.priority.toLowerCase()}`}>⚡ {task.priority}</span>
                        <span><User size={12} style={{ display: 'inline', marginRight: '4px' }} />{task.assignedTo}</span>
                        <span><Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />{task.dueDate}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
                  </div>
                ))}
                
                <button 
                  onClick={() => openNewTaskModal(idea.id)}
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    border: '2px dashed rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '12px',
                    color: 'rgba(255,255,255,0.8)',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    marginTop: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1))';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                >
                  <Plus size={16} />
                  Yeni Görev Ekle
                </button>
              </div>
            )}
          </div>
        ))
        )}
      </div>

      {/* Yeni Fikir Modal */}
      {isNewIdeaModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>🔥 Yeni Fikir Ekle</h2>
              <button 
                onClick={() => setIsNewIdeaModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px' }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <NewIdeaForm onSubmit={addNewIdea} onCancel={() => setIsNewIdeaModalOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Yeni Görev Modal */}
      {isNewTaskModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>✅ Yeni Görev Ekle</h2>
              <button 
                onClick={() => setIsNewTaskModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px' }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <NewTaskForm onSubmit={addNewTask} onCancel={() => setIsNewTaskModalOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Görev Detay Modal */}
      {isTaskModalOpen && selectedTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div className="modal-content" style={{ maxWidth: '700px', width: '95%' }}>
            <div className="modal-header">
              <h2>📋 {selectedTask.title}</h2>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px' }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <TaskDetailModal 
                task={selectedTask} 
                onClose={() => setIsTaskModalOpen(false)}
                onUpdateTask={updateTask}
              />
            </div>
          </div>
        </div>
      )}
            {/* User Profile Modal - Doğru Konum */}
      {isUserModalOpen && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            color: 'white',
            position: 'relative'
          }}>
            <button
              onClick={closeUserModal}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>
                {selectedUser.avatar}
              </div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>
                {selectedUser.name}
              </h2>
              <p style={{ margin: '0', opacity: 0.8, fontSize: '16px' }}>
                {selectedUser.role}
              </p>
              <p style={{ margin: '8px 0 0 0', opacity: 0.7, fontSize: '14px' }}>
                {selectedUser.email}
              </p>
            </div>

            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <span style={{
                background: selectedUser.status === 'available' ? '#10b981' : 
                          selectedUser.status === 'busy' ? '#ef4444' : '#f59e0b',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {selectedUser.status === 'available' ? 'Müsait' : 
                 selectedUser.status === 'busy' ? 'Meşgul' : 'Uzakta'}
              </span>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {selectedUser.completedTasks}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Tamamlanan
                </div>
              </div>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {selectedUser.activeTasks}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  Aktif Görevler
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Yetenekler</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedUser.skills.map((skill, index) => (
                  <span key={index} style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            {/* Recent Activity Section - Yetenekler bölümünden sonra ekleyin */}
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Son Aktiviteler</h4>
              <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                {selectedUser.recentActivity ? selectedUser.recentActivity.map((activity, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '6px',
                    fontSize: '12px'
                  }}>
                    <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                      {activity.type === 'task_completed' ? '✅ Görev tamamlandı' :
                       activity.type === 'comment_added' ? '💬 Yorum eklendi' :
                       activity.type === 'task_started' ? '🚀 Görev başlatıldı' : '📝 Aktivite'}
                    </div>
                    <div style={{ opacity: 0.8 }}>{activity.title}</div>
                    <div style={{ opacity: 0.6, fontSize: '10px' }}>{activity.date}</div>
                  </div>
                )) : (
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', fontStyle: 'italic' }}>
                    Henüz aktivite bulunmuyor
                  </p>
                )}
              </div>
            </div>

            {/* Assigned Projects Section */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Atanmış Projeler</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedUser.assignedProjects ? selectedUser.assignedProjects.map((project, index) => (
                  <span key={index} style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#93c5fd'
                  }}>
                    📁 {project}
                  </span>
                )) : (
                  <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', fontStyle: 'italic' }}>
                    Henüz proje atanmamış
                  </span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ 
              marginTop: '24px', 
              display: 'flex', 
              gap: '8px', 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
              paddingTop: '20px' 
            }}>
              <button 
              onClick={() => handleSendMessage(selectedUser)}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                color: '#93c5fd',
                padding: '8px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                📧 Mesaj Gönder
              </button>
              <button 
              onClick={() => handleAssignTaskToUser(selectedUser)}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                color: '#6ee7b7',
                padding: '8px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ➕ Görev Ata
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Task Assignment Modal - User Profile Modal'dan sonra ekleyin */}
      {isTaskAssignmentModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '1000px',
            height: '80vh',
            color: 'white',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '24px 32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px' }}>🎯 Akıllı Görev Atama</h2>
              <button
                onClick={closeTaskAssignmentModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{
              flex: 1,
              padding: '24px 32px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              overflow: 'hidden'
            }}>
              
              {/* Sol Panel - Mevcut Görevler */}
              <div>
                <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>📋 Atanabilir Görevler</h3>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  height: '100%',
                  overflowY: 'auto'
                }}>
                  {ideas.map(idea => 
                    idea.tasks.map(task => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleTaskDragStart(e, task)}
                        onDragEnd={handleTaskDragEnd}
                        style={{
                          background: draggedTask?.id === task.id ? 
                            'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '8px',
                          cursor: 'grab',
                          border: '2px dashed rgba(255, 255, 255, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (draggedTask?.id !== task.id) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (draggedTask?.id !== task.id) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                          }
                        }}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                          {task.title}
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          {idea.title} • {task.priority} • {task.dueDate}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sağ Panel - Takım Üyeleri */}
              <div>
                <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>👥 Takım Üyeleri</h3>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  height: '100%',
                  overflowY: 'auto'
                }}>
                  {Object.values(usersData).map(user => (
                    <div
                      key={user.id}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onDrop={(e) => handleUserDropZone(e, user.id)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '2px dashed rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '32px', marginRight: '12px' }}>
                          {user.avatar}
                        </span>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            {user.role}
                          </div>
                        </div>
                      </div>
                      
                      {/* Workload Bar */}
                      <div style={{ marginBottom: '8px' }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          fontSize: '11px', 
                          marginBottom: '4px' 
                        }}>
                          <span>İş Yükü</span>
                          <span>{user.activeTasks}/{user.workloadCapacity || 8}</span>
                        </div>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          height: '6px'
                        }}>
                          <div style={{
                            background: user.activeTasks > 6 ? '#ef4444' : 
                                     user.activeTasks > 3 ? '#f59e0b' : '#10b981',
                            width: `${(user.activeTasks / (user.workloadCapacity || 8)) * 100}%`,
                            height: '100%',
                            borderRadius: '6px'
                          }} />
                        </div>
                      </div>

                      {/* Skills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {user.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '10px'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Görev Detay Modal Komponenti
function TaskDetailModal({ task, onClose, onUpdateTask }) {
  const [activeTab, setActiveTab] = useState('details');
  const [newComment, setNewComment] = useState('');
  const [newChecklistItem, setNewChecklistItem] = useState('');

  console.log('🎯 TaskDetailModal render - onUpdateTask:', typeof onUpdateTask);

  // useCallback ile stable reference oluştur
  const handleAddChecklistItem = useCallback(() => {
    console.log('🔥 CHECKLIST EKLEME!');
    if (newChecklistItem.trim() && onUpdateTask) {
      const newItem = {
        id: Date.now(),
        text: newChecklistItem.trim(),
        completed: false
      };
      const currentChecklist = task.checklist || [];
      const updatedChecklist = [...currentChecklist, newItem];
      
      console.log('✅ Yeni checklist:', updatedChecklist);
      onUpdateTask(task.id, { checklist: updatedChecklist });
      setNewChecklistItem('');
    }
  }, [newChecklistItem, task, onUpdateTask]);

  const handleToggleChecklistItem = useCallback((itemId) => {
    console.log('☑️ TOGGLE:', itemId);
    if (onUpdateTask) {
      const currentChecklist = task.checklist || [];
      const updatedChecklist = currentChecklist.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      );
      onUpdateTask(task.id, { checklist: updatedChecklist });
    }
  }, [task, onUpdateTask]);

  // Yorum ekleme
  const addComment = () => {
    if (newComment.trim() && onUpdateTask) {
      const comment = {
        id: Date.now(),
        author: "Mevcut Kullanıcı",
        text: newComment.trim(),
        date: new Date().toISOString().split('T')[0]
      };
      const currentComments = task.comments || [];
      const updatedComments = [...currentComments, comment];
      onUpdateTask(task.id, { comments: updatedComments });
      setNewComment('');
    }
  };

  const tabStyle = (isActive) => ({
    padding: '10px 20px',
    border: 'none',
    background: isActive ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
    color: isActive ? 'white' : '#666',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: isActive ? '600' : '400'
  });

  return (
    <div>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <button
          style={tabStyle(activeTab === 'details')}
          onClick={() => setActiveTab('details')}
        >
          📋 Detaylar
        </button>
        <button
          style={tabStyle(activeTab === 'checklist')}
          onClick={() => setActiveTab('checklist')}
        >
          ✅ Checklist ({task.checklist?.length || 0})
        </button>
        <button
          style={tabStyle(activeTab === 'comments')}
          onClick={() => setActiveTab('comments')}
        >
          💬 Yorumlar ({task.comments?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#333', marginBottom: '15px' }}>📝 Açıklama</h4>
            <p style={{ color: '#666', lineHeight: '1.6', padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
              {task.description || 'Açıklama eklenmemiş'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4 style={{ color: '#333', marginBottom: '8px' }}>👤 Atanan</h4>
              <p style={{ color: '#666' }}>{task.assignedTo}</p>
            </div>

            <div>
              <h4 style={{ color: '#333', marginBottom: '8px' }}>📅 Son Tarih</h4>
              <p style={{ color: '#666' }}>{task.dueDate}</p>
            </div>

            <div>
              <h4 style={{ color: '#333', marginBottom: '8px' }}>🔄 Durum</h4>
              <span className={`status-${task.status.toLowerCase().replace(' ', '-')}`} style={{
                background: 'rgba(102, 126, 234, 0.1)',
                color: '#667eea',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px'
              }}>
                {task.status}
              </span>
            </div>

            <div>
              <h4 style={{ color: '#333', marginBottom: '8px' }}>⚡ Öncelik</h4>
              <span className={`priority-${task.priority.toLowerCase()}`} style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px'
              }}>
                {task.priority}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ color: '#333', margin: 0 }}>✅ Görev Listesi</h4>
            <span style={{ 
              background: '#f0f8f0', 
              color: '#4caf50', 
              padding: '4px 8px', 
              borderRadius: '12px', 
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {task.checklist?.filter(item => item.completed).length || 0} / {task.checklist?.length || 0}
            </span>
          </div>

          {/* Checklist Öğeleri */}
          {task.checklist && task.checklist.length > 0 ? (
            <div style={{ marginBottom: '20px' }}>
              {task.checklist.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  background: item.completed ? '#f0f8f0' : '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: `1px solid ${item.completed ? '#4caf50' : '#e1e5e9'}`,
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklistItem(item.id)}
                    style={{ 
                      marginRight: '12px', 
                      transform: 'scale(1.2)',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{
                    color: item.completed ? '#4caf50' : '#333',
                    textDecoration: item.completed ? 'line-through' : 'none',
                    flex: 1,
                    fontSize: '14px'
                  }}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => {
                      if (onUpdateTask) {
                        const currentChecklist = task.checklist || [];
                        const updatedChecklist = currentChecklist.filter(checkItem => checkItem.id !== item.id);
                        onUpdateTask(task.id, { checklist: updatedChecklist });
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ff6b6b',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      fontSize: '16px',
                      opacity: 0.7,
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = 1}
                    onMouseLeave={(e) => e.target.style.opacity = 0.7}
                    title="Sil"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic', marginBottom: '20px' }}>
              Henüz checklist öğesi yok. Aşağıdan yeni öğe ekleyebilirsiniz.
            </p>
          )}

          {/* Yeni Checklist Öğesi Ekleme */}
          <div style={{ 
            borderTop: '1px solid #eee', 
            paddingTop: '20px',
            background: '#fafafa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e1e5e9'
          }}>
            <h5 style={{ color: '#333', marginBottom: '12px', fontSize: '14px' }}>➕ Yeni Öğe Ekle</h5>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Yapılacak işi yazın..."
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '2px solid #e1e5e9',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={handleAddChecklistItem}
                disabled={!newChecklistItem.trim()}
                style={{
                  background: newChecklistItem.trim() ? 'linear-gradient(135deg, #4caf50, #45a049)' : '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: newChecklistItem.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                Ekle
              </button>
            </div>
            <p style={{ 
              fontSize: '12px', 
              color: '#666', 
              margin: '8px 0 0 0',
              fontStyle: 'italic'
            }}>
              💡 İpucu: Enter tuşuna basarak da ekleyebilirsiniz
            </p>
          </div>
        </div>
      )}

      {activeTab === 'comments' && (
        <div>
          <h4 style={{ color: '#333', marginBottom: '15px' }}>💬 Yorumlar</h4>
          
          {task.comments && task.comments.length > 0 ? (
            <div style={{ marginBottom: '20px' }}>
              {task.comments.map(comment => (
                <div key={comment.id} style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '15px',
                  marginBottom: '12px',
                  borderLeft: '4px solid #667eea'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ color: '#333' }}>{comment.author}</strong>
                    <span style={{ color: '#999', fontSize: '12px' }}>{comment.date}</span>
                  </div>
                  <p style={{ color: '#666', margin: 0, lineHeight: '1.5' }}>{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic', marginBottom: '20px' }}>Henüz yorum yapılmamış</p>
          )}

          {/* Yeni Yorum Formu */}
          <div style={{ 
            borderTop: '1px solid #eee', 
            paddingTop: '20px',
            background: '#fafafa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e1e5e9'
          }}>
            <h5 style={{ color: '#333', marginBottom: '12px', fontSize: '14px' }}>💬 Yeni Yorum</h5>
            <textarea
              placeholder="Yorumunuzu yazın..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                marginBottom: '12px',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              style={{
                background: newComment.trim() ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#ccc',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              <Send size={16} />
              Yorum Gönder
            </button>
          </div>
        </div>
      )}
      
    </div>
  );
}

// Yeni Fikir Form Komponenti
function NewIdeaForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Teknoloji',
    priority: 'Orta',
    assignedTo: '',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit({
        ...formData,
        assignedTo: formData.assignedTo ? formData.assignedTo.split(',').map(s => s.trim()) : [],
        tags: formData.tags ? formData.tags.split(',').map(s => s.trim()) : [],
        status: 'Planlanan'
      });
      setFormData({
        title: '',
        description: '',
        category: 'Teknoloji',
        priority: 'Orta',
        assignedTo: '',
        tags: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Fikir Başlığı *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Fikrinizin başlığını yazın..."
          required
        />
      </div>

      <div className="form-group">
        <label>Açıklama</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Fikrinizi detaylıca açıklayın..."
          rows={4}
        />
      </div>

      <div style={{ display: 'flex', gap: '15px', marginLeft: '30px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Kategori</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Teknoloji">Teknoloji</option>
            <option value="Tasarım">Tasarım</option>
            <option value="Pazarlama">Pazarlama</option>
            <option value="Operasyon">Operasyon</option>
            <option value="Strateji">Strateji</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Öncelik</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option value="Düşük">Düşük</option>
            <option value="Orta">Orta</option>
            <option value="Yüksek">Yüksek</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Atanacak Kişiler</label>
        <input
          type="text"
          value={formData.assignedTo}
          onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
          placeholder="Ahmet Y., Zeynep K. (virgülle ayırın)"
        />
      </div>

      <div className="form-group">
        <label>Etiketler</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({...formData, tags: e.target.value})}
          placeholder="mobil, react, tasarım (virgülle ayırın)"
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
        <button type="button" onClick={onCancel} className="btn-secondary">
          İptal
        </button>
        <button type="submit" className="btn-primary">
          <Plus size={16} style={{ marginRight: '8px' }} />
          Fikir Oluştur
        </button>
      </div>
    </form>
  );
}

// Yeni Görev Form Komponenti
function NewTaskForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Orta',
    assignedTo: '',
    dueDate: '',
    status: 'Beklemede'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'Orta',
        assignedTo: '',
        dueDate: '',
        status: 'Beklemede'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Görev Başlığı *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Görevin başlığını yazın..."
          required
        />
      </div>

      <div className="form-group">
        <label>Açıklama</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Görevin detaylarını açıklayın..."
          rows={3}
        />
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Öncelik</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
          >
            <option value="Düşük">Düşük</option>
            <option value="Orta">Orta</option>
            <option value="Yüksek">Yüksek</option>
          </select>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Durum</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="Beklemede">Beklemede</option>
            <option value="Devam Ediyor">Devam Ediyor</option>
            <option value="Tamamlandı">Tamamlandı</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Atanan Kişi</label>
          <input
            type="text"
            value={formData.assignedTo}
            onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
            placeholder="Ahmet Y."
          />
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Son Tarih</label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px' }}>
        <button type="button" onClick={onCancel} className="btn-secondary">
          İptal
        </button>
        <button type="submit" className="btn-primary">
          <CheckSquare size={16} style={{ marginRight: '8px' }} />
          Görev Oluştur
        </button>
      </div>
    </form>
  );
}

export default App;