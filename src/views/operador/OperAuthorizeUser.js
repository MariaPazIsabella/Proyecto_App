import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { FIRESTORE_DB } from '../../consts/firebase';
import { getDoc, doc, deleteDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import COLORS from '../../consts/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

import dataComunaEstablecimiento from '../../consts/dataComunaEstablecimiento';
import dataEstablecimientos from '../../consts/dataEstablecimientos';
import dataTipoEstablecimiento from '../../consts/dataTipoEstablecimiento';
import { PrimaryButton } from '../components/Button';

const OperAuthorizeUser = ({ route }) => {
    const { userId } = route.params;
    const [usuario, setUsuario] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [comunaId, setComunaId] = useState('');
    const [tipoId, setTipoId] = useState('');
    const [establecimientoId, setEstablecimientoId] = useState('');
    const [establecimientos, setEstablecimientos] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const getOneReport = async (id) => {
            try {
                const docRef = doc(FIRESTORE_DB, 'UsersNotAuthorizedAccess', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUsuario(docSnap.data());
                } else {
                    console.log('El usuario no existe');
                }
            } catch (error) {
                console.log(error);
            }
        };

        getOneReport(userId);
    }, [userId]);

    const handleVolver = () => {
        navigation.goBack();
    };

    const datosObligatorios = async () => {
        if (!selectedRole) {
            Alert.alert('Faltan datos', 'Por favor asigne rol');
        } else {
            agregarUsuarioAutorizado();
            deleteUser(userId);
        }
    };

    const agregarUsuarioAutorizado = async () => {
        addDoc(collection(FIRESTORE_DB, 'UsersAuthorizedAccess'), {
            role: selectedRole,
            correo: usuario.correo,
            rut: usuario.rut,
            uid: usuario.uid,
            establecimiento: establecimientoId,
            primerNombre: usuario.primerNombre,
            segundoNombre: usuario.segundoNombre,
            primerApellido: usuario.primerApellido,
            segundoApellido: usuario.segundoApellido,
        });
        Alert.alert('Usuario registrado');
    };

    const deleteUser = async (id) => {
        try {
            await deleteDoc(doc(FIRESTORE_DB, 'UsersNotAuthorizedAccess', id));
            handleVolver();
        } catch (error) {
            console.log(error);
        }
    };

    const confirmDeleteUser = () => {
        Alert.alert(
            'Confirmar Eliminación',
            '¿Estás seguro de que quieres eliminar esta solicitud?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => deleteUser(userId),
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {usuario ? (
                <ScrollView>
                    <View>
                        <Image style={styles.image} source={require('../../assets/logo_SS.png')} />
                        <TouchableOpacity style={styles.botonVolver} onPress={handleVolver}>
                            <Icon name="arrow-back" size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                        <Text style={styles.Titulo}>Detalles del usuario</Text>
                        <View style={styles.views}>
                            <Text style={styles.subTitulo}>
                                Nombre: {usuario.primerNombre} {usuario.segundoNombre} {usuario.primerApellido} {usuario.segundoApellido}
                            </Text>
                            <Text style={styles.subTitulo}>Rut: {usuario.rut}</Text>
                            <Text style={styles.subTitulo}>Correo: {usuario.correo}</Text>
                            <Text style={styles.subTitulo}>Rol: {selectedRole}</Text>
                            
                        </View>

                        <View style={styles.multiSelect}>
                            <Picker
                                selectedValue={selectedRole}
                                onValueChange={setSelectedRole}
                                style={styles.picker}
                            >
                                <Picker.Item label="Seleccione" value="" />
                                <Picker.Item label="Usuario" value="usuario" />
                            </Picker>
                        </View>


                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonEliminar} onPress={() => confirmDeleteUser()}>
                                <Text style={styles.buttonText}>Eliminar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonAutorizar} onPress={() => datosObligatorios()}>
                                <Text style={styles.buttonText}>Autorizar</Text>
                            </TouchableOpacity>
                        </View>


                    </View>
                </ScrollView>
            ) : (
                <Text style={styles.loading}>Cargando usuario...</Text>
            )}
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.light,
        padding: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // Otros estilos para el contenedor de los botones
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 16,
    },
    multiSelect: {
        height: 50,
        borderWidth: 1, // Ancho del borde
        borderColor: 'black', // Color del borde
        borderRadius: 10,
        marginTop: 5,
        backgroundColor: COLORS.white,
    },
    buttonEliminar: {
        width: '40%',
        backgroundColor: 'red',
        marginBottom: 5,
        textAlign: 'center',
        marginTop: 5,
        borderRadius: 10,
        padding: 10,
    },
    buttonAutorizar: {
        width: '40%',
        backgroundColor: 'blue',
        marginBottom: 5,
        marginTop: 5,
        borderRadius: 10,
        padding: 10,
    },
    buttonText: {
        color: '#fff',
    },
    Titulo: {
        marginTop: 15,
        color: '#1e6496',
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 10,
    },

    categoria: {
        marginTop: 15,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
    },
    subTitulo: {
        marginTop: 5,
        marginBottom: 5,
        height: 35,
        color: '#fff',
        flexDirection: 'row',
        fontSize: 15,
        paddingHorizontal: 20,
    },
    loading: {
        fontSize: 18,
        marginTop: 50,
        textAlign: 'center',
    },
    views: {
        borderWidth: 2,
        borderColor: '#0C17F7',
        marginBottom: '2%',
        backgroundColor: '#536FED80',
        borderRadius: 10,
    },
});

export default OperAuthorizeUser
