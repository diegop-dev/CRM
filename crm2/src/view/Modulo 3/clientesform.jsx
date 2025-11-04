import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
// <-- ADAPTADO: Asegúrate de que esta ruta apunte a tu nueva lógica de cliente
import { useClienteLogic } from "../../controller/Modulo 3/clientesform";


// --- Componentes reutilizables (Sin cambios) ---
const FormInput = React.memo(({ label, value, onChangeText, editable = true, multiline = false }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={[styles.textInput, multiline && styles.multilineInput]}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            blurOnSubmit={false}
        />
    </View>
));

const SelectInput = React.memo(({ label, value, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={[styles.textInput, { justifyContent: "center" }]}>
                <Text>{value || "Seleccione..."}</Text>
            </View>
        </View>
    </TouchableOpacity>
));

const LockedInput = React.memo(({ label, value }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[styles.textInput, { backgroundColor: "#e6e6e6" }]}>
            <Text>{value}</Text>
        </View>
    </View>
));

// --- Paso 1: Datos del Cliente ---
// <-- ADAPTADO: Nuevos campos para Cliente
const Paso1 = React.memo(({ logic, showTipo, setShowTipo, showEstadoCliente, setShowEstadoCliente }) => (
    <>
        <LockedInput label="ID de Cliente" value={logic.idCliente} />
        <FormInput label="Nombre del Cliente" value={logic.nombre} onChangeText={logic.setNombre} />
        <FormInput label="Apellido Paterno" value={logic.apellidoPaterno} onChangeText={logic.setApellidoPaterno} />
        <FormInput label="Apellido Materno" value={logic.apellidoMaterno} onChangeText={logic.setApellidoMaterno} />

        <SelectInput label="Tipo" value={logic.tipo} onPress={() => setShowTipo(!showTipo)} />
        {showTipo && (
            <View style={styles.pickerContainer}>
                <Picker selectedValue={logic.tipo} onValueChange={(v) => { logic.setTipo(v); setShowTipo(false); }}>
                    <Picker.Item label="Seleccione..." value="" />
                    <Picker.Item label="Persona" value="Persona" />
                    <Picker.Item label="Empresa" value="Empresa" />
                </Picker>
            </View>
        )}

        <SelectInput label="Estado del Cliente" value={logic.estadoCliente} onPress={() => setShowEstadoCliente(!showEstadoCliente)} />
        {showEstadoCliente && (
            <View style={styles.pickerContainer}>
                <Picker selectedValue={logic.estadoCliente} onValueChange={(v) => { logic.setEstadoCliente(v); setShowEstadoCliente(false); }}>
                    <Picker.Item label="Seleccione..." value="" />
                    <Picker.Item label="Activo" value="Activo" />
                    <Picker.Item label="Inactivo" value="Inactivo" />
                    <Picker.Item label="Potencial" value="Potencial" />
                </Picker>
            </View>
        )}
    </>
));

// --- Paso 2: Contacto ---
// <-- ADAPTADO: Nuevos campos para Contacto
const Paso2 = React.memo(({ logic, showSexo, setShowSexo }) => (
    <>
        <SelectInput label="Sexo" value={logic.sexo} onPress={() => setShowSexo(!showSexo)} />
        {showSexo && (
            <View style={styles.pickerContainer}>
                <Picker selectedValue={logic.sexo} onValueChange={(v) => { logic.setSexo(v); setShowSexo(false); }}>
                    <Picker.Item label="Seleccione..." value="" />
                    <Picker.Item label="Hombre" value="Hombre" />
                    <Picker.Item label="Mujer" value="Mujer" />
                </Picker>
            </View>
        )}

        <FormInput label="Correo Electronico" value={logic.correoElectronico} onChangeText={logic.setCorreoElectronico} />
        <FormInput label="Teléfono" value={logic.telefono} onChangeText={logic.setTelefono} />
        <FormInput label="Calle" value={logic.calle} onChangeText={logic.setCalle} />
        <FormInput label="Colonia" value={logic.colonia} onChangeText={logic.setColonia} />
        <FormInput label="Ciudad" value={logic.ciudad} onChangeText={logic.setCiudad} />
    </>
));

// --- Paso 3: Dirección y Detalles ---
// <-- ADAPTADO: Campos restantes y Botón de Guardar
const Paso3 = React.memo(({ logic, handleGuardar }) => (
    <>
        <FormInput label="Estado" value={logic.estado} onChangeText={logic.setEstado} />
        <FormInput label="País" value={logic.pais} onChangeText={logic.setPais} />
        <FormInput label="Código Postal" value={logic.codigoPostal} onChangeText={logic.setCodigoPostal} />

        <FormInput label="Descripción" value={logic.descripcion} onChangeText={logic.setDescripcion} multiline />

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
            {/* <-- ADAPTADO */}
            <Text style={styles.saveButtonText}>Guardar Cliente</Text>
        </TouchableOpacity>
    </>
));

// --- Principal ---
// <-- ADAPTADO: Renombrado a ClientesFormView
export default function ClientesFormView({ cliente = {}, mode = "crear" }) {
    // <-- ADAPTADO: Usar el hook de lógica de cliente
    const logic = useClienteLogic(cliente);
    const editable = mode !== "consultar";
    const [step, setStep] = useState(1);

    // 📄 useClienteLogic.js (controlador lógico del formulario)
    const handleGuardar = async () => {
        try {
            // <-- ADAPTADO: Objeto de datos del cliente
            const clienteData = {
                nombre: logic.nombre,
                apellidoPaterno: logic.apellidoPaterno,
                apellidoMaterno: logic.apellidoMaterno,
                tipo: logic.tipo,
                estadoCliente: logic.estadoCliente,
                sexo: logic.sexo,
                correoElectronico: logic.correoElectronico,
                telefono: logic.telefono,
                calle: logic.calle,
                colonia: logic.colonia,
                ciudad: logic.ciudad,
                estado: logic.estado,
                pais: logic.pais,
                codigoPostal: logic.codigoPostal,
                descripcion: logic.descripcion,
            };

            // <-- ADAPTADO: Endpoint para guardar clientes
            const response = await fetch("http://192.168.1.109:3000/clientes/guardar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clienteData),
            });

            const result = await response.json();

            if (response.ok) {
                // <-- ADAPTADO: Mensaje y ID de cliente
                alert(`Cliente guardado correctamente. ID generado: ${result.idCliente}`);
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            // <-- ADAPTADO: Mensajes de error
            console.error("Error al guardar cliente:", error);
            alert("Error al guardar cliente");
        }
    };

    // <-- ADAPTADO: Estados para los nuevos Pickers
    const [showSexo, setShowSexo] = useState(false);
    const [showTipo, setShowTipo] = useState(false);
    const [showEstadoCliente, setShowEstadoCliente] = useState(false);
    // Se eliminan los estados de fecha, rol y estado de empleado

    // Se eliminan las listas de dias, meses y años que no se usan

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", paddingTop: 10, paddingHorizontal: 20 }}
            >
                {/* <-- ADAPTADO: Props para cada paso */}
                {step === 1 && <Paso1
                    logic={logic}
                    showTipo={showTipo}
                    setShowTipo={setShowTipo}
                    showEstadoCliente={showEstadoCliente}
                    setShowEstadoCliente={setShowEstadoCliente}
                />}
                {step === 2 && <Paso2
                    logic={logic}
                    showSexo={showSexo}
                    setShowSexo={setShowSexo}
                />}
                {step === 3 && <Paso3
                    logic={logic}
                    handleGuardar={handleGuardar}
                />}

                {/* Lógica de navegación (Sin cambios) */}
                <View style={styles.buttonRow}>
                    {step > 1 && (
                        <TouchableOpacity style={[styles.navButton, styles.backButton]} onPress={() => setStep(step - 1)}>
                            <Text style={styles.navButtonText}>Regresar</Text>
                        </TouchableOpacity>
                    )}
                    {step < 3 && (
                        <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={() => setStep(step + 1)}>
                            <Text style={styles.navButtonText}>Continuar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Estilos (Sin cambios)
const styles = StyleSheet.create({
    inputContainer: { marginBottom: 20 },
    inputLabel: { fontSize: 14, fontWeight: "600", color: "#34495E", marginBottom: 10 },
    textInput: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderColor: "#BDC3C7",
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 15,
        fontSize: 15,
        color: "#333",
    },
    multilineInput: { height: 100 },
    pickerContainer: { backgroundColor: "#fff", borderRadius: 20, borderWidth: 1, borderColor: "#BDC3C7", overflow: "hidden" },
    dateRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    datePicker: { flex: 1, marginHorizontal: 3, backgroundColor: "#fff", borderRadius: 10 },
    navButton: { flex: 1, borderRadius: 25, paddingVertical: 12, alignItems: "center", marginHorizontal: 5 },
    backButton: { backgroundColor: "#95A5A6" },
    nextButton: { backgroundColor: "#3498DB" },
    navButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
    buttonRow: { flexDirection: "row", marginTop: 25 },
    saveButton: { backgroundColor: "#2ECC71", borderRadius: 25, paddingVertical: 12, alignItems: "center", marginTop: 25 },
    saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
