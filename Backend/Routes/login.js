const { Router } = require("express");
// Usamos desestructuración para asignar la función 'login' a la constante 'login'
const { login: loginController } = require("../Controllers/LoginController.js"); 
// Nota: También puedes usar 'const loginController = require("../Controllers/LoginController.js").login;'

const router = Router();

// ================================
// RUTA DE LOGIN
// ================================
// Ahora, la función 'login' que se está utilizando debe ser la función importada (la que llamaste loginController)
router.post("/", loginController); // 🔑 CLAVE: Usar la referencia importada.

module.exports = router;