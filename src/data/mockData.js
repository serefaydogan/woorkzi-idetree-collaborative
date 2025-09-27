// Woorkzi Fikir Yönetim Uygulaması - Mock Data
// Geçmiş çalışmalardan gelen yapılandırılmış test verileri

import { v4 as uuidv4 } from 'uuid';

// Ana fikirler listesi
export const mockIdeas = [
  {
    id: 'idea_001',
    title: 'Mobil Uygulama Geliştirme',
    description: 'Kullanıcı dostu, modern bir mobil uygulama geliştirmek için kapsamlı proje planı',
    category: 'tech',
    priority: 'high',
    status: 'active',
    createdAt: '2024-09-15T10:30:00Z',
    updatedAt: '2024-09-20T14:22:00Z',
    tags: ['mobil', 'react-native', 'ui/ux', 'geliştirme'],
    parentId: null,
    subIdeas: ['idea_002', 'idea_003'],
    tasks: ['task_001', 'task_002', 'task_003'],
    author: 'Woorkzi Team',
    collaborators: ['team_member_1', 'team_member_2'],
    notes: 'Bu proje üç aşamalı olarak planlandı. İlk aşama MVP geliştirme.',
    attachments: [],
    estimatedHours: 120,
    completionPercentage: 35
  },
  {
    id: 'idea_002',
    title: 'Kullanıcı Arayüzü Tasarımı',
    description: 'Modern, minimalist ve kullanıcı dostu arayüz tasarımı oluşturma',
    category: 'design',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2024-09-16T09:15:00Z',
    updatedAt: '2024-09-19T16:45:00Z',
    tags: ['ui', 'design', 'figma', 'wireframe'],
    parentId: 'idea_001',
    subIdeas: [],
    tasks: ['task_004', 'task_005'],
    author: 'Design Team',
    collaborators: ['designer_1'],
    notes: 'Figma\'da tasarımlar tamamlandı, geliştirici onayı bekleniyor.',
    attachments: ['ui_mockup.fig', 'color_palette.png'],
    estimatedHours: 40,
    completionPercentage: 80
  },
  {
    id: 'idea_003',
    title: 'Backend API Geliştirme',
    description: 'RESTful API ve veritabanı yapısının kurulması',
    category: 'tech',
    priority: 'high',
    status: 'planning',
    createdAt: '2024-09-17T11:00:00Z',
    updatedAt: '2024-09-18T13:30:00Z',
    tags: ['backend', 'api', 'database', 'nodejs'],
    parentId: 'idea_001',
    subIdeas: ['idea_004'],
    tasks: ['task_006', 'task_007'],
    author: 'Backend Team',
    collaborators: ['developer_1', 'developer_2'],
    notes: 'Veritabanı şeması tasarlanıyor. MongoDB kullanılacak.',
    attachments: ['db_schema.pdf'],
    estimatedHours: 60,
    completionPercentage: 20
  },
  {
    id: 'idea_004',
    title: 'Veritabanı Optimizasyonu',
    description: 'Performans optimizasyonu ve indexleme stratejileri',
    category: 'tech',
    priority: 'medium',
    status: 'planning',
    createdAt: '2024-09-18T14:20:00Z',
    updatedAt: '2024-09-19T10:15:00Z',
    tags: ['database', 'optimization', 'performance', 'indexing'],
    parentId: 'idea_003',
    subIdeas: [],
    tasks: ['task_008'],
    author: 'Database Specialist',
    collaborators: ['dba_1'],
    notes: 'Index stratejileri belirleniyor.',
    attachments: [],
    estimatedHours: 20,
    completionPercentage: 10
  },
  {
    id: 'idea_005',
    title: 'Pazarlama Stratejisi',
    description: 'Dijital pazarlama ve sosyal medya stratejisi geliştirme',
    category: 'marketing',
    priority: 'medium',
    status: 'active',
    createdAt: '2024-09-14T08:45:00Z',
    updatedAt: '2024-09-20T12:00:00Z',
    tags: ['pazarlama', 'sosyal-medya', 'strateji', 'dijital'],
    parentId: null,
    subIdeas: ['idea_006'],
    tasks: ['task_009', 'task_010'],
    author: 'Marketing Team',
    collaborators: ['marketer_1', 'content_creator_1'],
    notes: 'İlk kampanya planları hazırlandı.',
    attachments: ['marketing_plan.pdf'],
    estimatedHours: 80,
    completionPercentage: 50
  },
  {
    id: 'idea_006',
    title: 'İçerik Üretimi',
    description: 'Blog yazıları, video içerikler ve sosyal medya postları',
    category: 'marketing',
    priority: 'medium',
    status: 'in_progress',
    createdAt: '2024-09-15T13:30:00Z',
    updatedAt: '2024-09-20T09:20:00Z',
    tags: ['içerik', 'blog', 'video', 'sosyal-medya'],
    parentId: 'idea_005',
    subIdeas: [],
    tasks: ['task_011', 'task_012'],
    author: 'Content Team',
    collaborators: ['writer_1', 'video_editor_1'],
    notes: '5 blog yazısı ve 3 video planlandı.',
    attachments: ['content_calendar.xlsx'],
    estimatedHours: 30,
    completionPercentage: 60
  }
];

// Görevler listesi
export const mockTasks = [
  {
    id: 'task_001',
    title: 'Proje gereksinimleri analizi',
    description: 'Müşteri gereksinimlerini topla ve analiz et',
    ideaId: 'idea_001',
    status: 'completed',
    priority: 'high',
    assignedTo: 'team_member_1',
    createdAt: '2024-09-15T10:35:00Z',
    updatedAt: '2024-09-17T15:20:00Z',
    dueDate: '2024-09-20T17:00:00Z',
    completedAt: '2024-09-17T15:20:00Z',
    estimatedHours: 8,
    actualHours: 6,
    tags: ['analiz', 'gereksinimler']
  },
  {
    id: 'task_002',
    title: 'Teknik mimari tasarımı',
    description: 'Uygulama mimarisini tasarla ve dokümante et',
    ideaId: 'idea_001',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'team_member_2',
    createdAt: '2024-09-16T09:00:00Z',
    updatedAt: '2024-09-20T11:15:00Z',
    dueDate: '2024-09-25T17:00:00Z',
    completedAt: null,
    estimatedHours: 12,
    actualHours: 8,
    tags: ['mimari', 'tasarım', 'dokümantasyon']
  },
  {
    id: 'task_003',
    title: 'Geliştirme ortamı kurulumu',
    description: 'CI/CD pipeline ve geliştirme ortamlarını hazırla',
    ideaId: 'idea_001',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'team_member_1',
    createdAt: '2024-09-17T14:30:00Z',
    updatedAt: '2024-09-17T14:30:00Z',
    dueDate: '2024-09-30T17:00:00Z',
    completedAt: null,
    estimatedHours: 16,
    actualHours: 0,
    tags: ['devops', 'ci/cd', 'ortam']
  },
  {
    id: 'task_004',
    title: 'Wireframe oluşturma',
    description: 'Ana ekranlar için wireframe tasarımları',
    ideaId: 'idea_002',
    status: 'completed',
    priority: 'high',
    assignedTo: 'designer_1',
    createdAt: '2024-09-16T10:00:00Z',
    updatedAt: '2024-09-18T16:45:00Z',
    dueDate: '2024-09-22T17:00:00Z',
    completedAt: '2024-09-18T16:45:00Z',
    estimatedHours: 20,
    actualHours: 18,
    tags: ['wireframe', 'tasarım', 'ux']
  },
  {
    id: 'task_005',
    title: 'Renk paleti ve tipografi',
    description: 'Marka kimliği uyumlu renk ve font seçimi',
    ideaId: 'idea_002',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: 'designer_1',
    createdAt: '2024-09-18T11:20:00Z',
    updatedAt: '2024-09-20T14:30:00Z',
    dueDate: '2024-09-24T17:00:00Z',
    completedAt: null,
    estimatedHours: 8,
    actualHours: 5,
    tags: ['renk', 'tipografi', 'brand']
  }
];

// Kategoriler
export const categories = [
  { id: 'tech', name: 'Teknoloji', color: '#3B82F6', icon: '💻' },
  { id: 'design', name: 'Tasarım', color: '#8B5CF6', icon: '🎨' },
  { id: 'marketing', name: 'Pazarlama', color: '#EF4444', icon: '📢' },
  { id: 'business', name: 'İş Geliştirme', color: '#10B981', icon: '💼' },
  { id: 'research', name: 'Araştırma', color: '#F59E0B', icon: '🔬' },
  { id: 'other', name: 'Diğer', color: '#6B7280', icon: '📝' }
];

// Durum seçenekleri
export const statusOptions = [
  { id: 'planning', name: 'Planlama', color: '#F59E0B', icon: '📋' },
  { id: 'active', name: 'Aktif', color: '#3B82F6', icon: '🚀' },
  { id: 'in_progress', name: 'Devam Ediyor', color: '#8B5CF6', icon: '⚡' },
  { id: 'review', name: 'İnceleme', color: '#F97316', icon: '👀' },
  { id: 'completed', name: 'Tamamlandı', color: '#10B981', icon: '✅' },
  { id: 'cancelled', name: 'İptal Edildi', color: '#EF4444', icon: '❌' },
  { id: 'on_hold', name: 'Beklemede', color: '#6B7280', icon: '⏸️' }
];

// Öncelik seviyeleri
export const priorityOptions = [
  { id: 'low', name: 'Düşük', color: '#10B981', icon: '⬇️' },
  { id: 'medium', name: 'Orta', color: '#F59E0B', icon: '➡️' },
  { id: 'high', name: 'Yüksek', color: '#EF4444', icon: '⬆️' },
  { id: 'urgent', name: 'Acil', color: '#DC2626', icon: '🚨' }
];

// Yardımcı fonksiyonlar
export const getIdeaById = (id) => {
  return mockIdeas.find(idea => idea.id === id);
};

export const getSubIdeas = (parentId) => {
  return mockIdeas.filter(idea => idea.parentId === parentId);
};

export const getTasksByIdeaId = (ideaId) => {
  return mockTasks.filter(task => task.ideaId === ideaId);
};

export const getCategoryById = (id) => {
  return categories.find(cat => cat.id === id);
};

export const getStatusById = (id) => {
  return statusOptions.find(status => status.id === id);
};

export const getPriorityById = (id) => {
  return priorityOptions.find(priority => priority.id === id);
};

// Yeni fikir oluşturma template'i
export const createNewIdea = (title, description, category = 'other', parentId = null) => {
  return {
    id: uuidv4(),
    title,
    description,
    category,
    priority: 'medium',
    status: 'planning',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    parentId,
    subIdeas: [],
    tasks: [],
    author: 'Current User',
    collaborators: [],
    notes: '',
    attachments: [],
    estimatedHours: 0,
    completionPercentage: 0
  };
};

// Yeni görev oluşturma template'i
export const createNewTask = (title, description, ideaId, assignedTo = null) => {
  return {
    id: uuidv4(),
    title,
    description,
    ideaId,
    status: 'pending',
    priority: 'medium',
    assignedTo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: null,
    completedAt: null,
    estimatedHours: 0,
    actualHours: 0,
    tags: []
  };
};