import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { FIRESTORE_DB } from '../consts/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import COLORS from '../consts/colors';
import { PrimaryButton } from './components/Button';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


const AccessForm = (props) => {

    const agregarUsuarioNoAutorizado = async () => {
        const auth = getAuth();
        const user = auth.currentUser;
        
        // Verifica si el usuario está autenticado
        if (user) {
          // Obtiene el uid del usuario
          const uid = user.uid;
          
          // Agrega el uid al documento en Firebase
          addDoc(collection(FIRESTORE_DB, 'UsersNotAuthorizedAccess'), {
            uid: uid,
            correo: correo,
            primerNombre: primerNombre,
            segundoNombre: segundoNombre,
            primerApellido: primerApellido,
            segundoApellido: segundoApellido,
            rut: rutValido,
          })
          Alert.alert('Registro enviado');
        } else {
          // El usuario no está autenticado, maneja el caso según tus necesidades
          Alert.alert('Usuario no autenticado');
        }
      };

    const datosObligatorios = async () => {
        if (!correo || !primerNombre || !segundoNombre || !primerApellido || !segundoApellido || !rut) {
            Alert.alert('Faltan datos', 'Por favor complete los campos obligatorios');
        } else {
            agregarUsuarioNoAutorizado()
            handleVolver();
        }
    }

    const [correo, setCorreo] = useState('');
    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [rut, setRut] = useState('');
    const [rutValido, setRutValido] = useState('');
    const navigation = useNavigation();

    const limpiarTexto = (textoIngresado, setTexto) => {
        const textoLimpio = textoIngresado.replace(/[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]/g, '');
        setTexto(textoLimpio);
    };

    const handleVolver = () => {
        navigation.goBack();
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

    return (
        <View style={styles.containerGeneral}>
            <ScrollView>
            <StatusBar backgroundColor="black" />
            <View style={styles.containerBarra}>
                <Image
                    source={require('../assets/logo_SS.png')}
                    style={styles.logoBarra}
                />
                <Text style={styles.tituloBarra}>Servicio de Salud - Biobio</Text>
            </View>
            <Text style={{ fontSize: 20, color: "black", fontWeight: 'bold', alignSelf: 'center', marginTop: 15,}}>Registrar Nuevo Usuario</Text>
            <View style={styles.container}>

                <TouchableOpacity style={{marginTop:10,}} onPress={handleVolver}>
                    <Icon name="arrow-back" size={24} color={COLORS.dark} />
                </TouchableOpacity>
            
                <Text style={styles.subTitulo}>Primer Nombre (*)</Text>
                <TextInput
                    value={primerNombre}
                    onChangeText={(text) => limpiarTexto(text, setPrimerNombre)}
                    placeholder="Primer Nombre"
                    maxLength={15}
                    keyboardType="ascii-capable"
                    style={styles.textInput}
                />{primerNombre ? (
                    <Text style={styles.campoIngresado}>Campo Ingresado</Text>
                ) : (
                    <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
                )}

                <Text style={styles.subTitulo}>Segundo Nombre (*)</Text>
                <TextInput
                    value={segundoNombre}
                    onChangeText={(text) => limpiarTexto(text, setSegundoNombre)}
                    placeholder="Segundo Nombre"
                    maxLength={15}
                    style={styles.textInput}
                />{segundoNombre ? (
                    <Text style={styles.campoIngresado}>Campo Ingresado</Text>
                ) : (
                    <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
                )}

                <Text style={styles.subTitulo}>Apellido Paterno (*)</Text>
                <TextInput
                    value={primerApellido}
                    onChangeText={(text) => limpiarTexto(text, setPrimerApellido)}
                    placeholder="Apellido Paterno"
                    maxLength={15}
                    style={styles.textInput}
                />{primerApellido ? (
                    <Text style={styles.campoIngresado}>Campo Ingresado</Text>
                ) : (
                    <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
                )}

                <Text style={styles.subTitulo}>Apellido Materno (*)</Text>
                <TextInput
                    value={segundoApellido}
                    onChangeText={(text) => limpiarTexto(text, setSegundoApellido)}
                    placeholder="Apellido Materno"
                    maxLength={15}
                    style={styles.textInput}
                />{segundoApellido ? (
                    <Text style={styles.campoIngresado}>Campo Ingresado</Text>
                ) : (
                    <Text style={styles.campoObligatorio}>Campo Obligatorio</Text>
                )}

                <Text style={styles.subTitulo}>Rut (*)</Text>
                <TextInput
                    value={rut}
                    onChangeText={setRut}
                    onBlur={() => verificarRut(rut, setRutValido)}
                    maxLength={9}
                    keyboardType='numeric'
                    placeholder="Rut sin puntos ni guion"
                    style={styles.textInput}
                />
                {rutValido ? (
                    <Text style={{ color: 'green', alignSelf: 'center' }}>Rut válido</Text>
                ) : (
                    <Text style={{ color: 'red', alignSelf: 'center' }}>Rut incorrecto</Text>
                )}

                <Text style={styles.subTitulo}>Correo Electrónico (*)</Text>
                <TextInput
                    value={correo}
                    onChangeText={setCorreo}
                    placeholder="Correo Electrónico"
                    maxLength={20}
                    style={styles.textInput}
                />{correo ? (
                    <Text style={styles.campoIngresado}>Campo ingresado</Text>
                ) : (
                    <Text style={styles.campoObligatorio}>Campo obligatorio</Text>
                )}

                <View style={styles.Buttons2}>
                    <PrimaryButton
                        title="Guardar"
                        color="blue"
                        //onPress={() => subirPerfil()} />
                        onPress={() => datosObligatorios()}/> 
                </View>
            </View>
            </ScrollView>
        </View>
    )
}
//------------------------------------------------------------------------------------------
const styles = StyleSheet.create({

    containerBarra: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    container: {
        paddingHorizontal: 30,
        /* alignItems: 'center', */
    },
    containerBarra: {
        width: 500,
        height: 150,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#rgb(39, 40, 91)',
        padding: 20,
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
    Titulo: {
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        textDecorationLine: 'underline',
    },
    categoria: {
        marginTop: 15,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
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
    opcional: {
        marginTop: 10,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    campoObligatorio: {
        color: 'red',
    },
    campoIngresado: {
        color: 'green',
    },
    textInput: {
        flex: 1,
        height: 50,
        fontSize: 13,
        borderRadius: 10,
        flexDirection: 'row',
        borderWidth: 1, // Ancho del borde
        borderColor: 'black', // Color del borde
        backgroundColor: COLORS.white,
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    Buttons2: {
        fontSize: 12,
        height: 50,
        marginBottom: '25%',
        marginTop: 10,
    },
    time: {
        fontSize: 20,
        marginTop: 16,
    },

    multiSelect: {
        height: 50,
        borderWidth: 1, // Ancho del borde
        borderColor: 'black', // Color del borde
        borderRadius: 10,
        backgroundColor: COLORS.white,
        /* justifyContent: 'center',
        alignItems: 'center', */
    },
    descrip: {
        backgroundColor: 'white',
        alignSelf: 'center',
        borderWidth: 1, // Ancho del borde
        borderColor: 'black', // Color del borde
        paddingStart: 10,
        paddingEnd: 10,
        width: '100%',
        height: 200,
        borderRadius: 30,
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 10,
    }
});

export default AccessForm