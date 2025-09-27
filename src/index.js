// Woorkzi Fikir Yönetim Uygulaması - Ana Başlatıcı
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// React 18 ile uyumlu root oluşturma
const container = document.getElementById('root');
const root = createRoot(container);

// Uygulamayı render et
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Hot Module Replacement için (geliştirme ortamında)
if (module.hot) {
  module.hot.accept();
}