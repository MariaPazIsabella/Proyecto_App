import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import { FIRESTORE_DB } from '../consts/firebase';
import { getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import COLORS from '../consts/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ShowReporte = ({ route, reportes, setReportes, actualizarListaReportes }) => {
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

  const handleActualizar = async () => {
    try {
      const reporteRef = doc(FIRESTORE_DB, 'ReportsUploaded', reporteId);
      await updateDoc(reporteRef, { estado: 'reportado' });
      setReporteEstado('reportado');
      Alert.alert('Reporte actualizado');
      handleVolver();
    } catch (error) {
      console.log(error);
    }
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

                        <TouchableOpacity style={styles.botonCheck} onPress={handleActualizar}>
                            <Icon name="check-circle-outline" size={30} color={'#fff'} />
                            <Text style={styles.botonCheckText}>Actualizar estado</Text>
                        </TouchableOpacity>
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

export default ShowReporte

/*
//puede ver los reportes de su establecimiento y los de la comuna
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, Image, Text, View, TouchableOpacity, } from 'react-native';
import COLORS from '../../../consts/colors';

//firebase
import { FIRESTORE_DB } from '../../../consts/firebase';
import { getFirestore, addDoc, collection, getDoc, getDocs, doc, } from 'firebase/firestore';

/*
  const getOneReport = async (id) => {
        try {
            const docRef = doc(FIRESTORE_DB, 'ReportsUploaded', id)
            const docSnap = await getDoc(docRef)
            setReporte(docSnap.data())
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getOneReport(props.router.params.reporteId)
    }, []);
 *//*
const ShowReporte = (props) => {

const [reporte, setReporte] = useState([]);
 
const getOneReport = async (id) => {
  try {
      const dataDocs =[];
      const docSnap = await getDoc(collection(FIRESTORE_DB, 'ReportsUploaded', id))
      const { tipoAgresion, fecha, hora, nombreComuna, nombreTipo, establecimientoId, servicioSalud, unidad, descripcionUnidad, nombreAfectado, genero, estamentoAfectado, tipoEstamento, rutAfectado, fechaNacimiento, edad, domicilio, telefonoAfectado, correo, mutualidad, tipoAgresor, nombreAgresor, rutAgresor, sectorAgresor, domicilioAgresor, telefonoAgresor, nombreTestigo1, rutTestigo1, telefonoTestigo1, nombreTestigo2, rutTestigo2, telefonoTestigo2, descripcion, estado } = docSnap.data()
      dataDocs.push({
          id: doc.id, tipoAgresion, fecha, hora, nombreComuna, nombreTipo, establecimientoId, servicioSalud, unidad, descripcionUnidad, nombreAfectado, genero, estamentoAfectado, tipoEstamento, rutAfectado, fechaNacimiento, edad, domicilio, telefonoAfectado, correo, mutualidad, tipoAgresor, nombreAgresor, rutAgresor, sectorAgresor, domicilioAgresor, telefonoAgresor, nombreTestigo1, rutTestigo1, telefonoTestigo1, nombreTestigo2, rutTestigo2, telefonoTestigo2, descripcion, estado,
      })
      console.log(dataDocs)
      setReporte(docSnap.data())
  } catch (error) {
      console.log(error)
  }
}
 
useEffect(() => {
  getOneReport(props.router.params.reporteId)
}, []);
 
return (
  <SafeAreaView style={{ backgroundColor: COLORS.light, flex: 1 }}>
      <View>
          <Text style={styles.Titulo}>Detalles del reporte</Text>
 
 
          <Text style={styles.categoria}>ANTECEDENTES DE LA AGRESIÓN</Text>
          <Text style={styles.subTitulo}>tipoAgresion: {reporte.tipoAgresion}</Text>
          <Text style={styles.subTitulo}>fecha: {reporte.fecha}</Text>
          <Text style={styles.subTitulo}>hora: {reporte.hora}</Text>
          <Text style={styles.subTitulo}>nombreComuna: {reporte.nombreComuna}</Text>
          <Text style={styles.subTitulo}>nombreTipo: {reporte.nombreTipo}</Text>
          <Text style={styles.subTitulo}>establecimientoId: {reporte.establecimientoId}</Text>
          <Text style={styles.subTitulo}>servicioSalud: {reporte.servicioSalud}</Text>
          <Text style={styles.subTitulo}>unidad: {reporte.unidad}</Text>
          <Text style={styles.subTitulo}>descripcionUnidad: {reporte.descripcionUnidad}</Text>
 
 
          <Text style={styles.categoria}>IDENTIFICACIÓN DEL AFECTADO</Text>
          <Text style={styles.subTitulo}>nombreAfectado: {reporte.nombreAfectado}</Text>
          <Text style={styles.subTitulo}>genero: {reporte.genero}</Text>
          <Text style={styles.subTitulo}>estamentoAfectado: {reporte.estamentoAfectado}</Text>
          <Text style={styles.subTitulo}>tipoEstamento: {reporte.tipoEstamento}</Text>
          <Text style={styles.subTitulo}>rutAfectado: {reporte.rutAfectado}</Text>
          <Text style={styles.subTitulo}>fechaNacimiento: {reporte.fechaNacimiento}</Text>
          <Text style={styles.subTitulo}>edad: {reporte.edad}</Text>
          <Text style={styles.subTitulo}>domicilio: {reporte.domicilio}</Text>
          <Text style={styles.subTitulo}>telefonoAfectado: {reporte.telefonoAfectado}</Text>
          <Text style={styles.subTitulo}>correo: {reporte.correo}</Text>
          <Text style={styles.subTitulo}>mutualidad: {reporte.mutualidad}</Text>
 
 
          <Text style={styles.categoria}>DATOS DE EL/LA AGRESOR/A</Text>
          <Text style={styles.subTitulo}>tipoAgresor: {reporte.tipoAgresor}</Text>
          <Text style={styles.subTitulo}>nombreAgresor: {reporte.nombreAgresor}</Text>
          <Text style={styles.subTitulo}>rutAgresor: {reporte.rutAgresor}</Text>
          <Text style={styles.subTitulo}>sectorAgresor: {reporte.sectorAgresor}</Text>
          <Text style={styles.subTitulo}>domicilioAgresor: {reporte.domicilioAgresor}</Text>
          <Text style={styles.subTitulo}>telefonoAgresor: {reporte.telefonoAgresor}</Text>
 
 
          <Text style={styles.categoria}>TESTIGOS DEL CONFLICTO</Text>
          <Text style={styles.subTitulo}>nombreTestigo1: {reporte.nombreTestigo1}</Text>
          <Text style={styles.subTitulo}>rutTestigo1: {reporte.rutTestigo1}</Text>
          <Text style={styles.subTitulo}>telefonoTestigo1: {reporte.telefonoTestigo1}</Text>
          <Text style={styles.subTitulo}>nombreTestigo2: {reporte.nombreTestigo2}</Text>
          <Text style={styles.subTitulo}>rutTestigo2: {reporte.rutTestigo2}</Text>
          <Text style={styles.subTitulo}>telefonoTestigo2: {reporte.telefonoTestigo2}</Text>
 
 
 
          <Text style={styles.categoria}>DESCRIPCIÓN DEL INCIDENTE</Text>
          <Text style={styles.subTitulo}>descripcion: {reporte.descripcion}</Text>
          <Text style={styles.subTitulo}>estado: {reporte.estado}</Text>
 
 
      </View>
  </SafeAreaView>
);
};
 
const styles = StyleSheet.create({
header: {
  paddingVertical: 20,
  flexDirection: 'row',
  alignreportes: 'center',
  marginHorizontal: 20,
},
container: {
  flex: 1,
  backgroundColor: COLORS.light,
  alignreportes: 'center',
  justifyContent: 'center',
},
touchable: {
  height: 130,
 
},
cartCard: {
  height: 100,
  elevation: 15,
  borderRadius: 10,
  backgroundColor: COLORS.white,
  marginVertical: 10,
  marginHorizontal: 20,
  paddingHorizontal: 10,
  flexDirection: 'row',
  alignreportes: 'center',
},
card: {
  height: 120,
  width: 300,
  borderRadius: 10,
  borderColor: 'black',
},
actionBtn: {
  width: 80,
  height: 30,
  backgroundColor: COLORS.primary,
  borderRadius: 30,
  paddingHorizontal: 5,
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
},
filterContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  borderWidth: 1, // Ancho del borde
  borderColor: 'black', // Color del borde
  borderRadius: 30,
  marginHorizontal: 20,
  marginTop: 10,
},
filterInput: {
 
  height: 40,
  borderWidth: 1,
  borderColor: COLORS.grey,
  borderRadius: 20,
  paddingHorizontal: 20,
  width: '48%',
},
dateFilterContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: 20,
  marginTop: 10,
  marginBottom: 20,
},
dateFilterInput: {
  height: 40,
  borderWidth: 1,
  borderColor: COLORS.grey,
  borderRadius: 20,
  paddingHorizontal: 20,
  width: '48%',
},
Titulo: {
  marginTop: 15,
  color: '#1e6496',
  textAlign: 'center',
  textDecorationLine: 'underline',
  fontWeight: 'bold',
  fontSize: 20,
},
image: {
  width: 100,
  height: 100,
  alignSelf: 'center',
  marginTop: 10,
},
 
Titulo: {
  marginTop: 15,
  color: '#1e6496',
  textAlign: 'center',
  textDecorationLine: 'underline',
  fontWeight: 'bold',
  fontSize: 20,
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
});
 
export default ShowReporte

*/