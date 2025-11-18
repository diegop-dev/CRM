const { Router } = require("express");
const {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio, //Esta función ya contiene la lógica de Multer
  actualizarServicio,
  eliminarServicio,
  obtenerServiciosAleatorios,
  buscarServicio,
  obtenerEmpleados // Aseguramos que obtenerEmpleados esté importada
} = require("../Controllers/ServiciosController.js");

const router = Router();

// ================================
// RUTAS DE SERVICIOS
// ================================

// 🔑 RUTA CLAVE: POST para manejar FormData y Archivos
// El frontend llama a /api/servicios/guardar-con-archivo
router.post("/guardar-con-archivo", crearServicio);

// GET /servicios
router.get("/", obtenerServicios);

// GET /servicios/aleatorios
router.get("/aleatorios", obtenerServiciosAleatorios);

// GET /servicios/buscar?termino=
router.get("/buscar", buscarServicio);

// --- Rutas Genéricas (con :id) ---

// GET /servicios/123
router.get("/:id", obtenerServicioPorId);

// POST /servicios (Ruta antigua, ya no se usa para archivos)
// Si esta ruta está en uso en otro lugar, debes decidir si usarla o no.
// Como la nueva lógica maneja archivos, la dejaremos con el mismo nombre en el controller
// pero el frontend usa la nueva ruta.

// PUT /servicios/123 (Asumimos que actualizarServicio también usa Multer)
router.put("/:id", actualizarServicio);

// DELETE /servicios/123
router.delete("/:id", eliminarServicio);

// Ruta de empleados (necesaria para el frontend)
router.get("/empleados/todos", obtenerEmpleados);

module.exports = router;