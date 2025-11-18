const express = require('express');
const router = express.Router();
const ClientesController = require('../Controllers/ClientesController'); 

// === DEFINICIÓN DE RUTAS PARA CLIENTES ===

// 1. POST /clientes/guardar
// Ruta para crear un nuevo cliente
router.post('/guardar', ClientesController.guardarCliente);

// 2. GET /clientes/aleatorios
// Ruta para obtener 5 clientes aleatorios (para la pantalla inicial de Editar/Consultar)
router.get('/aleatorios', ClientesController.obtenerClientesAleatorios);

// 3. GET /clientes/buscar
// Ruta para buscar clientes por nombre (query param: ?termino=Juan)
router.get('/buscar', ClientesController.buscarCliente);

// 4. GET /clientes/consultar/:id
// Ruta para obtener todos los datos de un cliente específico por ID
router.get('/consultar/:id', ClientesController.consultarClientePorId);

// 5. PUT /clientes/editar/:id
// Ruta para actualizar los datos de un cliente existente
router.put('/editar/:id', ClientesController.editarCliente);


module.exports = router;