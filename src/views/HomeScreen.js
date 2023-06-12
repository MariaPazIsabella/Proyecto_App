import React from 'react';
import { View, FlatList, Text,TouchableOpacity,StyleSheet, SafeAreaView, Image } from 'react-native';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.containerGeneral}>
      <View style={styles.container}>
        <Image
          source={require('../assets/logo_SS.png')}
          style={styles.logo}
        />
        <Text style={styles.titulo}>Servicio de Salud - Biobio</Text>
      </View>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '45%', height: 3, backgroundColor: '#0f69b4' }} />
          <View style={{ width: '55%', height: 3, backgroundColor: '#e22c2c' }} />
        </View>
      </View>
      <View style={styles.containerSegundo}>
        <Image 
          source={require('../assets/banner-agresiones.png')} 
          style={styles.imagenBanner}
        />
      </View>
      
      <View style={styles.containerTercero}>
        <Text style={styles.contacto}>Información de contacto</Text>
        <Text style={styles.contactoDetalle}>Dirección</Text>
        <Text style={styles.detalle}>Avenida Ricardo Vicuña 147 Interior, Torre de Estacionamientos, Cuarto Piso, Los Ángeles</Text>
        <Text style={styles.contactoDetalle}>Teléfono</Text>
        <Text style={styles.detalle}>(56) (43) 2 332 445 - 2 332 543 - 2 332522</Text>
        <Text style={styles.contactoDetalle}>Correo electrónico</Text>
        <Text style={styles.detalle}>contacto@ssbiobio.cl</Text>
        <Text style={styles.contactoDetalle}>Delegación Seremi Los Ángeles</Text>
        <Text style={styles.detalle}>(43) 2 332893</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  containerGeneral: {
    flex: 1,
    backgroundColor: '#EEEEEE',
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
  contacto: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    /* marginBottom: 10, */
  },
  contactoDetalle: {
    fontSize: 15,
    /* marginBottom: 5, */
    marginTop: 5,
    color: '#0f69b4',
    textAlign: 'center',
  },
  detalle:{
    fontSize: 15,
    /* marginBottom: 5, */
    marginTop: 5,
    textAlign: 'center',
  },
  icon: {
    padding: 7,
    backgroundColor: 'black',
    borderRadius: 9999,
    textAlign: 'center',
    width: 40,
    marginTop: 15,
  },
  imagenBanner: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  }
});

export default HomeScreen;