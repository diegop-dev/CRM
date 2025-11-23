const sql = require("mssql");
const poolPromise = require("../db");
const upload = require('../config/uploadConfigFacturas'); 
const fs = require('fs');
const path = require('path');

// Middleware que espera el campo 'archivo_factura' del frontend
const uploadMiddleware = upload.single('archivo_factura'); 

// ====================================================================
// 1. OBTENER EMPLEADOS (Para el selector)
// ====================================================================
async function obtenerEmpleados(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT id_empleado, nombres, apellido_paterno 
            FROM Empleados 
            WHERE estado_empleado = 'ACTIVO'
        `);
        res.json({ success: true, empleados: result.recordset });
    } catch (error) {
        console.error("Error empleados:", error);
        res.status(500).json({ success: false, message: "Error al obtener empleados" });
    }
}

// ====================================================================
// 2. GUARDAR FACTURA (POST)
// ====================================================================
async function guardarFactura(req, res) {
    uploadMiddleware(req, res, async function (err) {
        if (err) {
            console.error("Error Multer:", err);
            return res.status(400).json({ success: false, message: err.message });
        }

        const { 
            numero_factura, fecha_emision, cliente_nombre, 
            monto_total, metodo_pago, responsable_registro, estado, 
            id_cliente // Opcional si usas FK
        } = req.body;
        
        const file = req.file;

        if (!numero_factura || !monto_total || !metodo_pago) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
        }

        const archivoRuta = file ? `/uploads/facturas/${file.filename}` : null;

        try {
            const pool = await poolPromise;
            
            // Validar duplicados
            const checkFolio = await pool.request()
                .input("numero_factura", sql.VarChar, numero_factura)
                .query("SELECT COUNT(*) as total FROM Facturas WHERE numero_factura = @numero_factura");
            
            if (checkFolio.recordset[0].total > 0) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({ success: false, message: "El número de factura ya existe." });
            }

            const request = pool.request();
            const result = await request
                .input("numero_factura", sql.VarChar, numero_factura)
                .input("fecha_emision", sql.Date, fecha_emision || null)
                .input("cliente_proveedor", sql.VarChar, cliente_nombre)
                .input("monto_total", sql.Decimal(12, 2), monto_total)
                .input("metodo_pago", sql.VarChar, metodo_pago)
                .input("estado", sql.VarChar, estado || 'PENDIENTE')
                .input("id_responsable", sql.Int, responsable_registro)
                .input("archivo", sql.VarChar, archivoRuta)
                .query(`
                    INSERT INTO Facturas (
                        numero_factura, fecha_emision, cliente_proveedor, 
                        monto_total, metodo_pago, estado, id_responsable, archivo, created_at
                    ) 
                    VALUES (
                        @numero_factura, @fecha_emision, @cliente_proveedor, 
                        @monto_total, @metodo_pago, @estado, @id_responsable, @archivo, GETDATE()
                    );
                    SELECT SCOPE_IDENTITY() AS id_factura;
                `);

            res.json({ success: true, message: "Factura guardada.", idFactura: result.recordset[0].id_factura });

        } catch (error) {
            console.error("Error BD:", error);
            if (file) fs.unlinkSync(file.path);
            res.status(500).json({ success: false, message: "Error al guardar.", error: error.message });
        }
    });
}

// ====================================================================
// 3. ACTUALIZAR FACTURA (PUT)
// ====================================================================
async function actualizarFactura(req, res) {
    uploadMiddleware(req, res, async function (err) {
        if (err) return res.status(400).json({ success: false, message: err.message });

        const { id } = req.params;
        const { 
            numero_factura, fecha_emision, cliente_nombre, 
            monto_total, metodo_pago, estado,
            archivo: archivoAnterior 
        } = req.body;
        
        const file = req.file;

        // 🔑 REGLA: Si hay archivo nuevo, usamos su ruta. Si no, conservamos la anterior.
        // NO borramos el archivo físico anterior del disco (según tu requerimiento).
        const archivoRuta = file ? `/uploads/facturas/${file.filename}` : archivoAnterior;

        if (!numero_factura || !monto_total) {
            if (file) fs.unlinkSync(file.path);
            return res.status(400).json({ success: false, message: "Faltan datos." });
        }

        try {
            const pool = await poolPromise;
            
            // Validar duplicidad de folio (excluyendo la actual)
            const check = await pool.request()
                .input("folio", sql.VarChar, numero_factura)
                .input("id", sql.Int, id)
                .query("SELECT COUNT(*) as total FROM Facturas WHERE numero_factura = @folio AND id_factura != @id");

            if (check.recordset[0].total > 0) {
                if (file) fs.unlinkSync(file.path);
                return res.status(400).json({ success: false, message: "El folio ya existe en otra factura." });
            }

            const result = await pool.request()
                .input("id", sql.Int, id)
                .input("numero_factura", sql.VarChar, numero_factura)
                .input("fecha_emision", sql.Date, fecha_emision || null)
                .input("cliente_proveedor", sql.VarChar, cliente_nombre)
                .input("monto_total", sql.Decimal(12, 2), monto_total)
                .input("metodo_pago", sql.VarChar, metodo_pago)
                .input("estado", sql.VarChar, estado)
                .input("archivo", sql.VarChar, archivoRuta) // Actualizamos ruta en BD
                .query(`
                    UPDATE Facturas SET 
                        numero_factura = @numero_factura,
                        fecha_emision = @fecha_emision,
                        cliente_proveedor = @cliente_proveedor,
                        monto_total = @monto_total,
                        metodo_pago = @metodo_pago,
                        estado = @estado,
                        archivo = @archivo,
                        updated_at = GETDATE()
                    WHERE id_factura = @id
                `);

            if (result.rowsAffected[0] === 0) {
                if (file) fs.unlinkSync(file.path);
                return res.status(404).json({ success: false, message: "Factura no encontrada." });
            }

            res.json({ success: true, message: "Factura actualizada." });

        } catch (error) {
            console.error(error);
            if (file) fs.unlinkSync(file.path);
            res.status(500).json({ success: false, message: "Error al actualizar." });
        }
    });
}

// ====================================================================
// 4. BUSCAR FACTURA (GET)
// ====================================================================
async function buscarFactura(req, res) {
    const { folio } = req.query; 
    if (!folio) return res.status(400).json({ success: false, message: "Falta folio." });

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("termino", sql.VarChar, `%${folio}%`)
            .query(`
                SELECT 
                    f.*,
                    (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
                FROM Facturas f
                LEFT JOIN Empleados e ON f.id_responsable = e.id_empleado
                WHERE f.numero_factura LIKE @termino OR f.cliente_proveedor LIKE @termino
            `);

        if (result.recordset.length === 0) return res.status(404).json({ success: false, message: "No encontrada." });
        
        res.json({ success: true, factura: result.recordset[0], facturas: result.recordset }); 

    } catch (error) {
        res.status(500).json({ success: false, message: "Error al buscar." });
    }
}

// ====================================================================
// 5. OBTENER POR ID (GET)
// ====================================================================
async function obtenerFacturaPorId(req, res) {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request().input("id", sql.Int, id).query(`
            SELECT f.*, (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
            FROM Facturas f
            LEFT JOIN Empleados e ON f.id_responsable = e.id_empleado
            WHERE f.id_factura = @id
        `);
        
        if (result.recordset.length === 0) return res.status(404).json({ success: false });
        res.json({ success: true, factura: result.recordset[0] });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}

// ====================================================================
// 6. RECIENTES (GET)
// ====================================================================
async function obtenerFacturasRecientes(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT TOP 10 f.*, (e.nombres + ' ' + e.apellido_paterno) AS responsable_nombre
            FROM Facturas f
            LEFT JOIN Empleados e ON f.id_responsable = e.id_empleado
            ORDER BY f.created_at DESC
        `);
        res.json({ success: true, facturas: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}

module.exports = {
    guardarFactura,
    actualizarFactura,
    buscarFactura,
    obtenerFacturaPorId,
    obtenerFacturasRecientes,
    obtenerEmpleados
};