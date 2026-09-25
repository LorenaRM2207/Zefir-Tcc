import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'



export default function TelaBuy() {

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }
  const navigation = useNavigation()
  return (
    <View style={styles.screen}>
      {/* Cabeçalho*/}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TelaSuporte')}
          >
          <Feather name="message-square" size={35} color="black" />
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
              <TouchableOpacity>
                <AntDesign name="minus-circle" size={15} color="#A4B5C4" />
              </TouchableOpacity>
              <Text style={styles.textNegrito}>2</Text>
              <TouchableOpacity>
              <Feather name="plus-circle" size={18} color="#A4B5C4" />
              </TouchableOpacity>
            </View>
            <Text style={styles.textNegrito}>Frete: ---</Text>
          </View>
          <Text style={styles.textNegrito}>Descrição</Text>
          <Text style={styles.textNormal}>Sensor que protege sua casa: detecta vazamentos de gás de cozinha e fecha a válvula automaticamente. Monitora a qualidade do ar e a umidade, garantindo mais segurança e bem-estar. Compacto e confiável, une segurança e saúde em um só produto.</Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10, marginBottom: 15  }}>
            <Text style={styles.textNegrito2}>R$: ---</Text>
            <TouchableOpacity
              style={styles.boxBottom}
              onPress={() => navigation.navigate('TelaPayment')}
            >
              <Text style={styles.textBottons}>Comprar</Text>
            </TouchableOpacity>
          </View>
          </View>

        </View>

      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  //Geral
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F6',
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
    lineHeight: 30,
    color: '#0F0F0F',
    marginHorizontal: 60, 
    textAlign:'center'
  },
  imageHeader: {
    width: 50,
    height: 50,
  },
  image: {
    width: 200,
    height: 200,
    margin: 10
  },
  boxGeral: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '100%',
    height: '230%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center', 
    margin: 10
  },
  boxGeral2: {
    backgroundColor: 'rgb(164, 181, 196)',
    width: '100%',
    height: '75%',
    borderRadius: 50,
    marginTop: 30, 
    padding: 30
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
  bottomAdd:{
    flexDirection:'row', 
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
    lineHeight: 20,
    color:'#071739'
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
})
