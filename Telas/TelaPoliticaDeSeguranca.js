import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AntDesign from '@expo/vector-icons/AntDesign'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default function TelaPoliticaDeSeguranca() {

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
        <TouchableOpacity
          style={{ flexDirection: 'row', marginTop: 120, alignItems: 'center', marginBottom: 10 }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
          <Text style={styles.textTitle}>Termos e Politícas</Text>
        </TouchableOpacity>
      </View>
      {/* Termos de uso*/}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TermosDeUso')}
          style={styles.boxRooms}
        >
          <View style={styles.columnsRow}>
            <View style={{ paddingRight: 15, paddingLeft: 18 }}>
              <FontAwesome name="book" size={30} color="#6C7072" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.textInformation}>Termos De Uso</Text>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <MaterialIcons name="keyboard-arrow-right" size={30} color="#6C7072" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* Politíca de privacidade*/}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PoliticaDePrivacidade')}
          style={styles.boxRooms}
        >
          <View style={styles.columnsRow}>
            <View style={{ paddingRight: 17, paddingLeft: 20 }}>
              <FontAwesome name="file" size={24} color="#6C7072" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.textInformation}>Política de Privacidade</Text>
            </View>
            <View style={{ paddingHorizontal: 20 }} >
              <MaterialIcons name="keyboard-arrow-right" size={30} color="#6C7072" />
            </View>
          </View>
        </TouchableOpacity >
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
  //Caixas de informações
  boxRooms: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '85%',
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    margin: 10,
    justifyContent: 'center',

  },
  columnsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  textInformation: {
    fontTitle: 'Manrope',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },
  textInformation2: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F'
  },
  textInformation3: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'red'
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },

})
