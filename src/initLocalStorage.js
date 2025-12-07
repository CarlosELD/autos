export function initializeLocalStorage() {
  // Limpiar session corrupta
  try {
    const session = JSON.parse(localStorage.getItem("session"));
    if (session && typeof session !== "object") {
      localStorage.removeItem("session");
    }
  } catch {
    localStorage.removeItem("session");
  }

  let users = JSON.parse(localStorage.getItem("users"));
  let ventas = JSON.parse(localStorage.getItem("ventas"));
  let contactos = JSON.parse(localStorage.getItem("contactos"));

  // Crear usuarios iniciales si no existen
  if (!users || users.length === 0) {
    users = [
      {
        id: 1,
        usuario: "admin",
        password: "admin123",
        nombre: "Administrador",
        correo: "admin@system.com",
        direccion: "Calle Principal 123",
        telefono: "555-1234",
        rol: "admin",
        genero: "Masculino",
        tipo: "Administrador"
      },
      {
        id: 2,
        usuario: "empleado1",
        password: "empleado123",
        nombre: "Juan Pérez",
        correo: "juan@empresa.com",
        direccion: "Avenida Central 456",
        telefono: "555-5678",
        rol: "empleado",
        genero: "Masculino",
        tipo: "Empleado"
      },
      {
        id: 3,
        usuario: "cliente1",
        password: "cliente123",
        nombre: "María García",
        correo: "maria@cliente.com",
        direccion: "Boulevard Norte 789",
        telefono: "555-9012",
        rol: "cliente",
        genero: "Femenino",
        tipo: "Cliente"
      }
    ];
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Crear ventas iniciales de ejemplo
  if (!ventas || ventas.length === 0) {
    ventas = [
      {
        id: 1,
        cliente: "Carlos Rodríguez",
        auto: "Ford Mustang Shelby GT 500",
        precio: "125000",
        fecha: "2024-01-15",
        estado: "completada",
        vendedor: "Juan Pérez",
        comision: "10"
      },
      {
        id: 2,
        cliente: "Ana Martínez",
        auto: "Chevrolet Camaro Z28",
        precio: "95000",
        fecha: "2024-02-20",
        estado: "pendiente",
        vendedor: "Juan Pérez",
        comision: "8"
      }
    ];
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }

  // Crear contactos iniciales de ejemplo
  if (!contactos || contactos.length === 0) {
    contactos = [
      {
        id: 1,
        nombre: "Roberto Sánchez",
        email: "roberto@email.com",
        telefono: "555-2345",
        mensaje: "Interesado en el Ford Mustang",
        fecha: "2024-01-10",
        estado: "respondido"
      },
      {
        id: 2,
        nombre: "Laura Fernández",
        email: "laura@email.com",
        telefono: "555-6789",
        mensaje: "Consulta sobre renta de autos clásicos",
        fecha: "2024-02-05",
        estado: "pendiente"
      }
    ];
    localStorage.setItem("contactos", JSON.stringify(contactos));
  }

  let ventasPiezas = JSON.parse(localStorage.getItem("ventasPiezas"));
  if (!ventasPiezas || ventasPiezas.length === 0) {
    ventasPiezas = [
      {
        id: 1,
        piezaId: 1,
        nombre: "Filtro de aceite",
        cantidad: 10,
        total: 500,
        fecha: "2024-01-15",
        cliente: "Taller Mecánico Central"
      },
      {
        id: 2,
        piezaId: 2,
        nombre: "Pastillas de freno",
        cantidad: 8,
        total: 1200,
        fecha: "2024-02-20",
        cliente: "Auto Servicio Express"
      },
      {
        id: 3,
        piezaId: 3,
        nombre: "Batería",
        cantidad: 5,
        total: 2500,
        fecha: "2024-03-10",
        cliente: "Taller Eléctrico"
      },
      {
        id: 4,
        piezaId: 4,
        nombre: "Amortiguadores",
        cantidad: 4,
        total: 3200,
        fecha: "2024-04-05",
        cliente: "Suspensión Profesional"
      },
      {
        id: 5,
        piezaId: 5,
        nombre: "Aceite de motor",
        cantidad: 20,
        total: 800,
        fecha: "2024-05-12",
        cliente: "Lubricantes SA"
      }
    ];
    localStorage.setItem("ventasPiezas", JSON.stringify(ventasPiezas));
  }
}