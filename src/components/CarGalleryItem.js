import React, { useState } from 'react';
import { Carousel, Button } from 'react-bootstrap';

const CarGalleryItem = ({ car, index, onConsultarVenta, onConsultarRenta }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
    };
    return (
        <div className="car-item animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="row align-items-center">
                <div className={`col-lg-6 ${index % 2 === 1 ? 'order-lg-2' : ''}`}>
                    {/* Carrusel de imágenes */}
                    <div id={`carousel-${car.id}`} className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {car.images.map((img, imgIndex) => (
                                <div
                                    key={imgIndex}
                                    className={`carousel-item ${imgIndex === 0 ? 'active' : ''}`}
                                >
                                    <img
                                        src={img}
                                        className="d-block w-100 carousel-img"
                                        alt={`${car.name} - vista ${imgIndex + 1}`}
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1551524164-6ca88f6f0960?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#carousel-${car.id}`}
                            data-bs-slide="prev"
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Anterior</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#carousel-${car.id}`}
                            data-bs-slide="next"
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Siguiente</span>
                        </button>
                    </div>

                    {/* Miniaturas */}
                    <div className="carousel-thumbnails mt-3">
                        {car.images.map((img, imgIndex) => (
                            <img
                                key={imgIndex}
                                src={img}
                                className={`thumbnail-img ${imgIndex === 0 ? 'active' : ''}`}
                                data-bs-target={`#carousel-${car.id}`}
                                data-bs-slide-to={imgIndex}
                                alt={`Miniatura ${imgIndex + 1}`}
                                onClick={() => setActiveIndex(imgIndex)}
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1551524164-6ca88f6f0960?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className={`col-lg-6 ${index % 2 === 1 ? 'order-lg-1' : ''}`}>
                    <div className="car-info h-100">
                        <h3>{car.name}</h3>
                        <p className="text-muted">{car.description}</p>

                        <div className="row mt-4">
                            <div className="col-md-6">
                                <div className="car-feature">
                                    <i className="fas fa-tachometer-alt"></i>
                                    <span><strong>Potencia:</strong> {car.power}</span>
                                </div>
                                <div className="car-feature">
                                    <i className="fas fa-calendar-alt"></i>
                                    <span><strong>Año:</strong> {car.year}</span>
                                </div>
                                <div className="car-feature">
                                    <i className="fas fa-gas-pump"></i>
                                    <span><strong>Motor:</strong> {car.engine}</span>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="car-feature">
                                    <i className="fas fa-palette"></i>
                                    <span><strong>Color:</strong> {car.color}</span>
                                </div>
                                <div className="car-feature">
                                    <i className="fas fa-cogs"></i>
                                    <span><strong>Transmisión:</strong> {car.transmission}</span>
                                </div>
                                <div className="car-feature">
                                    <i className="fas fa-road"></i>
                                    <span><strong>Kilometraje:</strong> {car.mileage}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <span className="price-tag pulse-animation">{car.price}</span>
                        </div>

                        <div className="mt-4">
                            <Button
                                className="btn btn-primary me-2"
                                onClick={() => onConsultarVenta(car)}
                            >
                                Consultar Venta
                            </Button>
                            <Button
                                className="btn btn-outline-primary"
                                onClick={() => onConsultarRenta(car)}
                            >
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