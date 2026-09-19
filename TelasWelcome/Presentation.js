import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

export default function Presentation() {

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
      {/* imagem do fundo */}
      <ImageBackground
        source={require('../assets/fundo.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <Image
            source={require('../assets/Logo.png')}
            style={styles.image}
          />
        </View>

        {/* Texto inferior  */}
        <View style={styles.card1}>
          <View stle={{ margin: 20 }}>
            <Text style={styles.textCard1}>Proteja seu ambiente</Text>
            <Text style={styles.text2Card1}>Garanta a qualidade do ar do seu ambiente e previna acidentes relacionados a gás, fumaça e outros riscos em espaços domésticos</Text>
          </View>
          {/* Botão começar */}
          <View>
            <TouchableOpacity
              style={styles.bottom}
              onPress={() => navigation.navigate('Presentation2')}
            >
              <Text style={styles.textBottom}> Começar </Text>
              <FontAwesome6 name="arrow-right-long" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>


  )
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  screen: {
    flex: 1,
    backgroundColor: '#fffcf3',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
    margin: 10
  },
  card1: {
    backgroundColor: "#FFFFFF",
    width: '100%',
    height: '30%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
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