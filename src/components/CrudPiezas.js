import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Badge, Card, Row, Col } from 'react-bootstrap';
import DataTable from './DataTable';
import ExportExcel from './ExportExcel';

const CrudPiezas = ({ user }) => {
  const [piezas, setPiezas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentPieza, setCurrentPieza] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    stock: '',
    precio: '',
    proveedor: '',
    minimoStock: '',
    ubicacion: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar datos al montar
  useEffect(() => {
    const cargarPiezas = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('piezas')) || [];
        // Filtrar elementos nulos y asegurar IDs
        const piezasValidas = stored
          .filter(p => p !== null && p !== undefined)
          .map((p, index) => ({
            ...p,
            id: p.id || index + 1
          }));
        setPiezas(piezasValidas);
      } catch (error) {
        console.error('Error al cargar piezas:', error);
        setPiezas([]);
      }
    };

    cargarPiezas();
  }, []);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre || formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es obligatoria';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número positivo';
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.minimoStock || parseInt(formData.minimoStock) < 0) {
      newErrors.minimoStock = 'El stock mínimo debe ser un número positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generar nuevo ID
  const generarNuevoId = () => {
    if (piezas.length === 0) return 1;
    const ids = piezas.map(p => parseInt(p.id)).filter(id => !isNaN(id));
    const maxId = Math.max(...ids, 0);
    return maxId + 1;
  };

  // Guardar pieza
  const handleSave = () => {
    if (!validateForm()) {
      setShowInfoModal(true);
      return;
    }

    const nuevaPieza = {
      ...formData,
      id: editing && currentPieza ? currentPieza.id : generarNuevoId(),
      stock: parseInt(formData.stock) || 0,
      precio: parseFloat(formData.precio) || 0,
      minimoStock: parseInt(formData.minimoStock) || 0,
      fechaActualizacion: new Date().toISOString()
    };

    let updatedPiezas;
    if (editing && currentPieza) {
      updatedPiezas = piezas.map(p => 
        p.id === currentPieza.id ? nuevaPieza : p
      );
    } else {
      updatedPiezas = [...piezas, nuevaPieza];
    }

    // Guardar en localStorage
    localStorage.setItem('piezas', JSON.stringify(updatedPiezas));
    setPiezas(updatedPiezas);
    
    // Cerrar modal y resetear
    setShowModal(false);
    resetForm();
    
    // Mostrar mensaje de éxito
    setSuccessMessage(editing ? 'Pieza actualizada correctamente' : 'Pieza agregada correctamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Eliminar pieza
  const handleDelete = (id) => {
    if (user.rol !== 'admin') {
      setShowInfoModal(true);
      return;
    }
    setDeleteId(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    const updatedPiezas = piezas.filter(p => p.id !== deleteId);
    localStorage.setItem('piezas', JSON.stringify(updatedPiezas));
    setPiezas(updatedPiezas);
    
    setSuccessMessage('Pieza eliminada correctamente');
    setTimeout(() => setSuccessMessage(''), 3000);
    setShowConfirmModal(false);
    setDeleteId(null);
  };

  // Editar pieza
  const handleEdit = (pieza) => {
    setCurrentPieza(pieza);
    setFormData({
      nombre: pieza.nombre || '',
      descripcion: pieza.descripcion || '',
      categoria: pieza.categoria || '',
      stock: pieza.stock || '',
      precio: pieza.precio || '',
      proveedor: pieza.proveedor || '',
      minimoStock: pieza.minimoStock || '',
      ubicacion: pieza.ubicacion || ''
    });
    setEditing(true);
    setShowModal(true);
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      stock: '',
      precio: '',
      proveedor: '',
      minimoStock: '',
      ubicacion: ''
    });
    setEditing(false);
    setCurrentPieza(null);
    setErrors({});
  };

  // Estado del stock
  const getEstadoStock = (stock, minimoStock) => {
    const stockNum = parseInt(stock) || 0;
    const minimoNum = parseInt(minimoStock) || 0;
    
    if (stockNum === 0) {
      return <Badge bg="danger">Agotado</Badge>;
    } else if (stockNum <= minimoNum) {
      return <Badge bg="warning">Bajo Stock</Badge>;
    } else {
      return <Badge bg="success">Disponible</Badge>;
    }
  };

  // Columnas para la tabla
  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 180
    },
    {
      field: 'categoria',
      headerName: 'Categoría',
      width: 120
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
      renderCell: (item) => `${item.stock || 0}`
    },
    {
      field: 'precio',
      headerName: 'Precio',
      width: 120,
      renderCell: (item) => `$${parseFloat(item.precio || 0).toLocaleString()}`
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 120,
      renderCell: (item) => getEstadoStock(item.stock, item.minimoStock)
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 150,
      renderCell: (item) => (
        <div>
          <Button
            variant="warning"
            size="sm"
            onClick={() => handleEdit(item)}
            className="me-2"
          >
            <i className="bi bi-pencil"></i>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(item.id)}
            disabled={user.rol !== 'admin'}
            title={user.rol !== 'admin' ? 'Solo administradores pueden eliminar' : ''}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      )
    }
  ];

  const categorias = [
    'Motor', 'Transmisión', 'Frenos', 'Suspensión',
    'Eléctrico', 'Carrocería', 'Interior', 'Accesorios'
  ];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-dark">Gestión de Piezas y Refacciones</h2>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="me-2"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nueva Pieza
          </Button>
          <ExportExcel
            data={piezas}
            filename="inventario_piezas"
            sheetName="Piezas"
            buttonText="Exportar Excel"
            buttonVariant="success"
          />
        </div>
      </div>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}

      {/* Estadísticas */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="bg-primary text-white rounded">
              <h5 className="card-title">Total Piezas</h5>
              <h3>{piezas.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="bg-success text-white rounded">
              <h5 className="card-title">Valor Total</h5>
              <h3>${piezas.reduce((total, p) => total + (parseFloat(p.precio) || 0) * (parseInt(p.stock) || 0), 0).toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="bg-warning text-white rounded">
              <h5 className="card-title">Bajo Stock</h5>
              <h3>{piezas.filter(p => (parseInt(p.stock) || 0) <= (parseInt(p.minimoStock) || 0)).length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="bg-danger text-white rounded">
              <h5 className="card-title">Agotadas</h5>
              <h3>{piezas.filter(p => (parseInt(p.stock) || 0) === 0).length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de piezas */}
      {piezas.length > 0 ? (
        <DataTable
          data={piezas}
          columns={columns}
          pageSize={10}
        />
      ) : (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          No hay piezas registradas. Agrega tu primera pieza usando el botón "Nueva Pieza".
        </Alert>
      )}

      {/* Modal para agregar/editar pieza */}
      <Modal
        show={showModal}
        onHide={() => {
          if (formData.nombre || formData.precio || formData.stock) {
            if (window.confirm('¿Estás seguro de cancelar? Los cambios no guardados se perderán.')) {
              setShowModal(false);
              resetForm();
            }
          } else {
            setShowModal(false);
            resetForm();
          }
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">{editing ? 'Editar Pieza' : 'Nueva Pieza'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre *</Form.Label>
              <Form.Control
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                isInvalid={!!errors.nombre}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nombre}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    isInvalid={!!errors.categoria}
                  >
                    <option value="">Seleccione categoría</option>
                    {categorias.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.categoria}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Ubicación</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.ubicacion}
                    onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                    placeholder="Ej: Almacén A, Estante 3"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Actual *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    isInvalid={!!errors.stock}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.stock}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Mínimo *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formData.minimoStock}
                    onChange={(e) => setFormData({ ...formData, minimoStock: e.target.value })}
                    isInvalid={!!errors.minimoStock}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.minimoStock}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio ($) *</Form.Label>
                  <Form.Control
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    isInvalid={!!errors.precio}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.precio}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Proveedor</Form.Label>
              <Form.Control
                type="text"
                value={formData.proveedor}
                onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowModal(false);
            resetForm();
          }}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editing ? 'Guardar Cambios' : 'Crear Pieza'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación para eliminar */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar esta pieza? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de información */}
      <Modal
        show={showInfoModal}
        onHide={() => setShowInfoModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Información</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user.rol !== 'admin' 
            ? 'Solo el administrador puede eliminar piezas'
            : 'Por favor complete todos los campos requeridos correctamente'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={() => setShowInfoModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CrudPiezas;