import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'




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
      <View style={styles.container}>
        <View style={styles.Card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%', justifyContent: 'space-around', marginTop: 30 }}>
            <SimpleLineIcons name="handbag" size={30} color="black" />
            <Text style={styles.textTitle}>Compra finalizada</Text>
          
          </View>
           <View style={{marginBottom: 30, marginTop:10}}>
          <Text style={styles.textInformation2}>Agradecemos pela compra!</Text>
          </View>
          {/* Produto*/}
          <View style={styles.container}>
            <View style={styles.boxProduct}>
              <View style={styles.columnsRow}>
                {/* Imagem */}
                <Image
                  source={require('../assets/Logo.png')}
                  style={styles.image}
                />
                {/* Texto */}
                <View>
                  <Text style={styles.textInformation3}>Sensor Zefir</Text>
                  <Text style={styles.textInformation2}>R$: ---</Text>
                </View>
                {/* Icone2 */}
                <View style={styles.bottomAdd}>
                  <Text style={styles.textInformation3}>2</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.boxProduct2}>
            <Text style={styles.textInformation3}>Endereço</Text>
            <Text style={styles.textInformation2}>Rua dos sensores N.44</Text>
            <Text style={styles.textInformation2}>Frete  7-14 dias      R$: ---</Text>
            <Text style={styles.textInformation3}>Valor Pago</Text>
            <Text style={styles.textInformation2}>R$: ---</Text>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxBottom}
          onPress={() => navigation.navigate('Principal')}
        >
          <Text style={styles.textBottons}>Voltar ao Início</Text>
        </TouchableOpacity>
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
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 20
  },
  Card: {
    backgroundColor: 'rgba(164, 181, 196, 0.2)',
    width: '80%',
    height: 550,
    borderRadius: 30,
    margin: 10,
    alignItems: 'center',
    marginTop: 150
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },
  textInformation2: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginTop: 5
  },
  textInformation3: {
    fontTitle: 'ManropeBold',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },
  boxProduct: {
    backgroundColor: 'rgba(164, 181, 196, 0.3)',
    width: '90%',
    height: 120,
    borderRadius: 20,
    margin: 10,
    justifyContent: 'space-around',
    alignItems: 'center', 
  },
  columnsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomAdd: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  boxProduct2: {
    backgroundColor: 'rgba(164, 181, 196, 0.31)',
    width: '65%',
    height: 220,
    borderRadius: 30,
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 30
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
  textBottons: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },
})
