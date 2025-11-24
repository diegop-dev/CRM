const sql = require("mssql");
const poolPromise = require("../db");

// ================================
// 1. GUARDAR CLIENTE
// ================================
async function guardarCliente(req, res) {
  const {
    nombreCliente, apellidoPaterno, apellidoMaterno, tipoCliente, estadoCliente,
    sexo, correoElectronico, telefono, calle, colonia, ciudad, estado, pais,
    codigoPostal, descripcion
  } = req.body;

  if (!nombreCliente || !tipoCliente || !estadoCliente) {
    return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
  }

  try {
    const pool = await poolPromise;
    
    // Validar duplicados
    const check = await pool.request()
      .input("nombre", sql.VarChar, nombreCliente)
      .input("apellidoPaterno", sql.VarChar, apellidoPaterno)
      .input("apellidoMaterno", sql.VarChar, apellidoMaterno)
      .query("SELECT COUNT(*) as total FROM Clientes WHERE nombre = @nombre AND apellido_paterno = @apellidoPaterno AND apellido_materno = @apellidoMaterno");

    if (check.recordset[0].total > 0) {
      return res.status(400).json({ success: false, message: "Ya existe un cliente con este nombre." });
    }

    const request = pool.request();
    const result = await request
      .input("nombre", sql.VarChar, nombreCliente)
      .input("apellido_paterno", sql.VarChar, apellidoPaterno)
      .input("apellido_materno", sql.VarChar, apellidoMaterno)
      .input("tipo", sql.VarChar, tipoCliente)
      .input("estado_cliente", sql.VarChar, estadoCliente)
      .input("sexo", sql.VarChar, sexo)
      .input("correo_electronico", sql.VarChar, correoElectronico)
      .input("telefono", sql.VarChar, telefono)
      .input("calle", sql.VarChar, calle)
      .input("colonia", sql.VarChar, colonia)
      .input("ciudad", sql.VarChar, ciudad)
      .input("estado", sql.VarChar, estado)
      .input("pais", sql.VarChar, pais)
      .input("codigo_postal", sql.VarChar, codigoPostal)
      .input("descripcion", sql.Text, descripcion)
      .query(`
        INSERT INTO Clientes (nombre, apellido_paterno, apellido_materno, tipo, estado_cliente, sexo, correo_electronico, telefono, calle, colonia, ciudad, estado, pais, codigo_postal, descripcion)
        VALUES (@nombre, @apellido_paterno, @apellido_materno, @tipo, @estado_cliente, @sexo, @correo_electronico, @telefono, @calle, @colonia, @ciudad, @estado, @pais, @codigo_postal, @descripcion);
        SELECT SCOPE_IDENTITY() AS id_cliente;
      `);

    res.json({ success: true, message: "Cliente guardado.", idCliente: result.recordset[0].id_cliente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al guardar cliente.", error: error.message });
  }
}

// ================================
// 2. OBTENER ALEATORIOS (Para listas iniciales)
// ================================
async function obtenerClientesAleatorios(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT TOP 5 id_cliente, nombre, apellido_paterno, apellido_materno, tipo, estado_cliente 
      FROM Clientes ORDER BY NEWID()
    `);
    res.json({ success: true, clientes: result.recordset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al obtener clientes." });
  }
}

// ================================
// 3. BUSCAR CLIENTE (Por nombre)
// ================================
async function buscarCliente(req, res) {
  const { termino } = req.query;
  if (!termino) return res.status(400).json({ success: false, message: "Falta término de búsqueda." });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("termino", sql.VarChar, `%${termino}%`)
      .query(`
        SELECT * FROM Clientes 
        WHERE nombre LIKE @termino OR apellido_paterno LIKE @termino
      `);
    res.json({ success: true, clientes: result.recordset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al buscar cliente." });
  }
}

// ================================
// 4. CONSULTAR CLIENTE POR ID
// ================================
async function consultarClientePorId(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Clientes WHERE id_cliente = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Cliente no encontrado." });
    }
    res.json({ success: true, cliente: result.recordset[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al consultar cliente." });
  }
}

// ================================
// 5. EDITAR CLIENTE
// ================================
async function editarCliente(req, res) {
  const { id } = req.params;
  const {
    nombreCliente, apellidoPaterno, apellidoMaterno, tipoCliente, estadoCliente,
    sexo, correoElectronico, telefono, calle, colonia, ciudad, estado, pais,
    codigoPostal, descripcion
  } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("nombre", sql.VarChar, nombreCliente)
      .input("apellido_paterno", sql.VarChar, apellidoPaterno)
      .input("apellido_materno", sql.VarChar, apellidoMaterno)
      .input("tipo", sql.VarChar, tipoCliente)
      .input("estado_cliente", sql.VarChar, estadoCliente)
      .input("sexo", sql.VarChar, sexo)
      .input("correo_electronico", sql.VarChar, correoElectronico)
      .input("telefono", sql.VarChar, telefono)
      .input("calle", sql.VarChar, calle)
      .input("colonia", sql.VarChar, colonia)
      .input("ciudad", sql.VarChar, ciudad)
      .input("estado", sql.VarChar, estado)
      .input("pais", sql.VarChar, pais)
      .input("codigo_postal", sql.VarChar, codigoPostal)
      .input("descripcion", sql.Text, descripcion)
      .query(`
        UPDATE Clientes SET 
          nombre = @nombre, apellido_paterno = @apellido_paterno, apellido_materno = @apellido_materno,
          tipo = @tipo, estado_cliente = @estado_cliente, sexo = @sexo,
          correo_electronico = @correo_electronico, telefono = @telefono,
          calle = @calle, colonia = @colonia, ciudad = @ciudad, estado = @estado,
          pais = @pais, codigo_postal = @codigo_postal, descripcion = @descripcion
        WHERE id_cliente = @id
      `);

    res.json({ success: true, message: "Cliente actualizado." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al editar cliente." });
  }
}
// ================================
// OBTENER TODOS LOS CLIENTES
// ================================
async function obtenerClientes(req, res) {
    try {
        const pool = await poolPromise;
        // Usamos 'nombre' (singular) y quitamos 'rfc' que no existe en tu tabla
        const result = await pool.request().query(`
            SELECT 
                id_cliente, 
                nombre, 
                apellido_paterno, 
                apellido_materno
            FROM Clientes
        `);

        res.json({ success: true, clientes: result.recordset });
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ success: false, message: "Error al obtener clientes." });
    }
}

module.exports = {
  guardarCliente,
  obtenerClientesAleatorios,
  buscarCliente,
  consultarClientePorId,
  editarCliente,
  obtenerClientes
};