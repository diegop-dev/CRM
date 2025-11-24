const sql = require("mssql");
const poolPromise = require("../db");
const bcrypt = require("bcrypt"); 


// ================================
// 1. INICIAR SESIÓN (LOGIN)
// ================================
async function login(req, res) {
  const { nombre_usuario, contraseña } = req.body;

  if (!nombre_usuario || !contraseña) {
    return res.status(400).json({ success: false, message: "Faltan nombre de usuario o contraseña." });
  }

  try {
    const pool = await poolPromise;
    
    // 1. Buscar al usuario por su nombre
    const result = await pool.request()
      .input("nombre_usuario", sql.VarChar, nombre_usuario)
      .query("SELECT * FROM Usuarios WHERE nombre_usuario = @nombre_usuario");

    if (result.recordset.length === 0) {
      // Usuario no encontrado
      return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos." });
    }

    const usuario = result.recordset[0];
    // 2. Comparar la contraseña proporcionada con la almacenada (hashed)
    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!esValida) {
      // Contraseña incorrecta
      return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos." });
    }

   
    res.json({
      success: true,
      message: "Inicio de sesión exitoso.",
      id_usuario: usuario.id_usuario, // <-- ¡LA CLAVE!
      nombre_usuario: usuario.nombre_usuario,
      id_rol: usuario.id_rol
      
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error en el servidor al iniciar sesión.", error: error.message });
  }
}

// Exportamos la función
module.exports = {
  login
};