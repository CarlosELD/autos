import React, { useState } from 'react';
import NavbarPrincipal from '../components/NavbarPrincipal';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import DataTable from '../components/DataTable';

const HomePage = ({ setLoggedUser, goToContacto }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [filterYear, setFilterYear] = useState('all');

  const carsData = [
    { id: 1, modelo: 'Ford Mustang Shelby GT 500', año: '1970', motor: '428 cu in (7.0 L) V8', potencia: '650 HP', descripcion: 'Un ícono del automovilismo, conocido por su motor V8 y su diseño deportivo.'},
    { id: 2, modelo: 'Chevrolet Camaro Z28', año: '1971', motor: '350 cu in (5.7 L) V8', potencia: '330 HP', descripcion: 'Un muscle car clásico con gran rendimiento y estilo único.' },
    { id: 3, modelo: 'Datsun 240Z', año: '1972', motor: '2.4 L I6', potencia: '151 HP', descripcion: 'El auto deportivo japonés que abrió camino en el mercado global.' },
    { id: 4, modelo: 'Lamborghini Countach', año: '1974', motor: '4.0 L V12', potencia: '370 HP', descripcion: 'Uno de los diseños más revolucionarios de Lamborghini.'  },
    { id: 5, modelo: 'Lotus Esprit', año: '1975', motor: '2.0 L I4', potencia: '160 HP', descripcion: 'Un deportivo británico con diseño de Giugiaro.' },
    { id: 6, modelo: 'Ford Bronco', año: '1977', motor: '5.0 L V8', potencia: '200 HP', descripcion: 'El todoterreno clásico estadounidense.'},
    { id: 7, modelo: 'Porsche 928', año: '1978', motor: '4.5 L V8', potencia: '240 HP', descripcion: 'Un Porsche innovador con motor delantero.'},
    { id: 8, modelo: 'Mercedes Clase G', año: '1979', motor: '2.8 L I6', potencia: '150 HP', descripcion: 'El legendario todoterreno alemán, símbolo de resistencia.'}
  ];

  const [filteredCars, setFilteredCars] = useState(carsData);

  const handleFilterChange = (e) => {
    const selectedYear = e.target.value;
    setFilterYear(selectedYear);
    
    if (selectedYear === 'all') {
      setFilteredCars(carsData);
    } else {
      const filtered = carsData.filter(car => car.año === selectedYear);
      setFilteredCars(filtered);
    }
  };

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = (user) => {
    setLoggedUser(user);
    setShowLogin(false);
  };

  const handleRegisterClick = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const columns = [
    { 
      field: 'modelo', 
      headerName: 'Modelo', 
      width: 200,
      sortable: true 
    },
    { 
      field: 'año', 
      headerName: 'Año', 
      width: 100,
      sortable: true 
    },
    { 
      field: 'motor', 
      headerName: 'Motor', 
      width: 180,
      sortable: false 
    },
    { 
      field: 'potencia', 
      headerName: 'Potencia', 
      width: 120,
      sortable: true 
    },
    { 
      field: 'descripcion', 
      headerName: 'Descripción', 
      width: 300,
      sortable: false 
    }
  ];

  return (
    <>
      <NavbarPrincipal 
        onLoginClick={handleLoginClick}
        goToContacto={goToContacto}
      />

      {/* Hero Section */}
      <section className="hero-section text-center py-5 bg-dark text-white">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Los Automóviles Clásicos Más Icónicos de los Años 70</h1>
          <p className="lead mb-4">Descubre, compra o renta los autos legendarios que marcaron una época dorada del automovilismo</p>
          <a href="#catalogo" className="btn btn-light btn-lg px-4">Ver Catálogo</a>
        </div>
      </section>

      {/* Catálogo */}
      <section id="catalogo" className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center mb-4 text-dark">Catálogo de Autos Clásicos</h2>
          <p className="text-center mb-5 text-secondary">Explora nuestra exclusiva colección de automóviles icónicos de los años 70, disponibles para venta o renta.</p>

          {/* Filtro */}
          <div className="mb-4">
            <label htmlFor="filterYear" className="form-label"><strong>Filtrar por año:</strong></label>
            <select 
              id="filterYear" 
              className="form-select w-auto d-inline-block" 
              value={filterYear} 
              onChange={handleFilterChange}
            >
              <option value="all">Todos</option>
              <option value="1970">1970</option>
              <option value="1971">1971</option>
              <option value="1972">1972</option>
              <option value="1974">1974</option>
              <option value="1975">1975</option>
              <option value="1977">1977</option>
              <option value="1978">1978</option>
              <option value="1979">1979</option>
            </select>
          </div>

          {/* Tabla con DataTable */}
          <section id="historia">
            <h3 className="mb-3 text-dark">Tabla de datos sobre los automóviles clásicos más icónicos del mundo</h3>
            <DataTable 
              data={filteredCars} 
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
            />
          </section>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4">
        <p className="mb-0">&copy; 2025 Motors 70's. Todos los derechos reservados.</p>
      </footer>

      {/* Modales */}
      <LoginModal 
        show={showLogin} 
        onHide={() => setShowLogin(false)} 
        onRegister={handleRegisterClick} 
        setLoggedUser={handleLoginSuccess}
      />
      <RegisterModal 
        show={showRegister} 
        onHide={() => setShowRegister(false)} 
      />
    </>
  );
};

export default HomePage;