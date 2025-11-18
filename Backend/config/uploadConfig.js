const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🔑 CLAVE: Directorio donde se guardarán los archivos de servicios.
// Este directorio debe ser accesible estáticamente por Express.
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'servicios');

// 1. Asegurarse de que el directorio exista. Si no existe, lo crea.
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 2. Configuración de almacenamiento (diskStorage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Indica a Multer dónde guardar el archivo
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // Genera un nombre único para el archivo
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        // El archivo se guardará como: archivo_servicio-TIMESTAMP.pdf
        cb(null, 'archivo_servicio-' + uniqueSuffix + ext); 
    }
});

// 3. Filtro para aceptar solo PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        // Rechazar el archivo y enviar un error
        cb(new Error('Solo se permiten archivos PDF!'), false);
    }
};

// 4. Inicializar multer con las configuraciones
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Límite de 5MB
    fileFilter: fileFilter
});

// Exportamos el middleware configurado
module.exports = upload;