import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const CarGalleryItem = ({ car, index, onConsultarVenta, onConsultarRenta }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
        
        // Actualizar el carrusel de Bootstrap
        const carousel = document.getElementById(`carousel-${car.id}`);
        if (carousel) {
          const bsCarousel = new window.bootstrap.Carousel(carousel);
          bsCarousel.to(selectedIndex);
        }
    };

    // Función para manejar errores de imagen
    const handleImageError = (e) => {
        e.target.src = '/pictures/default_car.jpg';
        e.target.onerror = null; // Prevenir bucles infinitos
    };

    return (
        <div className="car-item animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="car-item-content">
                <div className="carousel-container">
                    {/* Carrusel de imágenes */}
                    <div id={`carousel-${car.id}`} className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {car.images.map((img, imgIndex) => (
                                <div
                                    key={imgIndex}
                                    className={`carousel-item ${imgIndex === activeIndex ? 'active' : ''}`}
                                >
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
                            data-bs-target={`#carousel-${car.id}`}
                            data-bs-slide="prev"
                            onClick={() => {
                                const newIndex = activeIndex === 0 ? car.images.length - 1 : activeIndex - 1;
                                setActiveIndex(newIndex);
                            }}
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Anterior</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#carousel-${car.id}`}
                            data-bs-slide="next"
                            onClick={() => {
                                const newIndex = activeIndex === car.images.length - 1 ? 0 : activeIndex + 1;
                                setActiveIndex(newIndex);
                            }}
                        >
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
                                onClick={() => handleSelect(imgIndex)}
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