import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const CarGalleryItem = ({ car, index, onConsultarVenta, onConsultarRenta }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef(null);
    // Manejar cambio de slide manualmente
    const goToSlide = (index) => {
        setActiveIndex(index);
        // También podemos usar Bootstrap si está disponible
        if (window.bootstrap && carouselRef.current) {
            const carousel = new window.bootstrap.Carousel(carouselRef.current);
            carousel.to(index);
        }
    };
    // Función para manejar errores de imagen
    const handleImageError = (e) => {
        e.target.src = '/pictures/default_car.jpg';
        e.target.onerror = null; // Prevenir bucles infinitos
    };
    // Manejar clic en prev
    const handlePrev = () => {
        const newIndex = activeIndex === 0 ? car.images.length - 1 : activeIndex - 1;
        goToSlide(newIndex);
    };
    // Manejar clic en next
    const handleNext = () => {
        const newIndex = activeIndex === car.images.length - 1 ? 0 : activeIndex + 1;
        goToSlide(newIndex);
    };
    // Cargar Bootstrap dinámicamente si no está disponible
    useEffect(() => {
        // Verificar si Bootstrap está disponible
        if (!window.bootstrap) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
            script.async = true;
            document.body.appendChild(script);       
            return () => {
                if (script.parentNode) {
                    document.body.removeChild(script);
                }
            };
        }
    }, []);
    // Efecto para sincronizar el carrusel cuando activeIndex cambia
    useEffect(() => {
        const carouselElement = carouselRef.current;
        if (carouselElement && window.bootstrap) {
            try {
                const carousel = window.bootstrap.Carousel.getInstance(carouselElement) || 
                                new window.bootstrap.Carousel(carouselElement);
                carousel.to(activeIndex);
            } catch (error) {
                console.error('Error al controlar carrusel:', error);
            }
        }
    }, [activeIndex]);
    return (
        <div className="car-item animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="car-item-content">
                <div className="carousel-container">
                    {/* Carrusel de imágenes */}
                    <div 
                        id={`carousel-${car.id}`} 
                        ref={carouselRef}
                        className="carousel slide" 
                        data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {car.images.map((img, imgIndex) => (
                                <div
                                    key={imgIndex}
                                    className={`carousel-item ${imgIndex === activeIndex ? 'active' : ''}`}>
                                    <img
                                        src={img}
                                        className="d-block w-100 carousel-img"
                                        alt={`${car.name} - vista ${imgIndex + 1}`}
                                        onError={handleImageError}
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            onClick={handlePrev}>
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Anterior</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            onClick={handleNext}>
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Siguiente</span>
                        </button>
                    </div>
                    {/* Miniaturas */}
                    <div className="carousel-thumbnails">
                        {car.images.map((img, imgIndex) => (
                            <img
                                key={imgIndex}
                                src={img}
                                className={`thumbnail-img ${imgIndex === activeIndex ? 'active' : ''}`}
                                alt={`Miniatura ${imgIndex + 1}`}
                                onClick={() => goToSlide(imgIndex)}
                                onError={handleImageError}
                            />
                        ))}
                    </div>
                </div>
                <div className="car-info-container">
                    <div className="car-info">
                        <h3>{car.name}</h3>
                        <p className="car-description">{car.description}</p>
                        <div className="car-features-grid">
                            <div className="car-feature">
                                <i className="bi bi-speedometer2"></i>
                                <span><strong>Potencia:</strong> {car.power}</span>
                            </div>
                            <div className="car-feature">
                                <i className="bi bi-calendar"></i>
                                <span><strong>Año:</strong> {car.year}</span>
                            </div>
                            <div className="car-feature">
                                <i className="bi bi-gear"></i>
                                <span><strong>Motor:</strong> {car.engine}</span>
                            </div>
                            <div className="car-feature">
                                <i className="bi bi-palette"></i>
                                <span><strong>Color:</strong> {car.color}</span>
                            </div>
                            <div className="car-feature">
                                <i className="bi bi-gear-wide"></i>
                                <span><strong>Transmisión:</strong> {car.transmission}</span>
                            </div>
                            <div className="car-feature">
                                <i className="bi bi-tachometer"></i>
                                <span><strong>Kilometraje:</strong> {car.mileage}</span>
                            </div>
                        </div>
                        <div className="price-container">
                            <span className="price-tag pulse-animation">{car.price}</span>
                        </div>
                        <div className="car-actions">
                            <Button
                                variant="primary"
                                onClick={() => onConsultarVenta(car)}
                            >
                                <i className="bi bi-cash-coin me-2"></i>
                                Consultar Venta
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => onConsultarRenta(car)}
                            >
                                <i className="bi bi-calendar-check me-2"></i>
                                Consultar Renta
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CarGalleryItem;