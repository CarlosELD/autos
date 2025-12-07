import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import DataTable from './DataTable';
import ExportExcel from './ExportExcel';

const CrudVentas = ({ user, onClose }) => {
  const [ventas, setVentas] = useState([]);
  const [autos, setAutos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentVenta, setCurrentVenta] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    cliente: '',
    autoId: '',
    autoNombre: '',
    precio: '',
    fecha: new Date().toISOString().split('T')[0],
    estado: 'pendiente',
    vendedor: user?.nombre || '',
    metodoPago: 'efectivo'
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Función para generar ID auto-incrementable
  const generateVentaId = () => {
    const ventasData = JSON.parse(localStorage.getItem('ventas')) || [];
    if (ventasData.length === 0) return 1;
    const ids = ventasData.map(v => parseInt(v.id)).filter(id => !isNaN(id));
    const maxId = Math.max(...ids, 0);
    return maxId + 1;
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    try {
      // Cargar ventas
      const storedVentas = JSON.parse(localStorage.getItem('ventas')) || [];
      setVentas(storedVentas.filter(v => v && v.id));

      // Cargar autos
      const storedAutos = JSON.parse(localStorage.getItem('autos_galeria')) ||
        JSON.parse(localStorage.getItem('autos')) || [];
      setAutos(storedAutos.filter(a => a && a.id));
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Manejar cambio de auto
  const handleAutoChange = (e) => {
    const autoId = e.target.value;
    const autoSeleccionado = autos.find(a => a.id == autoId);

    if (autoSeleccionado) {
      let precio = autoSeleccionado.price || autoSeleccionado.precio;
      if (typeof precio === 'string') {
        // Extraer solo números
        precio = precio.replace(/[^0-9.]/g, '');
      }

      setFormData({
        ...formData,
        autoId: autoId,
        autoNombre: autoSeleccionado.name,
        precio: precio
      });
    } else {
      setFormData({
        ...formData,
        autoId: '',
        autoNombre: '',
        precio: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validación de cliente
    if (!formData.cliente || formData.cliente.trim().length < 2) {
      newErrors.cliente = 'El nombre del cliente es obligatorio (mínimo 2 caracteres)';
    }

    // Validación de auto
    if (!formData.autoId) {
      newErrors.autoId = 'Debe seleccionar un auto';
    }

    // Validación de precio
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    } else if (parseFloat(formData.precio) > 1000000) {
      newErrors.precio = 'El precio no puede exceder $1,000,000';
    }

    // Validación de fecha
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es obligatoria';
    } else {
      const fechaVenta = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaVenta > hoy) {
        newErrors.fecha = 'La fecha no puede ser futura';
      }
    }

    // Validación de método de pago
    if (!formData.metodoPago) {
      newErrors.metodoPago = 'El método de pago es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = () => {
    if (!validateForm()) {
      setErrors({ general: 'Por favor complete todos los campos requeridos' });
      return;
    }

    const precio = parseFloat(formData.precio) || 0;

    const nuevaVenta = {
      ...formData,
      id: editing && currentVenta ? currentVenta.id : generateVentaId(),
      precio: precio,
      fecha: formData.fecha,
      vendedor: user?.nombre || user?.usuario || 'Sin asignar',
      fechaRegistro: new Date().toISOString()
    };

    let updatedVentas;
    if (editing && currentVenta) {
      updatedVentas = ventas.map(v =>
        v && v.id === currentVenta.id ? nuevaVenta : v
      );
    } else {
      updatedVentas = [...ventas, nuevaVenta];
    }

    updatedVentas = updatedVentas.filter(v => v !== null && v !== undefined);

    setVentas(updatedVentas);
    localStorage.setItem('ventas', JSON.stringify(updatedVentas));

    setShowModal(false);
    resetForm();

    setSuccessMessage(editing ? 'Venta actualizada correctamente' : 'Venta registrada correctamente');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDelete = (id) => {
    if (user.rol !== 'admin') {
      setErrors({ general: 'Solo el administrador puede eliminar ventas' });
      return;
    }

    setShowConfirmModal(true);
    setCurrentVenta({ id });
  };

  const confirmDelete = () => {
    const updatedVentas = ventas.filter(v => v && v.id !== currentVenta.id);
    setVentas(updatedVentas);
    localStorage.setItem('ventas', JSON.stringify(updatedVentas));

    setSuccessMessage('Venta eliminada correctamente');
    setTimeout(() => setSuccessMessage(''), 3000);
    setShowConfirmModal(false);
    setCurrentVenta(null);
  };

  const handleEdit = (venta) => {
    if (!venta) return;

    setCurrentVenta(venta);
    setFormData({
      id: venta.id || '',
      cliente: venta.cliente || '',
      autoId: venta.autoId || venta.auto || '',
      autoNombre: venta.autoNombre || '',
      precio: venta.precio ? venta.precio.toString() : '',
      fecha: venta.fecha || new Date().toISOString().split('T')[0],
      estado: venta.estado || 'pendiente',
      vendedor: venta.vendedor || user?.nombre || '',
      metodoPago: venta.metodoPago || 'efectivo'
    });
    setEditing(true);
    setShowModal(true);
    setErrors({});
  };

  const resetForm = () => {
    setFormData({
      id: '',
      cliente: '',
      autoId: '',
      autoNombre: '',
      precio: '',
      fecha: new Date().toISOString().split('T')[0],
      estado: 'pendiente',
      vendedor: user?.nombre || '',
      metodoPago: 'efectivo'
    });
    setEditing(false);
    setCurrentVenta(null);
    setErrors({});
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80
    },
    {
      field: 'cliente',
      headerName: 'Cliente',
      width: 150
    },
    {
      field: 'autoNombre',
      headerName: 'Auto',
      width: 200
    },
    {
      field: 'precio',
      headerName: 'Precio',
      width: 120,
      renderCell: (item) => `$${parseFloat(item.precio || 0).toLocaleString()}`
    },
    {
      field: 'fecha',
      headerName: 'Fecha',
      width: 120
    },
    {
      field: 'vendedor',
      headerName: 'Vendedor',
      width: 150
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 120,
      renderCell: (item) => {
        const estado = item.estado || 'pendiente';
        const bgColor = estado === 'completada' ? 'success' :
          estado === 'cancelada' ? 'danger' : 'warning';
        return <span className={`badge bg-${bgColor}`}>{estado}</span>;
      }
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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-dark">Gestión de Ventas</h2>
        <div className="d-flex gap-2">
          <ExportExcel
            data={ventas}
            filename="ventas_autos_clasicos"
            sheetName="Ventas"
            buttonText="Exportar Excel"
            buttonVariant="success"
          />
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Nueva Venta
          </Button>
          {onClose && (
            <Button variant="secondary" onClick={onClose}>
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </Button>
          )}
        </div>
      </div>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>
          {successMessage}
        </Alert>
      )}

      {errors.general && (
        <Alert variant="danger" onClose={() => setErrors({ ...errors, general: '' })} dismissible>
          {errors.general}
        </Alert>
      )}

      <DataTable
        data={ventas}
        columns={columns}
        pageSize={10}
      />

      {/* Modal para agregar/editar */}
      <Modal
        show={showModal}
        onHide={() => {
          if (formData.cliente || formData.autoId || formData.precio) {
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
          <Modal.Title className="text-dark">{editing ? 'Editar Venta' : 'Nueva Venta'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Cliente *</Form.Label>
              <Form.Control
                type="text"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                isInvalid={!!errors.cliente}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cliente}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Auto *</Form.Label>
              <Form.Select
                value={formData.autoId}
                onChange={handleAutoChange}
                isInvalid={!!errors.autoId}
              >
                <option value="">Seleccione un auto</option>
                {autos.map(auto => (
                  <option key={auto.id} value={auto.id}>
                    {auto.name} - ${auto.price || auto.precio || '0'}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.autoId}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio *</Form.Label>
              <Form.Control
                type="text"
                value={formData.precio ? `$${parseFloat(formData.precio).toLocaleString()}` : ''}
                readOnly
                className="bg-light"
              />
              <small className="text-muted">El precio se carga automáticamente al seleccionar el auto</small>
              <Form.Control.Feedback type="invalid">
                {errors.precio}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Fecha *</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    isInvalid={!!errors.fecha}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fecha}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Estado *</Form.Label>
                  <Form.Select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    isInvalid={!!errors.estado}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.estado}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Método de Pago *</Form.Label>
              <Form.Select
                value={formData.metodoPago}
                onChange={(e) => setFormData({ ...formData, metodoPago: e.target.value })}
                isInvalid={!!errors.metodoPago}
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.metodoPago}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            if (window.confirm('¿Cancelar cambios?')) {
              setShowModal(false);
              resetForm();
            }
          }}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editing ? 'Guardar Cambios' : 'Crear Venta'}
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
          ¿Estás seguro de que quieres eliminar esta venta? Esta acción no se puede deshacer.
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
    </div>
  );
};

export default CrudVentas;