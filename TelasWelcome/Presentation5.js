import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//fonte de aplicativo
import { useFonts } from 'expo-font';
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Presentation5() {

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  if (!fontsLoaded) {
    return null;
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
        <View style={styles.Align}>
          <Text style={styles.textCard1}>Sinta a Tranquilidade </Text>
          <View style={styles.box1}>
            <Text style={styles.textBox1}> Agora é só aproveitar a tranquilidade de ter o Zefir cuidando do seu ambiente.</Text>
          </View>
          <View style={styles.container}>
            <Image
              source={require('../assets/Logo.png')}
              style={styles.image}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.bottom}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.textBottom}> Ir para o app</Text>
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
    flexDirection: 'column'
  },
  Align: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 180,
    height: 180,
    margin: 10,
    margin: 60,
  },
  box1: {
    backgroundColor: '#4B6382',
    width: '90%',
    height: 80,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: "center",
    padding: 10,
    margin: 25
  },
  textBox1: {
    fontFamily: 'Manrope',
    fontSize: 15,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },

  bottom: {
    backgroundColor: "#071739",
    borderRadius: 20,
    width: 190,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    flexDirection: 'row',
    paddingHorizontal: 20
  },
  textBottom: {
    fontFamily: 'Manrope',
    fontSize: 20,
    color: '#ffff'
  },
  textCard1: {
    fontFamily: 'ManropeBold',
    fontSize: 30,
  },
})