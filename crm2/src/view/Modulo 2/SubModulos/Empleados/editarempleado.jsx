import React, { useEffect } from "react";
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
import { useRoute, useNavigation } from "@react-navigation/native";
import EmpleadosFormView from "../Empleados/empleadosform";
import { useEditarEmpleadoLogic } from "../../../../controller/Modulo 2/SubModulos/Empleados/editarempleado";

export default function EditarEmpleadoView() {
  const route = useRoute();
  const navigation = useNavigation();
  const empleadoDesdeConsulta = route.params?.empleado || null;
  
  const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir de la pantalla de editar empleado y volver al menú de empleados?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Volver",
          onPress: () => {
            Alert.alert(
              "Área Segura",
              "Será redirigido al Menú de Empleados.",
              [
                { text: "Permanecer", style: "cancel" },
                {
                  text: "Confirmar",
                  onPress: () => {
                    navigation.navigate("MenuPrincipal");
                  },
                },
              ]
            );
          },
        },
      ],
      { cancelable: true }
    );
  }

  // Traemos las funciones del hook
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    empleados,
    empleadoSeleccionado,
    setEmpleadoSeleccionado,
    setEmpleadoDesdeNavegacion,
    loading,
    buscarEmpleado,
    seleccionarEmpleado,
    guardarCambios,
    deseleccionarEmpleado,
  } = useEditarEmpleadoLogic();

  // Usamos la función de formateo si viene de consulta
  useEffect(() => {
    if (empleadoDesdeConsulta) {
      setEmpleadoSeleccionado(empleadoDesdeConsulta);
    }
  }, [empleadoDesdeConsulta]);

  const handleInputChange = (campo, valor) => {
    setEmpleadoSeleccionado({ ...empleadoSeleccionado, [campo]: valor });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image
              source={require("../../../../../assets/LOGO_BLANCO.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Empleado</Text>
        </View>

        <View style={styles.divider} />

        {/* 🔹 CAMBIO 1: ÁREA DE BÚSQUEDA SIEMPRE VISIBLE */}
        <Text style={styles.label}>Buscar empleado:</Text>
        <View style={styles.searchBox}>
            <TextInput
            style={styles.input}
            placeholder="Ejemplo: Juan Pérez"
            value={terminoBusqueda}
            onChangeText={setTerminoBusqueda}
            />
            {/* 🔹 CAMBIO 2: BOTÓN DINÁMICO (Buscar / Limpiar) */}
            <TouchableOpacity
            style={[
                styles.button, 
                loading && { opacity: 0.6 },
                empleadoSeleccionado && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
            ]}
            onPress={empleadoSeleccionado ? deseleccionarEmpleado : buscarEmpleado}
            disabled={loading}
            >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.buttonText}>
                    {empleadoSeleccionado ? "Limpiar" : "Buscar"}
                </Text>
            )}
            </TouchableOpacity>
        </View>

        {/* Lista de empleados (Solo si NO hay selección) */}
        {empleados.length > 0 && !empleadoSeleccionado && (
          <FlatList
            data={empleados}
            keyExtractor={(item, index) =>
              item.id_empleado
                ? item.id_empleado.toString()
                : item.idEmpleado
                  ? item.idEmpleado.toString()
                  : `empleado-${index}`
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => seleccionarEmpleado(item)} >
                <Text style={styles.listText}>
                  {item.nombres || item.nombre}{" "}
                  {item.apellido_paterno || item.apellidoPaterno}{" "}
                  {item.apellido_materno || item.apellidoMaterno}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
                No hay empleados para mostrar.
              </Text>
            )}
            scrollEnabled={false}
          />
        )}

        {/* Formulario (Solo si HAY selección) */}
        {empleadoSeleccionado && (
          <View style={styles.resultContainer}>

            {/* Nota: El botón antiguo de regresar se ha eliminado porque el de "Limpiar" arriba cumple su función */}

            <Text style={styles.resultTitle}>
              Editar datos de{" "}
              {empleadoSeleccionado.nombres || "Empleado"}
            </Text>

            <EmpleadosFormView
              modo="editar"
              empleado={empleadoSeleccionado}
              editable
              onChange={handleInputChange}
              onGuardar={guardarCambios}
            />

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (tus estilos se quedan igual) ...
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  backButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 5,
    color: "#ffffff",
  },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 5 },
  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 10 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D0D3D4",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
  },
  button: {
    backgroundColor: "#77a7ab",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  listText: { fontSize: 16, fontWeight: "500", color: "#2C3E50" },
  resultContainer: {
    backgroundColor: "",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color:"white", textAlign:"center"},
  regresarButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  regresarButtonText: {
    fontSize: 15,
    color: "#ff0000ff", 
    fontWeight: '500',
  },
});