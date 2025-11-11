import React from "react";
import { ScrollView, StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Importamos el FORMULARIO "TONTO" que ya creamos
import FacturaFormView from "./facturasform"; 
// Importamos el HOOK de lógica que acabamos de crear
import { useEditarFacturaLogic } from "../../../../controller/Modulo 2/SubModulos/Facturas/editarfactura"; 

export default function EditarFacturaView() {

  // Usamos el hook para toda la lógica
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    factura,
    clientesList,
    facturasRecientes,
    isLoading,
    handleBuscarFactura,
    onChange,
    onGuardar,
    handleLimpiar 
  } = useEditarFacturaLogic();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../../../assets/LOGO_BLANCO.png")} // Ajusta esta ruta
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Editar Factura</Text>
        </View>
        <View style={styles.divider} />

        {/* --- Barra de Búsqueda --- */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por Número de Folio..."
            placeholderTextColor="#999"
            value={terminoBusqueda}
            onChangeText={setTerminoBusqueda}
            editable={!factura} // No se puede editar si ya hay una factura cargada
            keyboardType="numeric" // Ideal para folios numéricos
          />

          {/* Botón cambia entre "Buscar" y "Limpiar" */}
          {factura ? (
            <TouchableOpacity
              style={[styles.searchButton, styles.limpiarButton]}
              onPress={handleLimpiar}
            >
              <Text style={styles.searchButtonText}>Limpiar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleBuscarFactura()}
            >
              <Text style={styles.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* --- Indicador de Carga --- */}
        {isLoading && (
          <ActivityIndicator size="large" color="#77a7ab" style={{ marginVertical: 20 }} />
        )}

        {/* --- Formulario (SOLO SI SE ENCONTRÓ UNA FACTURA) --- */}
        {factura && !isLoading && (
          <View style={{ flex: 1, marginTop: 20 }}>
            <FacturaFormView
              factura={factura}
              modo="editar" // <-- ¡AQUÍ ESTÁ LA MAGIA!
              onChange={onChange}
              onGuardar={onGuardar}
              clientes={clientesList} // Pasa la lista de clientes al formulario
            />
          </View>
        )}

        {/* --- Lista de Facturas Recientes --- */}
        {/* Se muestra solo si NO hay una factura buscada y NO está cargando */}
        {!factura && !isLoading && (
          <View style={styles.recientesContainer}>
            <Text style={styles.recientesTitle}>
              {facturasRecientes.length > 0 ? "Facturas Recientes" : "No hay facturas recientes"}
            </Text>
            {facturasRecientes.map(f => (
              <TouchableOpacity
                key={f.id_factura}
                style={styles.recienteItem}
                onPress={() => {
                  // Al hacer clic, poblamos la barra de búsqueda Y buscamos
                  setTerminoBusqueda(f.numero_folio);
                  handleBuscarFactura(f.numero_folio);
                }}
              >
                <Text style={styles.recienteItemText}>{`Folio: ${f.numero_folio}`}</Text>
                <Text style={styles.recienteItemSubText}>{`Monto: $${f.monto_total}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
// (Copiados de editarproyecto.jsx para consistencia)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b3042",
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  headerIcon: {
    width: 60,
    height: 80,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 15,
    color: "#f7f3f3ff",
  },
  divider: {
    height: 3,
    backgroundColor: "#d92a1c",
    marginVertical: 10,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#77a7ab",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  limpiarButton: { 
    backgroundColor: "#E74C3C", // Rojo para "Limpiar"
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  recientesContainer: {
    marginHorizontal: 0,
    marginTop: 20,
    backgroundColor: "#3a3f50", 
    borderRadius: 12,
    padding: 15,
  },
  recientesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#5a5f70",
  },
  recienteItem: {
    backgroundColor: "#2b3042",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  recienteItemText: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "500",
  },
  recienteItemSubText: { // Estilo extra para el monto
    color: "#bdc3c7",
    fontSize: 14,
    marginTop: 2,
  },
});