import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default function PoliticaDePrivacidade() {

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
          style={styles.header}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
          <Text style={styles.textTitle}>Política De Privaciade </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
      <View style={[styles.container,{ paddingHorizontal:20}]}>
        <Text style={styles.textInformation}>ll</Text>
        <Text style={styles.textInformation2}>ll</Text>
      </View>
      </ScrollView>

    </View>
  )
}
const styles = StyleSheet.create({
  //Geral
  screen: {
    flex: 1,
    backgroundColor: 'rgba(164, 181, 196, 0.37)',
  },
  //alinhamento
  container: {
    alignItems: 'center',
  },
  //Cabeçalho
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    width: '100%',
    height: 90,
    justifyContent: 'flex-start',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 15,
  },
  textInformation: {
    fontFamily: 'ManropeBold',
    fontSize: 19,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginVertical: 5,
    alignSelf: 'flex-start'
  },
  textInformation2: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginVertical: 5
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },

})
