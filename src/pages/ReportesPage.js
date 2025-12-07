import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import ExportExcel from '../components/ExportExcel';
import NavbarUser from '../components/NavbarUser';

const ReportesPage = ({ user, goBack, goToHome, onLogout }) => {
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [piezas, setPiezas] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    try {
      const ventasData = JSON.parse(localStorage.getItem('ventas')) || [];
      const usuariosData = JSON.parse(localStorage.getItem('users')) || [];
      const piezasData = JSON.parse(localStorage.getItem('piezas')) || [];

      setVentas(ventasData);
      setUsuarios(usuariosData);
      setPiezas(piezasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Calcular ventas por mes
  const calcularVentasPorMes = () => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const ventasPorMes = meses.map((mes, index) => {
      const ventasMes = ventas.filter(venta => {
        if (!venta.fecha) return false;
        const fecha = new Date(venta.fecha);
        return fecha.getMonth() === index;
      });

      const total = ventasMes.reduce((sum, venta) => {
        return sum + (parseFloat(venta.precio) || 0);
      }, 0);

      return {
        mes,
        cantidad: ventasMes.length,
        total: total,
        color: `hsl(${index * 30}, 70%, 50%)`
      };
    });

    return ventasPorMes;
  };

  // Calcular ventas por vendedor (empleados del mes)
  const calcularEmpleadosDelMes = () => {
    const ventasCompletadas = ventas.filter(v => v.estado === 'completada');
    const ventasPorVendedor = {};

    ventasCompletadas.forEach(venta => {
      const vendedor = venta.vendedor || 'Sin nombre';
      if (!ventasPorVendedor[vendedor]) {
        ventasPorVendedor[vendedor] = {
          cantidad: 0,
          total: 0
        };
      }
      ventasPorVendedor[vendedor].cantidad += 1;
      ventasPorVendedor[vendedor].total += parseFloat(venta.precio) || 0;
    });

    return Object.entries(ventasPorVendedor)
      .map(([vendedor, datos]) => ({
        vendedor,
        cantidad: datos.cantidad,
        total: datos.total
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10
  };

  // Calcular ventas por auto
  const calcularVentasPorAuto = () => {
    const ventasPorAuto = {};

    ventas.forEach(venta => {
      const auto = venta.autoNombre || 'Sin nombre';
      if (!ventasPorAuto[auto]) {
        ventasPorAuto[auto] = {
          cantidad: 0,
          total: 0
        };
      }
      ventasPorAuto[auto].cantidad += 1;
      ventasPorAuto[auto].total += parseFloat(venta.precio) || 0;
    });

    return Object.entries(ventasPorAuto)
      .map(([auto, datos]) => ({
        auto,
        cantidad: datos.cantidad,
        total: datos.total
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  };

  // Calcular estadísticas generales
  const calcularEstadisticas = () => {
    const ventasCompletadas = ventas.filter(v => v.estado === 'completada');
    const totalVentas = ventasCompletadas.length;
    const totalIngresos = ventasCompletadas.reduce((sum, v) => sum + (parseFloat(v.precio) || 0), 0);
    const promedioVenta = totalVentas > 0 ? totalIngresos / totalVentas : 0;
    
    // Obtener mes actual
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const ventasMesActual = ventasCompletadas.filter(v => {
      if (!v.fecha) return false;
      return new Date(v.fecha).getMonth() === mesActual;
    });
    const ingresosMesActual = ventasMesActual.reduce((sum, v) => sum + (parseFloat(v.precio) || 0), 0);

    return {
      totalVentas,
      totalIngresos,
      promedioVenta,
      ventasMesActual: ventasMesActual.length,
      ingresosMesActual
    };
  };

  const handleExportPersonalizado = (dataType) => {
    let dataToExport = [];
    let columns = [];
    let filename = '';

    switch (dataType) {
      case 'ventas':
        dataToExport = ventas;
        columns = ['ID', 'Cliente', 'Auto', 'Precio', 'Fecha', 'Estado', 'Vendedor', 'Método de Pago'];
        filename = 'reporte_ventas';
        break;
      case 'empleados':
        dataToExport = calcularEmpleadosDelMes();
        columns = ['Vendedor', 'Cantidad de Ventas', 'Total Vendido'];
        filename = 'empleados_del_mes';
        break;
      case 'autos':
        dataToExport = calcularVentasPorAuto();
        columns = ['Auto', 'Cantidad Vendida', 'Total Vendido'];
        filename = 'ventas_por_auto';
        break;
      default:
        return;
    }

    setExportData(dataToExport);
    setExportColumns(columns);
    setShowExportModal(true);
  };

  const renderBarChart = (data, title, valueKey = 'total', labelKey = 'mes', height = 300) => {
    if (data.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-muted">No hay datos para mostrar</p>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(item => item[valueKey]));
    
    return (
      <div className="simple-bar-chart" style={{ height: `${height}px` }}>
        <h6 className="mb-3 text-dark">{title}</h6>
        {data.map((item, index) => (
          <div key={index} className="bar-item mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span className="bar-label text-dark">{item[labelKey]}</span>
              <span className="bar-value text-dark">
                {valueKey === 'total' ? `$${item[valueKey].toLocaleString()}` : item[valueKey]}
              </span>
            </div>
            <div className="bar-container bg-light" style={{ height: '20px', borderRadius: '4px' }}>
              <div 
                className="bar-fill" 
                style={{ 
                  width: `${(item[valueKey] / maxValue) * 100}%`,
                  backgroundColor: item.color || '#3498db',
                  height: '100%',
                  borderRadius: '4px'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const estadisticas = calcularEstadisticas();
  const ventasPorMes = calcularVentasPorMes();
  const empleadosDelMes = calcularEmpleadosDelMes();
  const ventasPorAuto = calcularVentasPorAuto();

  return (
    <>
      <NavbarUser
        user={user}
        onLogout={onLogout}
        goToHome={goToHome}
        goToContacto={() => {}}
        goToReportes={() => {}}
        goToAdmin={() => {}}
        goToPiezas={() => {}}
      />
      
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h1 className="text-dark">Reportes y Estadísticas</h1>
            <p className="text-muted">Análisis detallado de ventas y desempeño</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="success" onClick={() => handleExportPersonalizado('ventas')}>
              <i className="bi bi-download me-2"></i>
              Exportar Ventas
            </Button>
            <Button variant="secondary" onClick={goBack}>
              <i className="bi bi-arrow-left me-2"></i>
              Volver
            </Button>
          </div>
        </div>

        {/* Estadísticas generales */}
        <Row className="mb-5">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="bg-primary text-white rounded">
                <h5 className="card-title">Ventas Totales</h5>
                <h3>{estadisticas.totalVentas}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="bg-success text-white rounded">
                <h5 className="card-title">Ingresos Totales</h5>
                <h3>${estadisticas.totalIngresos.toLocaleString()}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="bg-warning text-white rounded">
                <h5 className="card-title">Promedio por Venta</h5>
                <h3>${estadisticas.promedioVenta.toLocaleString()}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="bg-info text-white rounded">
                <h5 className="card-title">Ventas Este Mes</h5>
                <h3>{estadisticas.ventasMesActual}</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Gráficas y tablas */}
        <Row className="mb-5">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Ventas por Mes</h5>
              </Card.Header>
              <Card.Body>
                {renderBarChart(ventasPorMes, 'Ingresos Mensuales', 'total', 'mes')}
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => handleExportPersonalizado('ventas')}
                  className="mt-3"
                >
                  <i className="bi bi-download me-2"></i>
                  Exportar Datos
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-success text-white">
                <h5 className="mb-0">Top 10 Empleados del Mes</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table striped hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Vendedor</th>
                        <th>Ventas</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empleadosDelMes.map((empleado, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{empleado.vendedor}</td>
                          <td>{empleado.cantidad}</td>
                          <td>${empleado.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <Button 
                  variant="outline-success" 
                  size="sm" 
                  onClick={() => handleExportPersonalizado('empleados')}
                  className="mt-2"
                >
                  <i className="bi bi-download me-2"></i>
                  Exportar Ranking
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-warning text-white">
                <h5 className="mb-0">Autos Más Vendidos</h5>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table striped hover size="sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Auto</th>
                        <th>Unidades</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventasPorAuto.map((auto, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{auto.auto}</td>
                          <td>{auto.cantidad}</td>
                          <td>${auto.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <Button 
                  variant="outline-warning" 
                  size="sm" 
                  onClick={() => handleExportPersonalizado('autos')}
                  className="mt-2"
                >
                  <i className="bi bi-download me-2"></i>
                  Exportar Lista
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">Resumen Detallado</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h6>Estado de Ventas:</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Completadas:</span>
                    <span className="badge bg-success">
                      {ventas.filter(v => v.estado === 'completada').length}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Pendientes:</span>
                    <span className="badge bg-warning">
                      {ventas.filter(v => v.estado === 'pendiente').length}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Canceladas:</span>
                    <span className="badge bg-danger">
                      {ventas.filter(v => v.estado === 'cancelada').length}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h6>Métodos de Pago:</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Efectivo:</span>
                    <span>{ventas.filter(v => v.metodoPago === 'efectivo').length}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tarjeta:</span>
                    <span>{ventas.filter(v => v.metodoPago === 'tarjeta').length}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Transferencia:</span>
                    <span>{ventas.filter(v => v.metodoPago === 'transferencia').length}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal para exportación personalizada */}
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Exportar Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <p>Se exportarán {exportData.length} registros con las siguientes columnas:</p>
            <ul>
              {exportColumns.map((col, index) => (
                <li key={index}>{col}</li>
              ))}
            </ul>
            
            {exportData.length > 0 && (
              <div className="table-responsive mt-3" style={{ maxHeight: '300px' }}>
                <Table striped hover size="sm">
                  <thead>
                    <tr>
                      {exportColumns.map((col, index) => (
                        <th key={index}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {exportData.slice(0, 5).map((item, index) => (
                      <tr key={index}>
                        {exportColumns.map((col, colIndex) => (
                          <td key={colIndex}>
                            {item[col] || item[col.toLowerCase()] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {exportData.length > 5 && (
                  <p className="text-muted text-center">
                    Mostrando 5 de {exportData.length} registros
                  </p>
                )}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            Cancelar
          </Button>
          <ExportExcel
            data={exportData}
            filename="exportacion_personalizada"
            sheetName="Datos"
            buttonText="Exportar a Excel"
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ReportesPage;