const { Router } = require("express");
const {
  guardarEmpleado,
  consultarEmpleado,
  buscarEmpleado,
  editarEmpleadoPorNombre,
  editarEmpleadoPorId,
  buscarEmpleadoPorUsuario,
  obtenerTodosLosEmpleados,
  obtenerEmpleadosAleatorios,
} = require("../Controllers/EmpleadosController"); 

const router = Router();

// 1. Crear un nuevo empleado
// URL: POST http://localhost:3000/empleados
router.post("/", guardarEmpleado);

// 2. Obtener todos los empleados
// URL: GET http://localhost:3000/empleados/todos
router.get("/todos", obtenerTodosLosEmpleados);

// 3. Obtener empleados aleatorios
// URL: GET http://localhost:3000/empleados/aleatorios
router.get("/aleatorios", obtenerEmpleadosAleatorios);

// 4. Buscar empleados (general)
// URL: GET http://localhost:3000/empleados/buscar?termino=...
router.get("/buscar", buscarEmpleado);

// 5. Buscar empleado por usuario (para validaciones)
// URL: GET http://localhost:3000/empleados/buscarusuario?termino=...
router.get("/buscarusuario", buscarEmpleadoPorUsuario);

// 6. Consultar empleado por ID
// URL: GET http://localhost:3000/empleados/15
router.get("/:idEmpleado", consultarEmpleado);

// 7. Editar empleado por ID
// URL: PUT http://localhost:3000/empleados/15
router.put("/:idEmpleado", editarEmpleadoPorId);

// 8. Editar empleado por Nombre (Ruta especial)
// URL: PUT http://localhost:3000/empleados/editarPorNombre
router.put("/editarPorNombre", editarEmpleadoPorNombre);

module.exports = router;