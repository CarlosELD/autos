import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';

const ExportExcel = ({ 
  data = [], 
  filename = 'exportacion', 
  sheetName = 'Datos',
  buttonText = 'Exportar Excel',
  buttonVariant = 'success',
  disabled = false
}) => {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleExport = () => {
    if (data.length === 0) {
      setMessage('No hay datos para exportar');
      setShowErrorModal(true);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        // Crear worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        // Crear workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName || 'Datos');

        // Generar nombre de archivo
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0];
        const finalFilename = `${filename}_${dateStr}.xlsx`;

        // Descargar archivo
        XLSX.writeFile(workbook, finalFilename);
        
        // Mostrar mensaje de éxito
        setMessage(`Archivo exportado exitosamente: ${finalFilename} (${data.length} filas)`);
        setShowSuccessModal(true);
        
      } catch (error) {
        console.error('Error en exportación:', error);
        setMessage(`Error al exportar: ${error.message}`);
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  return (
    <>
      <Button 
        variant={buttonVariant} 
        onClick={handleExport}
        className="d-flex align-items-center"
        disabled={loading || disabled || data.length === 0}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Exportando...
          </>
        ) : (
          <>
            <i className="bi bi-file-earmark-excel me-2"></i>
            {buttonText}
          </>
        )}
      </Button>

      {/* Modal de éxito */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Exportación Exitosa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de error */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Error en Exportación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShowErrorModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ExportExcel;