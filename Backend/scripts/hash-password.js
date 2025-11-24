const sql = require("mssql");

const poolPromise = require("../db"); 
const bcrypt = require("bcrypt");

async function hashearContraseñas() {
  console.log("Iniciando script para hashear contraseñas...");

  let pool;
  try {
    pool = await poolPromise;
    console.log("Conectado a la base de datos.");

    // 1. Obtener todos los usuarios y sus contraseñas
    const result = await pool.request().query("SELECT id_usuario, contraseña, nombre_usuario FROM Usuarios");
    const usuarios = result.recordset;

    if (usuarios.length === 0) {
      console.log("No se encontraron usuarios.");
      return;
    }

    console.log(`Se encontraron ${usuarios.length} usuarios.`);

    let actualizados = 0;

    // 2. Recorrer cada usuario
    for (const usuario of usuarios) {
      // 3. Revisar si la contraseña YA es un hash (para no re-hashear)
      if (usuario.contraseña && (usuario.contraseña.startsWith("$2a$") || usuario.contraseña.startsWith("$2b$"))) {
        console.log(`- Usuario '${usuario.nombre_usuario}' (ID: ${usuario.id_usuario}) ya tiene un hash. Omitiendo.`);
        continue;
      }

      
      console.log(`+ Hasheando contraseña para '${usuario.nombre_usuario}' (ID: ${usuario.id_usuario})...`);
      const hash = bcrypt.hashSync(usuario.contraseña, 10);
      
      // 5. Actualizar la base de datos con el nuevo hash
      await pool.request()
        .input("hash", sql.VarChar(255), hash)
        .input("id_usuario", sql.Int, usuario.id_usuario)
        .query("UPDATE Usuarios SET contraseña = @hash WHERE id_usuario = @id_usuario");
      
      actualizados++;
    }

    console.log("\n¡Proceso completado!");
    console.log(`Se actualizaron ${actualizados} contraseñas a formato hash.`);

  } catch (error) {
    console.error("\nError durante el script de hasheo:", error.message);
  } finally {
    if (pool) {
      console.log("Script finalizado.");
      
    }
  }
}
hashearContraseñas();