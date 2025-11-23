const sql = require("mssql");
const poolPromise = require("../db");
//  Importamos la configuración específica para DOCUMENTOS (carpeta uploads/documentos)
const upload = require('../config/uploadConfigDocs'); 
const fs = require('fs');
const path = require('path');

// Middleware de Multer que espera el campo 'archivo_doc' del frontend
const uploadMiddleware = upload.single('archivo_doc'); 

// ====================================================================
// 1. OBTENER EMPLEADOS (Para el selector)
// ====================================================================
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

// ====================================================================
// 2. CREAR DOCUMENTO (POST) - CON DOBLE VALIDACIÓN
// ====================================================================
async function crearDocumento(req, res) {
    uploadMiddleware(req, res, async function (err) {
        
        // 1. Error de subida
        if (err) {
            console.error("Error de subida Multer:", err);
            return res.status(400).json({ success: false, message: err.message });
        }

        const { 
            nombre_documento, // Este es tu "Identificador Único" (ej: 1111)
            tipo_documento,   // Ej: "Acta de Nacimiento"
            descripcion, 
            id_responsable, 
            estado, 
            created_by 
        } = req.body;
        
        const file = req.file;

        // 2. Validación de campos requeridos
        if (!nombre_documento || !tipo_documento || !id_responsable) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
        }

        const archivoRuta = file ? `/uploads/documentos/${file.filename}` : null;
        const estadoFinal = estado || 'VIGENTE';

        try {
            const pool = await poolPromise;

            // ==================================================================================
            // IDENTIFICADOR ÚNICO GLOBAL (NUEVA)
            // ==================================================================================
            // Verificamos que el 'nombre_documento' (Identificador) no exista ya en la BD.
            const checkIdentificador = await pool.request()
                .input("identificador", sql.VarChar, nombre_documento)
                .query(`
                    SELECT TOP 1 id_documento 
                    FROM Documentos 
                    WHERE nombre_documento = @identificador
                `);
            
            if (checkIdentificador.recordset.length > 0) {
                if (file) fs.unlinkSync(file.path); // Borramos el archivo subido para no dejar basura
                return res.status(409).json({ 
                    success: false, 
                    message: `El Identificador "${nombre_documento}" ya existe en el sistema. Por favor use otro.` 
                });
            }

            // ==================================================================================
            //  UN SOLO TIPO DE DOCUMENTO VIGENTE POR EMPLEADO
            // ==================================================================================
            // Si estoy subiendo un "Acta de Nacimiento" vigente, el empleado no debe tener otra igual.
            if (estadoFinal === 'VIGENTE' || estadoFinal === 'Actualizado') {
                const checkDuplicadoTipo = await pool.request()
                    .input("id_responsable", sql.Int, id_responsable)
                    .input("tipo_documento", sql.VarChar, tipo_documento)
                    .query(`
                        SELECT TOP 1 nombre_documento 
                        FROM Documentos 
                        WHERE id_responsable = @id_responsable 
                        AND tipo_documento = @tipo_documento
                        AND (estado = 'VIGENTE' OR estado = 'Actualizado')
                        AND deleted_at IS NULL
                    `);

                if (checkDuplicadoTipo.recordset.length > 0) {
                    if (file) fs.unlinkSync(file.path); // Borramos el archivo subido
                    return res.status(409).json({ 
                        success: false, 
                        message: `Este empleado ya tiene un documento "${tipo_documento}" vigente. Debe dar de baja el anterior antes de subir uno nuevo.` 
                    });
                }
            }

            // ==================================================================================
            // 3. INSERCIÓN EN BASE DE DATOS
            // ==================================================================================
            const request = pool.request();
            const result = await request
                .input("nombre_documento", sql.VarChar, nombre_documento)
                .input("tipo_documento", sql.VarChar, tipo_documento)
                .input("descripcion", sql.Text, descripcion)
                .input("id_responsable", sql.Int, id_responsable)
                .input("archivo", sql.VarChar, archivoRuta)
                .input("estado", sql.VarChar, estadoFinal)
                .input("created_by", sql.Int, created_by)
                .query(`
                    INSERT INTO Documentos (
                        nombre_documento, tipo_documento, descripcion, 
                        id_responsable, archivo, estado, created_at, fecha_creacion
                    ) 
                    VALUES (
                        @nombre_documento, @tipo_documento, @descripcion, 
                        @id_responsable, @archivo, @estado, GETDATE(), GETDATE()
                    );
                    SELECT SCOPE_IDENTITY() AS id_documento;
                `);

            res.json({ 
                success: true, 
                message: "Documento guardado correctamente.", 
                idDocumento: result.recordset[0].id_documento 
            });

        } catch (error) {
            console.error("Error en BD Documentos:", error);
            if (file) fs.unlinkSync(file.path);
            res.status(500).json({ success: false, message: "Error al guardar documento.", error: error.message });
        }
    });
}

// ====================================================================
// 3. ACTUALIZAR DOCUMENTO (PUT)
// ====================================================================
async function actualizarDocumento(req, res) {
    uploadMiddleware(req, res, async function (err) {
        if (err) {
            console.error("Error Multer:", err);
            return res.status(400).json({ success: false, message: err.message });
        }

        const { id } = req.params;
        const { 
            nombre_documento, tipo_documento, descripcion, 
            id_responsable, estado, updated_by,
            archivo: archivoAnterior 
        } = req.body;
        
        const file = req.file;

        if (!nombre_documento || !tipo_documento || !id_responsable) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
        }

        const archivoRuta = file ? `/uploads/documentos/${file.filename}` : archivoAnterior;
        const estadoFinal = estado || 'VIGENTE';

        try {
            const pool = await poolPromise;

            // --- VALIDACIÓN DE DUPLICADOS EN EDICIÓN ---
            // 1. Validar Identificador Único (excluyendo el actual)
            const checkIdentificador = await pool.request()
                .input("identificador", sql.VarChar, nombre_documento)
                .input("id_actual", sql.Int, id)
                .query(`SELECT TOP 1 id_documento FROM Documentos WHERE nombre_documento = @identificador AND id_documento != @id_actual`);
            
            if (checkIdentificador.recordset.length > 0) {
                if (file) fs.unlinkSync(file.path);
                return res.status(409).json({ success: false, message: `El Identificador "${nombre_documento}" ya está en uso por otro documento.` });
            }

            // 2. Validar Tipo por Empleado (excluyendo el actual)
            if (estadoFinal === 'VIGENTE' || estadoFinal === 'Actualizado') {
                const checkTipo = await pool.request()
                    .input("id_responsable", sql.Int, id_responsable)
                    .input("tipo_documento", sql.VarChar, tipo_documento)
                    .input("id_actual", sql.Int, id)
                    .query(`
                        SELECT TOP 1 nombre_documento FROM Documentos 
                        WHERE id_responsable = @id_responsable AND tipo_documento = @tipo_documento
                        AND (estado = 'VIGENTE' OR estado = 'Actualizado') AND deleted_at IS NULL
                        AND id_documento != @id_actual
                    `);

                if (checkTipo.recordset.length > 0) {
                    if (file) fs.unlinkSync(file.path);
                    return res.status(409).json({ success: false, message: `El empleado ya tiene OTRO documento "${tipo_documento}" vigente.` });
                }
            }

            const request = pool.request();
            const result = await request
                .input("id", sql.Int, id)
                .input("nombre_documento", sql.VarChar, nombre_documento)
                .input("tipo_documento", sql.VarChar, tipo_documento)
                .input("descripcion", sql.Text, descripcion)
                .input("id_responsable", sql.Int, id_responsable)
                .input("archivo", sql.VarChar, archivoRuta)
                .input("estado", sql.VarChar, estadoFinal)
                .query(`
                    UPDATE Documentos
                    SET 
                        nombre_documento = @nombre_documento,
                        tipo_documento = @tipo_documento,
                        descripcion = @descripcion,
                        id_responsable = @id_responsable,
                        archivo = @archivo,
                        estado = @estado,
                        updated_at = GETDATE()
                    WHERE id_documento = @id
                `);

            if (result.rowsAffected[0] === 0) {
                if (file) fs.unlinkSync(file.path);
                return res.status(404).json({ success: false, message: "Documento no encontrado." });
            }

            res.json({ success: true, message: "Documento actualizado correctamente." });

        } catch (error) {
            console.error("Error al actualizar:", error);
            if (file) fs.unlinkSync(file.path);
            res.status(500).json({ success: false, message: "Error al actualizar.", error: error.message });
        }
    });
}

// ... (Resto de funciones: obtenerDocumentos, buscarDocumento, etc. se mantienen igual)

// 4. BUSCAR DOCUMENTO
async function buscarDocumento(req, res) {
    const { termino } = req.query;
    if (!termino) return res.status(400).json({ success: false, message: "Falta término." });

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("termino", sql.VarChar, `%${termino}%`)
            .query(`
                SELECT d.*, (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
                FROM Documentos d
                LEFT JOIN Empleados e ON d.id_responsable = e.id_empleado
                WHERE (d.nombre_documento LIKE @termino OR d.tipo_documento LIKE @termino OR e.nombres LIKE @termino)
                AND d.deleted_at IS NULL
            `);
        if (result.recordset.length === 0) return res.status(404).json({ success: false, message: "No encontrado." });
        res.json({ success: true, documentos: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error en búsqueda." });
    }
}

// 5. ALEATORIOS
async function obtenerDocumentosAleatorios(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT TOP 10 d.*, (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
            FROM Documentos d
            LEFT JOIN Empleados e ON d.id_responsable = e.id_empleado
            WHERE d.deleted_at IS NULL ORDER BY NEWID()
        `);
        res.json({ success: true, documentos: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error carga inicial." });
    }
}

// 6. POR ID
async function obtenerDocumentoPorId(req, res) {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request().input("id", sql.Int, id).query(`
            SELECT d.*, (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
            FROM Documentos d
            LEFT JOIN Empleados e ON d.id_responsable = e.id_empleado
            WHERE d.id_documento = @id
        `);
        if (result.recordset.length === 0) return res.status(404).json({ success: false, message: "No encontrado." });
        res.json({ success: true, documento: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al obtener." });
    }
}

// 7. LISTAR TODOS
async function obtenerDocumentos(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT d.*, (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
            FROM Documentos d
            LEFT JOIN Empleados e ON d.id_responsable = e.id_empleado
            WHERE d.deleted_at IS NULL ORDER BY d.created_at DESC
        `);
        res.json({ success: true, documentos: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error al listar." });
    }
}

module.exports = {
    crearDocumento,
    actualizarDocumento,
    obtenerDocumentos,
    buscarDocumento,
    obtenerDocumentosAleatorios,
    obtenerDocumentoPorId,
    obtenerEmpleados
};