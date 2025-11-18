const express = require("express");
const router = express.Router();
const inventarioController = require("../Controllers/InventariosController"); // Ajusta esta ruta si es necesario

// Ruta para obtener todos los empleados
router.get("/empleados/todos", inventarioController.obtenerEmpleados);

// Rutas CRUD para Productos
router.post("/productos/guardar", inventarioController.guardarProducto);
router.get("/productos/buscar/:id", inventarioController.obtenerProductoPorId); // Obtener un producto por ID
router.put("/productos/editar/:id", inventarioController.editarProducto);

// RUTAS PARA BÚSQUEDA Y LISTADO
router.get("/productos/buscar", inventarioController.buscarProducto); // Búsqueda por término (Query parameter: ?termino=...)
router.get("/productos/aleatorios", inventarioController.obtenerProductosAleatorios); // Listado inicial

module.exports = router;