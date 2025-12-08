import React, { useState, useEffect } from 'react';
import NavbarUser from '../components/NavbarUser';
import { Card, Row, Col, Badge, Form, Button, Alert } from 'react-bootstrap';
import '../styles/unified.css';

const PiezasPage = ({ user, goBack }) => {
  const [piezas, setPiezas] = useState([]);
  const [filteredPiezas, setFilteredPiezas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({
    categoria: '',
    search: '',
    minPrecio: '',
    maxPrecio: '',
    estado: 'disponible'
  });
  
  const [carrito, setCarrito] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('piezas')) || [];
    setPiezas(stored.filter(p => p && p.stock > 0));
    
    // Extraer categorías únicas
    const cats = [...new Set(stored.filter(p => p && p.categoria).map(p => p.categoria))];
    setCategorias(cats);
  }, []);

  useEffect(() => {
    let result = piezas;
    
    if (filtros.categoria) {
      result = result.filter(p => p && p.categoria === filtros.categoria);
    }
    
    if (filtros.estado) {
      if (filtros.estado === 'disponible') {
        result = result.filter(p => p && p.stock > 0);
      } else if (filtros.estado === 'bajo_stock') {
        result = result.filter(p => p && p.stock > 0 && p.stock <= p.minimoStock);
      }
    }
    
    if (filtros.search) {
      const searchLower = filtros.search.toLowerCase();
      result = result.filter(p => 
        p && (
          p.nombre.toLowerCase().includes(searchLower) ||
          p.descripcion.toLowerCase().includes(searchLower) ||
          p.categoria.toLowerCase().includes(searchLower)
        )
      );
    }
    
    if (filtros.minPrecio) {
      result = result.filter(p => p && p.precio >= parseFloat(filtros.minPrecio));
    }
    
    if (filtros.maxPrecio) {
      result = result.filter(p => p && p.precio <= parseFloat(filtros.maxPrecio));
    }
    
    setFilteredPiezas(result);
  }, [filtros, piezas]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getEstadoStock = (stock, minimoStock) => {
    if (stock === 0) {
      return <Badge bg="danger">Agotado</Badge>;
    } else if (stock <= minimoStock) {
      return <Badge bg="warning">Bajo Stock</Badge>;
    } else {
      return <Badge bg="success">Disponible</Badge>;
    }
  };

  const agregarAlCarrito = (pieza) => {
    if (!pieza || pieza.stock <= 0) return;
    
    const existe = carrito.find(item => item.id === pieza.id);
    let nuevoCarrito;
    
    if (existe) {
      if (existe.cantidad < pieza.stock) {
        nuevoCarrito = carrito.map(item => 
          item.id === pieza.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        setSuccessMessage('No hay suficiente stock disponible');
        setTimeout(() => setSuccessMessage(''), 3000);
        return;
      }
    } else {
      nuevoCarrito = [...carrito, { ...pieza, cantidad: 1 }];
    }
    
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    
    setSuccessMessage(`${pieza.nombre} agregado al carrito`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const removerDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };
//realizar pedido 
  const realizarPedido = () => {
  if (carrito.length === 0) {
    setSuccessMessage('El carrito está vacío');
    setTimeout(() => setSuccessMessage(''), 3000);
    return;
  }
  
  // Registrar pedido original
  const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  const nuevoPedido = {
    id: Date.now(),
    usuario: user.usuario,
    items: carrito,
    total: calcularTotal(),
    fecha: new Date().toISOString().split('T')[0],
    estado: 'pendiente'
  };
  
  pedidos.push(nuevoPedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));

  // REGISTRAR VENTAS PARA REPORTES (NUEVO)
  const ventasPiezas = JSON.parse(localStorage.getItem("ventas_piezas")) || [];

  carrito.forEach(item => {
    ventasPiezas.push({
      id: Date.now() + Math.random(),
      nombre: item.nombre,
      cantidad: item.cantidad,
      total: item.precio * item.cantidad,
      fecha: new Date().toISOString().split("T")[0]
    });
  });

  localStorage.setItem("ventas_piezas", JSON.stringify(ventasPiezas));

  // Actualizar stock
  const nuevasPiezas = piezas.map(pieza => {
    const itemCarrito = carrito.find(item => item.id === pieza.id);
    if (itemCarrito) {
      return { ...pieza, stock: pieza.stock - itemCarrito.cantidad };
    }
    return pieza;
  });

  setPiezas(nuevasPiezas);
  localStorage.setItem('piezas', JSON.stringify(nuevasPiezas));

  // Limpiar carrito
  setCarrito([]);
  localStorage.removeItem('carrito');

  setSuccessMessage('Pedido realizado exitosamente');
  setTimeout(() => setSuccessMessage(''), 3000);
};

  return (
    <>
      <NavbarUser
        user={user}
        goToHome={() => {}}
        goToContacto={() => {}}
        goToReportes={() => {}}
        goToAdmin={() => {}}
        goToPiezas={() => {}}
        goToTemporada={() => {}}
      />

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-center mb-4">Piezas y Refacciones</h1>
            <p className="text-muted">Encuentra las piezas que necesitas para tu auto clásico</p>
          </div>
          <Button variant="secondary" onClick={goBack}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver a Galería
          </Button>
        </div>

        {successMessage && (
          <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
            {successMessage}
          </Alert>
        )}

        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-md-3">
            <Form.Group>
              <Form.Label>Buscar</Form.Label>
              <Form.Control
                type="text"
                name="search"
                value={filtros.search}
                onChange={handleFilterChange}
                placeholder="Nombre, descripción..."
              />
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group>
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="categoria"
                value={filtros.categoria}
                onChange={handleFilterChange}
              >
                <option value="">Todas</option>
                {categorias.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={filtros.estado}
                onChange={handleFilterChange}
              >
                <option value="disponible">Disponibles</option>
                <option value="bajo_stock">Bajo Stock</option>
                <option value="todos">Todos</option>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group>
              <Form.Label>Precio Mín</Form.Label>
              <Form.Control
                type="number"
                name="minPrecio"
                value={filtros.minPrecio}
                onChange={handleFilterChange}
                min="0"
                placeholder="Mínimo"
              />
            </Form.Group>
          </div>
          <div className="col-md-2">
            <Form.Group>
              <Form.Label>Precio Máx</Form.Label>
              <Form.Control
                type="number"
                name="maxPrecio"
                value={filtros.maxPrecio}
                onChange={handleFilterChange}
                min="0"
                placeholder="Máximo"
              />
            </Form.Group>
          </div>
          <div className="col-md-1 d-flex align-items-end">
            <Button 
              variant="outline-secondary" 
              onClick={() => setFiltros({
                categoria: '',
                search: '',
                minPrecio: '',
                maxPrecio: '',
                estado: 'disponible'
              })}
            >
              Limpiar
            </Button>
          </div>
        </div>

        {/* Carrito (solo para clientes) */}
        {user.rol === 'cliente' && carrito.length > 0 && (
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-cart me-2"></i>
                Carrito de Compras ({carrito.length} items)
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Pieza</th>
                      <th>Cantidad</th>
                      <th>Precio Unitario</th>
                      <th>Subtotal</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre}</td>
                        <td>{item.cantidad}</td>
                        <td>${item.precio.toLocaleString()}</td>
                        <td>${(item.precio * item.cantidad).toLocaleString()}</td>
                        <td>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => removerDelCarrito(item.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                      <td><strong>${calcularTotal().toLocaleString()}</strong></td>
                      <td>
                        <Button variant="success" onClick={realizarPedido}>
                          Realizar Pedido
                        </Button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Lista de piezas */}
        <Row>
          {filteredPiezas.length > 0 ? (
            filteredPiezas.map((pieza, index) => (
              <Col key={pieza.id || index} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{pieza.nombre}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {pieza.categoria}
                    </Card.Subtitle>
                    <Card.Text>
                      {pieza.descripcion || 'Sin descripción'}
                    </Card.Text>
                    <div className="mb-2">
                      <strong>Stock:</strong> {pieza.stock} unidades
                      {pieza.minimoStock && ` (Mínimo: ${pieza.minimoStock})`}
                    </div>
                    <div className="mb-2">
                      <strong>Precio:</strong> ${pieza.precio ? pieza.precio.toLocaleString() : '0'}
                    </div>
                    <div className="mb-3">
                      {getEstadoStock(pieza.stock, pieza.minimoStock || 10)}
                      {pieza.ubicacion && (
                        <span className="ms-2">
                          <i className="bi bi-geo-alt"></i> {pieza.ubicacion}
                        </span>
                      )}
                    </div>
                    {pieza.proveedor && (
                      <div className="text-muted mb-3">
                        <small>Proveedor: {pieza.proveedor}</small>
                      </div>
                    )}
                    
                    {user.rol === 'cliente' && pieza.stock > 0 && (
                      <Button 
                        variant="primary" 
                        onClick={() => agregarAlCarrito(pieza)}
                        className="w-100"
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Agregar al Carrito
                      </Button>
                    )}
                    
                    {(user.rol === 'empleado' || user.rol === 'admin') && (
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Solo vista para empleados
                        </span>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col className="text-center">
              <div className="alert alert-info">
                <i className="bi bi-info-circle display-4 d-block mb-3"></i>
                No se encontraron piezas con los filtros aplicados.
              </div>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};
export default PiezasPage;
