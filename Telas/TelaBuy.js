import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'



export default function TelaBuy() {

  const [valorResultado, setValorResultado] = React.useState(0)
  const LIMITE_POR_PESSOA = 10
  const [aviso, setAviso] = React.useState(null)
  const navigation = useNavigation()

  const mostrarAviso = (texto) => {
    setAviso(texto)
    setTimeout(() => setAviso(null), 3500)
  }
  const somar = () => {
    if (valorResultado >= LIMITE_POR_PESSOA) {
      mostrarAviso(`Limite de ${LIMITE_POR_PESSOA} sensores por pessoa.`)
      return
    }
    setValorResultado(valorResultado + 1)
  }
  const subtratir = () => {
    if (valorResultado <= 0) return
    setValorResultado(valorResultado - 1)
  }

  const comprar = () => {
    if (valorResultado < 1) {
      mostrarAviso('Escolha pelo menos 1 sensor para comprar.')
      return
    }
    navigation.navigate('TelaPayment', { quantidade: valorResultado })
  }
  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.screen}>
      {aviso && (
        <View style={styles.aviso}>
          <Text style={styles.textAviso}>{aviso}</Text>
        </View>
      )}
      {/* Cabeçalho*/}
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Principal')}
            >
              <Ionicons name="home-sharp" size={30} color="black" />
            </TouchableOpacity>
            <Text style={styles.textHeader}>Adquirir sensor</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
            >
              <Image
                source={require('../assets/Avatar.png')}
                style={styles.imageHeader}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <View style={styles.boxGeral}>
            <Image
              source={require('../assets/Logo.png')}
              style={styles.image}
            />

            <View style={styles.boxGeral2}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 70, marginBottom: 15 }}>
                <View style={styles.bottomAdd}>
                  <TouchableOpacity
                    onPress={subtratir}
                  >
                    <AntDesign name="minus-circle" size={15} color="#A4B5C4" />
                  </TouchableOpacity>
                  <Text style={styles.textNegrito}>{valorResultado}</Text>
                  <TouchableOpacity
                    onPress={somar}
                  >
                    <Feather name="plus-circle" size={18} color="#A4B5C4" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.textNegrito}>Frete: ---</Text>
              </View>
              <Text style={styles.textNegrito}>Descrição</Text>
              <Text style={styles.textNormal}>Sensor que protege sua casa: detecta vazamentos de gás de cozinha e fecha a válvula automaticamente. Monitora a qualidade do ar e a umidade, garantindo mais segurança e bem-estar. Compacto e confiável, une segurança e saúde em um só produto.</Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10, marginBottom: 15 }}>
                <Text style={styles.textNegrito2}>R$: 109,99</Text>
                <TouchableOpacity
                  style={styles.boxBottom}
                  onPress={comprar}
                >
                  <Text style={styles.textBottons}>Comprar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

    </View>
  )
}
const styles = StyleSheet.create({
  //Geral
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  //alinhamento
  container: {
    alignItems: 'center',
  },
  //Cabeçalho
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'center',
    marginTop: 50,
    paddingHorizontal: 10
  },
  textHeader: {
    fontFamily: 'ManropeBold',
    fontSize: 30,
    letterSpacing: 1,
    lineHeight: 40,
    color: '#0F0F0F',
    marginHorizontal: 30,
    textAlign: 'center'
  },
  imageHeader: {
    width: 50,
    height: 50,
  },
  image: {
    width: 200,
    height: 200,
    margin: 10,
  },

  boxGeral: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '100%',
    height: 700,
    borderRadius: 50,
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 30,
  },
  boxGeral2: {
    backgroundColor: 'rgb(164, 181, 196)',
    width: '100%',
    height: 700,
    borderRadius: 50,
    marginTop: 90,
    padding: 30,
  },
  textNegrito: {
    fontFamily: 'ManropeBold',
    fontSize: 19,
    letterSpacing: 1,
    lineHeight: 20,
  },
  textNormal: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 25,
    marginTop: 10,
    textAlign: 'justify'

  },
  //primeira linha
  bottomAdd: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: 100,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5,

  },
  //ultima linha 
  textNegrito2: {
    fontFamily: 'ManropeBold',
    fontSize: 35,
    letterSpacing: 1,
    lineHeight: 40,
    color: '#071739'
  },
  textBottons: {
    fontFamily: 'ManropeBold',
    fontSize: 19,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },

  boxBottom: {
    backgroundColor: '#071739',
    width: '45%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    margin: 10
  },
  aviso: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#D64545',
    zIndex: 10,
    elevation: 10,
  },
  textAviso: {
    fontFamily: 'ManropeBold',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
})
