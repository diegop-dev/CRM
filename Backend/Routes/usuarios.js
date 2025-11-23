const { Router } = require("express");
const { 
    buscarUsuarios,
    obtenerPermisosUsuario,
    obtenerCatalogoPermisos,
    actualizarPermisos
} = require("../Controllers/UsuariosController");

const router = Router();

// ================================
// RUTAS DE GESTIÓN DE USUARIOS
// Base URL: /usuarios (definido en index.js)
// ================================

// 1. BUSCAR (GET)
// Filtra usuarios por rol ('admin' o 'empleado') y término de búsqueda
// Endpoint: /usuarios/buscar?rol=admin&termino=Juan
router.get("/buscar", buscarUsuarios);

// 2. OBTENER PERMISOS DE UN USUARIO (GET)
// Devuelve la lista de módulos y el estado (activo/inactivo) para un usuario específico
// Endpoint: /usuarios/5/permisos
router.get("/:id/permisos", obtenerPermisosUsuario);

// 3. CATÁLOGO BASE (GET)
// Devuelve la lista de todos los módulos disponibles (útil para inicializar o crear nuevos)
// Endpoint: /usuarios/catalogo-permisos
router.get("/catalogo-permisos", obtenerCatalogoPermisos);

// 4. ACTUALIZAR PERMISOS (PUT)
// Recibe el ID del usuario y un array con los IDs de los módulos activos para guardar
// Endpoint: /usuarios/actualizar-permisos
router.put("/actualizar-permisos", actualizarPermisos);

module.exports = router;