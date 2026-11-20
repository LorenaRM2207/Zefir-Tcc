import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Entypo from '@expo/vector-icons/Entypo'
import Feather from '@expo/vector-icons/Feather'
import AvatarPerfil from '../components/AvatarPerfil'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const LIMITE_GAS_PPM = 200
const MINUTOS_CONECTADO = 10

export default function Home() {

  //Tela sem conexão/sensor conectado
  const [modoAtivo, setModoAtivo] = useState(true)
  const [leitura, setLeitura] = useState(null)
  const navigation = useNavigation()

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  function alternarFuncao() {
    setModoAtivo(!modoAtivo)
  }
  useEffect(() => {
    const q = query(collection(db, 'Leitura_sensor'), orderBy('data_hora', 'desc'), limit(1))
    const cancelar = onSnapshot(
      q,
      (snapshot) => {
        setLeitura(snapshot.docs.length > 0 ? snapshot.docs[0].data() : null)
      },
      (erro) => console.error('Erro ao ler sensor: ', erro)
    )
    return cancelar
  }, [])
  const dataLeitura = leitura?.data_hora?.toDate ? leitura.data_hora.toDate() : null
  const conectado = !!dataLeitura && (Date.now() - dataLeitura.getTime()) / 60000 <= MINUTOS_CONECTADO
  const gasAlto = !!leitura && Number(leitura.ppm_gas) > LIMITE_GAS_PPM
  const horaLeitura = dataLeitura
    ? `${String(dataLeitura.getHours()).padStart(2, '0')}:${String(dataLeitura.getMinutes()).padStart(2, '0')}`
    : ''

  if (!fontsLoaded) {
    return null
  }

  return (

    //View principal
    <View style={styles.screen}>


      {/* Cabeçalho*/}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TelaSuporte')}
          >
            <MaterialIcons name="support-agent" size={45} color="black" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Home</Text>
          <AvatarPerfil />
        </View>

      </View>
      {modoAtivo ? (
        <>
          <ScrollView>
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Image
                  source={require('../assets/Logo.png')}
                  style={styles.image}
                />
                <TouchableOpacity
                  onPress={alternarFuncao}
                  style={styles.boxSensor}
                >
                  <Text style={styles.textSensor}> Conectar Sensor</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Box Sensor Configurações */}
            <View style={styles.container}>
              <View style={[styles.boxSensor2, { height: 120, justifyContent: 'center' }]}>
                <Text style={[styles.text2Notification, { fontFamily: 'ManropeBold' }]}>Ainda não possui um sensor? </Text>
                <Text style={styles.text2Notification}>Compre um novo agora para aproveitar de todas as funcionalidades do nosso aplicativo,.</Text>
              </View>
              <Text style={[styles.textNotification, { fontSize: 25, color: '#071739', marginTop: 15 }]}> Zefir </Text>
              <Text style={[styles.text2Notification, { fontSize: 19 }]}>Detectando riscos, Protegendo vidas</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('TelaBuy')}
                style={[styles.bottom2, { marginTop: 15 }]}
              >
                <Text style={[styles.text3Notification, { fontFamily: 'Manrope' }]}> Compre já! </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </>
      ) : (
        <>
          {/* Cabeçalho*/}
          <ScrollView>
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

                  {/* Coluna 1 */}
                  <View style={{ alignItems: 'flex-start' }}>
                    <View style={styles.alignConfigurations}>
                      <View style={[styles.boxConects4, !conectado && { backgroundColor: '#D64545' }]}>
                        <Entypo name="link" size={22} color="black" />
                      </View>
                      <Text style={styles.text2Notification}>{conectado ? ' Conectado' : ' Desconectado'}</Text>
                    </View>

                    <View style={styles.alignConfigurations}>
                      <View style={[styles.boxConects4, gasAlto && { backgroundColor: '#D64545' }]}>
                        <Feather name="lock" size={22} color="black" />
                      </View>
                      <Text style={styles.text2Notification}>{gasAlto ? ' Alerta' : ' Seguro'}</Text>
                    </View>


                  </View>

                  {/* Coluna 2 */}
                  <View style={{ alignItems: 'flex-start' }}>
                    <View style={styles.alignConfigurations}>
                      <View style={styles.boxConects5}>
                        <Feather name="droplet" size={22} color="black" />
                      </View>
                      <Text style={styles.text2Notification}>{leitura ? ` ${Math.round(leitura.umidade)}%` : ' --'}</Text>
                    </View>
                    <View style={styles.alignConfigurations}>
                      <View style={styles.boxConects5}>
                        <Feather name="wind" size={22} color="black" />
                      </View>
                      <Text style={styles.text2Notification}>{leitura ? ` ${Math.round(leitura.ppm_gas)} ppm` : ' --'}</Text>
                    </View>
                  </View>

                </View>
              </View>
            </View>
            {/* Box Notification - Umidade do ar */}
            <View style={styles.container}>
              <View style={styles.box2Notification}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <EvilIcons name="exclamation" size={35} color="#463f3f" />
                  <Text style={styles.textNotification}> Pedido Feito</Text>
                </View>
                <View>
                  <Text style={styles.text2Notification}>Sua ultima compra foi realizada com sucesso </Text>
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
    lineHeight: 36,
    color: '#0F0F0F',
    marginHorizontal: 90
  },
  //Sensor desconctado
  logoBox: {
    alignItems: 'center',
    alignSelf: 'center',
    padding: 15,
    width: '85%',
    height: 200,
    backgroundColor: "#A4B5C4",
    borderRadius: 20,
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
    width: 140,
    height: 140,
    margin: 10
  },
  boxSensor: {
    backgroundColor: '#071739',
    width: '110%',
    height: 70,
    borderRadius: 20,
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
    width: '85%',
    height: 70,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    opacity: 0.9,
    justifyContent: 'center'
  },

  //Style Box Configurações sensor
  boxSensor2: {
    backgroundColor: '#D9D9D9',
    width: '85%',
    height: 130,
    borderRadius: 20,
    margin: 10,
    padding: 10,
    alignItems: 'stretch',
  },
  boxConects: {
    backgroundColor: '#D64545',
    width: 35,
    height: 35,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxConects3: {
    backgroundColor: '#A4B5C4',
    width: '75%',
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
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
    width: '85%',
    height: 250,
    borderRadius: 20,
  },
  boxBottom: {
    backgroundColor: 'rgba(39, 32, 32, 0.89)',
    width: '85%',
    height: 70,
    borderRadius: 20,
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
    backgroundColor: '#71cf77',
    width: 35,
    height: 35,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxConects5: {
    backgroundColor: 'rgba(255, 230, 119, 0.96)',
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
    backgroundColor: 'rgba(82, 130, 189, 0.53)',
    width: '85%',
    height: 150,
    borderRadius: 20,
    margin: 10,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //Style Box Notification - Vazamento de gás
  textNotification: {
    fontFamily: 'ManropeBold',
    fontSize: 19,
    letterSpacing: 1,
    textAlign: 'center'
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
    width: 125,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
})
