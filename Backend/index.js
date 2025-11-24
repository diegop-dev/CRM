const express = require("express");
const cors = require("cors");
const path = require('path'); 
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Servir la carpeta 'uploads' estáticamente.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- IMPORTAR RUTAS ---
const empleadosRoutes = require("./Routes/empleados");
const proyectoRoutes = require('./Routes/proyectos');
const clientesRoutes = require('./Routes/clientes');
const serviciosRoutes = require('./Routes/servicios');
const loginRoutes = require("./Routes/login");
const inventarioRoutes = require("./Routes/inventario");
// NUEVA IMPORTACIÓN
const documentosRoutes = require("./Routes/documentos");
const facturasRoutes = require("./Routes/facturas")
const usuariosRoutes = require("./Routes/usuarios")

// --- DEFINIR ENDPOINTS (Sin /api) ---
app.use("/empleados", empleadosRoutes);
app.use('/proyectos', proyectoRoutes);
app.use('/clientes', clientesRoutes);
app.use('/servicios', serviciosRoutes);

app.use("/login", loginRoutes);
app.use("/inventario", inventarioRoutes);
//NUEVO ENDPOINT PARA DOCUMENTOS
app.use("/documentos", documentosRoutes);
app.use("/facturas", facturasRoutes)
app.use("/usuarios", usuariosRoutes)

// Servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});