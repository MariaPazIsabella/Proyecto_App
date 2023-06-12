
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { FIRESTORE_DB } from '../../consts/firebase';
import { getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import COLORS from '../../consts/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

const OperShowUser = ({ route }) => {
    const { usuarioId } = route.params;
    const [usuario, setUsuario] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const getOneReport = async (id) => {
            try {
                const docRef = doc(FIRESTORE_DB, 'UsersAuthorizedAccess', id);
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

        getOneReport(usuarioId);
    }, [usuarioId]);

    const handleVolver = () => {
        navigation.goBack();
    };

    const handleUpdateRole = async () => {
        try {
            await updateDoc(doc(FIRESTORE_DB, 'UsersAuthorizedAccess', usuarioId), {
                role: selectedRole,
            });
            Alert.alert('Rol actualizado');
            setIsEditing(false);
        } catch (error) {
            console.log(error);
            Alert.alert('Error al actualizar el rol');
        }
    };

    const confirmDeleteUser = () => {
        Alert.alert(
            'Confirmar Eliminación',
            '¿Estás seguro de que quieres eliminar este usuario?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => deleteUser(usuarioId),
                },
            ],
            { cancelable: false }
        );
    };

    const deleteUser = async (id) => {
        try {
            await deleteDoc(doc(FIRESTORE_DB, 'UsersAuthorizedAccess', id));
            Alert.alert('Usuario eliminado');
            navigation.navigate('VistaUsuarios');
        } catch (error) {
            console.log(error);
            Alert.alert('Error al eliminar el usuario');
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <SafeAreaView>
            {usuario ? (
                <View>
                    <View style={styles.container}>
                        <Image
                            source={require('../../assets/logo_SS.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.titulo}>Detalles del usuario</Text>
                        <TouchableOpacity style={styles.volver} onPress={handleVolver}>
                                <Icon name="arrow-back" size={24} color={'#fff'}  />
                            </TouchableOpacity>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: '45%', height: 3, backgroundColor: '#0f69b4' }} />
                            <View style={{ width: '55%', height: 3, backgroundColor: '#e22c2c' }} />
                        </View>
                    </View>
                    <ScrollView>
                        <View style={styles.containerGen}>


                            <View style={styles.views}>
                                <Text style={styles.subTitulo}>
                                    Nombre: {usuario.primerNombre} {usuario.segundoNombre} {usuario.primerApellido} {usuario.segundoApellido}
                                </Text>
                                <Text style={styles.subTitulo}>Correo: {usuario.correo}</Text>
                                <Text style={styles.subTitulo}>Rol: {usuario.role}</Text>
                                {usuario.role === 'operador' && (
                                    <Text style={styles.subTitulo}>Establecimiento: {usuario.establecimiento}</Text>
                                )}

                            </View>


                            {usuario.role === 'usuario' && (
                                <View>
                                    <TouchableOpacity style={styles.button} onPress={() => confirmDeleteUser()}>
                                        <Text style={styles.buttonText}>Eliminar</Text>
                                    </TouchableOpacity>

                                </View>
                            )}

                        </View>
                    </ScrollView>

                </View>

            ) : (
                <Text style={styles.loading}>Cargando usuario...</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    containerGen: {
        flex: 1,
        backgroundColor: COLORS.light,
        padding: 20,
    },
    container: {
        width: 500,
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#rgb(39, 40, 91)',
        padding: 20,
    },
    containerSegundo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerTercero: {
        flex: 2,
        alignItems: 'center',
        /* justifyContent: 'center', */
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'right',
    },
    volver:{
        marginLeft:'10%',
    },

    multiSelect: {
        height: 50,
        borderWidth: 1, // Ancho del borde
        borderColor: 'black', // Color del borde
        borderRadius: 10,
        backgroundColor: COLORS.white,
    },
    button: {
        width: '30%',
        backgroundColor: '#0f69b4',
        marginBottom: 5,
        marginTop: 5,
        borderRadius: 10,
        padding: 5,
    },
    buttonText: {
        color: '#fff',
    },
    Titulo: {
        marginTop: 15,
        color: '#0f69b4',
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
        borderRadius: 10,
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
        backgroundColor: '#0f69b499',
        borderRadius: 10,
    },
});

export default OperShowUser

