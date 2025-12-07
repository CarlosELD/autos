import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Table, Card, Row, Col } from "react-bootstrap";
import DataTable from "./DataTable";
import ExportExcel from "./ExportExcel";

export default function CrudUsuarios({ user }) {
  const [users, setUsers] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingClose, setPendingClose] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: "",
    usuario: "",
    nombre: "",
    correo: "",
    direccion: "",
    telefono: "",
    rol: "empleado",
    password: ""
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      setUsers(storedUsers);

      const storedVentas = JSON.parse(localStorage.getItem("ventas")) || [];
      setVentas(storedVentas);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  //  RESET GENERAL (Formulario + errores)
  const resetForm = () => {
    setFormData({
      id: "",
      usuario: "",
      nombre: "",
      correo: "",
      direccion: "",
      telefono: "",
      rol: "empleado",
      password: ""
    });
    setErrors({});
  };

  // ---------------- VALIDACIONES ----------------
  const validateForm = () => {
    let newErrors = {};

    // Validación de nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    }

    // Validación de usuario
    if (!formData.usuario.trim()) {
      newErrors.usuario = "El usuario es obligatorio";
    } else if (formData.usuario.trim().length < 3) {
      newErrors.usuario = "El usuario debe tener al menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.usuario)) {
      newErrors.usuario = "El usuario solo puede contener letras, números y guiones bajos";
    }

    // Validación de correo
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "El correo no tiene un formato válido";
    }

    // Validación de teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^[0-9]+$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono solo debe contener números";
    } else if (formData.telefono.length < 7) {
      newErrors.telefono = "El teléfono debe tener al menos 7 dígitos";
    }

    // Validación de dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria";
    }

    // Validación de contraseña (solo para nuevos usuarios)
    if (!currentUser && !formData.password.trim()) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (!currentUser && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- MANEJO DE ID ----------------
  const generarNuevoId = () => {
    if (users.length === 0) return 1;
    const ids = users.map((u) => parseInt(u.id)).filter((id) => !isNaN(id));
    const maxId = Math.max(...ids, 0);
    return maxId + 1;
  };

  // ---------------- ADD ----------------
  const handleOpenAdd = () => {
    resetForm();
    setShowAdd(true);
  };

  const handleAddUser = () => {
    if (!validateForm()) return;

    const nuevoUsuario = {
      ...formData,
      id: generarNuevoId(),
      fechaRegistro: new Date().toISOString().split("T")[0]
    };

    const updatedUsers = [...users, nuevoUsuario];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    resetForm();
    setShowAdd(false);
  };

  // ---------------- EDIT ----------------
  const handleOpenEdit = (user) => {
    resetForm();
    setErrors({}); // limpiar validaciones

    setCurrentUser(user);
    setFormData({
      id: user.id,
      usuario: user.usuario,
      nombre: user.nombre,
      correo: user.correo,
      direccion: user.direccion || "",
      telefono: user.telefono || "",
      rol: user.rol,
      password: ""
    });

    setShowEdit(true);
  };

  const handleEditUser = () => {
    if (!validateForm()) return;

    const updatedUsers = users.map((u) =>
      u.id === currentUser.id
        ? {
          ...u,
          ...formData,
          password: formData.password ? formData.password : u.password
        }
        : u
    );

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    resetForm();
    setShowEdit(false);
    setCurrentUser(null);
  };

  // ---------------- DELETE ----------------
  const handleOpenDelete = (user) => {
    setCurrentUser(user);
    setShowDelete(true);
  };

  const handleDeleteUser = () => {
    const updatedUsers = users.filter((u) => u.id !== currentUser.id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setShowDelete(false);
    setCurrentUser(null);
  };

  // ---------------- CIERRES CON ADVERTENCIA ----------------
  const hasUnsavedData = () => {
    return (
      formData.nombre.trim() !== "" ||
      formData.usuario.trim() !== "" ||
      formData.correo.trim() !== "" ||
      formData.telefono.trim() !== ""
    );
  };

  const handleAttemptClose = (modal) => {
    if (hasUnsavedData()) {
      setPendingClose(modal);
      setShowWarning(true);
    } else {
      if (modal === "add") setShowAdd(false);
      if (modal === "edit") setShowEdit(false);
      resetForm();
    }
  };

  const confirmClose = () => {
    resetForm();
    setShowWarning(false);

    if (pendingClose === "add") setShowAdd(false);
    if (pendingClose === "edit") setShowEdit(false);

    setPendingClose(null);
  };

  const cancelWarning = () => {
    setShowWarning(false);
    setPendingClose(null);
  };

  // ---------------- CÁLCULO EMPLEADOS DEL MES ----------------
  const calcularEmpleadosDelMes = () => {
    const ventasCompletadas = ventas.filter((v) => v.estado === "completada" && v.vendedor);
    const ventasPorVendedor = {};

    ventasCompletadas.forEach((venta) => {
      const vendedor = venta.vendedor;
      if (!ventasPorVendedor[vendedor]) {
        ventasPorVendedor[vendedor] = { ventas: 0, total: 0 };
      }
      ventasPorVendedor[vendedor].ventas += 1;
      ventasPorVendedor[vendedor].total += parseFloat(venta.precio) || 0;
    });

    return Object.entries(ventasPorVendedor)
      .map(([nombre, datos]) => {
        const usuario = users.find((u) => u.nombre === nombre);
        return {
          nombre,
          rol: usuario?.rol || "empleado",
          ventas: datos.ventas,
          total: datos.total,
          correo: usuario?.correo || "N/A"
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  const empleadosDelMes = calcularEmpleadosDelMes();

  // ---------------- RENDER ----------------
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "nombre", headerName: "Nombre", width: 150 },
    { field: "usuario", headerName: "Usuario", width: 120 },
    { field: "correo", headerName: "Correo", width: 200 },
    {
      field: "rol",
      headerName: "Rol",
      width: 120,
      renderCell: (item) => {
        const rol = item.rol || "empleado";
        const bgColor = rol === "admin" ? "danger" : rol === "empleado" ? "info" : "secondary";
        return <span className={`badge bg-${bgColor}`}>{rol}</span>;
      }
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 150,
      renderCell: (item) => (
        <div>
          <Button variant="warning" size="sm" onClick={() => handleOpenEdit(item)} className="me-2">
            <i className="bi bi-pencil"></i>
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleOpenDelete(item)}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="container mt-4">

      {/* ENCABEZADO */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-dark">Gestión de Usuarios</h2>
        <div className="d-flex gap-2">
          <ExportExcel
            data={users}
            filename="usuarios_sistema"
            sheetName="Usuarios"
            buttonText="Exportar Excel"
            buttonVariant="success"
          />
          <Button variant="primary" onClick={handleOpenAdd}>
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* TABLA EMPLEADOS DEL MES */}
      {empleadosDelMes.length > 0 && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Header className="bg-warning text-white">
            <h5 className="mb-0">
              <i className="bi bi-trophy me-2"></i>
              Top 5 Empleados del Mes
            </h5>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Ventas Realizadas</th>
                    <th>Total Vendido</th>
                    <th>Correo</th>
                  </tr>
                </thead>
                <tbody>
                  {empleadosDelMes.map((empleado, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{empleado.nombre}</strong>
                        {index === 0 && (
                          <span className="badge bg-success ms-2">
                            <i className="bi bi-star-fill"></i> #1
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge bg-${empleado.rol === "admin" ? "danger" : "info"}`}>
                          {empleado.rol}
                        </span>
                      </td>
                      <td>{empleado.ventas}</td>
                      <td>${empleado.total.toLocaleString()}</td>
                      <td>{empleado.correo}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* TABLA PRINCIPAL */}
      <DataTable data={users} columns={columns} pageSize={10} />

      <Modal show={showEdit} onHide={() => handleAttemptClose("edit")} backdrop="static" keyboard={false} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    isInvalid={!!errors.nombre}
                  />
                  <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Usuario *</Form.Label>
                  <Form.Control
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                    isInvalid={!!errors.usuario}
                  />
                  <Form.Control.Feedback type="invalid">{errors.usuario}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Correo *</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    isInvalid={!!errors.correo}
                  />
                  <Form.Control.Feedback type="invalid">{errors.correo}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono *</Form.Label>
                  <Form.Control
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    isInvalid={!!errors.telefono}
                  />
                  <Form.Control.Feedback type="invalid">{errors.telefono}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nueva Contraseña (dejar en blanco para mantener actual)</Form.Label>
                  <Form.Control
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rol *</Form.Label>
                  <Form.Select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    isInvalid={!!errors.rol}
                  >
                    <option value="empleado">Empleado</option>
                    <option value="admin">Administrador</option>
                    <option value="cliente">Cliente</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.rol}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleAttemptClose("edit")}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditUser}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ---------------- MODAL ADVERTENCIA ---------------- */}
      <Modal show={showWarning} onHide={cancelWarning} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body> Tienes datos escritos en el formulario. ¿Deseas cerrar la ventana? </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cancelWarning}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmClose}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------------- MODAL ELIMINAR ---------------- */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}