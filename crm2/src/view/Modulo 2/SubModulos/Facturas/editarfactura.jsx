import React from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FacturaFormView from "../../../../view/Modulo 2/SubModulos/Facturas/facturasform"; 
import { useEditarFacturaLogic } from "../../../../controller/Modulo 2/SubModulos/Facturas/editarfactura"; 

export default function EditarFacturaView({ navigation }) {

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
    handleLimpiar,
    onFileSelect, 
    onViewFile    
  } = useEditarFacturaLogic();

  const handleLogoPress = () => {
      Alert.alert("Salir", "¿Volver al menú?", [
        { text: "Cancelar" },
        { text: "Sí", onPress: () => navigation.navigate("MenuPrincipal") }
      ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado */}
        <View style={styles.header}>
            <TouchableOpacity onPress={handleLogoPress}>
              <Image
                source={require("../../../../../assets/LOGO_BLANCO.png")} 
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Factura</Text>
        </View>
        <View style={styles.divider} />

        {/* --- Barra de Búsqueda --- */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por Folio..."
            placeholderTextColor="#999"
            value={terminoBusqueda}
            onChangeText={setTerminoBusqueda}
            editable={!factura} 
          />

          {/* Botón dinámico: Buscar o Limpiar */}
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

        {/* --- Loader --- */}
        {isLoading && (
          <ActivityIndicator size="large" color="#77a7ab" style={{ marginVertical: 20 }} />
        )}

        {/* --- FORMULARIO DE EDICIÓN --- */}
        {factura && !isLoading && (
          <View style={{ flex: 1, marginTop: 20, backgroundColor: '', borderRadius: 12, padding: 10 }}>
             <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#ffffffff'}}>
                Editando Factura: {factura.numeroFolio}
             </Text>
             
             <FacturaFormView
               factura={factura}
               modo="editar" //  Esto activa el botón de reemplazar en el form si así se requiere
               onChange={onChange}
               onGuardar={onGuardar}
               clientes={clientesList} 
               onRegresar={handleLimpiar} 
               onFileSelect={onFileSelect} //  Pasamos la función
               onViewFile={onViewFile}     //  Pasamos la función
             />
          </View>
        )}

        {/* --- LISTA DE RECIENTES --- */}
        {!factura && !isLoading && facturasRecientes.length > 0 && (
          <View style={styles.recientesContainer}>
            <Text style={styles.recientesTitle}>Facturas Recientes</Text>
            {facturasRecientes.map(f => (
              <TouchableOpacity
                key={f.id_factura}
                style={styles.recienteItem}
                onPress={() => {
                    setTerminoBusqueda(f.numero_factura);
                    handleBuscarFactura(f.numero_factura);
                }}
              >
                <Text style={styles.recienteItemText}>{`Folio: ${f.numero_factura}`}</Text>
                <Text style={styles.recienteItemSubText}>{`Monto: $${f.monto_total}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>

      {/* Botón Flotante Regresar */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2b3042", paddingHorizontal: 15, paddingTop: 5 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#FFFFFF" },
  headerTitle: { fontSize: 26, fontWeight: "700", marginLeft: 15, color: "#f7f3f3ff" },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 10, marginBottom: 20 },
  
  searchContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10, },
  searchInput: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, color: "#333" },
  searchButton: { backgroundColor: "#77a7ab", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 15, marginLeft: 10 },
  limpiarButton: { backgroundColor: "#E74C3C" },
  searchButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  
  recientesContainer: { marginHorizontal: 0, marginTop: 20, backgroundColor: "#3a3f50", borderRadius: 12, padding: 15 },
  recientesTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#5a5f70" },
  recienteItem: { backgroundColor: "#2b3042", paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, marginBottom: 10 },
  recienteItemText: { color: "#f0f0f0", fontSize: 16, fontWeight: "500" },
  recienteItemSubText: { color: "#bdc3c7", fontSize: 14, marginTop: 2 },

  backButton: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#77a7ab', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, elevation: 8 },
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});