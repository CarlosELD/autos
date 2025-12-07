import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeLocalStorage } from './initLocalStorage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Inicializar antes de renderizar
try {
  initializeLocalStorage();
} catch (error) {
  console.error('Error inicializando localStorage:', error);
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);