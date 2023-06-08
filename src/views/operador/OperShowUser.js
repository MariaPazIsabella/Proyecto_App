
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
            ) : (
                <Text style={styles.loading}>Cargando usuario...</Text>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.light,
        padding: 20,
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
        backgroundColor: '#1e6496',
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
        backgroundColor: '#536FED80',
        borderRadius: 10,
    },
});

export default OperShowUser

