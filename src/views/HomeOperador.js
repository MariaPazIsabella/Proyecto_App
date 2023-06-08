/* // mostrar el rut y el establecimiento asignado
import React, { useEffect, useState } from 'react';
import { getAuth, initializeApp, signOut } from 'firebase/auth';
import { firebaseConfig } from '../consts/firebase';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, View, Button } from 'react-native';
import { ScrollView, TextInput, TouchableHighlight, TouchableOpacity, } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../consts/colors';

const { width } = Dimensions.get('screen');
const cardWidth = width / 2 - 20;

const HomeOperador = ({ navigation }) => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const getCurrentDate = () => {
      const date = new Date();
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      setCurrentDate(formattedDate);
    };

    getCurrentDate();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.li }}>
      <View style={style.header}>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 28 }}>Hola,</Text>
            <Text style={{ fontSize: 28, fontWeight: 'bold', marginLeft: 10 }}>
              Funcionario
            </Text>
          </View>
          <Text style={{ marginTop: 5, fontSize: 22, color: COLORS.grey }}>
            ¿Necesitas ayuda?
          </Text>
        </View>
        <Image
          source={require('../assets/logo_SS.png')}
          style={{ height: 50, width: 50}}
        />
      </View>
      <View
        style={{
          marginTop: 40,
          flexDirection: 'row',
          paddingHorizontal: 20,
        }}>
        <View style={style.inputContainer}>
          <Icon name="search" size={28} />
          <TextInput
            style={{ flex: 1, fontSize: 18 }}
            placeholder="Buscas ..."
          />
        </View>
        <View style={style.sortBtn}>
          <Icon name="tune" size={28} color={COLORS.white} />
        </View>
      </View>
      <View>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginHorizontal: 10, marginBottom: 10 }}>
          Fecha actual: {currentDate}
        </Text>
        <Image
          source={require('../assets/fondo.jpg')}
          style={{ marginTop: 5, marginHorizontal: 5, height: 400, width: 350, borderRadius: 15, justifyContent: 'center' }}
        />
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: COLORS.light,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesListContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 45,
    width: 120,
    margiderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: COLORS.white,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 220,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: COLORS.white,
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeOperador;
 */