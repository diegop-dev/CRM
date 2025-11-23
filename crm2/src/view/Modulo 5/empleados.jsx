import React from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Image, 
  ActivityIndicator, 
  FlatList, 
  Alert 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Importaciones de componentes y lógica
import UsuariosFormView from "../../view/Modulo 5/usuariosform"; // El formulario reutilizable
// CAMBIO: Importamos el hook de empleados
import { useEmpleadosLogic } from "../../controller/Modulo 5/empleados";

export default function EmpleadosView() {
  const navigation = useNavigation();
   
  // Desestructuramos toda la lógica del hook de empleados
  const {
    terminoBusqueda, 
    setTerminoBusqueda, 
    listaUsuarios, 
    usuarioSeleccionado,
    loading, 
    buscarUsuarios, 
    seleccionarUsuario, 
    deseleccionarUsuario,
    formLogic 
  } = useEmpleadosLogic();

  const handleLogoPress = () => {
    Alert.alert("Salir", "¿Volver al menú principal?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sí", onPress: () => navigation.navigate("MenuPrincipal") }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollContainer}>
        
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image 
              source={require("../../../assets/LOGO_BLANCO.png")} 
              style={styles.headerIcon} 
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gestión de Empleados</Text>
        </View>
        <View style={styles.divider} />

        {/* ÁREA DE BÚSQUEDA SIEMPRE VISIBLE */}
        <Text style={styles.label}>Buscar Empleado:</Text>
        <View style={styles.searchBox}>
            <TextInput
                style={styles.input}
                placeholder="Nombre, Usuario..."
                placeholderTextColor="#999"
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
            />
            {/* BOTÓN CON DOBLE FUNCIÓN: BUSCAR / LIMPIAR */}
            <TouchableOpacity 
                style={[
                    styles.button, 
                    loading && { opacity: 0.6 },
                    usuarioSeleccionado && { backgroundColor: "#d92a1c" }
                ]} 
                onPress={usuarioSeleccionado ? deseleccionarUsuario : buscarUsuarios} 
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>
                        {usuarioSeleccionado ? "Limpiar" : "Buscar"}
                    </Text>
                )}
            </TouchableOpacity>
        </View>

        {/* 1. LISTA DE RESULTADOS (Visible solo si NO hay un usuario seleccionado) */}
        {!usuarioSeleccionado && (
          <>
            <FlatList
              data={listaUsuarios}
              keyExtractor={(item) => item.id_usuario.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.listItem} onPress={() => seleccionarUsuario(item)}>
                  <Text style={styles.listText}>
                    {item.nombres} {item.apellido_paterno}
                  </Text>
                  <Text style={styles.listSubText}>Usuario: {item.nombre_usuario}</Text>
                  <Text style={styles.listSubText}>Estado: {item.estado_usuario}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                !loading && (
                  <Text style={styles.emptyText}>
                    No hay resultados. Busque por nombre o usuario.
                  </Text>
                )
              }
              scrollEnabled={false}
            />
          </>
        )}

        {/* 2. FORMULARIO DE EDICIÓN (Visible SI hay un usuario seleccionado) */}
        {usuarioSeleccionado && (
          <View style={styles.resultContainer}>
           

            <Text style={styles.resultTitle}>
              Editando permisos de: {usuarioSeleccionado.nombres}
            </Text>

            <UsuariosFormView 
                usuarioData={formLogic} 
                modo="editar"
                onGuardar={formLogic.guardarCambios}
            />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1 },
   
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  headerTitle: { fontSize: 22, fontWeight: "700", marginLeft: 10, color: "#ffffff" },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 5, marginBottom: 20 },
   
  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 10 },
  searchBox: { flexDirection: "row", gap: 10, marginBottom: 10 },
   
  input: { 
    flex: 1, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 16, 
    color: "#333" 
  },
   
  button: { 
    backgroundColor: "#77a7ab", 
    padding: 12, 
    borderRadius: 10, 
    justifyContent: 'center', 
    minWidth: 80, 
    alignItems: 'center' 
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
   
  listItem: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 8, 
    elevation: 2 
  },
  listText: { fontSize: 16, fontWeight: "bold", color: "#2C3E50" },
  listSubText: { fontSize: 14, color: "#666", marginTop: 2 },
  emptyText: { color: "#FFF", textAlign: "center", marginTop: 20, opacity: 0.8 },
   
  resultContainer: { 
    backgroundColor: "", 
    padding: 20, 
    borderRadius: 12, 
    marginTop: 10 
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#ffffffff", textAlign: 'center' },
   
  regresarButton: { marginBottom: 15, alignSelf: 'flex-start' },
  regresarButtonText: { fontSize: 16, color: "#007AFF", fontWeight: "bold" },
});