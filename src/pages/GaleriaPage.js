import React, { useState, useEffect } from 'react';
import NavbarUser from '../components/NavbarUser';
import CarGalleryItem from '../components/CarGalleryItem';
import ExportExcel from '../components/ExportExcel';
import '../styles/galeria.css';

const GaleriaPage = ({
  user, onLogout, goToHome, goToContacto,
  goToReportes, goToAdmin, goToPiezas
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
      images: [
        '/pictures/Ford Mustang Shelby GT500 - 1.png',
        '/pictures/Ford Mustang Shelby GT500 - 2.png',
        '/pictures/Ford Mustang Shelby GT500 - 3.png'
      ]
    },
    {
      id: 2,
      name: 'BMW M1',
      year: 1978,
      engine: '3.5 L I6',
      power: '273 HP',
      description: 'El M1 es uno de los raros ejemplos de automóvil cuya versión de competición fue la base para la versión de calle.',
      color: 'Rojo',
      transmission: 'Manual',
      mileage: '11,029 km',
      price: '$750,000',
      images: [
        '/pictures/BMW_M1 - 1.png',
        '/pictures/BMW_M1 - 2.png',
        '/pictures/BMW_M1 - 3.png'
      ]
    },
    {
      id: 3,
      name: 'Chevrolet Camaro Z28',
      year: 1971,
      engine: '350 cu in (5.7 L) V8',
      power: '330 HP',
      description: 'Un muscle car clásico con gran rendimiento y estilo único.',
      color: 'Naranja con franjas negras',
      transmission: 'Manual',
      mileage: '68,500 km',
      price: '$95,000',
      images: [
        '/pictures/Chevrolet Camaro Z28 - 1.png',
        '/pictures/Chevrolet Camaro Z28 - 2.png',
        '/pictures/Chevrolet Camaro Z28 - 3.png'
      ]
    },
    {
      id: 4,
      name: 'Datsun 240Z',
      year: 1972,
      engine: '2.4 L I6',
      power: '151 HP',
      description: 'El auto deportivo japonés que abrió camino en el mercado global.',
      color: 'Naranja',
      transmission: 'Manual',
      mileage: '52,300 km',
      price: '$65,000',
      images: [
        '/pictures/Datsun 240Z - 1.png',
        '/pictures/Datsun 240Z - 2.png',
        '/pictures/Datsun 240Z - 3.png'
      ]
    },
    {
      id: 5,
      name: 'Ford Bronco',
      year: 1977,
      engine: '5.0 L V8',
      power: '200 HP',
      description: 'El todoterreno clásico estadounidense.',
      color: 'Naranja',
      transmission: 'Manual',
      mileage: '56,300 km',
      price: '$70,000',
      images: [
        '/pictures/Ford_Bronco - 1.png',
        '/pictures/Ford_Bronco - 2.png'
      ]
    },
    {
      id: 6,
      name: 'Mercedes Clase G',
      year: 1979,
      engine: '2.8 L I6',
      power: '152 HP',
      description: 'El legendario todoterreno alemán, símbolo de resistencia.',
      color: 'Naranja',
      transmission: 'Manual',
      mileage: '54,700 km',
      price: '$85,000',
      images: [
        '/pictures/Mercedes-Benz Clase G - 1.png',
        '/pictures/Mercedes-Benz Clase G - 2.png',
        '/pictures/Mercedes-Benz Clase G - 3.png'
      ]
    }
  ]);
  const [additionalCars] = useState([
    {
      id: 5,
      name: 'Lamborghini Countach',
      year: 1974,
      power: '370 HP',
      image: '/pictures/Lamborghini Countach - 1.png'
    },
    {
      id: 6,
      name: 'Lotus Esprit',
      year: 1975,
      power: '160 HP',
      image: '/pictures/Lotus Esprit - 1.png'
    },
    {
      id: 7,
      name: 'Ford Bronco',
      year: 1977,
      power: '200 HP',
      image: '/pictures/Ford Bronco - 1.png'
    },
    {
      id: 8,
      name: 'Porsche 928',
      year: 1978,
      power: '240 HP',
      image: '/pictures/Porsche 928 - 1.png'
    }
  ]);
  const handleConsultarVenta = (car) => {
    if (user?.rol === 'empleado' || user?.rol === 'admin') {
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
    // Guardar autos en localStorage si no existen
    try {
      // Guardar autos en localStorage para que estén disponibles en CrudVentas
      const autosParaVentas = cars.map(car => ({
        id: car.id,
        name: car.name,
        price: car.price,
        precioNumerico: parseFloat(car.price.replace(/[^0-9.]/g, '')) || 0
      }));

      localStorage.setItem("autos_galeria", JSON.stringify(autosParaVentas));
    } catch (error) {
      console.error('Error guardando autos:', error);
    }
    // Animación de entrada para elementos
    const timer = setTimeout(() => {
      const carItems = document.querySelectorAll('.car-item');
      carItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 200}ms`;
      });
    }, 100);
    return () => clearTimeout(timer);
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
      />
      {/* Elemento Gráfico */}
      <section className="elemento-grafico-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <img
                src="/pictures/ford-mustang-boss-302 - 1.png"
                alt="Elemento Gráfico Motors 70's"
                className="img-fluid elemento-grafico-img"
                onError={(e) => {
                  e.target.src = '/pictures/default_car.jpg';
                }}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Hero Section */}
      <section className="hero-section galeria-hero text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Galería de Autos Clásicos</h1>
          <p className="lead">
            Explora nuestra exclusiva colección de automóviles icónicos de los años 70
          </p>
        </div>
      </section>
      {/* Galería principal */}
      <section className="car-gallery">
        <div className="container">
          <div className="row mb-5">
            <div className="col-12">
              <h2 className="section-title galeria-title text-center">Automóviles Destacados</h2>
              <div className="export-container">
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
        </div>
      </section>
      {/* Galería adicional */}
      <section className="gallery-additional-section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title galeria-title text-center">
                Más Automóviles en Nuestra Colección
              </h2>
            </div>
          </div>
          <div className="gallery-grid">
            {additionalCars.map((car) => (
              <div className="gallery-item animate-fade-in" key={car.id}>
                <img
                  src={car.image}
                  alt={car.name}
                  className="gallery-item-image"
                  onError={(e) => {
                    e.target.src = '/pictures/default_car.jpg';
                  }}
                />
                <div className="gallery-item-content">
                  <h5>{car.name}</h5>
                  <p className="mb-0">Año: {car.year} | Potencia: {car.power}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer galeria-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4">
              <h5>Classic Motors 70's</h5>
              <p>
                Tu destino para encontrar los automóviles clásicos más icónicos de los años 70.
                Ofrecemos venta y renta de vehículos únicos y bien conservados.
              </p>
              <div className="social-icons">
                <a href="#"><i className="bi bi-facebook"></i></a>
                <a href="#"><i className="bi bi-twitter"></i></a>
                <a href="#"><i className="bi bi-instagram"></i></a>
                <a href="#"><i className="bi bi-youtube"></i></a>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h5>Enlaces</h5>
              <div className="footer-links">
                <p><button className="btn btn-link p-0" onClick={goToHome}>Inicio</button></p>
                <p><button className="btn btn-link p-0" onClick={goToContacto}>Contacto</button></p>
              </div>
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
              <div className="footer-contact-info">
                <p><i className="bi bi-geo-alt"></i> Av. Principal 123, Ciudad</p>
                <p><i className="bi bi-telephone"></i> +1 234 567 890</p>
                <p><i className="bi bi-envelope"></i> info@classicmotors70.com</p>
              </div>
            </div>
          </div>
          <hr className="footer-divider" />
          <div className="footer-copyright">
            <p className="mb-0">&copy; 2024 Classic Motors 70's. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default GaleriaPage;