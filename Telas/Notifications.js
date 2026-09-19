import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Entypo from '@expo/vector-icons/Entypo'
import Feather from '@expo/vector-icons/Feather'


export default function Notifications() {

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
      {/* Cabeçalho*/}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TelaSuporte')}
          >
          <Feather name="message-square" size={35} color="black" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Notificação</Text>
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

      {/* Box Notification - Vazamento de gás */}
      <View style={styles.container}>
        <View style={styles.boxNotification}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <EvilIcons name="exclamation" size={35} color="red" />
            <Text style={styles.textNotification}> Houve um vazamento de gás</Text>
          </View>
          <View>
            <Text style={styles.text2Notification}>Mas não se preocupe ele já foi contido</Text>
          </View>
          <TouchableOpacity
            style={styles.bottom}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.text3Notification}> Ver mais </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Box Notification - Umidade do ar */}
      <View style={styles.container}>
        <View style={styles.box2Notification}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <EvilIcons name="exclamation" size={35} color="#463f3f" />
            <Text style={styles.textNotification}> Ligue seu umidificador </Text>
          </View>
          <View>
            <Text style={styles.text2Notification}>O ar pode estar um pouco seco, a porcentagem ideal é de 50% a 60% </Text>
          </View>
          <TouchableOpacity
            style={styles.bottom}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.text3Notification}> Ver mais </Text>
          </TouchableOpacity>
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
    lineHeight: 20,
    color: '#0F0F0F',
    marginHorizontal: 60
  },
  imageHeader: {
    width: 50,
    height: 50,
  },
  //Style Box Notification - Umidade do ar
  box2Notification: {
    backgroundColor: '#D9D9D9',
    width: '90%',
    height: 150,
    borderRadius: 15,
    margin: 10,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //Style Box Notification - Vazamento de gás
  boxNotification: {
    backgroundColor: '#FFEAD0',
    width: '90%',
    height: 150,
    borderRadius: 15,
    margin: 10,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
  },
  textNotification: {
    fontFamily: 'ManropeBold',
    fontSize: 21,
    letterSpacing: 1,
    lineHeight: 20,
  },
  text2Notification: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    textAlign: 'center'

  },
  text3Notification: {
    fontFamily: 'Manrope',
    fontSize: 18,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },
  bottom: {
    backgroundColor: "#071739",
    borderRadius: 20,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

})
