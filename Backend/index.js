const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Importar las rutas
const empleadosRoutes = require("./Routes/empleados");
const proyectoRoutes = require('./Routes/proyectos');

// ✅ Montar las rutas correctamente
app.use("/empleados", empleadosRoutes);
app.use('/proyectos', proyectoRoutes);

// Servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
