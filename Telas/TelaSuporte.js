import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'
import AntDesign from '@expo/vector-icons/AntDesign'




export default function TelaSuporte() {

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
      <TouchableOpacity 
          style={{ marginTop: 50, marginBottom: 10, marginHorizontal: 20}}
          onPress={() => navigation.navigate('Principal')}
        >
          <AntDesign name="arrow-left" size={30} color="black" />
        </TouchableOpacity>
      <View style={styles.container}>
        <View>
        <Text style={styles.textTitle}>Há algo a relatar ou dúvidas?</Text>
        <Text style={styles.textInformation2}>Agradecemos pela compra!</Text>
      </View>
      </View>
      {/* E-mail*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 25, paddingLeft: 20 }}>
              <MaterialCommunityIcons name="email-outline" size={32} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>E-mail</Text>
              <Text style={styles.textInformation2}>email.suporte@gmail.com</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Telefone*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 23, paddingLeft: 20 }}>
              <Feather name="phone" size={32} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}> Telefone</Text>
              <Text style={styles.textInformation2}>(11) 91234-5678</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.textTitle}>Sobre nós</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.Card}>
          <Text style={styles.textInformation}> Na Zefir, acreditamos que segurança e bem-estar devem caminhar juntos. Somos uma empresa dedicada a desenvolver soluções inteligentes que protegem lares e empresas com praticidade e confiança.
            Nosso sensor Zefir detecta vazamentos de gás e fecha a válvula automaticamente, além de monitorar a qualidade do ar e a umidade. Com o App Zefir, você acompanha tudo em tempo real, recebendo alertas e relatórios direto no celular.
            Mais do que tecnologia, oferecemos tranquilidade e cuidado. A Zefir nasceu para ser sua parceira na missão de tornar ambientes mais seguros e saudáveis.</Text>
        </View>

      </View>
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
  textInformation: {
    fontTitle: 'Manrope',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    textAlign:'justify'
  },
  //Caixas de informações
  boxRooms: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    margin: 20,
    justifyContent: 'center',
  },
  columnsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  Card: {
    backgroundColor: 'rgba(164, 181, 196, 0.2)',
    width: '90%',
    height: 450,
    borderRadius: 30,
    margin: 20,
    alignItems: 'center',
    padding:20
  },
})
