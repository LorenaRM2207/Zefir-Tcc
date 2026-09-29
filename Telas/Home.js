import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Entypo from '@expo/vector-icons/Entypo'
import Feather from '@expo/vector-icons/Feather'



export default function Home() {

  //Tela sem conexão/sensor conectado
  const [modoAtivo, setModoAtivo] = useState(true)
  function alternarFuncao() {
    setModoAtivo(!modoAtivo)
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
  const navigation = useNavigation()
  return (

    //View principal
    <View style={styles.screen}>
      {modoAtivo ? (
        <>
        {/* Cabeçalho*/}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TelaSuporte')}
          >
          <Feather name="message-square" size={35} color="black" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Home</Text>
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
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Image
                source={require('../assets/Logo.png')}
                style={styles.image}
              />
              <View style={styles.boxSensor}>
                <TouchableOpacity
                  onPress={alternarFuncao}
                >
                  <Text style={styles.textSensor}> Conectar Sensor</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* Box Sensor Configurações */}
          <View style={styles.configurationContainer}>
            <View style={styles.boxSensor2}>
              <View style={styles.columnsRow}>

                {/* Box Sensor Configurações - Coluna 1 */}
                <View style={{ alignItems: 'flex-start' }}>
                  <View style={styles.alignConfigurations}>
                    <View style={styles.boxConects}>
                      <Entypo name="link" size={27} color="black" />
                    </View>
                    <Text style={styles.textConfiguration}> Desconectado</Text>
                  </View>
                  <View style={styles.alignConfigurations}>
                    <View style={styles.boxConects}>
                      <Feather name="lock" size={25} color="black" />
                    </View>
                    <Text style={styles.textConfiguration}> - </Text>
                  </View>
                  <View style={styles.alignConfigurations}>
                    <View style={styles.boxConects}>
                      <Feather name="droplet" size={25} color="black" />
                    </View>
                    <Text style={styles.textConfiguration}> - </Text>
                  </View>
                </View>

                {/* Box Sensor Configurações - Coluna 2 */}
                <View style={{ alignItems: 'flex-start' }}>
                  <View style={styles.alignConfigurations}>
                    <View style={styles.boxConects}>
                      <Feather name="battery" size={25} color="black" />
                    </View>
                    <Text style={styles.textConfiguration}> - </Text>
                  </View>
                  <View style={styles.alignConfigurations}>
                    <View style={styles.boxConects}>
                      <Feather name="wind" size={25} color="black" />
                    </View>
                    <Text style={styles.textConfiguration}> - </Text>
                  </View>
                  <View style={styles.boxConects3}>
                    <Feather name="power" size={20} color="#D64545" />
                    <Text style={styles.textConfiguration}> Desligar sensor</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

        </>
      ) : (
        <>
          {/* Cabeçalho*/}
      <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TelaSuporte')}
          >
          <Feather name="message-square" size={35} color="black" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Home</Text>
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
          <View style={styles.container2}>
            <Image
                source={require('../assets/presentation3.png')}
                style={styles.image2}
              />
              <View style={styles.boxBottom}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Rooms')}
                >
                  <Text style={styles.textRooms}> Verificar ambientes</Text>
                </TouchableOpacity>
              </View>
          </View>
          {/* Bottom compra sensor */}
          <View style={styles.container}>
            <TouchableOpacity
             style={styles.bottomBuy}
             onPress={() => navigation.navigate('TelaBuy')}
            >
              <Text style={styles.textRooms}>Compre um novo sensor</Text>
            </TouchableOpacity>
          </View>
          {/* Box Sensor Configurações */}
          <View style={styles.container}>
            <View style={styles.boxSensor2}>
              <View style={styles.columnsRow}>

                {/* Box Sensor Configurações - Coluna 1 */}
                <View style={{ alignItems: 'flex-start' }}>
                  <View style={styles.alignConfigurations}>
                    <View style={styles.boxConects4}>
                      <Entypo name="link" size={27} color="black" />
                    </View>
                    <Text style={styles.textConfiguration}> Conectado</Text>
                  </View>
                  <View style={styles.alignConfigurations}>
                    <View style={styles.boxConects4}>
                      <Feather name="lock" size={25} color="black" />
                    </View>
                    <Text style={styles.textConfiguration}> Seguro </Text>
                  </View>
                  <View style={styles.alignConfigurations}>
                    <View style={styles.boxConects5}>
                      <Feather name="droplet" size={25} color="black" />
                    </View>
                    <Text style={styles.textConfiguration}> 40% </Text>
                  </View>
                </View>

                {/* Box Sensor Configurações - Coluna 2 */}
                <View style={{ alignItems: 'flex-start' }}>
                  <View style={styles.alignConfigurations}>
                    <View style={styles.boxConects4}>
                      <Feather name="battery" size={25} color="black" />
                    </View>
                    <Text style={styles.textConfiguration}> 95% </Text>
                  </View>
                  <View style={styles.alignConfigurations}>
                    <View style={styles.boxConects5}>
                      <Feather name="wind" size={25} color="black" />
                    </View>
                    <Text style={styles.textConfiguration}> 2% </Text>
                  </View>
                  <View style={styles.boxConects3}>
                    <Feather name="power" size={20} color="#D64545" />
                    <Text style={styles.textConfiguration}> Desligar sensor</Text>
                  </View>
                </View>
              </View>
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
                style={styles.bottom2}
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
                style={styles.bottom2}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Text style={styles.text3Notification}> Ver mais </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ height: 100 }} />
          </ScrollView>
        </>
      )}
    </View>

  )
}

const styles = StyleSheet.create({

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
    marginHorizontal: 90
  },
  imageHeader: {
    width: 50,
    height: 50,
  },
  
  //Sensor desconctado
  logoBox: {
    alignItems: 'center',
    alignSelf: 'center',
    padding: 15,
    width: '85%',
    height: 200,
    backgroundColor: "#A4B5C4",
    borderRadius: 15,
  },
  logoContainer: {
    alignItems: 'center',
    margin: 10,
    marginBottom: 90
  },
  configurationContainer: {
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    margin: 10
  },
  boxSensor: {
    backgroundColor: '#071739',
    width: '110%',
    height: 70,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    opacity: 0.9,
    justifyContent: 'center'
  },
  textSensor: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },
  bottomBuy: {
    backgroundColor: '#071739',
    width: '90%',
    height: 70,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    opacity: 0.9,
    justifyContent: 'center'
  },

  //Style Box Configurações sensor
  boxSensor2: {
    backgroundColor: '#D9D9D9',
    width: '90%',
    height: 170,
    borderRadius: 15,
    margin: 10,
    padding: 10,
    alignItems: 'stretch',
  },
  boxConects: {
    backgroundColor: 'red',
    width: 35,
    height: 35,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
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
  bottom: {
    backgroundColor: "#071739",
    borderRadius: 20,
    width: '90%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    position: 'absolute'
  },





  //Geral
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  //alinhamento
  container: {
    alignItems: 'center',
    marginTop: 10
  },
  container2: {
    alignItems: 'center',
    margin: 10, 
    position: 'relative',
  },
  //Ambientes
  image2: {
    width: '90%',
    height: 250,
    borderRadius: 10,
  },
  boxBottom: {
    backgroundColor: 'rgba(39, 32, 32, 0.64)',
    width: '90%',
    height: 70,
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0
  },
  textRooms: {
    fontFamily: 'Manrope',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },
  //Style Box Configurações sensor
  boxConects4: {
    backgroundColor: '#1FC72A',
    width: 35,
    height: 35,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxConects5: {
    backgroundColor: '#FFD726',
    width: 35,
    height: 35,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textConfiguration: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
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
  bottom2: {
    backgroundColor: "#071739",
    borderRadius: 20,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
})
