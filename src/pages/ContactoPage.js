import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import NavbarPrincipal from '../components/NavbarPrincipal';
import NavbarUser from '../components/NavbarUser';
import '../styles/contacto.css';

const ContactoPage = ({
  goToHome,goToGaleria,isLoggedIn,user,
  onLogout,goToReportes,goToAdmin,goToPiezas
}) => {
  const [formData, setFormData] = useState({
    nombre: '',apellido: '',email: '',
    telefono: '',interes: '',vehiculo: '', mensaje: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Animar elementos al cargar
    const elements = document.querySelectorAll('.contact-info-card, .form-container, .sidebar-info');
    elements.forEach((el, index) => {
      setTimeout(() => {el.classList.add('animate-fade-in');}, index * 200);
    });}, []);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
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
      setLoading(false);
      // Reset form
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        interes: '',
        vehiculo: '',
        mensaje: ''
      });
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };
  return (
    <>
      {/* Navbar */}
      {isLoggedIn ? (
        <NavbarUser
          user={user}
          onLogout={onLogout}
          goToHome={() => {
            if (user) {goToGaleria();} else {goToHome();}
          }}
          goToContacto={() => { }}
          goToReportes={goToReportes}
          goToAdmin={goToAdmin}
          goToPiezas={goToPiezas}/>
      ) : (
        <NavbarPrincipal
          onLoginClick={() => goToHome()}
          goToContacto={() => { }}/>
      )}
      {/* Hero Section */}
      <section className="hero-section contacto-hero text-center">
        <div className="container">
          <h1 className="display-4 fw-bold mb-4">Contáctanos</h1>
          <p className="lead">
            Estamos aquí para ayudarte a encontrar el automóvil clásico de tus sueños
          </p>
        </div>
      </section>
      {/* Información de Contacto */}
      <section className="contacto-info-section">
        <div className="container">
          <h2 className="section-title contacto-title">¿Cómo podemos ayudarte?</h2>
          <p className="section-subtitle">
            Ya sea que estés interesado en comprar, rentar o necesites servicios de restauración,
            nuestro equipo de expertos está listo para asistirte.
          </p>
          <div className="row contact-info-cards">
            <div className="col-md-4 mb-4">
              <div className="contact-info-card">
                <div className="contact-icon-container">
                  <i className="bi bi-geo-alt contact-icon"></i>
                </div>
                <h4>Visítanos</h4>
                <p>Av. Automóvil Clásico 123<br />Ciudad, Estado 12345</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="contact-info-card">
                <div className="contact-icon-container">
                  <i className="bi bi-telephone contact-icon"></i>
                </div>
                <h4>Llámanos</h4>
                <p> +1 234 567 890<br />+1 234 567 891</p>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="contact-info-card">
                <div className="contact-icon-container">
                  <i className="bi bi-envelope contact-icon"></i>
                </div>
                <h4>Escríbenos</h4>
                <p>info@motors70s.com<br />
                  ventas@motors70s.com
                </p>
              </div>
            </div>
          </div>
          <div className="form-row-container">
            {/* Formulario */}
            <div className="form-container">
              <div className="form-wrapper">
                <h3>Envíanos un Mensaje</h3>
                {submitted && (
                  <Alert 
                    variant="success" 
                    className="form-alert form-alert-success"
                    onClose={() => setSubmitted(false)} 
                    dismissible>
                    <i className="bi bi-check-circle me-2"></i>
                    ¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.
                  </Alert>
                )}
                <Form id="contactForm" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group-enhanced">
                        <label htmlFor="nombre" className="form-label">Nombre <span className="required-indicator">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          id="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          placeholder="Tu nombre"/>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group-enhanced">
                        <label htmlFor="apellido" className="form-label">Apellido <span className="required-indicator">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          id="apellido"
                          value={formData.apellido}
                          onChange={handleChange}
                          required
                          placeholder="Tu apellido"/>
                      </div>
                    </div>
                  </div>
                  <div className="form-group-enhanced">
                    <label htmlFor="email" className="form-label">Correo Electrónico <span className="required-indicator">*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="correo@ejemplo.com"/>
                  </div>
                  <div className="form-group-enhanced">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+1 234 567 890"/>
                  </div>
                  <div className="form-group-enhanced">
                    <label htmlFor="interes" className="form-label">Interés Principal</label>
                    <select
                      className="form-select"
                      id="interes"
                      value={formData.interes}
                      onChange={handleChange}>
                      <option value="">Selecciona una opción</option>
                      <option value="compra">Compra de vehículo</option>
                      <option value="renta">Renta de vehículo</option>
                      <option value="restauracion">Servicios de restauración</option>
                      <option value="valoracion">Valoración de vehículo</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div className="form-group-enhanced">
                    <label htmlFor="vehiculo" className="form-label">
                      Vehículo de Interés (opcional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vehiculo"
                      placeholder="Ej: Ford Mustang Shelby GT 500"
                      value={formData.vehiculo}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group-enhanced">
                    <label htmlFor="mensaje" className="form-label">Mensaje <span className="required-indicator">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="mensaje"
                      rows="5"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      placeholder="Escribe tu mensaje aquí..."/>
                  </div>
                  <button
                    type="submit"
                    className={`btn-submit-enhanced ${loading ? 'loading' : ''}`}
                    disabled={loading}>
                    {loading ? (
                      <>
                        <span className="visually-hidden">Enviando...</span>Enviando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </Form>
              </div>
            </div>
            {/* Información lateral */}
            <div className="sidebar-info">
              <div className="info-card">
                <h3>Horario de Atención</h3>
                <ul className="schedule-list">
                  <li>
                    <strong>Lunes - Viernes:</strong>
                    <span>9:00 - 18:00</span>
                  </li>
                  <li>
                    <strong>Sábados:</strong>
                    <span>10:00 - 16:00</span>
                  </li>
                  <li>
                    <strong>Domingos:</strong>
                    <span>Cerrado</span>
                  </li>
                </ul>
                <div className="schedule-note">
                  Para citas fuera de horario, contáctanos para coordinar.
                </div>
              </div>
              <div className="info-card">
                <h3>Servicios</h3>
                <ul className="service-list">
                  <li>
                    <i className="bi bi-check-circle"></i>
                    Venta de autos clásicos
                  </li>
                  <li>
                    <i className="bi bi-check-circle"></i>
                    Renta para eventos
                  </li>
                  <li>
                    <i className="bi bi-check-circle"></i>
                    Restauración profesional
                  </li>
                  <li>
                    <i className="bi bi-check-circle"></i>
                    Mantenimiento especializado
                  </li>
                  <li>
                    <i className="bi bi-check-circle"></i>
                    Asesoría en compra/venta
                  </li>
                  <li>
                    <i className="bi bi-check-circle"></i>
                    Certificación de autenticidad
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer contacto-footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <h5 className="mb-3">
                <i className="bi bi-car-front-fill me-2"></i>
                Motors 70's
              </h5>
              <p>
                Especialistas en automóviles clásicos de los años 70. Ofrecemos venta, renta y servicios de
                restauración para los iconos automotrices más deseados.
              </p>
              <div className="social-icons contacto-social">
                <a href="#"><i className="bi bi-facebook"></i></a>
                <a href="#"><i className="bi bi-instagram"></i></a>
                <a href="#"><i className="bi bi-twitter"></i></a>
                <a href="#"><i className="bi bi-youtube"></i></a>
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
              <div className="footer-contact-info">
                <p><i className="bi bi-geo-alt"></i> Av. Automóvil Clásico 123, Ciudad</p>
                <p><i className="bi bi-telephone"></i> +1 234 567 890</p>
                <p><i className="bi bi-envelope"></i> info@motors70s.com</p>
                <p><i className="bi bi-clock"></i> Lunes - Viernes: 9:00 - 18:00</p>
              </div>
            </div>
          </div>
          <hr className="footer-divider" />
          <div className="footer-copyright">
            <p>&copy; 2024 Motors 70's. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};
export default ContactoPage;