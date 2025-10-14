// server.js
const express = require('express');
const cors = require('cors');
const { sql, pool, poolConnect } = require('./db'); 

const app = express();
app.use(express.json());
app.use(cors());


app.post('/empleados', async (req, res) => {
  try {
    const f = req.body;
    console.log('📦 Datos recibidos:', f);

    const camposObligatorios = ['nombres', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento'];
    const camposFaltantes = camposObligatorios.filter(
      campo => !f[campo] || f[campo].toString().trim() === ''
    );
    if (camposFaltantes.length > 0) {
      return res.status(400).json({ mensaje: '❌ Faltan campos obligatorios', camposFaltantes });
    }

    
    const empleadoResult = await pool.request()
      .input('nombres', sql.VarChar(100), f.nombres)
      .input('apellido_paterno', sql.VarChar(100), f.apellidoPaterno)
      .input('apellido_materno', sql.VarChar(100), f.apellidoMaterno)
      .input('fecha_nacimiento', sql.Date, f.fechaNacimiento)
      .input('sexo', sql.VarChar(10), f.sexo || null)
      .input('rfc', sql.Char(13), f.rfc || null)
      .input('curp', sql.Char(18), f.curp || null)
      .input('nss', sql.Char(11), f.nss || null)
      .input('telefono', sql.VarChar(20), f.telefono || null)
      .input('correo_electronico', sql.VarChar(150), f.correo || null)
      .input('calle', sql.VarChar(150), f.calle || null)
      .input('colonia', sql.VarChar(100), f.colonia || null)
      .input('ciudad', sql.VarChar(100), f.ciudad || null)
      .input('estado', sql.VarChar(100), f.estado || null)
      .input('codigo_postal', sql.VarChar(10), f.codigoPostal || null)
      .input('estado_empleado', sql.VarChar(20), f.estadoEmpleado || 'ACTIVO')
      .query(`
        INSERT INTO Empleados (
          nombres, apellido_paterno, apellido_materno, fecha_nacimiento,
          sexo, rfc, curp, nss, telefono, correo_electronico,
          calle, colonia, ciudad, estado, codigo_postal, estado_empleado
        )
        VALUES (
          @nombres, @apellido_paterno, @apellido_materno, @fecha_nacimiento,
          @sexo, @rfc, @curp, @nss, @telefono, @correo_electronico,
          @calle, @colonia, @ciudad, @estado, @codigo_postal, @estado_empleado
        );
        SELECT SCOPE_IDENTITY() AS id_empleado;
      `);

    const idEmpleado = empleadoResult.recordset[0].id_empleado;

    
    if (f.nombreUsuario && f.contrasena && f.idRol) {
      await pool.request()
        .input('id_empleado', sql.Int, idEmpleado)
        .input('nombre_usuario', sql.VarChar(50), f.nombreUsuario)
        .input('contraseña', sql.VarChar(255), f.contrasena)
        .input('id_rol', sql.Int, f.idRol)
        .input('estado_usuario', sql.VarChar(20), f.estadoUsuario || 'ACTIVO')
        .query(`
          INSERT INTO Usuarios (id_empleado, nombre_usuario, contraseña, id_rol, estado_usuario)
          VALUES (@id_empleado, @nombre_usuario, @contraseña, @id_rol, @estado_usuario)
        `);
    }

    res.json({ mensaje: '✅ Empleado y usuario guardados correctamente', idEmpleado });
  } catch (err) {
    console.error('❌ Error al guardar empleado/usuario:', err);
    res.status(500).json({ mensaje: 'Error al guardar empleado/usuario', error: err.message });
  }
});


app.get('/empleados', async (req, res) => {
  try {
    const q = req.query.q || '';
    const limit = parseInt(req.query.limit) || 10;

    const empleados = await pool.request()
      .input('limit', sql.Int, limit)
      .query(`
        SELECT TOP(@limit)
          e.id_empleado AS idEmpleado,
          e.nombres,
          e.apellido_paterno AS apellidoPaterno,
          e.apellido_materno AS apellidoMaterno,
          u.id_usuario AS idUsuario,
          u.nombre_usuario AS nombreUsuario,
          r.id_rol AS idRol,
          r.nombre AS nombreRol
        FROM Empleados e
        LEFT JOIN Usuarios u ON e.id_empleado = u.id_empleado
        LEFT JOIN Roles r ON u.id_rol = r.id_rol
        WHERE
          CAST(e.id_empleado AS VARCHAR) LIKE '%${q}%' OR
          e.nombres LIKE '%${q}%' OR
          e.apellido_paterno LIKE '%${q}%' OR
          e.apellido_materno LIKE '%${q}%' OR
          u.nombre_usuario LIKE '%${q}%' OR
          r.nombre LIKE '%${q}%'
        ORDER BY e.id_empleado DESC
      `);

    res.json(empleados.recordset);
  } catch (err) {
    console.error('❌ Error al obtener empleados:', err);
    res.status(500).json({ mensaje: 'Error al obtener empleados', error: err.message });
  }
});


app.get('/empleados/:id', async (req, res) => {
  try {
    const { id } = req.params;

    
    const result = await pool.request()
      .input('id_empleado', sql.Int, id)
      .query(`
        -- Consulta 1: Datos del Empleado y Usuario
        SELECT
          e.id_empleado AS idEmpleado,
          e.nombres,
          e.apellido_paterno AS apellidoPaterno,
          e.apellido_materno AS apellidoMaterno,
          e.fecha_nacimiento AS fechaNacimiento,
          e.sexo,
          e.rfc,
          e.curp,
          e.nss,
          e.telefono,
          e.correo_electronico AS correo,
          e.calle,
          e.colonia,
          e.ciudad,
          e.estado,
          e.codigo_postal AS codigoPostal,
          e.estado_empleado AS estadoEmpleado,
          u.id_usuario AS idUsuario,
          u.nombre_usuario AS nombreUsuario,
          u.contraseña AS contrasena,
          u.estado_usuario AS estadoUsuario,
          r.id_rol AS idRol,
          r.nombre AS nombreRol
        FROM Empleados e
        LEFT JOIN Usuarios u ON e.id_empleado = u.id_empleado
        LEFT JOIN Roles r ON u.id_rol = r.id_rol
        WHERE e.id_empleado = @id_empleado;

        -- Consulta 2: Beneficiarios
        SELECT * FROM Beneficiarios WHERE id_empleado = @id_empleado;

        -- Consulta 3: Permisos
        SELECT * FROM Permisos WHERE id_empleado = @id_empleado;
      `);

    
    if (result.recordsets[0].length === 0) {
      return res.status(404).json({ mensaje: 'Empleado no encontrado' });
    }

    const empleado = result.recordsets[0][0];

    
    empleado.beneficiarios = result.recordsets[1];

    
    empleado.permisos = result.recordsets[2];

    res.json(empleado);
  } catch (err) {
    console.error('❌ Error al obtener empleado por ID:', err);
    res.status(500).json({ mensaje: 'Error al obtener empleado', error: err.message });
  }
});



app.put('/empleados/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const f = req.body;

    // Actualizar Empleados
    await pool.request()
      .input('id_empleado', sql.Int, id)
      .input('nombres', sql.VarChar(100), f.nombres)
      .input('apellido_paterno', sql.VarChar(100), f.apellidoPaterno)
      .input('apellido_materno', sql.VarChar(100), f.apellidoMaterno)
      .input('fecha_nacimiento', sql.Date, f.fechaNacimiento)
      .input('sexo', sql.VarChar(10), f.sexo || null)
      .input('rfc', sql.Char(13), f.rfc || null)
      .input('curp', sql.Char(18), f.curp || null)
      .input('nss', sql.Char(11), f.nss || null)
      .input('telefono', sql.VarChar(20), f.telefono || null)
      .input('correo_electronico', sql.VarChar(150), f.correo || null)
      .input('calle', sql.VarChar(150), f.calle || null)
      .input('colonia', sql.VarChar(100), f.colonia || null)
      .input('ciudad', sql.VarChar(100), f.ciudad || null)
      .input('estado', sql.VarChar(100), f.estado || null)
      .input('codigo_postal', sql.VarChar(10), f.codigoPostal || null)
      .input('estado_empleado', sql.VarChar(20), f.estadoEmpleado || 'ACTIVO')
      .query(`
        UPDATE Empleados
        SET
          nombres = @nombres,
          apellido_paterno = @apellido_paterno,
          apellido_materno = @apellido_materno,
          fecha_nacimiento = @fecha_nacimiento,
          sexo = @sexo,
          rfc = @rfc,
          curp = @curp,
          nss = @nss,
          telefono = @telefono,
          correo_electronico = @correo_electronico,
          calle = @calle,
          colonia = @colonia,
          ciudad = @ciudad,
          estado = @estado,
          codigo_postal = @codigo_postal,
          estado_empleado = @estado_empleado,
          updated_at = GETDATE()
        WHERE id_empleado = @id_empleado
      `);

    // Actualizar Usuarios
    if (f.nombreUsuario || f.contrasena || f.idRol || f.estadoUsuario) {
      await pool.request()
        .input('id_empleado', sql.Int, id)
        .input('nombre_usuario', sql.VarChar(50), f.nombreUsuario || null)
        .input('contraseña', sql.VarChar(255), f.contrasena || null)
        .input('id_rol', sql.Int, f.idRol || null)
        .input('estado_usuario', sql.VarChar(20), f.estadoUsuario || null)
        .query(`
          UPDATE Usuarios
          SET
            nombre_usuario = ISNULL(@nombre_usuario, nombre_usuario),
            contraseña = ISNULL(@contraseña, contraseña),
            id_rol = ISNULL(@id_rol, id_rol),
            estado_usuario = ISNULL(@estado_usuario, estado_usuario),
            updated_at = GETDATE()
          WHERE id_empleado = @id_empleado
        `);
    }

    res.json({ mensaje: '✅ Empleado actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar empleado:', err);
    res.status(500).json({ mensaje: 'Error al actualizar empleado', error: err.message });
  }
});


poolConnect.then(() => {
  app.listen(3000, () => {
    console.log('🚀 Servidor corriendo en http://192.168.1.122:3000');
  });
});
