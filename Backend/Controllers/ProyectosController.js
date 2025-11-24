const sql = require("mssql");
const poolPromise = require("../db"); 
// ================================
// GUARDAR PROYECTO
// ================================
async function guardarProyecto(req, res) {
  const {
    nombreProyecto, tipoProyecto, fechaInicio, fechaFin,
    idResponsable, estado, prioridad, recursosAsignados, descripcion
  } = req.body;

  if (!nombreProyecto || !idResponsable || !estado) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos obligatorios: Nombre, Responsable y Estado."
    });
  }
  try {
    const pool = await poolPromise;
    const checkProyecto = await pool.request()
      .input("nombreProyecto", sql.VarChar, nombreProyecto)
      .query("SELECT COUNT(*) AS total FROM Proyectos WHERE nombre_proyecto = @nombreProyecto");
    if (checkProyecto.recordset[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: "Error: Ya existe un proyecto con ese mismo nombre."
      });
    }
    const request = pool.request();
    // Manejar fechas nulas o vacías correctamente
    const fechaInicioSQL = fechaInicio ? fechaInicio : null;
    const fechaFinSQL = fechaFin ? fechaFin : null;

    const resultProyecto = await request
      .input("nombre_proyecto", sql.VarChar, nombreProyecto)
      .input("tipo_proyecto", sql.VarChar, tipoProyecto)
      .input("fecha_inicio", sql.Date, fechaInicioSQL)
      .input("fecha_fin", sql.Date, fechaFinSQL)
      .input("id_responsable", sql.Int, idResponsable)
      .input("estado", sql.VarChar, estado)
      .input("prioridad", sql.VarChar, prioridad)
      .input("recursos_asignados", sql.Text, recursosAsignados)
      .input("descripcion", sql.Text, descripcion)
      .query(`
        INSERT INTO Proyectos (nombre_proyecto, tipo_proyecto, fecha_inicio, fecha_fin, id_responsable, estado, prioridad, recursos_asignados, descripcion)
        VALUES (@nombre_proyecto, @tipo_proyecto, @fecha_inicio, @fecha_fin, @id_responsable, @estado, @prioridad, @recursos_asignados, @descripcion);
        SELECT SCOPE_IDENTITY() AS id_proyecto;
      `);
    const idProyecto = resultProyecto.recordset[0].id_proyecto;
    res.json({ success: true, message: "Proyecto guardado correctamente", idProyecto });
  } catch (error) {
    console.error("Error al guardar el proyecto:", error);
    res.status(500).json({ success: false, message: "Error al guardar el proyecto", error: error.message });
  }
}

// ================================
// BUSCAR PROYECTO
// ================================
async function buscarProyecto(req, res) {
  const { termino } = req.query;

  if (!termino) {
    return res.status(400).json({ success: false, message: "Debe proveer un término de búsqueda." });
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Hacemos un JOIN con Empleados para obtener el nombre del responsable
    const result = await request
      .input("termino", sql.VarChar, `%${termino}%`)
      .query(`
        SELECT 
          p.id_proyecto,
          p.nombre_proyecto,
          p.tipo_proyecto,
          p.fecha_inicio,
          p.fecha_fin,
          p.id_responsable,
          e.nombres AS responsable_nombres, -- Nombre del responsable
          e.apellido_paterno AS responsable_ap, -- Apellido del responsable
          p.estado,
          p.prioridad,
          p.recursos_asignados,
          p.descripcion
        FROM Proyectos p
        LEFT JOIN Empleados e ON p.id_responsable = e.id_empleado
        WHERE p.nombre_proyecto LIKE @termino
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: "Proyecto no encontrado." });
    }

    const proyecto = result.recordset[0];
    // Combinamos nombre y apellido para el frontend
    proyecto.responsable_nombre = `${proyecto.responsable_nombres || ''} ${proyecto.responsable_ap || ''}`.trim();

    res.json({ success: true, proyecto: proyecto });
  } catch (error) {
    console.error("Error al buscar proyecto:", error);
    res.status(500).json({ success: false, message: "Error al buscar proyecto", error: error.message });
  }
}

// ================================
// EDITAR PROYECTO
// ================================
async function editarProyecto(req, res) {
  const { id } = req.params; 
  const {
    nombreProyecto,
    tipoProyecto,
    fechaInicio,
    fechaFin,
    idResponsable,
    estado,
    prioridad,
    recursosAsignados,
    descripcion
  } = req.body;

  if (!nombreProyecto || !idResponsable || !estado) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos obligatorios: Nombre, Responsable y Estado."
    });
  }

  try {
    const pool = await poolPromise;
    const request = pool.request();

    // Manejar fechas nulas o vacías correctamente
    const fechaInicioSQL = fechaInicio ? fechaInicio : null;
    const fechaFinSQL = fechaFin ? fechaFin : null;

    await request
      .input("id_proyecto", sql.Int, id)
      .input("nombre_proyecto", sql.VarChar, nombreProyecto)
      .input("tipo_proyecto", sql.VarChar, tipoProyecto)
      .input("fecha_inicio", sql.Date, fechaInicioSQL)
      .input("fecha_fin", sql.Date, fechaFinSQL)
      .input("id_responsable", sql.Int, idResponsable)
      .input("estado", sql.VarChar, estado)
      .input("prioridad", sql.VarChar, prioridad)
      .input("recursos_asignados", sql.Text, recursosAsignados)
      .input("descripcion", sql.Text, descripcion)
      .query(`UPDATE Proyectos SET
          nombre_proyecto = @nombre_proyecto,
          tipo_proyecto = @tipo_proyecto,
          fecha_inicio = @fecha_inicio,
          fecha_fin = @fecha_fin,
          id_responsable = @id_responsable,
          estado = @estado,
          prioridad = @prioridad,
          recursos_asignados = @recursos_asignados,
          descripcion = @descripcion
        WHERE id_proyecto = @id_proyecto
      `);

    res.json({ success: true, message: "Proyecto actualizado correctamente" });

  } catch (error) {
    console.error("Error al editar el proyecto:", error);
    res.status(500).json({ success: false, message: "Error al editar el proyecto", error: error.message });
  }
}

// ================================
// OBTENER PROYECTOS RECIENTES
// ================================
async function obtenerProyectosRecientes(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT TOP 5 
        id_proyecto,
        nombre_proyecto
      FROM Proyectos
      ORDER BY id_proyecto DESC
    `);

    res.json({
      success: true,
      proyectos: result.recordset,
    });
  } catch (error) {
    console.error("Error al obtener proyectos recientes:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener proyectos recientes",
    });
  }
}

// ================================
// OBTENER PROYECTOS ALEATORIOS (NUEVO)
// ================================
async function obtenerProyectosAleatorios(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT TOP 5 
        id_proyecto,
        nombre_proyecto
      FROM Proyectos
      ORDER BY NEWID()
    `);

    res.json({
      success: true,
      proyectos: result.recordset,
    });
  } catch (error) {
    console.error("Error al obtener proyectos aleatorios:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener proyectos aleatorios",
    });
  }
}

// ================================
// EXPORTAR FUNCIONES
// ================================
module.exports = {
  guardarProyecto,
  buscarProyecto,
  editarProyecto,
  obtenerProyectosRecientes,
  obtenerProyectosAleatorios, 
};