import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, StatusBar, Button, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { FIRESTORE_DB } from '../consts/firebase';
import { getFirestore, addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


import COLORS from '../consts/colors';
import { PrimaryButton } from './components/Button';

const EditarPerfil = () => {
  const [uid, setUid] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    obtenerUid();
  }, []);

  const subirPerfil = async () => {
    const nombre = primerNombre + ' ' + segundoNombre + ' ' + primerApellido + ' ' + segundoApellido;
    // Verificar si se ha obtenido el UID del usuario
    if (!uid) {
      Alert.alert('No se ha obtenido el UID del usuario');
      return;
    }

    // Verificar si el usuario ya tiene un perfil
    const db = getFirestore();
    const profileRef = doc(db, 'UserProfiles', uid);



    try {
      const profileDoc = await getDoc(profileRef);
      if (profileDoc.exists()) {
        // El usuario ya tiene un perfil, actualizar los datos existentes
        await updateDoc(profileRef, {
          nombreAfectado: nombre,
          genero: genero,
          rutAfectado: rutValido,
          fechaNacimiento: fecha,
          telefonoAfectado: telefono,
          correo: correo,
          domicilio: domicilio,
          mutualidad: mutual,
          tipoEstamento: tipoEstamento,
        });

        Alert.alert('Perfil actualizado');
      } else {
        // El usuario no tiene un perfil, crear uno nuevo
        await setDoc(profileRef, {
          uid: uid,
          nombreAfectado: nombre,
          genero: genero,
          rutAfectado: rutValido,
          fechaNacimiento: fecha,
          telefonoAfectado: telefono,
          correo: correo,
          domicilio: domicilio,
          mutualidad: mutual,
          tipoEstamento: tipoEstamento,
        });

        Alert.alert('Perfil creado');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error al subir el perfil');
    }
  };

  // Obtener el UID del usuario actual
  const obtenerUid = () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUid(uid); // Guardar el UID en el estado
      }
    });
  };

  const formatearFecha = (evento, fechaSeleccionada) => {
    const fechaActual = fechaSeleccionada || fecha;
    setMostrarSelectorFecha(false);
    setFecha(fechaActual);
  };

  const mostrarSelectorFechaModal = () => {
    setMostrarSelectorFecha(true);
  };


  //-----------------------------------------------------
  const navigation = useNavigation();
  const [primerNombre, setPrimerNombre] = useState('');
  const [segundoNombre, setSegundoNombre] = useState('');
  const [primerApellido, setPrimerApellido] = useState('');
  const [segundoApellido, setSegundoApellido] = useState('');
  const [genero, setGenero] = useState('');
  const [rut, setRut] = useState('');
  const [rutValido, setRutValido] = useState(''); //rut valido es el que se envia, no tiene dv
  const [fecha, setFecha] = useState('');
  const [mostrarSelectorFecha, setMostrarSelectorFecha] = useState(false);
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [mutual, setMutual] = useState('');
  const [tipoEstamento, setTipoEstamento] = useState('');

  //-------------------------------------------Limpiar texto-----------------------------------------------  
  const limpiarTexto = (textoIngresado, setTexto) => {
    const textoLimpio = textoIngresado.replace(/[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]/g, '');
    setTexto(textoLimpio);
  };

  
  //--------------------------------------------------NUMERO-----------------------------------------
  const clearNum = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    setTelefono(cleaned)
  }
  //--------------------------------------------------RUT-----------------------------------------
  const verificarRut = (rut) => {
    // Remover guiones y puntos del Rut
    const rutLimpio = rut.replace(/[^0-9Kk]/g, '');

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
      setRutValido(rutLimpio);
      console.log('rut', rutLimpio);
    } else {
      console.log('Error', 'El Rut ingresado es incorrecto');
      console.log('rut', rutValido);
      setRutValido(false);
    }
  };
  //--------------------------------------------------Datos obligatorios-----------------------------------------
  const savePerfil = async () => {
    if (!primerNombre || !segundoNombre || !primerApellido || !segundoApellido || !rutValido || !fecha || !telefono || !correo || !domicilio || !mutual || !estamento || !tipoEstamento) {
      Alert.alert('Error', 'Por favor complete, todos los campos son obligatorios');
    } else {
      subirPerfil()
    }
  }

  const handleVolver = () => {
    navigation.goBack();
  };
  
  //------------------------------------------------------------------------------------------
  return (
    <View>
      <StatusBar backgroundColor="black" />
      <View style={styles.containerBarra}>
        <Image
          source={require('../assets/logo_SS.png')}
          style={styles.logoBarra}
        />
        <Text style={styles.tituloBarra}>Datos Personales</Text>
        <TouchableOpacity 
          style={styles.volver}
          onPress={handleVolver}>
          <Icon name="arrow-back" size={27} color={'#fff'} />
        </TouchableOpacity>
      </View>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '45%', height: 3, backgroundColor: '#0f69b4' }} />
          <View style={{ width: '55%', height: 3, backgroundColor: '#e22c2c' }} />
        </View>
      </View>
      <ScrollView >

        <View style={styles.container}>
          <Text style={styles.subTitulo}>Primer Nombre (*)</Text>
          <TextInput
            value={primerNombre}
            onChangeText={(text) => limpiarTexto(text, setPrimerNombre)}
            placeholder="Primer Nombre"
            maxLength={15}
            keyboardType="ascii-capable"
            style={styles.textInput}
          />

          <Text style={styles.subTitulo}>Segundo Nombre (*)</Text>
          <TextInput
            value={segundoNombre}
            onChangeText={(text) => limpiarTexto(text, setSegundoNombre)}
            placeholder="Segundo Nombre"
            maxLength={15}
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Apellido Paterno (*)</Text>
          <TextInput
            value={primerApellido}
            onChangeText={(text) => limpiarTexto(text, setPrimerApellido)}
            placeholder="Apellido Paterno"
            maxLength={15}
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Apellido Materno (*)</Text>
          <TextInput
            value={segundoApellido}
            onChangeText={(text) => limpiarTexto(text, setSegundoApellido)}
            placeholder="Apellido Materno"
            maxLength={15}
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Género (*)</Text>
          <View style={styles.multiSelect}>
            <Picker
              selectedValue={genero}
              onValueChange={(itemValue) => setGenero(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione" value="" />
              <Picker.Item label="Masculino" value="Masculino" />
              <Picker.Item label="Femenino" value="Femenino" />
              <Picker.Item label="Sin informacion" value="Sin informacion" />
            </Picker>
          </View>

          <Text style={styles.subTitulo}>Rut (*)</Text>
          <TextInput
            value={rut}
            onChangeText={setRut}
            onBlur={() => verificarRut(rut)}
            maxLength={12}
            placeholder="11.111.111-1"
            style={styles.textInput}
          />
          {rutValido ? (
            <Text style={{ color: 'green', alignSelf: 'center', marginTop: 8 }}>Rut Válido</Text>
          ) : (
            <Text style={{ color: 'red', alignSelf: 'center', marginTop: 8 }}>Rut Icorrecto</Text>
          )}
          <View>
          <Text style={styles.subTitulo}>Fecha de Nacimiento (*)</Text>
          <TouchableOpacity onPress={mostrarSelectorFechaModal} style={styles.textInput}>
            
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
          
          

          <Text style={styles.subTitulo}>Teléfono (*) </Text>
          <TextInput
            value={telefono}
            onChangeText={clearNum}
            keyboardType='numeric'
            placeholder="111111111"
            maxLength={9}
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Correo Electrónico (*)</Text>
          <TextInput
            value={correo}
            onChangeText={setCorreo}
            placeholder="...@gmail.com"
            maxLength={40}
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Dirección (*)</Text>
          <TextInput
            value={domicilio}
            onChangeText={setDomicilio}
            placeholder="Domicilio"
            style={styles.textInput}
          />
          <Text style={styles.subTitulo}>Mutual</Text>
          <View style={styles.multiSelect}>
            <Picker
              selectedValue={mutual}
              onValueChange={(itemValue) => setMutual(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione" value="" />
              <Picker.Item label="ISL" value="ISL" />
              <Picker.Item label="Mutual de seguridad" value="Mutual de seguridad" />
              <Picker.Item label="ACHS" value="ACHS" />
              <Picker.Item label="IST" value="IST" />
              <Picker.Item label="Sin mutualidad" value="Sin mutualidad" />
            </Picker>
          </View>


          <Text style={styles.subTitulo}>Estamento Funcionario</Text>
          <View style={styles.multiSelect}>
            <Picker
              selectedValue={tipoEstamento}
              onValueChange={(itemValue) => setTipoEstamento(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione" value="" />
              <Picker.Item label="(a) Médicos Cirujanos, Farmacéuticos, Químico-Farmacéuticos, Bioquímicos y Cirujano-Dentista" value="Medicos" />
              <Picker.Item label="(b) Otros Profesionales" value="Profesionales" />
              <Picker.Item label="(c) Técnicos de Nivel Superior" value="Tecnico Superios" />
              <Picker.Item label="(d) Técnicos de Salud" value="Tecnico Salud" />
              <Picker.Item label="(e) Administrativos de Salud" value="Administrativos" />
              <Picker.Item label="(f) Auxiliares de Servicios de Salud" value="Auxiliares" />
              <Picker.Item label="Otro" value="Otro" />
            </Picker>
          </View>


          <View style={styles.Buttons2}>
            <PrimaryButton
              title="Guardar"
              color="blue"
              //onPress={() => subirPerfil()} />
              onPress={() => savePerfil()} />
          </View>
        </View>
      </ScrollView>

    </View>

  )
}

//------------------------------------------------------------------------------------------
const styles = StyleSheet.create({
  containerBarra: {
    width: 500,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#rgb(39, 40, 91)',
    padding: 20,
  },
  picker: {
    fontSize: 10,
  },
  logoBarra: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  tituloBarra: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'right',
  },
  container: {
    /* paddingVertical: 20, */
    paddingHorizontal: 30,
    /* alignItems: 'center', */
  },
  volver:{
    marginLeft:'15%'

  },
  Titulo: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  subTitulo: {
    flex: 1,
    marginTop: 15,
    height: 35,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#0f69b4',
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 13,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderWidth: 1, // Ancho del borde
    borderColor: 'black', // Color del borde
    /* alignItems: 'center', */
    paddingHorizontal: 20,
  },
  buttonLayout: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  Buttons: {
    fontSize: 12,
    height: 50,
    marginBottom: '15%',
  },
  Buttons2: {
    fontSize: 12,
    height: 50,
    marginBottom: '35%',
    marginTop: 10,
  },
  multiSelect: {
    fontSize: 12,
    textAlign: 'center',
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1, // Ancho del borde
    borderColor: 'black', // Color del borde
    /* justifyContent: 'center',
    alignItems: 'center', */
  },
  image: {
    width: 90,
    height: 90,
    alignSelf: 'center',
  }
})

export default EditarPerfil