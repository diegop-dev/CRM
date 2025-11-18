const sql = require("mssql");
const poolPromise = require("../db");
const upload = require('../config/uploadConfig');
const fs = require('fs');
const path = require('path');

// Middleware para subir PDF
const uploadMiddleware = upload.single('archivo_pdf');

// =====================================================
// 1. OBTENER EMPLEADOS (Para Pickers)
// =====================================================
async function obtenerEmpleados(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT id_empleado, nombres, apellido_paterno, apellido_materno
      FROM Empleados
      WHERE estado_empleado = 'ACTIVO'
    `);
    res.json({ success: true, empleados: result.recordset });
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({ success: false, message: "Error al obtener empleados" });
  }
}

// =====================================================
// 2. CREAR SERVICIO
// =====================================================
async function crearServicio(req, res) {
  uploadMiddleware(req, res, async function (err) {

    if (err) {
      console.error("Error de subida Multer:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Error al procesar el archivo (Solo PDF, máximo 5MB)."
      });
    }

    const {
      nombre_servicio, descripcion, categoria, precio, moneda,
      duracion_estimada, estado, id_responsable, notas_internas,
      created_by
    } = req.body;

    const file = req.file;
    const archivoRuta = file ? `/uploads/servicios/${file.filename}` : null;

    if (!nombre_servicio || !categoria || !precio) {
      if (file) fs.unlinkSync(file.path);
      return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
    }

    try {
      const pool = await poolPromise;

      const check = await pool.request()
        .input("nombre", sql.VarChar, nombre_servicio)
        .query("SELECT COUNT(*) AS total FROM Servicios WHERE nombre_servicio = @nombre");

      if (check.recordset[0].total > 0) {
        if (file) fs.unlinkSync(file.path);
        return res.status(400).json({ success: false, message: "Ya existe un servicio con este nombre." });
      }

      const request = pool.request();
      const result = await request
        .input("nombre_servicio", sql.VarChar, nombre_servicio)
        .input("descripcion", sql.Text, descripcion)
        .input("categoria", sql.VarChar, categoria)
        .input("precio", sql.Decimal(12, 2), precio)
        .input("moneda", sql.VarChar, moneda)
        .input("duracion_estimada", sql.VarChar, duracion_estimada)
        .input("estado", sql.VarChar, estado || 'ACTIVO')
        .input("id_responsable", sql.Int, id_responsable)
        .input("notas_internas", sql.Text, notas_internas)
        .input("archivo", sql.VarChar, archivoRuta)
        .input("created_by", sql.Int, created_by)
        .query(`
          INSERT INTO Servicios (
            nombre_servicio, descripcion, categoria, precio, moneda,
            duracion_estimada, estado, id_responsable, notas_internas,
            archivo, created_by, created_at
          )
          VALUES (
            @nombre_servicio, @descripcion, @categoria, @precio, @moneda,
            @duracion_estimada, @estado, @id_responsable, @notas_internas,
            @archivo, @created_by, GETDATE()
          );
          SELECT SCOPE_IDENTITY() AS id_servicio;
        `);

      res.json({
        success: true,
        message: "Servicio creado correctamente.",
        idServicio: result.recordset[0].id_servicio
      });

    } catch (error) {
      console.error("Error al guardar servicio:", error);
      if (file) fs.unlinkSync(file.path);
      res.status(500).json({ success: false, message: "Error al guardar servicio.", error: error.message });
    }
  });
}

// =====================================================
// 3. OBTENER TODOS LOS SERVICIOS
// =====================================================
async function obtenerServicios(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        s.id_servicio,
        s.nombre_servicio,
        s.descripcion,
        s.categoria,
        s.precio,
        s.moneda,
        s.duracion_estimada,
        s.estado,
        s.id_responsable AS idResponsable,
        s.notas_internas,
        s.archivo,
        s.created_at,
        s.updated_at,
        (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
      FROM Servicios s
      LEFT JOIN Empleados e ON s.id_responsable = e.id_empleado
      ORDER BY s.created_at DESC;
    `);

    res.json({ success: true, servicios: result.recordset });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Error al obtener servicios." });
  }
}

// =====================================================
// 4. OBTENER SERVICIO POR ID
// =====================================================
async function obtenerServicioPorId(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`
        SELECT 
          s.id_servicio,
          s.nombre_servicio,
          s.descripcion,
          s.categoria,
          s.precio,
          s.moneda,
          s.duracion_estimada,
          s.estado,
          s.id_responsable AS idResponsable,
          s.notas_internas,
          s.archivo,
          s.created_at,
          s.updated_at,
          (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
        FROM Servicios s
        LEFT JOIN Empleados e ON s.id_responsable = e.id_empleado
        WHERE s.id_servicio = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Servicio no encontrado." });
    }

    res.json({ success: true, servicio: result.recordset[0] });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Error al consultar servicio." });
  }
}

// =====================================================
// 5. ACTUALIZAR SERVICIO
// =====================================================
async function actualizarServicio(req, res) {
  uploadMiddleware(req, res, async function (err) {

    if (err) {
      console.error("Error Multer:", err);
      return res.status(400).json({ success: false, message: "Error con el archivo." });
    }

    const { id } = req.params;
    const {
      nombre_servicio, descripcion, categoria, precio, moneda,
      duracion_estimada, estado, id_responsable,
      notas_internas, archivo: archivoAnterior, updated_by
    } = req.body;

    const file = req.file;
    let archivoRuta = archivoAnterior;

    // Manejar archivo nuevo o eliminar
    if (file) archivoRuta = `/uploads/servicios/${file.filename}`;
    else if (archivoAnterior === "ELIMINAR") {
      // Eliminar archivo físico si existe
      const pool = await poolPromise;
      const currentResult = await pool.request()
        .input("id", sql.Int, id)
        .query("SELECT archivo FROM Servicios WHERE id_servicio = @id");

      if (currentResult.recordset[0] && currentResult.recordset[0].archivo) {
        const pathArchivo = path.join(__dirname, "..", currentResult.recordset[0].archivo);
        if (fs.existsSync(pathArchivo)) fs.unlinkSync(pathArchivo);
      }

      archivoRuta = null;
    }

    try {
      const pool = await poolPromise;

      // Obtener datos actuales
      const currentResult = await pool.request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM Servicios WHERE id_servicio = @id");

      if (currentResult.recordset.length === 0) {
        return res.status(404).json({ success: false, message: "Servicio no encontrado." });
      }

      const servicioActual = currentResult.recordset[0];

      // Validar campos obligatorios
      if (!nombre_servicio && !servicioActual.nombre_servicio) {
        return res.status(400).json({ success: false, message: "El nombre del servicio es obligatorio." });
      }
      if (!categoria && !servicioActual.categoria) {
        return res.status(400).json({ success: false, message: "La categoría es obligatoria." });
      }
      if (!precio && servicioActual.precio == null) {
        return res.status(400).json({ success: false, message: "El precio es obligatorio." });
      }

      // Validar id_responsable
      let idResponsableFinal = servicioActual.id_responsable;
      if (id_responsable !== undefined && id_responsable !== null && id_responsable !== "") {
        const parsedId = parseInt(id_responsable);
        if (!isNaN(parsedId)) {
          idResponsableFinal = parsedId;
        }
      }

      await pool.request()
        .input("id", sql.Int, id)
        .input("nombre_servicio", sql.VarChar, nombre_servicio || servicioActual.nombre_servicio)
        .input("descripcion", sql.Text, descripcion || servicioActual.descripcion)
        .input("categoria", sql.VarChar, categoria || servicioActual.categoria)
        .input("precio", sql.Decimal(12, 2), precio ?? servicioActual.precio)
        .input("moneda", sql.VarChar, moneda || servicioActual.moneda)
        .input("duracion_estimada", sql.VarChar, duracion_estimada || servicioActual.duracion_estimada)
        .input("estado", sql.VarChar, estado || servicioActual.estado)
        .input("id_responsable", sql.Int, idResponsableFinal)
        .input("notas_internas", sql.Text, notas_internas || servicioActual.notas_internas)
        .input("archivo", sql.VarChar, archivoRuta)
        .input("updated_by", sql.Int, updated_by)
        .query(`
          UPDATE Servicios SET
            nombre_servicio = @nombre_servicio,
            descripcion = @descripcion,
            categoria = @categoria,
            precio = @precio,
            moneda = @moneda,
            duracion_estimada = @duracion_estimada,
            estado = @estado,
            id_responsable = @id_responsable,
            notas_internas = @notas_internas,
            archivo = @archivo,
            updated_by = @updated_by,
            updated_at = GETDATE()
          WHERE id_servicio = @id
        `);

      res.json({ success: true, message: "Servicio actualizado correctamente." });

    } catch (error) {
      console.error("Error actualizando servicio:", error);
      res.status(500).json({ success: false, message: "Error al actualizar servicio." });
    }
  });
}

// =====================================================
// 6. ELIMINAR SERVICIO
// =====================================================
async function eliminarServicio(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Servicios WHERE id_servicio = @id");

    res.json({ success: true, message: "Servicio eliminado correctamente." });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Error al eliminar servicio." });
  }
}

// =====================================================
// 7. BUSCAR SERVICIO
// =====================================================
async function buscarServicio(req, res) {
  const { termino } = req.query;
  if (!termino) return res.status(400).json({ success: false, message: "Falta término de búsqueda." });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("termino", sql.VarChar, `%${termino}%`)
      .query(`
        SELECT 
          s.id_servicio,
          s.nombre_servicio,
          s.descripcion,
          s.categoria,
          s.precio,
          s.moneda,
          s.duracion_estimada,
          s.estado,
          s.id_responsable AS idResponsable,
          s.notas_internas,
          s.archivo,
          (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
        FROM Servicios s
        LEFT JOIN Empleados e ON s.id_responsable = e.id_empleado
        WHERE 
          s.nombre_servicio LIKE @termino
          OR s.categoria LIKE @termino
      `);

    res.json({ success: true, servicios: result.recordset });

  } catch (error) {
    console.error("Error buscar:", error);
    res.status(500).json({ success: false, message: "Error al buscar servicio." });
  }
}

// =====================================================
// 8. OBTENER SERVICIOS ALEATORIOS
// =====================================================
async function obtenerServiciosAleatorios(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT TOP 10
        s.id_servicio,
        s.nombre_servicio,
        s.descripcion,
        s.categoria,
        s.precio,
        s.moneda,
        s.duracion_estimada,
        s.estado,
        s.id_responsable AS idResponsable,
        s.notas_internas,
        s.archivo,
        (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
      FROM Servicios s
      LEFT JOIN Empleados e ON s.id_responsable = e.id_empleado
      ORDER BY NEWID();
    `);

    res.json({ success: true, servicios: result.recordset });

  } catch (error) {
    console.error("Error aleatorios:", error);
    res.status(500).json({ success: false, message: "Error al obtener aleatorios." });
  }
}

// =====================================================
// EXPORTAR TODO
// =====================================================
module.exports = {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
  obtenerServiciosAleatorios,
  buscarServicio,
  obtenerEmpleados
};
