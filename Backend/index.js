const express = require("express");
const cors = require("cors");
const path = require('path'); // Importamos 'path' para trabajar con directorios
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Nota: express.urlencoded se deja en true para compatibilidad, aunque Multer maneja el form-data
app.use(express.urlencoded({ extended: true }));

//  Servir la carpeta 'uploads' estáticamente para acceder a los archivos.
// Esto hace que http://localhost:3000/uploads/servicios/archivo.pdf sea accesible.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// rutas
const empleadosRoutes = require("./Routes/empleados");
const proyectoRoutes = require('./Routes/proyectos');
const clientesRoutes = require('./Routes/clientes');
const serviciosRoutes = require('./Routes/servicios');
const loginRoutes = require("./Routes/login");
const inventarioRoutes = require("./Routes/inventario");

// Rutas correctamente
// Usamos '/api/...' para ser coherentes con la URL que usa el frontend (API_URL/servicios)
app.use("/empleados", empleadosRoutes);
app.use('/proyectos', proyectoRoutes);
app.use('/clientes', clientesRoutes);
app.use('/servicios', serviciosRoutes); // Aquí se engancha la ruta de subida
app.use("/login", loginRoutes);
app.use("/inventario", inventarioRoutes);

// Servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});