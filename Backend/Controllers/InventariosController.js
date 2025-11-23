const sql = require("mssql");
const poolPromise = require("../db"); // Asumo la ruta a tu pool de conexión

// ================================
// OBTENER EMPLEADOS (Requerido para Pickers)
// ================================
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

// ================================
// GUARDAR NUEVO PRODUCTO (CON VALIDACIÓN DE UNICIDAD)
// ================================
async function guardarProducto(req, res) {
    const { nombre, codigo_interno, categoria, unidad_medida, idResponsable, fechaIngreso, cantidad, estado, descripcion } = req.body;

    if (!nombre || !idResponsable || !estado || !cantidad) {
        return res.status(400).json({
            success: false,
            message: "Faltan datos obligatorios (Nombre, Responsable, Estado, Cantidad)."
        });
    }
    try {
        const pool = await poolPromise;

        // 1. VERIFICACIÓN DE NOMBRE (CI/AI - Case and Accent Insensitive)
        // Esto previene duplicados como "cámara" y "Camara".
        const checkNombre = await pool.request()
            .input("nombre", sql.VarChar, nombre)
            .query(`
                SELECT COUNT(*) AS total 
                FROM Inventario 
                WHERE nombre COLLATE Latin1_General_CI_AI = @nombre COLLATE Latin1_General_CI_AI
            `);

        if (checkNombre.recordset[0].total > 0) {
            return res.status(400).json({
                success: false,
                message: "Error: Ya existe un producto con este nombre (ignorando mayúsculas y acentos)."
            });
        }

        // 2. VERIFICACIÓN DE CÓDIGO INTERNO
        if (codigo_interno) {
            const checkCodigo = await pool.request()
                .input("codigo", sql.VarChar, codigo_interno)
                .query("SELECT COUNT(*) AS total FROM Inventario WHERE codigo_interno = @codigo");
            if (checkCodigo.recordset[0].total > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Error: El Código Interno ya existe y debe ser único."
                });
            }
        }

        // --- PROCESO DE INSERCIÓN ---
        const fechaIngresoSQL = fechaIngreso ? fechaIngreso : null;
        const request = pool.request();

        await request
            .input("nombre", sql.VarChar, nombre)
            .input("categoria", sql.VarChar, categoria)
            .input("codigo_interno", sql.VarChar, codigo_interno)
            .input("descripcion", sql.Text, descripcion)
            .input("cantidad", sql.Int, cantidad)
            .input("unidad_medida", sql.VarChar, unidad_medida)
            .input("fecha_ingreso", sql.Date, fechaIngresoSQL)
            .input("estado", sql.VarChar, estado)
            .input("id_responsable", sql.Int, idResponsable)
            .query(`
                INSERT INTO Inventario (nombre, categoria, codigo_interno, descripcion, cantidad, unidad_medida, fecha_ingreso, estado, id_responsable)
                VALUES (@nombre, @categoria, @codigo_interno, @descripcion, @cantidad, @unidad_medida, @fecha_ingreso, @estado, @id_responsable);
            `);

        res.json({ success: true, message: "Producto guardado correctamente" });
    } catch (error) {
        console.error("Error al guardar el producto:", error);
        res.status(500).json({ success: false, message: "Error al guardar el producto", error: error.message });
    }
}


// ================================
// OBTENER PRODUCTO POR ID
// ================================
async function obtenerProductoPorId(req, res) {
    const id = req.params.id;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_producto", sql.Int, id)
            .query(`
                SELECT 
                    p.*, 
                    E.nombres AS responsable_nombres, 
                    E.apellido_paterno AS responsable_ap
                FROM Inventario p
                LEFT JOIN Empleados E ON p.id_responsable = E.id_empleado
                WHERE id_producto = @id_producto
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Producto no encontrado." });
        }

        const producto = result.recordset[0];
        producto.responsable_nombre = `${producto.responsable_nombres || ''} ${producto.apellido_paterno || ''}`.trim();
        producto.id_responsable = producto.id_responsable;

        res.json({ success: true, producto });

    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).json({ success: false, message: "Error del servidor." });
    }
}

// ================================
// EDITAR PRODUCTO
// ================================
async function editarProducto(req, res) {
    const { id } = req.params;
    const {
        nombre, codigo_interno, categoria, unidad_medida,
        idResponsable, fechaIngreso, cantidad, estado, descripcion
    } = req.body;

    if (!nombre || !idResponsable || !estado || !cantidad) {
        return res.status(400).json({
            success: false,
            message: "Faltan datos obligatorios (Nombre, Responsable, Estado, Cantidad)."
        });
    }

    try {
        const pool = await poolPromise;

        // 1. VERIFICACIÓN DE NOMBRE (CI/AI - Excluyendo el producto actual)
        const checkNombre = await pool.request()
            .input("nombre", sql.VarChar, nombre)
            .input("id_actual", sql.Int, id)
            .query(`
                SELECT COUNT(*) AS total 
                FROM Inventario 
                WHERE nombre COLLATE Latin1_General_CI_AI = @nombre COLLATE Latin1_General_CI_AI
                AND id_producto != @id_actual
            `);

        if (checkNombre.recordset[0].total > 0) {
            return res.status(400).json({
                success: false,
                message: "Error: Ya existe otro producto con este nombre (ignorando mayúsculas y acentos)."
            });
        }

        // 2. VERIFICACIÓN DE CÓDIGO INTERNO (Excluyendo el producto actual)
        if (codigo_interno) {
            const checkCodigo = await pool.request()
                .input("codigo", sql.VarChar, codigo_interno)
                .input("id_actual", sql.Int, id)
                .query("SELECT COUNT(*) AS total FROM Inventario WHERE codigo_interno = @codigo AND id_producto != @id_actual");
            if (checkCodigo.recordset[0].total > 0) {
                return res.status(400).json({ success: false, message: "Error: El Código Interno ya está asignado a otro producto." });
            }
        }

        // --- PROCESO DE ACTUALIZACIÓN ---
        const fechaIngresoSQL = fechaIngreso ? fechaIngreso : null;
        const request = pool.request();

        await request
            .input("id_producto", sql.Int, id)
            .input("nombre", sql.VarChar, nombre)
            .input("categoria", sql.VarChar, categoria)
            .input("codigo_interno", sql.VarChar, codigo_interno)
            .input("descripcion", sql.Text, descripcion)
            .input("cantidad", sql.Int, cantidad)
            .input("unidad_medida", sql.VarChar, unidad_medida)
            .input("fecha_ingreso", sql.Date, fechaIngresoSQL)
            .input("estado", sql.VarChar, estado)
            .input("id_responsable", sql.Int, idResponsable)
            .input("updated_at", sql.DateTime, new Date())
            .query(`
                UPDATE Inventario SET
                    nombre = @nombre,
                    categoria = @categoria,
                    codigo_interno = @codigo_interno,
                    descripcion = @descripcion,
                    cantidad = @cantidad,
                    unidad_medida = @unidad_medida,
                    fecha_ingreso = @fecha_ingreso,
                    estado = @estado,
                    id_responsable = @id_responsable,
                    updated_at = @updated_at
                WHERE id_producto = @id_producto
            `);

        res.json({ success: true, message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error("Error al editar el producto:", error);
        res.status(500).json({ success: false, message: "Error al editar el producto", error: error.message });
    }
}

// ================================
// BUSCAR PRODUCTO POR TÉRMINO
// ================================
async function buscarProducto(req, res) {
    const { termino } = req.query;

    if (!termino) {
        return res.status(400).json({ success: false, message: "Debe proveer un término de búsqueda." });
    }

    try {
        const pool = await poolPromise;
        const request = pool.request();

        // Buscamos por Nombre o Código Interno, ignorando CI/AI en el nombre
        const result = await request
            .input("termino", sql.VarChar, `%${termino}%`)
            .query(`
                SELECT 
                    id_producto,
                    nombre,
                    codigo_interno
                FROM Inventario
                WHERE nombre COLLATE Latin1_General_CI_AI LIKE @termino OR codigo_interno LIKE @termino
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Productos no encontrados." });
        }

        res.json({ success: true, productos: result.recordset });

    } catch (error) {
        console.error("Error al buscar productos:", error);
        res.status(500).json({ success: false, message: "Error al buscar productos", error: error.message });
    }
}

// ================================
// OBTENER PRODUCTOS ALEATORIOS
// ================================
async function obtenerProductosAleatorios(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT TOP 10 
                id_producto,
                nombre
            FROM Inventario
            ORDER BY NEWID()
        `);

        res.json({
            success: true,
            productos: result.recordset,
        });
    } catch (error) {
        console.error("Error al obtener productos aleatorios:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener productos aleatorios",
        });
    }
}

// ================================
// EXPORTAR FUNCIONES
// ================================
module.exports = {
    obtenerEmpleados,
    guardarProducto,
    obtenerProductoPorId,
    editarProducto,
    buscarProducto,
    obtenerProductosAleatorios,
};