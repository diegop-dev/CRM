import { useState, useCallback } from "react";

// Hook para manejar los campos del formulario de Factura
export function useFacturaFormLogic(initialFactura = {}) {
  
  const [idFactura, setIdFactura] = useState(initialFactura.id_factura || "");
  const [numeroFolio, setNumeroFolio] = useState(initialFactura.numeroFolio || "");
  
  // Fecha de emisión desglosada
  const [diaEmision, setDiaEmision] = useState(initialFactura.diaEmision || "");
  const [mesEmision, setMesEmision] = useState(initialFactura.mesEmision || "");
  const [añoEmision, setAñoEmision] = useState(initialFactura.añoEmision || "");

  // Cliente
  const [idCliente, setIdCliente] = useState(initialFactura.id_cliente || "");
  const [clienteNombre, setClienteNombre] = useState(initialFactura.cliente_nombre || "");

  const [montoTotal, setMontoTotal] = useState(initialFactura.montoTotal || "");
  const [metodoPago, setMetodoPago] = useState(initialFactura.metodoPago || "");
  
  // Responsable (generalmente el usuario logueado, solo para mostrar)
  const [responsableRegistro, setResponsableRegistro] = useState(initialFactura.responsable_registro || "");

  // Archivo
  const [archivo, setArchivo] = useState(initialFactura.archivo || null);

  // Función para empaquetar los datos antes de guardar
  const getFacturaData = useCallback(() => {
    return {
      id_factura: idFactura,
      numeroFolio: numeroFolio,
      diaEmision, mesEmision, añoEmision,
      idCliente: idCliente,
      clienteNombre: clienteNombre,
      montoTotal: montoTotal,
      metodoPago: metodoPago,
      responsableRegistro: responsableRegistro,
      archivo: archivo
    };
  }, [idFactura, numeroFolio, diaEmision, mesEmision, añoEmision, idCliente, clienteNombre, montoTotal, metodoPago, responsableRegistro, archivo]);

  return {
    // Getters y Setters individuales para conectar con los inputs
    idFactura, setIdFactura,
    numeroFolio, setNumeroFolio,
    diaEmision, setDiaEmision,
    mesEmision, setMesEmision,
    añoEmision, setAñoEmision,
    idCliente, setIdCliente,
    clienteNombre, setClienteNombre,
    montoTotal, setMontoTotal,
    metodoPago, setMetodoPago,
    responsableRegistro, setResponsableRegistro,
    archivo, setArchivo,
    
    getFacturaData // Función para obtener el objeto completo
  };
}