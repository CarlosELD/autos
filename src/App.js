import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import GaleriaPage from './pages/GaleriaPage';
import ContactoPage from './pages/ContactoPage';
import AdminDashboard from './pages/AdminDashboard';
import ReportesPage from './pages/ReportesPage';
import PiezasPage from './pages/PiezasPage';
import './styles/unified.css';

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = () => {
      try {
        const session = JSON.parse(sessionStorage.getItem('session'));
        if (session) {
          setLoggedUser(session);
        } else {
          const rememberSession = JSON.parse(localStorage.getItem('rememberSession'));
          if (rememberSession && rememberSession.user) {
            setLoggedUser(rememberSession.user);
            sessionStorage.setItem('session', JSON.stringify(rememberSession.user));
          }
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (user, rememberMe = false) => {
    setLoggedUser(user);
    sessionStorage.setItem('session', JSON.stringify(user));
    
    if (rememberMe) {
      localStorage.setItem('rememberSession', JSON.stringify({ user }));
    }
    
    setCurrentPage('galeria');
  };

  const handleLogout = () => {
    setLoggedUser(null);
    sessionStorage.removeItem('session');
    localStorage.removeItem('rememberSession');
    setCurrentPage('home');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        if (loggedUser) {
          return (
            <GaleriaPage 
              user={loggedUser}
              onLogout={handleLogout}
              goToHome={() => navigateTo('galeria')}
              goToContacto={() => navigateTo('contacto')}
              goToReportes={() => navigateTo('reportes')}
              goToAdmin={() => navigateTo('admin')}
              goToPiezas={() => navigateTo('piezas')}
            />
          );
        }
        return (
          <HomePage 
            setLoggedUser={handleLogin}
            goToContacto={() => navigateTo('contacto')}
          />
        );
      
      case 'galeria':
        return (
          <GaleriaPage 
            user={loggedUser}
            onLogout={handleLogout}
            goToHome={() => navigateTo(loggedUser ? 'galeria' : 'home')}
            goToContacto={() => navigateTo('contacto')}
            goToReportes={() => navigateTo('reportes')}
            goToAdmin={() => navigateTo('admin')}
            goToPiezas={() => navigateTo('piezas')}
          />
        );
      
      case 'contacto':
        return (
          <ContactoPage 
            goToHome={() => navigateTo(loggedUser ? 'galeria' : 'home')}
            goToGaleria={() => navigateTo('galeria')}
            isLoggedIn={!!loggedUser}
            user={loggedUser}
            onLogout={handleLogout}
            goToReportes={() => navigateTo('reportes')}
            goToAdmin={() => navigateTo('admin')}
            goToPiezas={() => navigateTo('piezas')}
          />
        );
      
      case 'admin':
        if (!loggedUser || (loggedUser.rol !== 'admin' && loggedUser.rol !== 'empleado')) {
          navigateTo('galeria');
          return null;
        }
        return (
          <AdminDashboard
            user={loggedUser}
            onLogout={handleLogout}
            goToHome={() => navigateTo('home')}
            goToGaleria={() => navigateTo('galeria')}
            goToReportes={() => navigateTo('reportes')}
          />
        );

      case 'reportes':
        if (!loggedUser || (loggedUser.rol !== 'admin' && loggedUser.rol !== 'empleado')) {
          navigateTo('galeria');
          return null;
        }
        return (
          <ReportesPage
            user={loggedUser}
            goBack={() => navigateTo('galeria')}
            goToHome={() => navigateTo('home')}
            onLogout={handleLogout}
          />
        );

      case 'piezas':
        if (!loggedUser) {
          navigateTo('home');
          return null;
        }
        return (
          <PiezasPage
            user={loggedUser}
            goBack={() => navigateTo('galeria')}
          />
        );

      default:
        return (
          <HomePage
            setLoggedUser={handleLogin}
            goToContacto={() => navigateTo('contacto')}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;