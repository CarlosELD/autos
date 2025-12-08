import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalConfirmacion = ({
  show,
  onHide,
  onConfirm,
  title = "Confirmar Eliminación",
  message = "¿Estás seguro de que quieres eliminar este registro?",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  variant = "danger"
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmacion;