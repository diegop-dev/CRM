const { Router } = require("express");
const { 
    guardarFactura,
    actualizarFactura,
    buscarFactura,
    obtenerFacturasRecientes,
    obtenerFacturaPorId,
    obtenerEmpleados
} = require("../Controllers/FacturasController");

const router = Router();

// ================================
// RUTAS DE FACTURAS
// Base URL: /facturas (definido en index.js)
// ================================

// 1. GUARDAR (POST)
// Sube archivo y guarda datos.
// Endpoint: /facturas/guardar-con-archivo
router.post("/guardar-con-archivo", guardarFactura);

// 2. EDITAR (PUT)
// Actualiza datos y reemplaza archivo si se envía uno nuevo.
// Endpoint: /facturas/:id
router.put("/:id", actualizarFactura);

// 3. BUSCAR (GET)
// Busca por folio o cliente.
// Endpoint: /facturas/buscar?folio=...
router.get("/buscar", buscarFactura);

// 4. RECIENTES (GET)
// Obtiene las últimas 10 facturas para la lista inicial.
// Endpoint: /facturas/recientes
router.get("/recientes", obtenerFacturasRecientes);

// 5. OBTENER EMPLEADOS (GET)
// Para llenar el campo de responsable si es necesario.
// Endpoint: /facturas/empleados
router.get("/empleados", obtenerEmpleados);

// 6. OBTENER POR ID (GET)
// Para obtener el detalle completo al seleccionar una factura.
// Endpoint: /facturas/:id
router.get("/:id", obtenerFacturaPorId);

module.exports = router;