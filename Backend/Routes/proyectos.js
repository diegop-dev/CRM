const express = require('express');
const router = express.Router();
// OJO: Asegúrate que el nombre 'ProyectosController' coincida con tu archivo
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

// GET /proyectos/recientes (NUEVO)
// Ruta para obtener los 5 proyectos más recientes
router.get('/recientes', ProyectoController.obtenerProyectosRecientes);

// GET /proyectos/todos
// (Esta ruta aún no la hemos creado en el controlador)
// router.get('/todos', ProyectoController.obtenerTodosLosProyectos);


module.exports = router;