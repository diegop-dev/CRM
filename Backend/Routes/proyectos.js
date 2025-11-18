const express = require('express');
const router = express.Router();
const ProyectoController = require('../Controllers/ProyectosController'); 

// === DEFINICIÓN DE RUTAS PARA PROYECTOS ===

// POST /proyectos/guardar
// Ruta para crear un nuevo proyecto
router.post('/guardar', ProyectoController.guardarProyecto);

// GET /proyectos/buscar
// Se usa con query params: /proyectos/buscar?termino=CRM
router.get('/buscar', ProyectoController.buscarProyecto);

// PUT /proyectos/editar/:id
// Se usa con params: /proyectos/editar/15
router.put('/editar/:id', ProyectoController.editarProyecto);

// GET /proyectos/recientes
// Ruta para obtener los 5 proyectos más recientes (para Editar)
router.get('/recientes', ProyectoController.obtenerProyectosRecientes);

// GET /proyectos/aleatorios (NUEVO)
// Ruta para obtener 5 proyectos aleatorios (para Consultar)
router.get('/aleatorios', ProyectoController.obtenerProyectosAleatorios);


module.exports = router;