const sql = require("mssql");
const poolPromise = require("../db");

// ====================================================================
// 1. BUSCAR USUARIOS (Por Rol y Término)
// ====================================================================
async function buscarUsuarios(req, res) {
    const { rol, termino } = req.query;
    // rol puede ser 'admin' o 'empleado'
    // termino es el texto de búsqueda
    
    const rolFiltro = rol === 'admin' ? 'Administrador' : 'Empleado'; // Ajusta según los nombres en tu tabla Roles
    const terminoBusqueda = termino ? `%${termino}%` : '%';

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("rolNombre", sql.VarChar, rolFiltro)
            .input("termino", sql.VarChar, terminoBusqueda)
            .query(`
                SELECT 
                    u.id_usuario, 
                    u.nombre_usuario, 
                    u.estado_usuario,
                    e.id_empleado,
                    e.nombres, 
                    e.apellido_paterno,
                    r.nombre as rol
                FROM Usuarios u
                JOIN Empleados e ON u.id_empleado = e.id_empleado
                JOIN Roles r ON u.id_rol = r.id_rol
                WHERE r.nombre = @rolNombre
                AND (e.nombres LIKE @termino OR e.apellido_paterno LIKE @termino OR u.nombre_usuario LIKE @termino)
            `);

        res.json({ success: true, usuarios: result.recordset });

    } catch (error) {
        console.error("Error buscando usuarios:", error);
        res.status(500).json({ success: false, message: "Error al buscar usuarios." });
    }
}

// ====================================================================
// 2. OBTENER PERMISOS DE UN USUARIO (CORREGIDO)
// ====================================================================
async function obtenerPermisosUsuario(req, res) {
    const { id } = req.params; 
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("id_usuario", sql.Int, id)
            .query(`
                SELECT 
                    CM.id_modulo,
                    CM.nombre_modulo,
                    CM.clave_modulo,
                    CM.descripcion,
                    --CAMBIO CLAVE: Convertimos a INT para evitar problemas de tipos (Buffer/Boolean)
                    CAST(ISNULL(AUM.activo, 0) AS INT) as activo
                FROM Cat_Modulos CM
                LEFT JOIN Acceso_Usuarios_Modulos AUM 
                    ON CM.id_modulo = AUM.id_modulo 
                    AND AUM.id_usuario = @id_usuario
                ORDER BY CM.id_modulo ASC
            `);

        res.json({ success: true, permisos: result.recordset });

    } catch (error) {
        console.error("Error obteniendo permisos:", error);
        res.status(500).json({ success: false, message: "Error al cargar permisos." });
    }
}


// ====================================================================
// 3. OBTENER CATÁLOGO COMPLETO (Para crear nuevo usuario)
// ====================================================================
async function obtenerCatalogoPermisos(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT id_modulo, nombre_modulo, descripcion, CAST(0 AS BIT) as activo 
            FROM Cat_Modulos
            ORDER BY id_modulo ASC
        `);
        res.json({ success: true, permisos: result.recordset });
    } catch (error) {
        res.status(500).json({ success: false });
    }
}

// ====================================================================
// 4. ACTUALIZAR PERMISOS (Guardar cambios de los switches)
// ====================================================================
async function actualizarPermisos(req, res) {
    const { id_usuario, permisos } = req.body; 
    // 'permisos' es un array con los IDs de los módulos que deben estar ACTIVOS [1, 3, 5]

    if (!id_usuario) return res.status(400).json({ success: false, message: "Falta ID usuario." });

    try {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        
        await transaction.begin();
        const request = new sql.Request(transaction);

        try {
            // PASO 1: Desactivar TODOS los permisos de este usuario primero
            await request.input("id_usuario", sql.Int, id_usuario).query(`
                UPDATE Acceso_Usuarios_Modulos 
                SET activo = 0 
                WHERE id_usuario = @id_usuario
            `);

            // PASO 2: Activar solo los que vienen en el array
            // Iteramos sobre el array de IDs recibidos
            if (permisos && permisos.length > 0) {
                for (const idModulo of permisos) {
                    const reqLoop = new sql.Request(transaction);
                    await reqLoop
                        .input("u_id", sql.Int, id_usuario)
                        .input("m_id", sql.Int, idModulo)
                        .query(`
                            IF EXISTS (SELECT 1 FROM Acceso_Usuarios_Modulos WHERE id_usuario = @u_id AND id_modulo = @m_id)
                            BEGIN
                                UPDATE Acceso_Usuarios_Modulos SET activo = 1 WHERE id_usuario = @u_id AND id_modulo = @m_id
                            END
                            ELSE
                            BEGIN
                                INSERT INTO Acceso_Usuarios_Modulos (id_usuario, id_modulo, activo) VALUES (@u_id, @m_id, 1)
                            END
                        `);
                }
            }

            await transaction.commit();
            res.json({ success: true, message: "Permisos actualizados correctamente." });

        } catch (err) {
            await transaction.rollback();
            throw err;
        }

    } catch (error) {
        console.error("Error actualizando permisos:", error);
        res.status(500).json({ success: false, message: "Error al guardar permisos." });
    }
}

module.exports = {
    buscarUsuarios,
    obtenerPermisosUsuario,
    obtenerCatalogoPermisos,
    actualizarPermisos
};