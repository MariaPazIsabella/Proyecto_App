import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useState, useEffect } from 'react';
import { StyleSheet,TimePickerAndroid, Text, View, TextInput, Image, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { FIRESTORE_DB } from '../consts/firebase';
import { collection, addDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import dataComunaEstablecimiento from '../consts/dataComunaEstablecimiento'
import dataEstablecimientos from '../consts/dataEstablecimientos'
import dataTipoEstablecimiento from '../consts/dataTipoEstablecimiento'
import COLORS from '../consts/colors';
import { PrimaryButton } from './components/Button';

const Formulario = (navigation) => {
  const [isEditing, setIsEditing] = useState(false);

   useEffect(() => {
    obtenerUid();
    cargarDatosPerfil();
  }, []); 
  const datosObligatorios = async () => {
    if (!tipoAgresion || !fecha || !hora || !nombreComuna || !nombreTipo || !establecimientoId || !unidad || !tipoAgresor || !primerNombreTestigo1 || !segundoApellidoTestigo1 || !segundoNombreTestigo1 || !primerApellidoTestigo1 || !rutTestigo1 || !telefonoTestigo1 || !descripcion) {
      Alert.alert('Faltan datos', 'Por favor complete los campos obligatorios');
    } else {
      subirReporte()
    }
  }
  const subirReporte = async () => {
    const nombreTestigo1 = primerNombreTestigo1 + ' ' + segundoNombreTestigo1 + ' ' + primerApellidoTestigo1 + ' ' + segundoApellidoTestigo1;
    const nombreTestigo2 = primerNombreTestigo2 + ' ' + segundoNombreTestigo2 + ' ' + primerApellidoTestigo2 + ' ' + segundoApellidoTestigo2;
    const nombreAgresor = primerNombreAgresor + ' ' + segundoNombreAgresor + ' ' + primerApellidoAgresor + ' ' + segundoApellidoAgresor;
    if (uid) {
      addDoc(collection(FIRESTORE_DB, 'ReportsUploaded'), {
        uid: uid,
        tipoAgresion: tipoAgresion,
        fecha: fecha,
        hora: tiempo,
        nombreComuna: nombreComuna,
        nombreTipo: nombreTipo,
        establecimientoId: establecimientoId,
        servicioSalud: 'Servicio de Salud del BioBio',
        unidad: unidad,
        descripcionUnidad: descripcionUnidad,
        nombreAfectado: nombreAfectado,
        genero: genero,
        estamentoAfectado: estamentoAfectado,
        tipoEstamento: tipoEstamento,
        rutAfectado: rutAfectado,
        fechaNacimiento: fechaNacimiento,
        edad: edad,
        domicilio: domicilio,
        telefonoAfectado: telefonoAfectado,
        correo: correo,
        mutualidad: mutualidad,
        tipoAgresor: tipoAgresor,
        nombreAgresor: nombreAgresor,
        rutAgresor: rutAgresorValido,
        sectorAgresor: sectorAgresor,
        domicilioAgresor: domicilioAgresor,
        telefonoAgresor: telefonoAgresor,
        nombreTestigo1: nombreTestigo1,
        rutTestigo1: rutTestigo1Valido,
        telefonoTestigo1: telefonoTestigo1,
        nombreTestigo2: nombreTestigo2,
        rutTestigo2: rutTestigo2Valido,
        telefonoTestigo2: telefonoTestigo2,
        descripcion: descripcion,
        estado: 'revision',
      })
        .then(() => {
          Alert.alert('Reporte subido');
        })
        .catch((error) => {
          console.log(error);
          Alert.alert('Error al subir el Reporte');
        });
    } else {
      Alert.alert('No se ha obtenido el UID del usuario');
    }
  };
  const obtenerUid = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid); // Guardar el UID en el estado
      }
    });
  };
  const cargarDatosPerfil = async () => {
    const auth = getAuth(); // Obtén la instancia de autenticación de Firebase
    const user = auth.currentUser; // Obtén el usuario actual
    if (user) {
      const userId = user.uid; // Obtén el UID del usuario actual
      const userProfileQuery = query(collection(FIRESTORE_DB, 'UserProfiles'), where('uid', '==', userId));
      const querySnapshot = await getDocs(userProfileQuery);
      querySnapshot.forEach((doc) => {
        setNombreAfectado(doc.data().nombreAfectado);
        setGenero(doc.data().genero);
        setRutAfectado(doc.data().rutAfectado);
        setFechaNacimiento(doc.data().fechaNacimiento);
        setEdad(doc.data().edad);
        setTelefonoAfectado(doc.data().telefonoAfectado);
        setCorreo(doc.data().correo);
        setDomicilio(doc.data().domicilio);
        setMutualiad(doc.data().mutualidad);
        setEstamentoAfectado(doc.data().estamentoAfectado);
        setTipoEstamento(doc.data().tipoEstamento);
      });
      toggleEditing();
    }
  };
  
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };
  /* const [hora, setHora] = useState('');
  const [minutos, setMinutos] = useState('');
  const dataHoras = [];
  for (let i = 0; i <= 24; i++) {
    const formattedHour = i.toString().padStart(2, '0');
    dataHoras.push(formattedHour);
  }
  const dataMinutos = [];
  for (let i = 0; i <= 59; i++) {
    const formattedMinute = i.toString().padStart(2, '0');
    dataMinutos.push(formattedMinute);
  }  */

  //I.	IDENTIFIQUE TIPO(S) DE AGRESIÓN(ES)
  const [tipoAgresion, setTipoAgresion] = useState('');
  //II.	ANTECEDENTES DE LA AGRESIÓN
  const [fecha, setFecha] = useState(new Date());
  const [mostrarSelectorFecha, setMostrarSelectorFecha] = useState(false);
  const [hora, setHora] = useState(new Date());
  const [mostrarSelectorHora, setMostrarSelectorHora] = useState(false);

  const [comunaId, setComunaId] = useState('');
  const [nombreComuna, setNombreComuna] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [nombreTipo, setNombreTipo] = useState('');
  const [establecimientoId, setEstablecimientoId] = useState('');
  const [establecimientos, setEstablecimientos] = useState([]);
  const [unidad, setUnidad] = useState('');
  const [descripcionUnidad, setDescripcionUnidad] = useState('');
  //III.	IDENTIFICACIÓN DEL AFECTADO
  const [uid, setUid] = useState(null);
  const [nombreAfectado, setNombreAfectado] = useState('');
  const [genero, setGenero] = useState('');
  const [estamentoAfectado, setEstamentoAfectado] = useState('');
  const [tipoEstamento, setTipoEstamento] = useState('');
  const [rutAfectado, setRutAfectado] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [edad, setEdad] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [telefonoAfectado, setTelefonoAfectado] = useState('');
  const [correo, setCorreo] = useState('');
  const [mutualidad, setMutualiad] = useState('');
  //IV.	DATOS DE EL/LA AGRESOR/A (de ser posible)
  const [tipoAgresor, setTipoAgresor] = useState('');
  const [primerNombreAgresor, setPrimerNombreAgresor] = useState('');
  const [segundoNombreAgresor, setSegundoNombreAgresor] = useState('');
  const [primerApellidoAgresor, setPrimerApellidoAgresor] = useState('');
  const [segundoApellidoAgresor, setSegundoApellidoAgresor] = useState('');
  const [rutAgresor, setRutAgresor] = useState('');
  const [rutAgresorValido, setRutAgresorValido] = useState('');
  const [sectorAgresor, setSectorAgresor] = useState('');
  const [domicilioAgresor, setDomicilioAgresor] = useState('');
  const [telefonoAgresor, setTelefonoAgresor] = useState('');
  //V.	TESTIGOS DEL CONFLICTO
  // TESTIGO 1
  const [primerNombreTestigo1, setPrimerNombreTestigo1] = useState('');
  const [segundoNombreTestigo1, setSegundoNombreTestigo1] = useState('');
  const [primerApellidoTestigo1, setPrimerApellidoTestigo1] = useState('');
  const [segundoApellidoTestigo1, setSegundoApellidoTestigo1] = useState('');
  const [rutTestigo1, setRutTestigo1] = useState('');
  const [rutTestigo1Valido, setRutTestigo1Valido] = useState('');
  const [telefonoTestigo1, setTelefonoTestigo1] = useState('');
  // TESTIGO 2
  const [primerNombreTestigo2, setPrimerNombreTestigo2] = useState('');
  const [segundoNombreTestigo2, setSegundoNombreTestigo2] = useState('');
  const [primerApellidoTestigo2, setPrimerApellidoTestigo2] = useState('');
  const [segundoApellidoTestigo2, setSegundoApellidoTestigo2] = useState('');
  const [rutTestigo2, setRutTestigo2] = useState('');
  const [rutTestigo2Valido, setRutTestigo2Valido] = useState('');
  const [telefonoTestigo2, setTelefonoTestigo2] = useState('');
  //VI.	DESCRIPCIÓN DEL INCIDENTE
  const [descripcion, setDescripcion] = useState('');

  //------------------------------------------------------------------------------------------
  const limpiarTexto = (textoIngresado, setTexto) => {
    const textoLimpio = textoIngresado.replace(/[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]/g, '');
    setTexto(textoLimpio);
  };
  //--------------------------------------------------RUT-----------------------------------------
  const verificarRut = (rutValido, setRutValido) => {
    // Remover guiones y puntos del Rut
    const rutLimpio = rutValido.replace(/[^0-9Kk]/g, '');
    // Obtener el número base y dígito verificador
    const rutRegExp = /^(\d+)([kK\d])$/;
    const rutSinDigito = rutLimpio.slice(0, -1);
    const match = rutLimpio.match(rutRegExp);
    if (!match) {
      // El Rut no cumple con el formato válido
      console.log('Error', 'El Rut ingresado no es válido');
      return;
    }

    const num = parseInt(match[1]);
    const dv = match[2].toUpperCase();

    // Calcular dígito verificador esperado
    let M = 0;
    let S = 1;
    let numRut = num; // Crear una nueva variable para almacenar el valor numérico del Rut
    for (; numRut; numRut = Math.floor(numRut / 10)) {
      S = (S + numRut % 10 * (9 - M++ % 6)) % 11;
    }

    const dvEsperado = S ? S - 1 + '' : 'K';

    // Comparar dígito verificador ingresado con el esperado
    if (dv === dvEsperado) {
      console.log('Éxito', 'El Rut ingresado es válido');
      setRutValido(rutSinDigito);
    } else {
      console.log('Error', 'El Rut ingresado es incorrecto');
      setRutValido(false);
    }
  };
  //--------------------------------------------------FECHA-----------------------------------------
  const formatearFecha = (evento, fechaSeleccionada) => {
    const fechaActual = fechaSeleccionada || fecha;
    setMostrarSelectorFecha(false);
    setFecha(fechaActual);
  };

  const mostrarSelectorFechaModal = () => {
    setMostrarSelectorFecha(true);
  };
  

  //--------------------------------------------------HORA-----------------------------------------
  const formatearHora = (evento, horaSeleccionada) => {
    if (horaSeleccionada !== undefined) {
      setHora(horaSeleccionada);
    }
    setMostrarSelectorHora(false);
  };

  const mostrarSelectorHoraModal = () => {
    setMostrarSelectorHora(true);
  };


  /* const formatDate = (text) => {
    // Elimina todo lo que no sea dígito
    const cleaned = text.replace(/[^0-9]/g, '');
    // Divide en grupos de 2, 2 y 4 caracteres
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);
    if (match) {
      // Formatea la fecha con los separadores deseados
      const formatted = match[1] + '-' + match[2] + '-' + match[3];
      setFecha(formatted);
    } else {
      setFecha(cleaned);
    }
  }; */

  //--------------------------------------------------NUMERO-----------------------------------------
  const clearNum = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setTelefonoAgresor(cleaned)
  }
  //-----------------------------------------HORA--------------------------------------------------
/*   const tiempo = `${hora}:${minutos}`; */
  //-----------------------------------------Comuna Tipo Establecimiento----------------------------------------------------
  const getEstablecimientosPorComunaYTipo = (comunaId, tipoId) => {
    const establecimientosFiltrados = dataEstablecimientos.filter(
      establecimiento => establecimiento.idComuna === comunaId && establecimiento.idTipo === tipoId
    );
    const nombresEstablecimientos = establecimientosFiltrados.map(
      establecimiento => establecimiento.nombre
    );
    setEstablecimientoId('');
    return nombresEstablecimientos;
  };
  const handleComunaChange = comunaId => {
    setComunaId(comunaId);
    const comuna = dataComunaEstablecimiento.find(c => c.id === comunaId);
    setNombreComuna(comuna ? comuna.name : '');
    const nuevosEstablecimientos = getEstablecimientosPorComunaYTipo(comunaId, tipoId);
    setEstablecimientos(nuevosEstablecimientos);
  };
  const handleTipoChange = tipoId => {
    setTipoId(tipoId);
    const tipo = dataTipoEstablecimiento.find(t => t.id === tipoId);
    setNombreTipo(tipo ? tipo.nombre : '');
    const nuevosEstablecimientos = getEstablecimientosPorComunaYTipo(comunaId, tipoId);
    setEstablecimientos(nuevosEstablecimientos);
  };
  const handleEstablecimientoChange = establecimientoId => {
    setEstablecimientoId(establecimientoId);
  }

  const handleChangeDescripcion = (text) => {
    setDescripcion(text);
  };
  //------------------------------------------------------------------------------------------
  return (
    <View style={styles.containerGeneral}>
      <StatusBar backgroundColor="black" />
      <View style={styles.containerBarra}>
        <Image
          source={require('../assets/logo_SS.png')}
          style={styles.logoBarra}
        />
        <Text style={styles.tituloBarra}>INGRESAR FORMULARIO</Text>
      </View>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '45%', height: 3, backgroundColor: '#0f69b4' }} />
          <View style={{ width: '55%', height: 3, backgroundColor: '#e22c2c' }} />
        </View>
      </View>
      
      <View style={styles.container}>
        <ScrollView>
          <>
            <Text style={styles.categoria}>I.	IDENTIFIQUE TIPO(S) DE AGRESIÓN(ES)</Text>
            <Text style={styles.subTitulo}>Tipo de Agresión</Text>
            <View style={styles.multiSelect}>
              <Picker
                selectedValue={tipoAgresion}
                onValueChange={(itemValue) => setTipoAgresion(itemValue)}>
                <Picker.Item label="Seleccione" value="" />
                <Picker.Item label="A.F: Con arma de fuego" value="A.F: Con arma de fuego" />
                <Picker.Item label="A.F: Con arma blanca" value="A.F: Con arma blanca" />
                <Picker.Item label="A.F: Con objeto contundente" value="A.F: Con objeto contundente" />
                <Picker.Item label="A.F: Golpes, patadas, empujones" value="A.F: Golpes, patadas, empujones" />
                <Picker.Item label="A.F.S: Tocaciones, agarrones, etc" value="A.F.S: Tocaciones, agarrones, etc" />
                <Picker.Item label="A.V.S: Lenguaje con connotacion sexual u obseno" value="A.V.S: Lenguaje con connotacion sexual u obseno" />
                <Picker.Item label="A.V: Amenazas u hostigamientos" value="A.V: Amenazas u hostigamientos" />
                <Picker.Item label="A.V: Insultos o garabatos" value="A.V: Insultos o garabatos" />
                <Picker.Item label="A.V: Burlas o descalificaciones" value="A.V: Burlas o descalificaciones" />
                <Picker.Item label="A.V: Denotación por redes sociales" value="A.V: Denotación por redes sociales" />
                <Picker.Item label="Ataque contra la infraestructura" value="Ataque contra la infraestructura" />
                <Picker.Item label="Otro tipo de agresión" value="Otro tipo de agresión" />
              </Picker>
            </View>
            {tipoAgresion ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}
            <Text style={styles.categoria}>II.	ANTECEDENTES DE LA AGRESIÓN</Text>
            <View>
              <Text style={styles.subTitulo}>Fecha</Text>
              <TouchableOpacity onPress={mostrarSelectorFechaModal} style={styles.textInput}>
                <Text>{format(fecha, 'PPP', { locale: es })}</Text>
              </TouchableOpacity>
              {mostrarSelectorFecha && (
                <DateTimePicker
                  value={fecha}
                  mode="date"
                  display="default"
                  onChange={formatearFecha}
                />
              )}
            </View>
            {/* {fecha ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )} */}
             <View>
            <Text style={styles.subTitulo}>Hora</Text>
            <TouchableOpacity onPress={mostrarSelectorHoraModal} style={styles.textInput}>
            <Text>{hora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            {mostrarSelectorHora && (
              <DateTimePicker
                value={hora}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={formatearHora}
              />
            )}
          </View>
            {/* {hora && minutos ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}
 */}
            <Text style={styles.subTitulo}>Comuna</Text>
            <View style={styles.multiSelect}>
              <Picker
                selectedValue={comunaId}
                onValueChange={handleComunaChange}
              >
                <Picker.Item label="Seleccione una comuna" value="" />
                {dataComunaEstablecimiento.map(comuna => (
                  <Picker.Item key={comuna.id} label={comuna.name} value={comuna.id} />
                ))}
              </Picker>
            </View>
            {comunaId ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}
            <Text style={styles.subTitulo}>Tipo de Establecimiento</Text>
            <View style={styles.multiSelect}>
              <Picker
                selectedValue={tipoId}
                onValueChange={handleTipoChange}
              >
                <Picker.Item label="Seleccione un tipo de establecimiento" value="" />
                {dataTipoEstablecimiento.map(tipo => (
                  <Picker.Item key={tipo.id} label={tipo.nombre} value={tipo.id} />
                ))}
              </Picker>
            </View>
            {tipoId ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}

            <Text style={styles.subTitulo}>Establecimiento</Text>
            <View style={styles.multiSelect}>
              <Picker
                selectedValue={establecimientoId}
                onValueChange={handleEstablecimientoChange}
              >
                <Picker.Item label="Seleccione un Establecimiento" value="" />
                {establecimientos.map((nombre, index) => (
                  <Picker.Item key={index} label={nombre} value={nombre} />
                ))}
              </Picker>
            </View>
            {establecimientoId ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}

            <Text style={styles.subTitulo}>Unidad</Text>
            <View style={styles.multiSelect}>
              <Picker
                selectedValue={unidad}
                onValueChange={(itemValue) => setUnidad(itemValue)}
              >
                <Picker.Item label="Seleccione" value="" />
                <Picker.Item label="Area atención abierta" value="Area atención abierta" />
                <Picker.Item label="Area atención cerrada" value="Area atención cerrada" />
                <Picker.Item label="Servicios de apoyo" value="Servicios de apoyo" />
                <Picker.Item label="Servicios generales" value="Servicios generales" />
                <Picker.Item label="OIRS" value="OIRS" />
                <Picker.Item label="SOME" value="SOME" />
                <Picker.Item label="Urgencia" value="Urgencia" />
                <Picker.Item label="Sala de espera" value="Sala de espera" />
                <Picker.Item label="Visita Domiciliaria" value="Visita Domiciliaria" />
                <Picker.Item label="Sector/Box" value="Sector/Box" />
                <Picker.Item label="Exterior del Centro" value="Exterior del Centro" />
                <Picker.Item label="Vía pública" value="Vía pública" />
                <Picker.Item label="Otro" value="Otro" />
              </Picker>
            </View>
            {unidad ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}
            <Text style={styles.subTitulo}>Descripcion de la Unidad</Text>
            <TextInput
              value={descripcionUnidad}
              onChangeText={(text) => limpiarTexto(text, setDescripcionUnidad)}
              placeholder="Descripcion"
              maxLength={60}
              keyboardType="ascii-capable"
              style={styles.textInput}
            />

            <Text style={styles.categoria}>III.	DATOS DE EL/LA AGRESOR/A </Text>
            <Text style={styles.subTitulo}>Tipo de Agresor</Text>
            <View style={styles.multiSelect}>
              <Picker
                selectedValue={tipoAgresor}
                onValueChange={(itemValue) => setTipoAgresor(itemValue)}
              >
                <Picker.Item label="Seleccione" value="" />
                <Picker.Item label="Paciente" value="Paciente" />
                <Picker.Item label="Familiar/Acompañante del paciente" value="Familiar/Acompañante del paciente" />
                <Picker.Item label="Paciente de Salud Mental" value="Paciente de Salud Mental" />
                <Picker.Item label="Otro" value="Otro" />
              </Picker>
            </View>
            {tipoAgresor ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}
            <Text style={styles.subTitulo}>Primer Nombre (*)</Text>
            <TextInput
              value={primerNombreAgresor}
              onChangeText={setPrimerNombreAgresor}
              placeholder="Primer Nombre"
              maxLength={20}
              style={styles.textInput}
            />
            <Text style={styles.subTitulo}>Segundo Nombre (*)</Text>
            <TextInput
              value={segundoNombreAgresor}
              onChangeText={setSegundoNombreAgresor}
              placeholder="Segundo Nombre"
              maxLength={20}
              style={styles.textInput}
            />
            <Text style={styles.subTitulo}>Apellido Paterno (*)</Text>
            <TextInput
              value={primerApellidoAgresor}
              onChangeText={setPrimerApellidoAgresor}
              placeholder="Apellido Paterno"
              maxLength={20}
              style={styles.textInput}
            />
            <Text style={styles.subTitulo}>Apellido Materno (*)</Text>
            <TextInput
              value={segundoApellidoAgresor}
              onChangeText={setSegundoApellidoAgresor}
              placeholder="Apellido Materno"
              maxLength={20}
              style={styles.textInput}
            />
            <Text style={styles.subTitulo}>Rut (*)</Text>
            <TextInput
              value={rutAgresor}
              onChangeText={setRutAgresor}
              onBlur={() => verificarRut(rutAgresor, setRutAgresorValido)}
              maxLength={9}
              keyboardType='numeric'
              placeholder="Rut sin puntos ni guion"
              style={styles.textInput}
            />
            {rutAgresorValido ? (
              <Text style={{ color: 'green', alignSelf: 'center' }}>Rut Válido</Text>
            ) : (
              <Text style={{ color: 'red', alignSelf: 'center' }}>Rut Incorrecto</Text>
            )}

            <Text style={styles.subTitulo}>Sector del Agresor</Text>
            <TextInput
              value={sectorAgresor}
              onChangeText={setSectorAgresor}
              placeholder="Sector agresor"
              maxLength={20}
              style={styles.textInput}
            />
            <Text style={styles.subTitulo}>Dirección</Text>
            <TextInput
              value={domicilioAgresor}
              onChangeText={setDomicilioAgresor}
              placeholder="domicilio"
              maxLength={30}
              style={styles.textInput}
            />

            <Text style={styles.subTitulo}>Teléfono</Text>
            <TextInput
              value={telefonoAgresor}
              onChangeText={clearNum}
              keyboardType='numeric'
              placeholder="111111111"
              maxLength={9}
              style={styles.textInput}
            />
            <Text style={styles.categoria}>IV.	TESTIGOS DEL CONFLICTO</Text>
            <Text style={styles.opcional}>TESTIGO I</Text>

            <Text style={styles.subTitulo}>Primer Nombre (*)</Text>
            <TextInput
              value={primerNombreTestigo1}
              onChangeText={setPrimerNombreTestigo1}
              placeholder="Primer Nombre"
              maxLength={20}
              style={styles.textInput}
            />
            {primerNombreTestigo1 ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}

            <Text style={styles.subTitulo}>Segundo Nombre (*)</Text>
            <TextInput
              value={segundoNombreTestigo1}
              onChangeText={setSegundoNombreTestigo1}
              placeholder="Segundo Nombre"
              maxLength={20}
              style={styles.textInput}
            />
            {segundoNombreTestigo1 ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}

            <Text style={styles.subTitulo}>Apellido Paterno (*)</Text>
            <TextInput
              value={primerApellidoTestigo1}
              onChangeText={setPrimerApellidoTestigo1}
              placeholder="Apellido Paterno"
              maxLength={20}
              style={styles.textInput}
            />
            {primerApellidoTestigo1 ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}

            <Text style={styles.subTitulo}>Apellido Materno (*)</Text>
            <TextInput
              value={segundoApellidoTestigo1}
              onChangeText={setSegundoApellidoTestigo1}
              placeholder="Apellido Materno"
              maxLength={20}
              style={styles.textInput}
            />{segundoApellidoTestigo1 ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}

            <Text style={styles.subTitulo}>Rut (*)</Text>
            <TextInput
              value={rutTestigo1}
              onChangeText={setRutTestigo1}
              onBlur={() => verificarRut(rutTestigo1, setRutTestigo1Valido)}
              placeholder="Rut sin puntos ni guion"
              maxLength={12}
              keyboardType='numeric'
              style={styles.textInput}
            />
            {rutTestigo1Valido ? (
              <Text style={{ color: 'green', alignSelf: 'center' }}>Rut Válido</Text>
            ) : (
              <Text style={{ color: 'red', alignSelf: 'center' }}>Rut Incorrecto</Text>
            )}
            <Text style={styles.subTitulo}>Teléfono (*)</Text>
            <TextInput
              value={telefonoTestigo1}
              onChangeText={setTelefonoTestigo1}
              placeholder="Telefono"
              maxLength={9}
              keyboardType='numeric'
              style={styles.textInput}
            />
            {telefonoTestigo1 ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}
            <Text style={styles.opcional}>OPCIONAL TESTIGO II</Text>
            <Text style={styles.subTitulo}>Primer Nombre (*)</Text>
            <TextInput
              value={primerNombreTestigo2}
              onChangeText={setPrimerNombreTestigo2}
              placeholder="Primer Nombre"
              maxLength={20}
              style={styles.textInput}
            />
            <Text style={styles.subTitulo}>Segundo Nombre (*)</Text>
            <TextInput
              value={segundoNombreTestigo2}
              onChangeText={setSegundoNombreTestigo2}
              placeholder="Segundo Nombre"
              maxLength={20}
              style={styles.textInput}
            />
            <Text style={styles.subTitulo}>Apellido Paterno (*)</Text>
            <TextInput
              value={primerApellidoTestigo2}
              onChangeText={setPrimerApellidoTestigo2}
              placeholder="Apellido Paterno"
              maxLength={20}
              style={styles.textInput}
            />
            <Text style={styles.subTitulo}>Apellido Materno (*)</Text>
            <TextInput
              value={segundoApellidoTestigo2}
              onChangeText={setSegundoApellidoTestigo2}
              placeholder="Apellido Materno"
              maxLength={20}
              style={styles.textInput}
            />
            <Text style={styles.subTitulo}>Rut (*)</Text>
            <TextInput
              value={rutTestigo2}
              onChangeText={setRutTestigo2}
              onBlur={() => verificarRut(rutTestigo2, setRutTestigo2Valido)}
              placeholder="Rut sin puntos ni guion"
              maxLength={9}
              keyboardType='numeric'
              style={styles.textInput}
            />
            {rutTestigo2Valido ? (
              <Text style={{ color: 'green', alignSelf: 'center' }}>Rut Válido</Text>
            ) : (
              <Text style={{ color: 'red', alignSelf: 'center' }}>Rut Incorrecto</Text>
            )}
            <Text style={styles.subTitulo}>Teléfono (*)</Text>
            <TextInput
              value={telefonoTestigo2}
              onChangeText={setTelefonoTestigo2}
              placeholder="Telefono"
              maxLength={9}
              keyboardType='numeric'
              style={styles.textInput}
            />
            <Text style={styles.categoria}>VI. DESCRIPCIÓN DEL INCIDENTE</Text>
            {/* <Text style={styles.Titulo}>Descripción de la agresión</Text> */}
            
            <View>
            <Text style={styles.subTitulo}>Descripción de la agresión (*)</Text>
            <TextInput
              value={descripcion}
              onChangeText={handleChangeDescripcion}
              placeholder="Ingrese una descripción"
              style={styles.textInput}
              multiline={true}
              numberOfLines={4}
            />
          </View>
            {descripcion ? (
              <Text style={styles.campoIngresado}>Campo Ingresado</Text>
            ) : (
              <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
            )}
            <View style={styles.buttons}>
              <PrimaryButton
                title="Guardar"
                color="#0f69b4"
                //onPress={() => guardarPerfil()}/>
                onPress={() => datosObligatorios()} />
            </View>
          </>
        {/* ) : (
          <>
            <Text style={styles.loading}>No presenta un perfil, actualizar datos</Text>
          </>
        )}
 */}
      </ScrollView>
      </View>
    </View>
  )
}
//------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
  logoBarra: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  tituloBarra: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  containerBarra: {
    width: 500,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#rgb(39, 40, 91)',
    padding: 20,
  },
  containerGeneral: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  container: {
    paddingHorizontal: 25,
  },

  Titulo: {
    marginTop: 5,
    color: '#1e6496',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 17,
  },
  categoria: {
    marginTop: 5,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textInputF: {
    marginTop: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  textInputH: {
    marginTop: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  subTitulo: {
    marginTop: 3,
    height: 30,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
    fontSize: 15,
    color: '#0f69b4',
  },
  opcional: {
    marginTop: 3,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  campoObligatorio: {
    color: 'red',
    marginTop: 2,
    textAlign: 'center',
  },
  campoIngresado: {
    color: 'green',
    marginTop: 2,
    textAlign: 'center',
  },
  textInput: {
    flex: 1,
    height: 45,
    width: 300,
    alignSelf: 'center',
    fontSize: 13,
    borderRadius: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttons: {
    fontSize: 12,
    height: 50,
    marginBottom: '35%',
    marginTop: 5,
  },
  time: {
    fontSize: 20,
    marginTop: 16,
  },
  multiSelect: {
    height: 45,
    width: 300,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  descrip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'black',
    width: '100%',
    borderRadius: 10,
  },
  header: {
    marginBottom: '1%',
  },
  containerPick: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  picker: {
    width: '44%',
    height: 50,
    marginTop: 1,
    marginHorizontal: 10,
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },

});

export default Formulario