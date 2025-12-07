import React from "react";
import { Button } from "react-bootstrap";
import AccessibilityDropdown from "./AccessibilityDropdown";

export default function NavbarUser({ 
  user = null, 
  onLogout = () => {},
  goToHome = () => {},
  goToContacto = () => {},
  goToReportes = () => {},
  goToAdmin = () => {},
  goToPiezas = () => {},
  goToTemporada = () => {}
}) {
  
  // Función para manejar el clic en el logo
  const handleLogoClick = () => {
    if (user) {
      goToHome(); // Esto debería llevar a la galería cuando hay usuario
    } else {
      goToHome();
    }
  };

  // Función para manejar clic en Piezas
  const handlePiezasClick = () => {
    if (user) {
      goToPiezas();
    } else {
      alert("Debes iniciar sesión para acceder a Piezas y Refacciones");
    }
  };

  const handleReportesClick = () => {
    if (user && (user.rol === "admin" || user.rol === "empleado")) {
      goToReportes();
    } else {
      alert("Debes iniciar sesión para acceder a reportes");
      goToHome();
    }
  };

  const handleAdminClick = () => {
    if (user && (user.rol === "admin" || user.rol === "empleado")) {
      goToAdmin("ventas");
    } else {
      alert("No tienes permisos para acceder al panel de administración");
      goToHome();
    }
  };

  const handleGaleriaClick = () => {
    if (user) {
      goToHome(); // goToHome ya debería llevar a galería cuando hay usuario
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 sticky-top">
      <div className="container-fluid">
        {/* Logo/Inicio */}
        <button
          className="navbar-brand fw-bold btn btn-link text-white p-0"
          onClick={handleLogoClick}
          style={{ background: "none", border: "none" }}
        >
          <i className="bi bi-car-front-fill me-2"></i> Motors 70's
        </button>

        {/* BOTÓN DE MENÚ PARA MÓVIL */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* CONTENIDO DEL NAV */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* OPCIONES IZQUIERDA */}
          <ul className="navbar-nav me-auto">
            {/* Galería - solo visible si hay usuario */}
            {user && (
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link text-white"
                  onClick={handleGaleriaClick}
                  style={{ background: 'none', border: 'none' }}
                >
                  <i className="bi bi-images me-1"></i>
                  Galería
                </button>
              </li>
            )}
            
            {/* Contacto - siempre visible */}
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link text-white"
                onClick={goToContacto}
                style={{ background: 'none', border: 'none' }}
              >
                <i className="bi bi-envelope me-1"></i>
                Contacto
              </button>
            </li>
            
            {/* Piezas y Refacciones - solo para usuarios logueados */}
            {user && (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={handlePiezasClick}
                  style={{ background: 'none', border: 'none' }}
                >
                  <i className="bi bi-gear me-1"></i>
                  Piezas y Refacciones
                </button>
              </li>
            )}
            
            {/* Reportes - solo admin y empleado */}
            {user && (user.rol === 'admin' || user.rol === 'empleado') && (
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link text-info"
                  onClick={handleReportesClick}
                  style={{ background: 'none', border: 'none' }}
                >
                  <i className="bi bi-graph-up me-1"></i>
                  Reportes
                </button>
              </li>
            )}
            
            {/* Panel de Administración - solo admin y empleado */}
            {user && (user.rol === 'admin' || user.rol === 'empleado') && (
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link text-warning"
                  onClick={handleAdminClick}
                  style={{ background: 'none', border: 'none' }}
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  Panel de Administración
                </button>
              </li>
            )}
            
            {/* Temporadas - solo admin */}
            {user && user.rol === 'admin' && (
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link text-success"
                  onClick={goToTemporada}
                  style={{ background: 'none', border: 'none' }}
                >
                  <i className="bi bi-calendar-event me-1"></i>
                  Temporadas
                </button>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {/* Dropdown de accesibilidad */}
            <div className="dropdown me-2" data-bs-auto-close="outside">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                id="accessDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-universal-access-circle me-1"></i> Accesibilidad
              </button>

              <div className="dropdown-menu dropdown-menu-end p-2" aria-labelledby="accessDropdown">
                <AccessibilityDropdown />
              </div>
            </div>

            {/* Dropdown de usuario - solo si hay usuario */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  <span className="text-truncate" style={{ maxWidth: '120px' }}>
                    {user.nombre || user.usuario}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <div className="dropdown-item-text">
                      <small className="text-muted d-block">Rol:</small>
                      <strong>
                        {user.rol === 'admin' && 'Administrador'}
                        {user.rol === 'empleado' && 'Empleado'}
                        {user.rol === 'cliente' && 'Cliente'}
                      </strong>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger"
                      onClick={onLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Button 
                variant="outline-light" 
                onClick={() => goToHome()}
              >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}