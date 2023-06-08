import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';

import { Card } from 'react-native-elements';

import { FIRESTORE_DB } from '../consts/firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';

import COLORS from '../consts/colors';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';


const NewUserList = () => {
    const [lista, setLista] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const getUsersNotAuthorizedAccess = async () => {
            try {
                const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'UsersNotAuthorizedAccess'));
                const docs = [];

                querySnapshot.forEach((doc) => {
                    const { primerNombre, primerApellido, rut } = doc.data();

                    docs.push({
                        id: doc.id,
                        primerNombre,
                        primerApellido,
                        rut,
                    });
                    console.log(docs);
                });

                setLista(docs);
            } catch (error) {
            }
        };

        getUsersNotAuthorizedAccess();
    }, []);

    const handleVolver = () => {
        navigation.goBack();
    };

    const handleCardPress = (userId) => {
        navigation.navigate('ShowAuthorizeUser', { userId });
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <StatusBar backgroundColor="black" />

                <Image style={styles.image} source={require('../assets/logo_SS.png')} />
                <Text style={styles.Titulo}>Registre nuevo usuario</Text>

                <TouchableOpacity style={styles.botonVolver} onPress={handleVolver}>
                    <Icon name="arrow-back" size={24} color={COLORS.dark} />
                </TouchableOpacity>

                <View style={styles.container}>
                    {lista.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => handleCardPress(item.id)}>
                            <Card containerStyle={styles.card}>
                                <Text>Nombre: {item.primerNombre} {item.primerApellido}</Text>
                                <Text>Rut: {item.rut}</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>


            </ScrollView>
        </View>
    );
};
//------------------------------------------------------------------------------------------
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.light,
        alignItems: 'center',
        justifyContent: 'center',
    },

    Titulo: {
        marginTop: 15,
        color: '#1e6496',
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
        fontSize: 20,
    },
    card: {
        height: 60,
        width: 300,
        borderRadius: 10,
        borderWidth: 2,
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
        fontSize: 15,
        paddingHorizontal: 20,
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
        color: 'green'
    },
    textInput: {
        flex: 1,
        height: 50,
        fontSize: 15,
        borderRadius: 10,
        flexDirection: 'row',
        borderWidth: 1, // Ancho del borde
        borderColor: 'black', // Color del borde
        backgroundColor: COLORS.white,
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    Buttons: {
        fontSize: 13,
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

export default NewUserList