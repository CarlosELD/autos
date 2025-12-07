import React, { useState, useEffect } from 'react';
import NavbarUser from '../components/NavbarUser';
import CarGalleryItem from '../components/CarGalleryItem';
import ExportExcel from '../components/ExportExcel';
import '../styles/galeria.css';
import vehiculo1 from '../pictures/Ford Mustang Shelby GT500 - 1.png';
import vehiculo2 from '../pictures/Ford Mustang Shelby GT500 - 2.png';
import vehiculo3 from '../pictures/Ford Mustang Shelby GT500 - 3.png';
import vehiculo4 from '../pictures/BMW_M1 - 1.png';
import vehiculo5 from '../pictures/BMW_M1 - 2.png';
import vehiculo6 from '../pictures/BMW_M1 - 3.png';
import elementoGrafico from '../pictures/elemento_grafico.png';

const GaleriaPage = ({
  user,
  onLogout,
  goToHome,
  goToContacto,
  goToReportes,
  goToAdmin,
  goToPiezas,
  goToTemporada
}) => {
  const [cars] = useState([
    {
      id: 1,
      name: 'Ford Mustang Shelby GT 500',
      year: 1970,
      engine: '428 cu in (7.0 L) V8',
      power: '650 HP',
      description: 'Un ícono del automovilismo, conocido por su motor V8 y su diseño deportivo.',
      color: 'Azul con franjas blancas',
      transmission: 'Manual',
      mileage: '45,000 km',
      price: '$125,000',
      images: [vehiculo1, vehiculo2, vehiculo3]
    },
    {
      id: 2,
      name: 'BMW M1',
      year: 1978,
      engine: '3.5 L I6',
      power: '273 HP',
      description: 'Un ícono del automovilismo, El M1 es uno de los raros ejemplos de automóvil cuya versión de competición fue la base para la versión de calle.',
      color: 'Rojo',
      transmission: 'Manual',
      mileage: '11,029 km',
      price: '$750,000',
      images: [vehiculo4, vehiculo5, vehiculo6]
    }
  ]);

  const [additionalCars] = useState([
    {
      id: 3,
      name: 'Ford Mustang Boss 302',
      year: 1970,
      power: '290 HP',
      image: vehiculo3
    },
    {
      id: 4,
      name: 'Pontiac Firebird',
      year: 1970,
      power: '335 HP',
      image: vehiculo1
    }
  ]);

  const handleConsultarVenta = (car) => {
    if (user.rol === 'empleado' || user.rol === 'admin') {
      if (typeof goToAdmin === 'function') {
        goToAdmin('ventas');
      }
    } else {
      alert(`Consultando venta para ${car.name} - Por favor contacte a un vendedor`);
    }
  };

  const handleConsultarRenta = (car) => {
    alert(`Consultando renta para ${car.name} - Será contactado por nuestro equipo`);
  };

  useEffect(() => {
    // Animaciones
    const animateElements = () => {
      const elements = document.querySelectorAll('.car-item');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 200);
      });
    };

    animateElements();
  }, []);

  useEffect(() => {
    // Guardar autos en localStorage si no existen
    const autosGuardados = JSON.parse(localStorage.getItem('autos_galeria'));
    if (!autosGuardados || autosGuardados.length === 0) {
      const autosConId = cars.map((car, index) => ({
        ...car,
        id: index + 1,
        modelo: car.name,
        precioNumerico: parseFloat(car.price.replace('$', '').replace(',', '')) || 0
      }));
      localStorage.setItem('autos_galeria', JSON.stringify(autosConId));
    }
  }, [cars]);

  return (
    <>
      <NavbarUser
        user={user}
        onLogout={onLogout}
        goToHome={goToHome}
        goToContacto={goToContacto}
        goToReportes={goToReportes}
        goToAdmin={goToAdmin}
        goToPiezas={goToPiezas}
        goToTemporada={goToTemporada}
      />

      {/* Elemento Gráfico */}
      <section className="elemento-grafico-section py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <img
                src={elementoGrafico}
                alt="Elemento Gráfico Motors 70's"
                className="img-fluid elemento-grafico-img pulse-animation"
                style={{ maxHeight: '300px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Galería de Autos Clásicos</h1>
          <p className="lead">Explora nuestra exclusiva colección de automóviles icónicos de los años 70</p>
        </div>
      </section>

      {/* Galería principal */}
      <section className="container car-gallery">
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="section-title text-center">Automóviles Destacados</h2>
            <div className="text-end mb-3">
              <ExportExcel
                data={cars}
                filename="galeria_autos_clasicos"
                sheetName="Autos"
                buttonText="Exportar Galería a Excel"
              />
            </div>
          </div>
        </div>

        {cars.map((car, index) => (
          <CarGalleryItem
            key={car.id}
            car={car}
            index={index}
            onConsultarVenta={handleConsultarVenta}
            onConsultarRenta={handleConsultarRenta}
          />
        ))}
      </section>

      {/* Galería adicional */}
      <section className="container transition-fade">
        <div className="row">
          <div className="col-12">
            <h2 className="section-title text-center">Más Automóviles en Nuestra Colección</h2>
          </div>
        </div>
        <div className="gallery-grid">
          {additionalCars.map(car => (
            <div className="gallery-item" key={car.id}>
              <img src={car.image} alt={car.name} style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
              <div className="p-3">
                <h5>{car.name}</h5>
                <p className="mb-0">Año: {car.year} | Potencia: {car.power}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <h5>Classic Motors 70's</h5>
              <p>Tu destino para encontrar los automóviles clásicos más icónicos de los años 70. Ofrecemos venta y renta de vehículos únicos y bien conservados.</p>
              <div className="social-icons">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h5>Enlaces</h5>
              <ul className="list-unstyled">
                <li>
                  <button className="btn btn-link p-0 text-white" onClick={goToHome}>
                    Inicio
                  </button>
                </li>
                <li>
                  <button className="btn btn-link p-0 text-white" onClick={goToContacto}>
                    Contacto
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h5>Servicios</h5>
              <ul className="list-unstyled">
                <li><a href="#">Venta de Autos Clásicos</a></li>
                <li><a href="#">Renta de Autos Clásicos</a></li>
                <li><a href="#">Restauración</a></li>
                <li><a href="#">Asesoría</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h5>Contacto</h5>
              <ul className="list-unstyled">
                <li><i className="fas fa-map-marker-alt me-2"></i> Av. Principal 123, Ciudad</li>
                <li><i className="fas fa-phone me-2"></i> +1 234 567 890</li>
                <li><i className="fas fa-envelope me-2"></i> info@classicmotors70.com</li>
              </ul>
            </div>
          </div>
          <hr className="bg-light" />
          <div className="text-center py-3">
            <p className="mb-0">&copy; 2024 Classic Motors 70's. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default GaleriaPage;