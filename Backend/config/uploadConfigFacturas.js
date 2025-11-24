const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Apuntamos a la carpeta que ya creaste: 'uploads/documentos'
// Usamos '..' para salir de la carpeta 'config' y buscar 'uploads' en la raíz del backend.
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'facturas');

// Verificación de seguridad: Aunque ya la tengas, esto evita que el servidor se caiga si se borra accidentalmente.
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 1. Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Indicamos a Multer que guarde aquí
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Generamos un nombre único para evitar sobrescribir archivos con el mismo nombre
        // Ejemplo: doc-1715555555-987654321.pdf
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'doc-' + uniqueSuffix + ext); 
    }
});

// 2. Filtro de archivos (PDF e Imágenes)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
        cb(null, true); // Archivo aceptado
    } else {
        cb(new Error('Formato no válido. Solo se permiten archivos PDF o Imágenes.'), false);
    }
};

// 3. Inicializar Multer
const uploadDocs = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // Límite de 10MB por archivo
    fileFilter: fileFilter
});

// Exportamos el middleware listo para usar en DocumentosController.js
module.exports = uploadDocs;