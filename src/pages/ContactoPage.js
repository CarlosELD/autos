import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import NavbarPrincipal from '../components/NavbarPrincipal';
import NavbarUser from '../components/NavbarUser';
import AccessibilityControls from '../components/AccessibilityControls';
import '../styles/contacto.css';

const ContactoPage = ({
  goToHome,
  goToGaleria,
  isLoggedIn,
  user,
  onLogout,
  goToReportes,
  goToAdmin,
  goToPiezas,
  goToTemporada
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    interes: '',
    vehiculo: '',
    mensaje: ''
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const animateElements = () => {
      const elements = document.querySelectorAll('.contact-info-card, .form-container');
      elements.forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 200);
      });
    };

    animateElements();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const contactos = JSON.parse(localStorage.getItem('contactos')) || [];
    const nuevoContacto = {
      id: Date.now(),
      ...formData,
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente'
    };

    contactos.push(nuevoContacto);
    localStorage.setItem('contactos', JSON.stringify(contactos));

    setSubmitted(true);

    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      interes: '',
      vehiculo: '',
      mensaje: ''
    });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      {/* Navbar */}
      {isLoggedIn ? (
        <NavbarUser
          user={user}
          onLogout={onLogout}
          goToHome={() => {
            if (user) {
              goToGaleria();
            } else {
              goToHome();
            }
          }}
          goToContacto={() => { }}
          goToReportes={goToReportes}
          goToAdmin={goToAdmin}
          goToPiezas={goToPiezas}
          goToTemporada={goToTemporada}
        />
      ) : (
        <NavbarPrincipal
          onLoginClick={() => goToHome()}
          goToContacto={() => { }}
        />
      )}
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Contáctanos</h1>
          <p className="lead">
            Estamos aquí para ayudarte a encontrar el automóvil clásico de tus sueños
          </p>
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title">¿Cómo podemos ayudarte?</h2>
          <p className="mb-5">
            Ya sea que estés interesado en comprar, rentar o necesites servicios de restauración,
            nuestro equipo de expertos está listo para asistirte.
          </p>

          <div className="row mb-5">
            <div className="col-md-4 mb-4">
              <div className="contact-info-card text-center">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <h4>Visítanos</h4>
                <p>Av. Automóvil Clásico 123<br />Ciudad, Estado 12345</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="contact-info-card text-center">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <h4>Llámanos</h4>
                <p>+1 234 567 890<br />+1 234 567 891</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="contact-info-card text-center">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <h4>Escríbenos</h4>
                <p>info@motors70s.com<br />ventas@motors70s.com</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 mb-5">
              <div className="bg-white p-4 rounded shadow-sm form-container">
                <h3 className="mb-4">Envíanos un Mensaje</h3>

                {submitted && (
                  <Alert variant="success" onClose={() => setSubmitted(false)} dismissible>
                    <i className="fas fa-check-circle me-2"></i>
                    ¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.
                  </Alert>
                )}

                <Form id="contactForm" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Form.Label htmlFor="nombre">Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        id="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Form.Label htmlFor="apellido">Apellido</Form.Label>
                      <Form.Control
                        type="text"
                        id="apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <Form.Label htmlFor="email">Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <Form.Label htmlFor="telefono">Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      id="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <Form.Label htmlFor="interes">Interés Principal</Form.Label>
                    <Form.Select
                      id="interes"
                      value={formData.interes}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Selecciona una opción</option>
                      <option value="compra">Compra de vehículo</option>
                      <option value="renta">Renta de vehículo</option>
                      <option value="restauracion">Servicios de restauración</option>
                      <option value="valoracion">Valoración de vehículo</option>
                      <option value="otro">Otro</option>
                    </Form.Select>
                  </div>

                  <div className="mb-3">
                    <Form.Label htmlFor="vehiculo">Vehículo de Interés (opcional)</Form.Label>
                    <Form.Control
                      type="text"
                      id="vehiculo"
                      placeholder="Ej: Ford Mustang Shelby GT 500"
                      value={formData.vehiculo}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <Form.Label htmlFor="mensaje">Mensaje</Form.Label>
                    <Form.Control
                      as="textarea"
                      id="mensaje"
                      rows="5"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="btn btn-primary btn-lg">
                    Enviar Mensaje
                  </Button>
                </Form>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="mb-4">
                <h3 className="mb-3">Horario de Atención</h3>
                <div className="bg-white p-4 rounded shadow-sm">
                  <ul className="list-unstyled">
                    <li className="mb-2"><strong>Lunes - Viernes:</strong> 9:00 - 18:00</li>
                    <li className="mb-2"><strong>Sábados:</strong> 10:00 - 16:00</li>
                    <li className="mb-2"><strong>Domingos:</strong> Cerrado</li>
                  </ul>
                  <p className="mt-3">Para citas fuera de horario, contáctanos para coordinar.</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Servicios</h3>
                <div className="bg-white p-4 rounded shadow-sm">
                  <ul className="list-unstyled">
                    <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Venta de autos clásicos</li>
                    <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Renta para eventos</li>
                    <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Restauración profesional</li>
                    <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Mantenimiento especializado</li>
                    <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Asesoría en compra/venta</li>
                    <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Certificación de autenticidad</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="mb-3"><i className="fas fa-car me-2"></i>Motors 70's</h5>
              <p>
                Especialistas en automóviles clásicos de los años 70. Ofrecemos venta, renta y servicios de
                restauración para los iconos automotrices más deseados.
              </p>
              <div className="social-icons">
                <a href="#"><i className="fab fa-facebook"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <h5 className="mb-3">Enlaces Rápidos</h5>
              <div className="footer-links">
                <p><button className="btn btn-link p-0" onClick={goToHome}>Inicio</button></p>
                <p><button className="btn btn-link p-0" onClick={goToGaleria}>Galería de Autos</button></p>
                <p><a href="#">Términos y Condiciones</a></p>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <h5 className="mb-3">Contacto</h5>
              <p><i className="fas fa-map-marker-alt me-2"></i> Av. Automóvil Clásico 123, Ciudad</p>
              <p><i className="fas fa-phone me-2"></i> +1 234 567 890</p>
              <p><i className="fas fa-envelope me-2"></i> info@motors70s.com</p>
              <p><i className="fas fa-clock me-2"></i> Lunes - Viernes: 9:00 - 18:00</p>
            </div>
          </div>
          <hr className="mt-4 mb-4" />
          <div className="text-center">
            <p>&copy; 2024 Motors 70's. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default ContactoPage;