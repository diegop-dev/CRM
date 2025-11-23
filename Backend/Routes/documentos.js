const { Router } = require("express");
const { 
    crearDocumento, 
    actualizarDocumento,
    obtenerDocumentos,
    buscarDocumento,
    obtenerDocumentosAleatorios,
    obtenerDocumentoPorId
} = require("../Controllers/DocumentosController");

const router = Router();

// ================================
// DEFINICIÓN DE RUTAS
// ================================

// 1. Crear nuevo documento (con archivo)
router.post("/guardar-con-archivo", crearDocumento);

// 2. Actualizar documento existente (con o sin archivo nuevo)
router.put("/:id", actualizarDocumento);

// 3. Buscar documentos por término
router.get("/buscar", buscarDocumento);

// 4. Obtener documentos aleatorios (carga inicial)
router.get("/aleatorios", obtenerDocumentosAleatorios);

// 5. Obtener un documento específico
router.get("/:id", obtenerDocumentoPorId);

// 6. Listar todos los documentos (general)
router.get("/", obtenerDocumentos);

module.exports = router;