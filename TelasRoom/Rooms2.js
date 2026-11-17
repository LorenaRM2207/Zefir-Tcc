import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase'
import { criarNotificacao } from '../components/ConfigNotification'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Entypo from '@expo/vector-icons/Entypo'
import Feather from '@expo/vector-icons/Feather'
import AntDesign from '@expo/vector-icons/AntDesign'

const LIMITE_GAS_PPM = 200
const MINUTOS_CONECTADO = 10

export default function Rooms2() {

  const navigation = useNavigation()
  const route = useRoute()
  const ambiente = route.params?.ambiente
  const [leitura, setLeitura] = useState(null)

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
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
  useEffect(() => {
    if (!dataLeitura) return
    const t = dataLeitura.getTime()
    if (gasAlto) {
      criarNotificacao('gas', 'Gás detectado',
        `Nível de gás acima do normal às ${horaLeitura}. Saia do local até estabilizar.`, `gas_${t}`)
    }
    if (!conectado) {
      criarNotificacao('conexao', 'Sensor desconectado',
        `O sensor está sem enviar dados desde ${horaLeitura}.`, `conexao_${t}`)
    }
  }, [gasAlto, conectado, dataLeitura?.getTime()])

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity
        style={{ marginTop: 50, marginBottom: 10, marginHorizontal: 20 }}
        onPress={() => navigation.navigate('Rooms')}
      >
        <AntDesign name="arrow-left" size={30} color="black" />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.logoBox}>
            <Text style={styles.textCozinha}>{ambiente?.nome_comodo || 'Ambiente'}</Text>
            <Image
              source={ambiente?.foto ? { uri: ambiente.foto } : require('../assets/presentation3.png')}
              style={styles.image}
            />
          </View>
        </View>
        {/* Box Sensor */}
        <View style={styles.container}>
          <View style={[styles.boxSensor, !gasAlto && { backgroundColor: '#DFF5E1' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <EvilIcons name={gasAlto ? 'exclamation' : 'check'} size={23} color={gasAlto ? 'red' : 'green'} />
              <Text style={styles.textSensor}>
                {!leitura ? ' Sem leituras ainda' : gasAlto ? ' Foi detectado gás no ambiente' : ' Nenhum gás detectado'}
              </Text>
            </View>
            <Text style={styles.textSensor2}>
              {!leitura
                ? 'Assim que o sensor enviar dados, eles aparecem aqui.'
                : gasAlto
                  ? `Nível de gás acima do normal às ${horaLeitura}. Mantenha o cuidado e saia do local até a situação se estabilizar.`
                  : `Última leitura às ${horaLeitura}. Tudo dentro do normal.`}
            </Text>
          </View>
        </View>
        {/* Box Sensor Configurações */}
        <View style={styles.container}>
          <View style={styles.boxSensor2}>
            <View style={styles.columnsRow}>

              {/* Coluna 1 */}
              <View style={{ alignItems: 'flex-start' }}>
                <View style={styles.alignConfigurations}>
                  <View style={[styles.boxConects, !conectado && { backgroundColor: '#D64545' }]}>
                    <Entypo name="link" size={20} color="black" />
                  </View>
                  <Text style={styles.text2Card1}>{conectado ? ' Conectado' : ' Desconectado'}</Text>
                </View>

                <View style={styles.alignConfigurations}>
                  <View style={[styles.boxConects, gasAlto && { backgroundColor: '#D64545' }]}>
                    <Feather name="lock" size={20} color="black" />
                  </View>
                  <Text style={styles.text2Card1}>{gasAlto ? ' Alerta' : ' Seguro'}</Text>
                </View>

                <View style={styles.alignConfigurations}>
                  <View style={styles.boxConects2}>
                    <Feather name="droplet" size={20} color="black" />
                  </View>
                  <Text style={styles.text2Card1}>{leitura ? ` ${Math.round(leitura.umidade)}%` : ' --'}</Text>
                </View>
              </View>

              {/* Coluna 2 */}
              <View style={{ alignItems: 'flex-start' }}>
                <View style={styles.alignConfigurations}>
                  <View style={styles.boxConects}>
                    <Feather name="battery" size={20} color="black" />
                  </View>
                  <Text style={styles.text2Card1}>{leitura?.bateria != null ? ` ${leitura.bateria}%` : ' --'}</Text>
                </View>

                <View style={styles.alignConfigurations}>
                  <View style={styles.boxConects2}>
                    <Feather name="wind" size={20} color="black" />
                  </View>
                  <Text style={styles.text2Card1}>{leitura ? ` ${Math.round(leitura.ppm_gas)} ppm` : ' --'}</Text>
                </View>

                <View style={{ width: '110%' }}>
                  <View style={[styles.boxConects3, { width: '78%' }]}>
                    <Feather name="power" size={20} color="#D64545" />
                    <Text style={[styles.textConfiguration, { fontSize: 15, textAlign: 'center' }]}> Desligar sensor</Text>
                  </View>
                </View>
              </View>

            </View>
          </View>
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    alignItems: 'center',

  },
  boxSensor: {
    backgroundColor: '#FFEAD0',
    width: '90%',
    minHeight: 110,
    borderRadius: 15,
    margin: 10,
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
    minHeight: 150,
    borderRadius: 15,
    margin: 20,
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
    width: '90%',
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
  text2Card1: {
    fontFamily: 'Manrope',
    fontSize: 15,
    letterSpacing: 1,
    lineHeight: 20,
  },
})
