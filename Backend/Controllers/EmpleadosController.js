const sql = require("mssql");
const poolPromise = require("../db");

// ================================
// 🧩 GUARDAR EMPLEADO
// ================================
async function guardarEmpleado(req, res) {
  const {
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    diaNacimiento,
    mesNacimiento,
    añoNacimiento,
    sexo,
    rfc,
    curp,
    nss,
    telefono,
    correoElectronico,
    calle,
    colonia,
    ciudad,
    estado,
    codigoPostal,
    rol,
    estadoEmpleado,
    nombreUsuario,
    contraseña,
    observaciones
  } = req.body;

  const fechaNacimiento = `${añoNacimiento}-${mesNacimiento.padStart(2, "0")}-${diaNacimiento.padStart(2, "0")}`;

  const rolMap = {
    "Super Administrador": 1,
    "Administrador": 2,
    "Empleado": 3
  };
  const rolId = rolMap[rol];

  if (!rolId) {
    return res.status(400).json({ success: false, message: "Rol inválido" });
  }

  let transaction;

  try {
    const pool = await poolPromise;
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    // --- Inserción en Empleados ---
    const requestEmpleado = transaction.request();
    const resultEmpleado = await requestEmpleado
      .input("nombres", sql.NVarChar, nombres)
      .input("apellidoPaterno", sql.NVarChar, apellidoPaterno)
      .input("apellidoMaterno", sql.NVarChar, apellidoMaterno)
      .input("fechaNacimiento", sql.Date, fechaNacimiento)
      .input("sexo", sql.NVarChar, sexo)
      .input("rfc", sql.NVarChar, rfc)
      .input("curp", sql.NVarChar, curp)
      .input("nss", sql.NVarChar, nss)
      .input("telefono", sql.NVarChar, telefono)
      .input("correoElectronico", sql.NVarChar, correoElectronico)
      .input("calle", sql.NVarChar, calle)
      .input("colonia", sql.NVarChar, colonia)
      .input("ciudad", sql.NVarChar, ciudad)
      .input("estado", sql.NVarChar, estado)
      .input("codigoPostal", sql.NVarChar, codigoPostal)
      .input("estadoEmpleado", sql.NVarChar, estadoEmpleado)
      .input("observaciones", sql.NVarChar, observaciones)
      .query(`
        INSERT INTO Empleados 
        (nombres, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, rfc, curp, nss, telefono, correo_electronico, calle, colonia, ciudad, estado, codigo_postal, estado_empleado, observaciones)
        VALUES
        (@nombres, @apellidoPaterno, @apellidoMaterno, @fechaNacimiento, @sexo, @rfc, @curp, @nss, @telefono, @correoElectronico, @calle, @colonia, @ciudad, @estado, @codigoPostal, @estadoEmpleado, @observaciones);
        SELECT SCOPE_IDENTITY() AS id_empleado;
      `);

    const idEmpleado = resultEmpleado.recordset[0].id_empleado;

    // --- Inserción en Usuarios ---
    const requestUsuario = transaction.request();
    await requestUsuario
      .input("idEmpleado", sql.Int, idEmpleado)
      .input("nombreUsuario", sql.NVarChar, nombreUsuario)
      .input("contraseña", sql.NVarChar, contraseña)
      .input("rol", sql.Int, rolId)
      .query(`
        INSERT INTO Usuarios (id_empleado, nombre_usuario, contraseña, id_rol)
        VALUES (@idEmpleado, @nombreUsuario, @contraseña, @rol);
      `);

    await transaction.commit();

    res.json({ success: true, message: "Empleado guardado correctamente", idEmpleado });

  } catch (error) {
    console.error("Error al guardar el empleado:", error);

    if (transaction && !transaction._aborted) {
      try {
        await transaction.rollback();
        console.log("Transacción revertida correctamente");
      } catch (rollbackError) {
        console.error("Error al hacer rollback:", rollbackError);
      }
    }

    res.status(500).json({ success: false, message: "Error al guardar el empleado", error });
  }
}

// ================================
// 🔍 CONSULTAR EMPLEADO POR ID
// ================================
async function consultarEmpleado(req, res) {
  const { idEmpleado } = req.params;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    const result = await request
      .input("idEmpleado", sql.Int, idEmpleado)
      .query(`
        SELECT 
          e.id_empleado,
          e.nombres,
          e.apellido_paterno,
          e.apellido_materno,
          e.fecha_nacimiento,
          e.sexo,
          e.rfc,
          e.curp,
          e.nss,
          e.telefono,
          e.correo_electronico,
          e.calle,
          e.colonia,
          e.ciudad,
          e.estado,
          e.codigo_postal,
          e.estado_empleado,
          e.observaciones,
          u.nombre_usuario,
          u.contraseña,
          r.nombre_rol AS rol
        FROM Empleados e
        INNER JOIN Usuarios u ON e.id_empleado = u.id_empleado
        INNER JOIN Roles r ON u.id_rol = r.id_rol
        WHERE e.id_empleado = @idEmpleado
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Empleado no encontrado" });
    }

    res.json({ success: true, empleado: result.recordset[0] });
  } catch (error) {
    console.error("Error al consultar empleado:", error);
    res.status(500).json({ success: false, message: "Error al consultar empleado", error });
  }
}

// ================================
// 🔎 BUSCAR EMPLEADO POR NOMBRE O USUARIO
// ================================
async function buscarEmpleado(req, res) {
  const { termino } = req.query;

  try {
    const pool = await poolPromise;
    const request = pool.request();

    const result = await request
      .input("termino", sql.NVarChar, `%${termino}%`)
      .query(`
        SELECT 
          e.id_empleado,
          e.nombres,
          e.apellido_paterno,
          e.apellido_materno,
          u.nombre_usuario,
          r.nombre_rol AS rol,
          e.telefono,
          e.correo_electronico,
          e.estado_empleado
        FROM Empleados e
        INNER JOIN Usuarios u ON e.id_empleado = u.id_empleado
        INNER JOIN Roles r ON u.id_rol = r.id_rol
        WHERE 
          e.nombres LIKE @termino
          OR e.apellido_paterno LIKE @termino
          OR e.apellido_materno LIKE @termino
          OR u.nombre_usuario LIKE @termino
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "No se encontraron empleados" });
    }

    res.json({ success: true, empleados: result.recordset });
  } catch (error) {
    console.error("Error al buscar empleados:", error);
    res.status(500).json({ success: false, message: "Error al buscar empleados", error });
  }
}

module.exports = { guardarEmpleado, consultarEmpleado, buscarEmpleado };
