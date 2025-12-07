import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

export default function LoginModal({ show, onHide, onRegister, setLoggedUser }) {
  const [data, setData] = useState({ usuario: "", password: "", rememberMe: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const validateForm = () => {
    if (!data.usuario.trim()) {
      setError("El usuario es obligatorio");
      return false;
    }
    if (!data.password.trim()) {
      setError("La contraseña es obligatoria");
      return false;
    }
    if (data.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    return true;
  };
  const handleLogin = () => {
    setError("");
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(
          u => u.usuario === data.usuario && u.password === data.password
        );
        if (!user) {
          setError("Usuario o contraseña incorrectos");
          setLoading(false);
          return;
        }
        // Guardar en sessionStorage
        sessionStorage.setItem("session", JSON.stringify(user));
        if (data.rememberMe) {
          localStorage.setItem("rememberSession", JSON.stringify({
            user: user,
            rememberMe: true,
            timestamp: new Date().getTime()
          }));
        } else {
          localStorage.removeItem("rememberSession");
        }        
        setLoggedUser(user, data.rememberMe);
        setLoading(false);
        onHide();
      } catch (error) {
        setError("Error al iniciar sesión. Intente nuevamente.");
        setLoading(false);
      }
    }, 500);
  };
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Iniciar Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}     
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Usuario *</Form.Label>
            <Form.Control
              value={data.usuario}
              onChange={(e) => setData({ ...data, usuario: e.target.value })}
              disabled={loading}
              isInvalid={!!error && !data.usuario}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña *</Form.Label>
            <Form.Control
              type="password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              disabled={loading}
              isInvalid={!!error && !data.password}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Recordar mi sesión"
              checked={data.rememberMe}
              onChange={(e) => setData({ ...data, rememberMe: e.target.checked })}
              disabled={loading}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onRegister} disabled={loading}>
          Registrar
        </Button>
        <Button variant="primary" onClick={handleLogin} disabled={loading}>
          {loading ? "Validando..." : "Acceder"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}