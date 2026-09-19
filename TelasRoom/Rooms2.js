import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Entypo from '@expo/vector-icons/Entypo'
import Feather from '@expo/vector-icons/Feather'


export default function Rooms2() {

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
        <View style={styles.logoBox}>
          <Text style={styles.textCozinha}>Cozinha da hamburgueria </Text>
          <Image
            source={require('../assets/presentation3.png')}
            style={styles.image}
          />
        </View>
      </View>
      {/* Box Sensor */}
      <View style={styles.container}>
        <View style={styles.boxSensor}>
          <View style={{ flexDirection: 'row' }}>
            <EvilIcons name="exclamation" size={23} color="red" />
            <Text style={styles.textSensor}> Foi detectado gás no ambiente</Text>
          </View>
          <View>
            <Text style={styles.textSensor2}>Houve um pequeno vazamento de gás no ambiente às 16:44. Mas não se preocupe, ele já foi contido.</Text>
          </View>
        </View>
      </View>
      {/* Box Sensor Configurações */}
      <View style={styles.container}>
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
              <View style={{ width: '110%' }}>
                <View style={styles.boxConects3}>
                  <Feather name="power" size={18} color="#D64545" />
                  <Text style={styles.text2Card1}> Desligar sensor</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>


    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

  },
  boxSensor: {
    backgroundColor: '#FFEAD0',
    width: '90%',
    height: 110,
    borderRadius: 15,
    margin: 5,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSensor2: {
    fontFamily: 'Manrope',
    fontSize: 15,
    color: 'black'
  },
  //Style Box Logo
  logoBox: {
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    width: '90%',
    height: 300,
    backgroundColor: "#A4B5C4",
    borderRadius: 15,
    marginTop: 130
  },
  image: {
    width: '95%',
    height: 230,
    marginTop: 15,
    borderRadius: 10,
    margin: 10
  },
  textCozinha: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white', 
    marginTop: 10
  },
  textSensor: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: 'black'
  },
  //Style Box Configurações sensor
  boxSensor2: {
    backgroundColor: '#D9D9D9',
    width: '90%',
    height: 150,
    borderRadius: 15,
    margin: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 280
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
    width: '100%',
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
  columnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'flex-start',
  },
  text2Card1: {
    fontFamily: 'Manrope',
    fontSize: 15,
    letterSpacing: 1,
    lineHeight: 20,
  },
})
