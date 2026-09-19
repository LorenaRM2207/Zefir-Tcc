import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Entypo from '@expo/vector-icons/Entypo'
import Feather from '@expo/vector-icons/Feather'


export default function Presentation4() {

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
    //View principal
    <View style={styles.screen}>

      {/* Cabeçalho */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <Text style={styles.text2Card1}>3/3</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.text2Card1}>Pular</Text>
        </TouchableOpacity>
      </View>

      {/* View de alinhamento */}
      <View style={{ alignItems: 'center' }}>
        {/* Box Sensor */}
        <View style={styles.boxSensor}>
          <View style={{ flexDirection: 'row' }}>
            <EvilIcons name="exclamation" size={23} color="red" />
            <Text style={styles.textSensor}> Foi detectado gás no ambiente</Text>
          </View>
          <View>
            <Text style={styles.textSensor2}>Houve um pequeno vazamento de gás no ambiente às 16:44. Mas não se preocupe, ele já foi contido.</Text>
          </View>
        </View>

        {/* Box Sensor Configurações */}
        <View style={styles.boxSensor2}>
          <View style={styles.columnsRow}>

            {/* Box Sensor Configurações - Coluna 1 */}
            <View style={{ alignItems: 'flex-start' }}>
              <View style={styles.alignConfigurations}>
                <View style={styles.boxConects}>
                  <Entypo name="link" size={20} color="black" />
                </View>
                <Text style={styles.text2Card1}> Conectado</Text>
              </View>
              <View style={styles.alignConfigurations}>
                <View style={styles.boxConects}>
                  <Feather name="lock" size={20} color="black" />
                </View>
                <Text style={styles.text2Card1}> Seguro</Text>
              </View>
              <View style={styles.alignConfigurations}>
                <View style={styles.boxConects2}>
                  <Feather name="droplet" size={20} color="black" />
                </View>
                <Text style={styles.text2Card1}> 40%</Text>
              </View>
            </View>

            {/* Box Sensor Configurações - Coluna 2 */}
            <View style={{ alignItems: 'flex-start' }}>
              <View style={styles.alignConfigurations}>
                <View style={styles.boxConects}>
                  <Feather name="battery" size={20} color="black" />
                </View>
                <Text style={styles.text2Card1}> 95%</Text>
              </View>
              <View style={styles.alignConfigurations}>
                <View style={styles.boxConects2}>
                  <Feather name="wind" size={20} color="black" />
                </View>
                <Text style={styles.text2Card1}> 2%</Text>
              </View>
              <View style={styles.boxConects3}>
                <Feather name="power" size={18} color="#D64545" />
                <Text style={styles.text2Card1}> Desligar sensor</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Card inferior */}
      <View style={styles.card1}>
        <View style={styles.titleContainer}>
          <Text style={styles.textCard1}>
            Conecte seu sensor
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text2Card1}>Ligue o sensor e siga as instruções para conectá-lo via Wi-Fi.
            Assim, o app poderá monitorar seu ambiente e enviar alertas automáticos.
          </Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.bottom}
            onPress={() => navigation.navigate('Presentation5')}
          >
            <Text style={styles.textBottom}> Continuar </Text>
            <FontAwesome6 name="arrow-right-long" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View >

  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    justifyContent: 'space-between',
  },

  //Style Box Sensor
  boxSensor: {
    backgroundColor: '#FFEAD0',
    width: '80%',
    height: 110,
    borderRadius: 15,
    margin: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1
  },
  textSensor2: {
    fontFamily: 'Manrope',
    fontSize: 15,
    color: 'black'
  },
  //Style Box Configurações sensor
  boxSensor2: {
    backgroundColor: '#D9D9D9',
    width: '80%',
    height: 150,
    borderRadius: 15,
    margin: 10,
    padding: 10,
    alignItems: 'center',

  },
  boxConects: {
    backgroundColor: '#1FC72A',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxConects2: {
    backgroundColor: '#FFD726',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxConects3: {
    backgroundColor: '#A4B5C4',
    width: '110%',
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: 10,
    marginTop: 15,
  },
  alignConfigurations: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
  },
  textSensor: {
    fontFamily: 'ManropeBold',
    fontSize: 18,
    color: 'black'
  },
  textCozinha: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },
  columnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'flex-start',
  },
  //Box card inferior 
  card1: {
    backgroundColor: "#F6F6F6",
    width: '100%',
    height: '40%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,

    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'flex-start'
  },
  titleContainer: {
    width: '100%',
  },
  textContainer: {
    width: '100%',
    margin: 30,
  },
  textCard1: {
    fontFamily: 'ManropeBold',
    fontSize: 30,

  },
  text2Card1: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
  },
  bottom: {
    backgroundColor: "#4B6382",
    borderRadius: 20,
    width: 180,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 20
  },
  textBottom: {
    fontFamily: 'Manrope',
    fontSize: 20,
    color: '#ffff'
  },
})