import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/MenuStyles';

export default function GestionProyectos() {
  const [idProyecto, setIdProyecto] = useState('');
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [tipoProyecto, setTipoProyecto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [responsable, setResponsable] = useState('');
  const [estado, setEstado] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [Auditoria, setAuditoria] = useState('');
  const [Descripcion, setDescripcion] = useState('');

 
  const [RecursosList, setRecursosList] = useState([]);
  const [currentRecurso, setCurrentRecurso] = useState('');

  useEffect(() => {
    const generarId = () => {
      const id = 'PRJ-' + Math.floor(1000 + Math.random() * 9000);
      setIdProyecto(id);
    };
    generarId();

    const fechaHoy = new Date();
    const fechaFormateada = `${fechaHoy.getFullYear()}-${String(
      fechaHoy.getMonth() + 1
    ).padStart(2, '0')}-${String(fechaHoy.getDate()).padStart(2, '0')}`;
    setAuditoria(`Fecha: ${fechaFormateada} | Usuario: usuario1`);
  }, []);

  
  const guardarProyecto = () => {
    Alert.alert(
      "Confirmación",
      "¿Desea guardar este nuevo proyecto?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => {
           
            if (
              nombreProyecto.trim() === '' &&
              tipoProyecto.trim() === '' &&
              fechaInicio.trim() === '' &&
              fechaFin.trim() === '' &&
              responsable.trim() === '' &&
              estado.trim() === '' &&
              prioridad.trim() === '' &&
              RecursosList.length === 0 &&
              Descripcion.trim() === ''
            ) {
              Alert.alert("Error", "El proyecto no se puede guardar porque no hay campos rellenados");
              return;
            }

            
            setIdProyecto('PRJ-' + Math.floor(1000 + Math.random() * 9000));
            setNombreProyecto('');
            setTipoProyecto('');
            setFechaInicio('');
            setFechaFin('');
            setResponsable('');
            setEstado('');
            setPrioridad('');
            setRecursosList([]);
            setCurrentRecurso('');
            const fechaHoy = new Date();
            const fechaFormateada = `${fechaHoy.getFullYear()}-${String(
              fechaHoy.getMonth() + 1
            ).padStart(2, '0')}-${String(fechaHoy.getDate()).padStart(2, '0')}`;
            setAuditoria(`Fecha: ${fechaFormateada} | Usuario: usuario1`);
            setDescripcion('');
            Alert.alert("Éxito", "Proyecto guardado con éxito");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 50,
          alignItems: 'flex-start',
        }}
        showsVerticalScrollIndicator={true}
      >
        {/* Encabezado */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <Image
            source={require('../assets/1.png')}
            style={{ width: 60, height: 60, borderRadius: 10, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={[styles.title, { textAlign: 'left', marginBottom: 0 }]}>
            Gestión de Proyectos
          </Text>
        </View>

        <View style={{ width: '100%', height: 2, backgroundColor: '#060707ff', marginBottom: 15 }} />

        <View style={{ width: '100%' }}>
          <Text style={labelStyle}>ID de Proyecto</Text>
          <TextInput style={inputStyle} value={idProyecto} editable={false} />

          <Text style={labelStyle}>Nombre del Proyecto</Text>
          <TextInput
            style={inputStyle}
            placeholder="Escribe el nombre del proyecto"
            value={nombreProyecto}
            onChangeText={setNombreProyecto}
          />

          <Text style={labelStyle}>Tipo de Proyecto</Text>
          <TextInput
            style={inputStyle}
            placeholder="Ejemplo: Software, Infraestructura, etc."
            value={tipoProyecto}
            onChangeText={setTipoProyecto}
          />

          <Text style={labelStyle}>Fecha de Inicio</Text>
          <TextInput
            style={inputStyle}
            placeholder="YYYY-MM-DD"
            value={fechaInicio}
            onChangeText={setFechaInicio}
          />

          <Text style={labelStyle}>Fecha de Fin</Text>
          <TextInput
            style={inputStyle}
            placeholder="YYYY-MM-DD"
            value={fechaFin}
            onChangeText={setFechaFin}
          />

          <Text style={labelStyle}>Responsable / Encargado</Text>
          <TextInput
            style={inputStyle}
            placeholder="Nombre del responsable"
            value={responsable}
            onChangeText={setResponsable}
          />

          <Text style={labelStyle}>Estado del Proyecto</Text>
          <TextInput
            style={inputStyle}
            placeholder="En progreso, Planeado, Finalizado"
            value={estado}
            onChangeText={setEstado}
          />

          <Text style={labelStyle}>Prioridad</Text>
          <TextInput
            style={inputStyle}
            placeholder="Baja, Media, Alta"
            value={prioridad}
            onChangeText={setPrioridad}
          />

          <Text style={labelStyle}>Recursos</Text>
          <TextInput
            style={{ ...inputStyle, height: 120, textAlignVertical: 'top' }}
            placeholder="Escribe un recurso y presiona Enter..."
            value={currentRecurso}
            onChangeText={setCurrentRecurso}
            multiline
            blurOnSubmit={false}
            onSubmitEditing={() => {
              if (currentRecurso.trim() !== '') {
                setRecursosList([...RecursosList, currentRecurso.trim()]);
                setCurrentRecurso('');
              }
            }}
          />
          <View style={{ marginTop: 10 }}>
            {RecursosList.map((item, index) => (
              <Text key={index}>{index + 1}. {item}</Text>
            ))}
          </View>

          <Text style={labelStyle}>Auditoría</Text>
          <TextInput
            style={{ ...inputStyle, backgroundColor: '#e6e6e6' }}
            value={Auditoria}
            editable={false}
            multiline
          />

          <Text style={labelStyle}>Descripción</Text>
          <TextInput
            style={{ ...inputStyle, height: 120, textAlignVertical: 'top' }}
            placeholder="Explicación del Proyecto..."
            value={Descripcion}
            onChangeText={setDescripcion}
            multiline
          />

          <View style={{ marginVertical: 20, width: '100%' }}>
            <Button title="Guardar Proyecto" onPress={guardarProyecto} />
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const labelStyle = {
  fontWeight: 'bold',
  marginTop: 20,
};

const inputStyle = {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 10,
  marginTop: 5,
  width: '100%',
};
