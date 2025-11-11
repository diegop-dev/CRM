const express = require("express");
const router = express.Router();
const {
  guardarEmpleado,
  consultarEmpleado,
  buscarEmpleado,
  editarEmpleadoPorId,
  obtenerTodosLosEmpleados,
  obtenerEmpleadosAleatorios,
  buscarEmpleadoPorUsuario, // <-- 1. IMPORTAMOS LA NUEVA FUNCIÓN
} = require("../Controllers/EmpleadosController");

// ------------------------------------
// RUTAS PRINCIPALES
// ------------------------------------

// Guardar un nuevo empleado
// (POST /empleados/guardar)
router.post("/guardar", guardarEmpleado);

// Editar Empleado por ID (La forma correcta)
// (PUT /empleados/editar/123)
router.put("/editar/:idEmpleado", editarEmpleadoPorId);

// Consultar empleado por ID
// (GET /empleados/consultar/123)
router.get("/consultar/:idEmpleado", consultarEmpleado);

// Buscar empleado por nombre o usuario (Usada por "Editar Empleado")
// (GET /empleados/buscar?termino=...)
router.get("/buscar", buscarEmpleado);

// Buscar empleado POR USUARIO (Usada por "Consultar Empleado")
// (GET /empleados/buscar/usuario?termino=...)
router.get("/buscar/usuario", buscarEmpleadoPorUsuario); // <-- 2. AÑADIMOS LA NUEVA RUTA

// ------------------------------------
// OTRAS RUTAS
// ------------------------------------
// ... (resto de tus rutas) ...
router.get("/todos", obtenerTodosLosEmpleados);
router.get("/aleatorios", obtenerEmpleadosAleatorios);
// ...

module.exports = router;