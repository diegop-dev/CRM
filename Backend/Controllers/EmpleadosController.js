const sql = require("mssql");
const poolPromise = require("../db");
const bcrypt = require("bcrypt");

// ================================
// GUARDAR EMPLEADO
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

  if (!diaNacimiento || !mesNacimiento || !añoNacimiento) {
    return res.status(400).json({ success: false, message: "Faltan datos de fecha de nacimiento" });
  }

  const dia = diaNacimiento.toString().padStart(2, "0");
  const mes = mesNacimiento.toString().padStart(2, "0");
  const año = añoNacimiento.toString();
  const fechaNacimiento = `${año}-${mes}-${dia}`;

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

    // --- INICIO DE VALIDACIÓN DE DUPLICADOS ---

    // 1. Validar que el Nombre de Usuario sea único
    const checkUser = await pool.request()
      .input("nombreUsuario", sql.NVarChar, nombreUsuario)
      .query("SELECT COUNT(*) AS total FROM Usuarios WHERE nombre_usuario = @nombreUsuario");

    if (checkUser.recordset[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: "Error: El nombre de usuario ya existe. Por favor, elija otro."
      });
    }

    // 2. Validar que el Nombre Completo del Empleado sea único
    const checkEmpleado = await pool.request()
      .input("nombres", sql.NVarChar, nombres)
      .input("apellidoPaterno", sql.NVarChar, apellidoPaterno)
      .input("apellidoMaterno", sql.NVarChar, apellidoMaterno)
      .query(`
        SELECT COUNT(*) AS total 
        FROM Empleados 
        WHERE nombres = @nombres 
          AND apellido_paterno = @apellidoPaterno 
          AND apellido_materno = @apellidoMaterno
      `);

    if (checkEmpleado.recordset[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: "Error: Ya existe un empleado con ese mismo nombre completo."
      });
    }
    // --- FIN DE VALIDACIÓN DE DUPLICADOS ---

    // Si pasa las validaciones, iniciamos la transacción
    transaction = new sql.Transaction(pool);
    await transaction.begin();

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

    // 2. Hasheamos la contraseña antes de guardarla
    const hash = bcrypt.hashSync(contraseña, 10); // 10 rondas de salt

    const requestUsuario = transaction.request();
    await requestUsuario
      .input("idEmpleado", sql.Int, idEmpleado)
      .input("nombreUsuario", sql.NVarChar, nombreUsuario)
      .input("contraseñaHash", sql.NVarChar(255), hash) 
      .input("rol", sql.Int, rolId)
      .query(`
        INSERT INTO Usuarios (id_empleado, nombre_usuario, contraseña, id_rol)
        VALUES (@idEmpleado, @nombreUsuario, @contraseñaHash, @rol);
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
// CONSULTAR EMPLEADO POR ID
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
          u.id_usuario, 
          u.nombre_usuario,
          -- NO enviamos la contraseña al frontend
          r.nombre AS rol
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
// BUSCAR EMPLEADO POR NOMBRE O USUARIO
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
          u.id_usuario, 
          u.nombre_usuario,
          -- NO enviamos la contraseña al frontend
          r.nombre AS rol
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
      return res.status(404).json({ success: false, message: "Empleado no encontrado" });
    }

    res.json({ success: true, empleados: result.recordset });
  } catch (error) {
    console.error("Error al buscar empleados:", error);
    res.status(500).json({ success: false, message: "Error al buscar empleados", error });
  }
}

// ================================
// EDITAR EMPLEADO POR NOMBRE
// ================================
async function editarEmpleadoPorNombre(req, res) {
  const {
    nombre,
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

  if (!diaNacimiento || !mesNacimiento || !añoNacimiento) {
    return res.status(400).json({ success: false, message: "Faltan datos de fecha de nacimiento" });
  }

  const dia = diaNacimiento.toString().padStart(2, "0");
  const mes = mesNacimiento.toString().padStart(2, "0");
  const año = añoNacimiento.toString();
  const fechaNacimiento = `${año}-${mes}-${dia}`;

  const rolMap = {
    "Super Administrador": 1,
    "Administrador": 2,
    "Empleado": 3,
  };
  const rolId = rolMap[rol];

  if (!rolId) {
    return res.status(400).json({ success: false, message: "Rol inválido" });
  }

  let transaction;

  try {
    const pool = await poolPromise;
    const findResult = await pool
      .request()
      .input("nombre", sql.NVarChar, nombre)
      .query(`SELECT id_empleado FROM Empleados WHERE nombres = @nombre`);

    if (findResult.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Empleado no encontrado" });
    }

    const idEmpleado = findResult.recordset[0].id_empleado;

    transaction = new sql.Transaction(pool);
    await transaction.begin();

    await transaction.request()
      .input("idEmpleado", sql.Int, idEmpleado)
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
        UPDATE Empleados SET
          apellido_paterno = @apellidoPaterno,
          apellido_materno = @apellidoMaterno,
          fecha_nacimiento = @fechaNacimiento,
          sexo = @sexo,
          rfc = @rfc,
          curp = @curp,
          nss = @nss,
          telefono = @telefono,
          correo_electronico = @correoElectronico,
          calle = @calle,
          colonia = @colonia,
          ciudad = @ciudad,
          estado = @estado,
          codigo_postal = @codigoPostal,
          estado_empleado = @estadoEmpleado,
          observaciones = @observaciones
        WHERE id_empleado = @idEmpleado
      `);

    const requestUsuario = transaction.request();
    requestUsuario.input("idEmpleado", sql.Int, idEmpleado);
    requestUsuario.input("nombreUsuario", sql.NVarChar, nombreUsuario);
    requestUsuario.input("rol", sql.Int, rolId);

    let updateQueryUsuarios;

    // SI el frontend envió una nueva contraseña...
    if (contraseña) {
      const hash = bcrypt.hashSync(contraseña, 10);
      requestUsuario.input("contraseñaHash", sql.NVarChar(255), hash);
      
      updateQueryUsuarios = `
        UPDATE Usuarios SET
          nombre_usuario = @nombreUsuario,
          contraseña = @contraseñaHash, -- Actualiza con hash
          id_rol = @rol
        WHERE id_empleado = @idEmpleado
      `;
    } else {
      // NO se envió contraseña, no actualizamos ese campo
      updateQueryUsuarios = `
        UPDATE Usuarios SET
          nombre_usuario = @nombreUsuario,
          id_rol = @rol
          -- No se toca el campo contraseña
        WHERE id_empleado = @idEmpleado
      `;
    }
    
    await requestUsuario.query(updateQueryUsuarios);

    await transaction.commit();
    res.json({ success: true, message: "Empleado actualizado correctamente" });

  } catch (error) {
    console.error("Error al editar empleado por nombre:", error);
    if (transaction && !transaction._aborted) await transaction.rollback();
    res.status(500).json({ success: false, message: "Error al editar empleado", error });
  }
}

// ================================
// OBTENER TODOS LOS EMPLEADOS
// ================================
const obtenerTodosLosEmpleados = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        id_empleado,
        nombres,
        apellido_paterno,
        apellido_materno
      FROM Empleados
      ORDER BY nombres ASC
    `);

    res.json({
      success: true,
      empleados: result.recordset,
    });
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener empleados",
    });
  }
};

// ================================
// OBTENER 5 EMPLEADOS ALEATORIOS
// ================================
const obtenerEmpleadosAleatorios = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT TOP 5 
        id_empleado,
        nombres,
        apellido_paterno,
        apellido_materno
      FROM Empleados
      ORDER BY NEWID();
    `);

    res.json({
      success: true,
      empleados: result.recordset,
    });
  } catch (error) {
    console.error("Error al obtener empleados aleatorios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener empleados aleatorios",
    });
  }
};

// ================================
// EDITAR EMPLEADO POR ID
// ================================
async function editarEmpleadoPorId(req, res) {
  const { idEmpleado } = req.params;

  const {
    nombres, 
    apellidoPaterno,
    apellidoMaterno,
    diaNacimiento,
    mesNacimiento,
    añoNacimiento,
    sexo, rfc, curp, nss, telefono, correoElectronico,
    calle, colonia, ciudad, estado, codigoPostal,
    rol, estadoEmpleado, nombreUsuario, contraseña, observaciones
  } = req.body;

  // --- Validación de Fecha y Rol ---
  if (!diaNacimiento || !mesNacimiento || !añoNacimiento) {
    return res.status(400).json({ success: false, message: "Faltan datos de fecha" });
  }
  const fechaNacimiento = `${añoNacimiento}-${mesNacimiento.toString().padStart(2, "0")}-${diaNacimiento.toString().padStart(2, "0")}`;

  const rolMap = { "Super Administrador": 1, "Administrador": 2, "Empleado": 3 };
  const rolId = rolMap[rol];
  if (!rolId) {
    return res.status(400).json({ success: false, message: "Rol inválido" });
  }
  // --- Fin Validación ---

  let transaction;
  try {
    const pool = await poolPromise;
    transaction = new sql.Transaction(pool);
    await transaction.begin();

    // 1. Actualizar Tabla Empleados
    await transaction.request()
      .input("idEmpleado", sql.Int, idEmpleado)
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
        UPDATE Empleados SET
          nombres = @nombres,
          apellido_paterno = @apellidoPaterno,
          apellido_materno = @apellidoMaterno,
          fecha_nacimiento = @fechaNacimiento,
          sexo = @sexo, 
          rfc = @rfc, 
          curp = @curp, 
          nss = @nss,
          telefono = @telefono, 
          correo_electronico = @correoElectronico,
          calle = @calle, 
          colonia = @colonia, 
          ciudad = @ciudad, 
          estado = @estado,
          codigo_postal = @codigoPostal, 
          estado_empleado = @estadoEmpleado,
          observaciones = @observaciones
        WHERE id_empleado = @idEmpleado
      `);

    // 2. Actualizar Tabla Usuarios
    const requestUsuario = transaction.request();
    requestUsuario.input("idEmpleado", sql.Int, idEmpleado);
    requestUsuario.input("nombreUsuario", sql.NVarChar, nombreUsuario);
    requestUsuario.input("rol", sql.Int, rolId);

    let updateQueryUsuarios;

    // SI el frontend envió una nueva contraseña...
    if (contraseña) {
      const hash = bcrypt.hashSync(contraseña, 10);
      requestUsuario.input("contraseñaHash", sql.NVarChar(255), hash);
      
      updateQueryUsuarios = `
        UPDATE Usuarios SET
          nombre_usuario = @nombreUsuario,
          contraseña = @contraseñaHash, -- Actualiza con hash
          id_rol = @rol
        WHERE id_empleado = @idEmpleado
      `;
    } else {
      // NO se envió contraseña, no actualizamos ese campo
      updateQueryUsuarios = `
        UPDATE Usuarios SET
          nombre_usuario = @nombreUsuario,
          id_rol = @rol
          -- No se toca el campo contraseña
        WHERE id_empleado = @idEmpleado
      `;
    }
    
    await requestUsuario.query(updateQueryUsuarios);

    await transaction.commit();
    res.json({ success: true, message: "Empleado actualizado correctamente" });

  } catch (error) {
    console.error("Error al editar empleado por ID:", error);
    if (transaction && !transaction._aborted) await transaction.rollback();
    res.status(500).json({ success: false, message: "Error al editar empleado", error });
  }
}

// ================================
// NUEVA FUNCIÓN: BUSCAR EMPLEADO POR USUARIO (Usado por "Consultar Empleado")
// ================================
async function buscarEmpleadoPorUsuario(req, res) {
  const { termino } = req.query;

  if (!termino) {
    return res.status(400).json({ success: false, message: "Debe proveer un nombre de usuario." });
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    const result = await request
      .input("termino", sql.NVarChar, termino)
      .query(`
        SELECT 
          e.id_empleado, e.nombres, e.apellido_paterno, e.apellido_materno,
          e.fecha_nacimiento, e.sexo, e.rfc, e.curp, e.nss,
          e.telefono, e.correo_electronico, e.calle, e.colonia, e.ciudad,
          e.estado, e.codigo_postal, e.estado_empleado, e.observaciones,
          u.id_usuario, 
          u.nombre_usuario,
          -- NO enviamos la contraseña al frontend
          r.nombre AS rol
        FROM Empleados e
        INNER JOIN Usuarios u ON e.id_empleado = u.id_empleado
        INNER JOIN Roles r ON u.id_rol = r.id_rol
        WHERE u.nombre_usuario = @termino 
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true, empleado: result.recordset[0] });
  } catch (error) {
    console.error("Error al buscar empleado por usuario:", error);
    res.status(500).json({ success: false, message: "Error al buscar empleado", error });
  }
}

module.exports = {
  guardarEmpleado,
  consultarEmpleado,
  buscarEmpleado,
  editarEmpleadoPorNombre,
  editarEmpleadoPorId,
  buscarEmpleadoPorUsuario,
  obtenerTodosLosEmpleados,
  obtenerEmpleadosAleatorios,
};