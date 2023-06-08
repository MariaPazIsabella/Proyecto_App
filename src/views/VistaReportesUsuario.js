import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

import COLORS from '../consts/colors';
import { FIRESTORE_DB } from '../consts/firebase';

const VistaReportesUsuarios = () => {
  const [lista, setLista] = useState([]);
  const [estadoFiltrado, setEstadoFiltrado] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const getLista = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const userId = user.uid;

        try {
          const q = query(
            collection(FIRESTORE_DB, 'ReportsUploaded'),
            where('uid', '==', userId)
          );

          const querySnapshot = await getDocs(q);
          const docs = [];

          querySnapshot.forEach((doc) => {
            const { nombreComuna, fecha, establecimientoId, estado } = doc.data();

            if (!estadoFiltrado || estado === estadoFiltrado) {
              docs.push({
                id: doc.id,
                nombreComuna,
                fecha,
                establecimientoId,
                estado,
              });
            }
          });

          setLista(docs);
        } catch (error) {
          // Manejar errores
        }
      }
    };

    getLista();
  }, [estadoFiltrado]);

  const handleFiltrarRole = (estado) => {
    setEstadoFiltrado(estado);
  };

  const handleMostrarTodos = () => {
    setEstadoFiltrado('');
  };

  const getCardBorderStyle = (estado) => {
    if (estado === 'revision') {
      return { borderColor: 'red' };
    } else if (estado === 'reportado') {
      return { borderColor: 'blue' };
    } else {
      return {};
    }
  };

  const handleCardPress = (reporteId) => {
    navigation.navigate('Show', { reporteId });
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.light, flex: 1, marginBottom: 10 }}>
      <View style={styles.header}>
        <Text style={styles.Titulo}>LISTA DE REPORTES</Text>
      </View>

      <View style={styles.filtros}>
        <TouchableOpacity style={styles.botonFiltro} onPress={handleMostrarTodos}>
          <Text style={styles.textoBoton}>Todos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonFiltro} onPress={() => handleFiltrarRole('revision')}>
          <Text style={styles.textoBoton}>Revisión</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonFiltro} onPress={() => handleFiltrarRole('reportado')}>
          <Text style={styles.textoBoton}>Reportado</Text>
        </TouchableOpacity>
      </View>

        <ScrollView>
          <View style={styles.container}>
            {lista.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleCardPress(item.id)}
              >
                <Card containerStyle={[styles.card, getCardBorderStyle(item.estado)]}>
                  <Card.Title>{item.estado}</Card.Title>
                  <Card.Divider />
                  <Text>Fecha: {item.fecha}</Text>
                  <Text>Comuna: {item.nombreComuna}</Text>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };

  
const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 300,
    borderWidth: 1, // Ancho del borde
    borderColor: 'black', // Color del borde
    marginBottom: '5%',
    marginLeft: '5%',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    alignItems: 'center',
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
    alignItems: 'center',
  },
  card: {
    height: 130,
    width: 300,
    borderRadius: 10,
    borderWidth: 2,
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
  filterInput: {
    height: '4%',
    borderWidth: 1,
    borderColor: COLORS.grey,
    paddingHorizontal: 10,
    marginLeft: '5%',
    marginBottom: 5,
    width: '45%',
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
  header: {
    marginBottom: '1%',
  },
  filtros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  botonFiltro: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  textoBoton: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
    border: 2,
    borderColor: 'black',
  },
  multiSelect: {
    height: '8%',
    width: '84%',
    marginLeft: '8%',
    borderWidth: 1, // Ancho del borde
    borderColor: 'black', // Color del borde
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginBottom: '3%',
    /* justifyContent: 'center',
    alignItems: 'center', */
  },
});
export default VistaReportesUsuarios;