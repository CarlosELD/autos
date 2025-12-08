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

let piezas = JSON.parse(localStorage.getItem("piezas"));
  if (!piezas || piezas.length === 0) {
    piezas = [
      {
        id: 1,
        nombre: 'Filtro de aceite',
        descripcion: 'Filtro de aceite para motor V8',
        categoria: 'Motor',
        stock: 50,
        precio: 50,
        proveedor: 'AutoParts SA',
        minimoStock: 10,
        ubicacion: 'Almacén A'
      },
      {
        id: 2,
        nombre: 'Pastillas de freno',
        descripcion: 'Pastillas de freno delanteras',
        categoria: 'Frenos',
        stock: 30,
        precio: 150,
        proveedor: 'BrakeTech',
        minimoStock: 5,
        ubicacion: 'Almacén B'
      }
    ];
    localStorage.setItem("piezas", JSON.stringify(piezas));
  }
  
  let autosGaleria = JSON.parse(localStorage.getItem("autos_galeria"));
  if (!autosGaleria || autosGaleria.length === 0) {
    autosGaleria = [
      {
        id: 1,
        name: 'Ford Mustang Shelby GT 500',
        price: '125000',
        precioNumerico: 125000
      },
      {
        id: 2,
        name: 'BMW M1',
        price: '750000',
        precioNumerico: 750000
      },
      {
        id: 3,
        name: 'Chevrolet Camaro Z28',
        price: '95000',
        precioNumerico: 95000
      },
      {
        id: 4,
        name: 'Datsun 240Z',
        price: '65000',
        precioNumerico: 65000
      },
      {
        id: 5,
        name: 'Ford Bronco',
        price: '70000',
        precioNumerico: 70000
      },
      {
        id: 6,
        name: 'Mercedes Clase G',
        price: '85000',
        precioNumerico: 85000
      }
    ];
    localStorage.setItem("autos_galeria", JSON.stringify(autosGaleria));
  }
}