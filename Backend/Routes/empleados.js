const express = require("express");
const router = express.Router();
const { 
  guardarEmpleado, 
  consultarEmpleado, 
  buscarEmpleado 
} = require("../Controllers/EmpleadosController");

// ➕ Guardar un nuevo empleado
router.post("/guardar", guardarEmpleado);

// 🔍 Consultar empleado por ID
router.get("/consultar/:idEmpleado", consultarEmpleado);

// 🔎 Buscar empleado por nombre o usuario
router.get("/buscar", buscarEmpleado);

module.exports = router;
