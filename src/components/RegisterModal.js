import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function RegisterModal({ show, onHide }) {
  const [data, setData] = useState({
    usuario: "",
    nombre: "",
    correo: "",
    direccion: "",
    telefono: "",
    password: "",
    rol: "user",
  });

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.usuario === data.usuario)) {
      alert("Ese usuario ya existe");
      return;
    }

    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Usuario registrado");
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Usuario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {[
            ["usuario", "Usuario"],
            ["nombre", "Nombre"],
            ["correo", "Correo"],
            ["direccion", "Dirección"],
            ["telefono", "Teléfono"],
          ].map(([key, label]) => (
            <Form.Group className="mb-2" key={key}>
              <Form.Label>{label}</Form.Label>
              <Form.Control
                value={data[key]}
                onChange={(e) =>
                  setData({ ...data, [key]: e.target.value })
                }
              />
            </Form.Group>
          ))}

          <Form.Group>
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}