import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

export default function Presentation2() {

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
    //View geral

    <View style={styles.screen}>
      {/* Cabeçalho */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <Text style={styles.text2Card1}>1/3</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Principal')}>
          <Text style={styles.text2Card1}>Pular</Text>
        </TouchableOpacity>
      </View>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Image
            source={require('../assets/Logo.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.boxSensor}>
          <Text style={styles.textSensor}> Conectar Sensor</Text>
        </View>
      </View>
      {/* Card inferior*/}
      <View style={styles.card1}>
        <View style={styles.titleContainer}>
          <Text style={styles.textCard1}>
            Conecte seu sensor
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text2Card1}>
            Ligue o sensor e siga as instruções para conectá-lo via Wi-Fi.
            Assim, o app poderá monitorar seu ambiente e enviar alertas automáticos.
          </Text>
        </View>
        <View>
          {/* Botyão continuar */}
          <TouchableOpacity
            style={styles.bottom}
            onPress={() => navigation.navigate('Presentation3')}
          >
            <Text style={styles.textBottom}> Continuar </Text>
            <FontAwesome6 name="arrow-right-long" size={20} color="white" />
          </TouchableOpacity>
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
  logoBox: {
    alignItems: 'center',
    alignSelf: 'center',
    padding: 15,
    width: 280,
    height: 180,
    backgroundColor: "#A4B5C4",
    borderRadius: 15,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 130,
    height: 130,
    margin: 10
  },
  boxSensor: {
    backgroundColor: '#071739',
    width: 280,
    height: 50,
    borderRadius: 15,
    margin: 10,
    padding: 15,
    alignItems: 'center',
  },
  textSensor: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },
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
    marginTop: 30,
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
    marginTop: 40,
    flexDirection: 'row',
    paddingHorizontal: 20
  },
  textBottom: {
    fontFamily: 'Manrope',
    fontSize: 20,
    color: '#ffff'
  },
})