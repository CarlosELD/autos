import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Tabs, Tab } from 'react-bootstrap';
import ExportExcel from '../components/ExportExcel';
import NavbarUser from '../components/NavbarUser';
import * as XLSX from 'xlsx';

const ReportesPage = ({ user, goBack, goToHome, onLogout }) => {
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [piezas, setPiezas] = useState([]);
  const [ventasPiezas, setVentasPiezas] = useState([]);
  const [activeTab, setActiveTab] = useState('empleados');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    try {
      const ventasData = JSON.parse(localStorage.getItem('ventas')) || [];
      const usuariosData = JSON.parse(localStorage.getItem('users')) || [];
      const piezasData = JSON.parse(localStorage.getItem('piezas')) || [];
      const ventasPiezasData = JSON.parse(localStorage.getItem('ventasPiezas')) || [];

      setVentas(ventasData);
      setUsuarios(usuariosData);
      setPiezas(piezasData);
      setVentasPiezas(ventasPiezasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 1. EMPLEADOS QUE MÁS VEHÍCULOS HAN VENDIDO
  const calcularEmpleadosTop = () => {
    const empleados = usuarios.filter(u => u.rol === 'empleado' || u.rol === 'admin');
    
    const ventasPorEmpleado = empleados.map(empleado => {
      const ventasEmpleado = ventas.filter(v => v.vendedor === empleado.nombre);
      const totalVentas = ventasEmpleado.reduce((sum, v) => sum + (parseFloat(v.precio) || 0), 0);
      
      return {
        nombre: empleado.nombre,
        ventas: ventasEmpleado.length,
        totalVentas: totalVentas,
        comisionTotal: ventasEmpleado.reduce((sum, v) => sum + (parseFloat(v.comision) || 0), 0)
      };
    });

    return ventasPorEmpleado.sort((a, b) => b.ventas - a.ventas).slice(0, 10);
  };

  // 2. PIEZAS MÁS VENDIDAS
  const calcularPiezasTop = () => {
    // Agrupar ventas de piezas por nombre
    const ventasAgrupadas = {};
    
    ventasPiezas.forEach(venta => {
      const nombre = venta.nombre;
      if (!ventasAgrupadas[nombre]) {
        ventasAgrupadas[nombre] = {
          nombre: nombre,
          cantidad: 0,
          total: 0
        };
      }
      ventasAgrupadas[nombre].cantidad += venta.cantidad;
      ventasAgrupadas[nombre].total += venta.total || 0;
    });

    return Object.values(ventasAgrupadas).sort((a, b) => b.cantidad - a.cantidad).slice(0, 10);
  };

  // 3. VENTAS DEL AÑO POR MES
  const calcularVentasAnuales = () => {
    const meses = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    const ventasPorMes = meses.map((mes, index) => {
      const ventasMes = ventas.filter(venta => {
        if (!venta.fecha) return false;
        try {
          const fecha = new Date(venta.fecha);
          return fecha.getMonth() === index;
        } catch {
          return false;
        }
      });

      const total = ventasMes.reduce((sum, venta) => sum + (parseFloat(venta.precio) || 0), 0);

      return {
        mes,
        cantidad: ventasMes.length,
        total: total
      };
    });

    return ventasPorMes;
  };

  // 4. ESTADÍSTICAS GENERALES
  const calcularEstadisticas = () => {
    const ventasCompletadas = ventas.filter(v => v.estado === 'completada');
    const totalVentas = ventasCompletadas.length;
    const totalIngresos = ventasCompletadas.reduce((sum, v) => sum + (parseFloat(v.precio) || 0), 0);
    const promedioVenta = totalVentas > 0 ? totalIngresos / totalVentas : 0;
    
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const ventasMesActual = ventasCompletadas.filter(v => {
      if (!v.fecha) return false;
      try {
        return new Date(v.fecha).getMonth() === mesActual;
      } catch {
        return false;
      }
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

  // FUNCIONES DE EXPORTACIÓN
  const exportarEmpleadosExcel = () => {
    const data = calcularEmpleadosTop().map((emp, index) => ({
      'Posición': index + 1,
      'Nombre': emp.nombre,
      'Ventas Realizadas': emp.ventas,
      'Total Vendido': emp.totalVentas,
      'Comisión Total': emp.comisionTotal
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Empleados_Top");
    XLSX.writeFile(wb, 'empleados_top.xlsx');
  };

  const exportarPiezasExcel = () => {
    const data = calcularPiezasTop().map((pieza, index) => ({
      'Posición': index + 1,
      'Nombre': pieza.nombre,
      'Cantidad Vendida': pieza.cantidad,
      'Total Ventas': pieza.total
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Piezas_Top");
    XLSX.writeFile(wb, 'piezas_top.xlsx');
  };

  const exportarVentasAnualesExcel = () => {
    const data = calcularVentasAnuales().map(mes => ({
      'Mes': mes.mes,
      'Cantidad de Ventas': mes.cantidad,
      'Total Vendido': mes.total
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas_Anuales");
    XLSX.writeFile(wb, 'ventas_anuales.xlsx');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  const empleadosTop = calcularEmpleadosTop();
  const piezasTop = calcularPiezasTop();
  const ventasAnuales = calcularVentasAnuales();
  const estadisticas = calcularEstadisticas();

  // Función para crear una barra de progreso simple para visualización
  const ProgressBar = ({ value, max = 100, color = 'primary', label }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="mb-3">
        <div className="d-flex justify-content-between mb-1">
          <small>{label}</small>
          <small>{value}</small>
        </div>
        <div className="progress" style={{ height: '10px' }}>
          <div 
            className={`progress-bar bg-${color}`} 
            role="progressbar" 
            style={{ width: `${Math.min(percentage, 100)}%` }}
            aria-valuenow={percentage}
            aria-valuemin="0" 
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    );
  };

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
          <Button variant="secondary" onClick={goBack}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </Button>
        </div>

        {/* Estadísticas generales */}
        <Row className="mb-5">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="bg-primary text-white rounded">
                <h5 className="card-title">Ventas Totales</h5>
                <h3>{estadisticas.totalVentas}</h3>
                <small className="opacity-75">Vehículos vendidos</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="bg-success text-white rounded">
                <h5 className="card-title">Ingresos Totales</h5>
                <h3>${estadisticas.totalIngresos.toLocaleString()}</h3>
                <small className="opacity-75">Total en ventas</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="bg-warning text-white rounded">
                <h5 className="card-title">Promedio por Venta</h5>
                <h3>${estadisticas.promedioVenta.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                <small className="opacity-75">Promedio por transacción</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="bg-info text-white rounded">
                <h5 className="card-title">Ventas Este Mes</h5>
                <h3>{estadisticas.ventasMesActual}</h3>
                <small className="opacity-75">${estadisticas.ingresosMesActual.toLocaleString()}</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tabs para diferentes reportes */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab eventKey="empleados" title="Top Empleados">
            <Card className="border-0 shadow-sm mt-3">
              <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Top 10 Empleados con Más Ventas</h5>
                <div>
                  <ExportExcel
                    data={empleadosTop}
                    filename="empleados_top"
                    sheetName="Empleados"
                    buttonText="Exportar"
                    buttonVariant="light"
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="p-3 border rounded">
                      <h6 className="mb-3">Ventas por Empleado</h6>
                      {empleadosTop.map((empleado, index) => {
                        const maxVentas = Math.max(...empleadosTop.map(e => e.ventas));
                        return (
                          <ProgressBar
                            key={index}
                            value={empleado.ventas}
                            max={maxVentas}
                            color={index === 0 ? 'success' : index === 1 ? 'warning' : index === 2 ? 'info' : 'primary'}
                            label={`${index + 1}. ${empleado.nombre}`}
                          />
                        );
                      })}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Ventas</th>
                            <th>Total Vendido</th>
                            <th>Comisión Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {empleadosTop.map((empleado, index) => (
                            <tr key={index}>
                              <td>
                                <span className={`badge ${index === 0 ? 'bg-success' : index === 1 ? 'bg-warning' : index === 2 ? 'bg-info' : 'bg-secondary'}`}>
                                  {index + 1}
                                </span>
                              </td>
                              <td>
                                <strong>{empleado.nombre}</strong>
                                {index === 0 && <span className="badge bg-success ms-2">Top 1</span>}
                              </td>
                              <td>
                                <span className="badge bg-primary">{empleado.ventas}</span>
                              </td>
                              <td>${empleado.totalVentas.toLocaleString()}</td>
                              <td>
                                <span className="badge bg-warning">
                                  ${empleado.comisionTotal.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="piezas" title="Piezas Más Vendidas">
            <Card className="border-0 shadow-sm mt-3">
              <Card.Header className="bg-success text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Top 10 Piezas Más Vendidas</h5>
                <div>
                  <ExportExcel
                    data={piezasTop}
                    filename="piezas_top"
                    sheetName="Piezas"
                    buttonText="Exportar"
                    buttonVariant="light"
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="p-3 border rounded">
                      <h6 className="mb-3">Distribución de Ventas</h6>
                      {piezasTop.map((pieza, index) => {
                        const maxCantidad = Math.max(...piezasTop.map(p => p.cantidad));
                        return (
                          <ProgressBar
                            key={index}
                            value={pieza.cantidad}
                            max={maxCantidad}
                            color={index === 0 ? 'success' : index === 1 ? 'warning' : index === 2 ? 'info' : 'primary'}
                            label={`${index + 1}. ${pieza.nombre}`}
                          />
                        );
                      })}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Pieza</th>
                            <th>Cantidad Vendida</th>
                            <th>Total Ventas</th>
                            <th>Promedio por Unidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {piezasTop.map((pieza, index) => {
                            const promedio = pieza.cantidad > 0 ? pieza.total / pieza.cantidad : 0;
                            return (
                              <tr key={index}>
                                <td>
                                  <span className={`badge ${index === 0 ? 'bg-success' : index === 1 ? 'bg-warning' : index === 2 ? 'bg-info' : 'bg-secondary'}`}>
                                    {index + 1}
                                  </span>
                                </td>
                                <td>
                                  <strong>{pieza.nombre}</strong>
                                  {index === 0 && <span className="badge bg-success ms-2">Más Vendida</span>}
                                </td>
                                <td>
                                  <span className="badge bg-primary">{pieza.cantidad}</span>
                                </td>
                                <td>${pieza.total.toLocaleString()}</td>
                                <td>
                                  <span className="badge bg-info">
                                    ${promedio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="ventas" title="Ventas Anuales">
            <Card className="border-0 shadow-sm mt-3">
              <Card.Header className="bg-warning text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Ventas del Año por Mes</h5>
                <div>
                  <Button variant="light" size="sm" onClick={exportarVentasAnualesExcel} className="me-2">
                    <i className="bi bi-download me-1"></i>
                    Excel
                  </Button>
                  <ExportExcel
                    data={ventasAnuales}
                    filename="ventas_anuales"
                    sheetName="Ventas"
                    buttonText="Exportar"
                    buttonVariant="light"
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="p-3 border rounded">
                      <h6 className="mb-3">Ventas Mensuales</h6>
                      {ventasAnuales.map((mes, index) => {
                        const maxTotal = Math.max(...ventasAnuales.map(v => v.total));
                        return (
                          <ProgressBar
                            key={index}
                            value={mes.total}
                            max={maxTotal}
                            color={mes.total > 0 ? 'success' : 'secondary'}
                            label={`${mes.mes} - ${mes.cantidad} ventas`}
                          />
                        );
                      })}
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="table-responsive">
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Mes</th>
                            <th>Cantidad de Ventas</th>
                            <th>Total Vendido</th>
                            <th>Promedio por Venta</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ventasAnuales.map((mes, index) => {
                            const promedio = mes.cantidad > 0 ? mes.total / mes.cantidad : 0;
                            return (
                              <tr key={index}>
                                <td>
                                  <strong>{mes.mes}</strong>
                                </td>
                                <td>
                                  <span className="badge bg-primary">{mes.cantidad}</span>
                                </td>
                                <td>${mes.total.toLocaleString()}</td>
                                <td>
                                  <span className="badge bg-info">
                                    ${promedio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default ReportesPage;