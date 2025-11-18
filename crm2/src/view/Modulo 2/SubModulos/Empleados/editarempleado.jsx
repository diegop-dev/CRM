// src/view/Modulo1/editarempleado.jsx
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

  // Traemos las dos funciones de 'set' y la nueva de 'deseleccionar'
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    empleados,
    empleadoSeleccionado,
    setEmpleadoSeleccionado,  // <--- Para handleInputChange
    setEmpleadoDesdeNavegacion, // <--- Para el useEffect
    loading,
    buscarEmpleado,
    seleccionarEmpleado,
    guardarCambios,
    deseleccionarEmpleado,  // <--- 1. Importamos la nueva función
  } = useEditarEmpleadoLogic();

  // CAMBIO 2: Usamos la función de formateo
  useEffect(() => {
    if (empleadoDesdeConsulta) {
      setEmpleadoSeleccionado(empleadoDesdeConsulta);
    }
  }, [empleadoDesdeConsulta]);

  // Esta función es correcta, usa 'setEmpleadoSeleccionado'
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

        {/* Campo de búsqueda (solo si no venimos desde consulta) */}
        {!empleadoDesdeConsulta && !empleadoSeleccionado && ( // <-- Ocultamos si hay un empleado seleccionado
          <>
            <Text style={styles.label}>Buscar empleado:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: Juan Pérez"
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={buscarEmpleado}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Buscar</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Lista de empleados */}
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

        {/* Formulario */}
        {empleadoSeleccionado && (
          <View style={styles.resultContainer}>

            {/* Añadimos el botón/texto de regreso */}
            {!empleadoDesdeConsulta && ( // Solo mostrar si NO venimos desde 'consultar'
              <TouchableOpacity
                onPress={deseleccionarEmpleado}
                style={styles.regresarButton}
              >
                <Text style={styles.regresarButtonText}>{"🔙 Volver a la lista"}</Text>
              </TouchableOpacity>
            )}

            {/*  Usamos 'nombres' para el título */}
            <Text style={styles.resultTitle}>
              Editar datos de{" "}
              {empleadoSeleccionado.nombres ||
                 "Empleado"}
            </Text>

            <EmpleadosFormView
              modo="editar"
              empleado={empleadoSeleccionado}
              editable
              onChange={handleInputChange}
              // Pasamos la función 'guardarCambios'
              onGuardar={guardarCambios}
            />

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ... (tus estilos se quedan exactamente igual) ...
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

  //  Añadimos los estilos para el botón de regreso
  regresarButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  regresarButtonText: {
    fontSize: 18,
    color: "#2b3042", 
    fontWeight: '500',
  },
});
