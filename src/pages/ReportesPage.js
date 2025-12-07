import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, Tabs, Tab } from 'react-bootstrap';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ExportExcel from '../components/ExportExcel';
import NavbarUser from '../components/NavbarUser';
import * as XLSX from 'xlsx';

const ReportesPage = ({ user, goBack, goToHome, onLogout }) => {
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [piezas, setPiezas] = useState([]);
  const [ventasPiezas, setVentasPiezas] = useState([]);
  const [activeTab, setActiveTab] = useState('empleados');

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
        const fecha = new Date(venta.fecha);
        return fecha.getMonth() === index;
      });

      const total = ventasMes.reduce((sum, venta) => sum + (parseFloat(venta.precio) || 0), 0);

      return {
        mes,
        cantidad: ventasMes.length,
        total: total,
        color: `hsl(${index * 30}, 70%, 50%)`
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

  // COLORS PARA GRÁFICAS
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'];

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

  const empleadosTop = calcularEmpleadosTop();
  const piezasTop = calcularPiezasTop();
  const ventasAnuales = calcularVentasAnuales();
  const estadisticas = calcularEstadisticas();

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
                <Button variant="light" size="sm" onClick={exportarEmpleadosExcel}>
                  <i className="bi bi-download me-2"></i>
                  Exportar Excel
                </Button>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div style={{ width: '100%', height: 400 }}>
                      <ResponsiveContainer>
                        <BarChart data={empleadosTop}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nombre" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="ventas" name="Ventas Realizadas" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
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
                              <td>{index + 1}</td>
                              <td>{empleado.nombre}</td>
                              <td>{empleado.ventas}</td>
                              <td>${empleado.totalVentas.toLocaleString()}</td>
                              <td>${empleado.comisionTotal.toLocaleString()}</td>
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
                <Button variant="light" size="sm" onClick={exportarPiezasExcel}>
                  <i className="bi bi-download me-2"></i>
                  Exportar Excel
                </Button>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div style={{ width: '100%', height: 400 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={piezasTop}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.nombre}: ${entry.cantidad}`}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="cantidad"
                          >
                            {piezasTop.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
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
                          </tr>
                        </thead>
                        <tbody>
                          {piezasTop.map((pieza, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{pieza.nombre}</td>
                              <td>{pieza.cantidad}</td>
                              <td>${pieza.total.toLocaleString()}</td>
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

          <Tab eventKey="ventas" title="Ventas Anuales">
            <Card className="border-0 shadow-sm mt-3">
              <Card.Header className="bg-warning text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Ventas del Año por Mes</h5>
                <Button variant="light" size="sm" onClick={exportarVentasAnualesExcel}>
                  <i className="bi bi-download me-2"></i>
                  Exportar Excel
                </Button>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div style={{ width: '100%', height: 400 }}>
                      <ResponsiveContainer>
                        <LineChart data={ventasAnuales}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="cantidad" stroke="#82ca9d" />
                        </LineChart>
                      </ResponsiveContainer>
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
                          </tr>
                        </thead>
                        <tbody>
                          {ventasAnuales.map((mes, index) => (
                            <tr key={index}>
                              <td>{mes.mes}</td>
                              <td>{mes.cantidad}</td>
                              <td>${mes.total.toLocaleString()}</td>
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
        </Tabs>
      </div>
    </>
  );
};

export default ReportesPage;