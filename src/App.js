import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/unified.css';
import './styles/navbar.css';
// Componentes lazy para mejor rendimiento
const HomePage = lazy(() => import('./pages/HomePage'));
const GaleriaPage = lazy(() => import('./pages/GaleriaPage'));
const ContactoPage = lazy(() => import('./pages/ContactoPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ReportesPage = lazy(() => import('./pages/ReportesPage'));
const PiezasPage = lazy(() => import('./pages/PiezasPage'));

function App() {
  const [loggedUser, setLoggedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);

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
        // Limpiar sesión corrupta
        sessionStorage.removeItem('session');
        localStorage.removeItem('rememberSession');
      } finally {
        setLoading(false);
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
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" variant="primary" />
        </div>
      );
    }

    try {
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
    } catch (error) {
      console.error('Error al renderizar página:', error);
      return (
        <div className="container text-center py-5">
          <h2>Error al cargar la página</h2>
          <p>{error.message}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Recargar Página
          </button>
        </div>
      );
    }
  };

  return (
    <Suspense fallback={
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    }>
      <div className="App">
        {renderPage()}
      </div>
    </Suspense>
  );
}

export default App;