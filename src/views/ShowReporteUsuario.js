import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { FIRESTORE_DB } from '../consts/firebase';
import { getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import COLORS from '../consts/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ShowReporteUsuario = ({ route, reportes, setReportes, actualizarListaReportes }) => {
  const { reporteId } = route.params;
  const [reporte, setReporte] = useState(null);
  const [reporteEstado, setReporteEstado] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getOneReport = async (id) => {
      try {
        const docRef = doc(FIRESTORE_DB, 'ReportsUploaded', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReporte(docSnap.data());
          setReporteEstado(docSnap.data().estado);
        } else {
          console.log('El reporte no existe');
        }
      } catch (error) {
        console.log(error);
      }
    };

    getOneReport(reporteId);
  }, [reporteId]);

  const handleVolver = () => {
    navigation.goBack();
  };



    return (
        <SafeAreaView style={styles.container}>
            {reporte ? (

                <ScrollView>
                    <View>
                        <Image
                            style={styles.image}
                            source={require('../assets/logo_SS.png')}
                        />
                        <TouchableOpacity style={styles.botonVolver} onPress={handleVolver}>
                            <Icon name="arrow-back" size={24} color={COLORS.dark} />
                        </TouchableOpacity>

                        <Text style={styles.Titulo}>Detalles del reporte</Text>
                        <View style={styles.views}>
                            <Text style={styles.categoria}>ANTECEDENTES DE LA AGRESIÓN</Text>
                            <Text style={styles.subTitulo}>Tipo agresion: {reporte.tipoAgresion}</Text>
                            <Text style={styles.subTitulo}>Fecha: {reporte.fecha}</Text>
                            <Text style={styles.subTitulo}>Hora: {reporte.hora}</Text>
                            <Text style={styles.subTitulo}>Nombre comuna: {reporte.nombreComuna}</Text>
                            <Text style={styles.subTitulo}>Tipo establecimiento: {reporte.nombreTipo}</Text>
                            <Text style={styles.subTitulo}>Establecimiento: {reporte.establecimientoId}</Text>    
                            <Text style={styles.subTitulo}>Servicio de salud: {reporte.servicioSalud}</Text>
                            <Text style={styles.subTitulo}>Unidad: {reporte.unidad}</Text>
                            <Text style={styles.subTitulo}>Descripcion de la unidad: {reporte.descripcionUnidad}</Text>

                        </View>

                        <View style={styles.views}>
                            <Text style={styles.categoria}>IDENTIFICACIÓN DEL AFECTADO</Text>
                            <Text style={styles.subTitulo}>Nombre afectado: {reporte.nombreAfectado}</Text>
                            <Text style={styles.subTitulo}>Genero: {reporte.genero}</Text>
                            <Text style={styles.subTitulo}>Estamento del afectado: {reporte.estamentoAfectado}</Text>
                            <Text style={styles.subTitulo}>Tipo estamento: {reporte.tipoEstamento}</Text>
                            <Text style={styles.subTitulo}>Rut del afectado: {reporte.rutAfectado}</Text>
                            <Text style={styles.subTitulo}>Fecha nacimiento: {reporte.fechaNacimiento}</Text>
                            <Text style={styles.subTitulo}>Edad: {reporte.edad}</Text>
                            <Text style={styles.subTitulo}>Domicilio: {reporte.domicilio}</Text>
                            <Text style={styles.subTitulo}>Telefono afectado: {reporte.telefonoAfectado}</Text>
                            <Text style={styles.subTitulo}>Correo: {reporte.correo}</Text>
                            <Text style={styles.subTitulo}>Mutualidad: {reporte.mutualidad}</Text>

                        </View>

                        <View style={styles.views}>
                            <Text style={styles.categoria}>DATOS DE EL/LA AGRESOR/A</Text>
                            <Text style={styles.subTitulo}>Tipo de agresor: {reporte.tipoAgresor}</Text>
                            <Text style={styles.subTitulo}>Nombre agresor: {reporte.nombreAgresor}</Text>
                            <Text style={styles.subTitulo}>Rut agresor: {reporte.rutAgresor}</Text>
                            <Text style={styles.subTitulo}>Sector agresor: {reporte.sectorAgresor}</Text>
                            <Text style={styles.subTitulo}>Domicilio agresor: {reporte.domicilioAgresor}</Text>
                            <Text style={styles.subTitulo}>Telefono agresor: {reporte.telefonoAgresor}</Text>

                        </View>

                        <View style={styles.views}>
                            <Text style={styles.categoria}>TESTIGOS DEL CONFLICTO</Text>
                            <Text style={styles.subTitulo}>Nombre testigo 1: {reporte.nombreTestigo1}</Text>
                            <Text style={styles.subTitulo}>Rut testigo 1: {reporte.rutTestigo1}</Text>
                            <Text style={styles.subTitulo}>Telefono testigo 1: {reporte.telefonoTestigo1}</Text>
                            <Text style={styles.subTitulo}>Nombre testigo 2: {reporte.nombreTestigo2}</Text>
                            <Text style={styles.subTitulo}>Rut testigo 2: {reporte.rutTestigo2}</Text>
                            <Text style={styles.subTitulo}>Telefono testigo 2: {reporte.telefonoTestigo2}</Text>

                        </View>


                        <View style={styles.views}>
                            <Text style={styles.categoria}>DESCRIPCIÓN DEL INCIDENTE</Text>
                            <Text style={styles.subTitulo}>Descripcion: {reporte.descripcion}</Text>
                            <Text style={styles.subTitulo}>Estado: {reporte.estado}</Text>

                        </View>

                    </View>

                </ScrollView>

            ) : (
                <Text style={styles.loading}>Cargando reporte...</Text>
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
        marginTop: 15,
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
    botonCheck: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0C17F7',
        borderRadius: 10,
        paddingVertical: 10,
        marginTop: 20,
    },
    botonCheckText: {
        marginLeft: 5,
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ShowReporteUsuario
