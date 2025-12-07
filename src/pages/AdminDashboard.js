import React, { useState } from 'react';
import CrudUsuarios from '../components/CrudUsuarios';
import CrudVentas from '../components/CrudVentas';
import CrudPiezas from '../components/CrudPiezas';
import { Button, Container, Row, Col } from 'react-bootstrap';

const AdminDashboard = ({
  user,
  onLogout,
  goToHome,
  goToGaleria
}) => {
  const [currentSection, setCurrentSection] = useState('ventas');

  const renderSection = () => {
    switch (currentSection) {
      case 'usuarios':
        return <CrudUsuarios />;
      case 'ventas':
        return <CrudVentas user={user} />;
      case 'piezas':
        return <CrudPiezas user={user} />;
      default:
        return <CrudVentas user={user} />;
    }
  };

  return (
    <Container fluid className="p-0 min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="d-flex">
        <div className="sidebar bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
          <div className="p-3">
            <h4 className="fw-bold mb-4">
              <i className="bi bi-speedometer2 me-2"></i>
              Panel Admin
            </h4>
            
            <div className="mb-4 p-3 bg-secondary rounded">
              <p className="mb-1"><strong>{user.nombre}</strong></p>
              <small className="text-light">{user.rol === 'admin' ? 'Administrador' : 'Empleado'}</small>
            </div>

            <nav className="nav flex-column">
              <Button
                variant="link"
                className={`nav-link text-white text-start mb-2 ${currentSection === 'ventas' ? 'active bg-primary' : ''}`}
                onClick={() => setCurrentSection('ventas')}
              >
                <i className="bi bi-cash-coin me-2"></i>
                Ventas
              </Button>
              
              {user.rol === 'admin' && (
                <Button
                  variant="link"
                  className={`nav-link text-white text-start mb-2 ${currentSection === 'usuarios' ? 'active bg-primary' : ''}`}
                  onClick={() => setCurrentSection('usuarios')}
                >
                  <i className="bi bi-people me-2"></i>
                  Usuarios
                </Button>
              )}
              
              <Button
                variant="link"
                className={`nav-link text-white text-start mb-2 ${currentSection === 'piezas' ? 'active bg-primary' : ''}`}
                onClick={() => setCurrentSection('piezas')}
              >
                <i className="bi bi-gear me-2"></i>
                Piezas
              </Button>
            </nav>

            <div className="mt-5 pt-5">
              <Button
                variant="outline-light"
                className="w-100 mb-2"
                onClick={goToGaleria}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver a Galería
              </Button>
              
              <Button
                variant="danger"
                className="w-100"
                onClick={onLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-grow-1 p-4">
          {renderSection()}
        </div>
      </div>
    </Container>
  );
};
export default AdminDashboard;