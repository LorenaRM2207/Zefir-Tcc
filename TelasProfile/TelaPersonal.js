import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Ionicons from '@expo/vector-icons/Ionicons'



export default function Personal() {

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
          style={{flexDirection: 'row', marginTop: 120, alignItems: 'center', marginBottom: 10}}
          onPress={() => navigation.navigate('Principal')}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
          <Text style={styles.textTitle}>Informações pessoais</Text>
        </TouchableOpacity>
      </View>
      {/* Nome*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{paddingRight:30, paddingLeft:20}}>
              <FontAwesome5 name="user" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Nome</Text>
              <Text style={styles.textInformation2}>Zefir</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Gênero*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{paddingRight:20, paddingLeft:10}}>
              <EvilIcons name="user" size={45} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Gênero</Text>
              <Text style={styles.textInformation2}>Feminino</Text>
            </View>
          </View>
        </View>
      </View>
      {/* E-mail*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{paddingRight:25, paddingLeft:20}}>
              <MaterialCommunityIcons name="email-outline" size={32} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>E-mail</Text>
              <Text style={styles.textInformation2}>zefir.sensor@gmail.com</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Telefone*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{paddingRight:23, paddingLeft:20}}>
              <Feather name="phone" size={32} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}> Telefone</Text>
              <Text style={styles.textInformation2}>(11) 94444-4444</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Endereço*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{paddingRight:25, paddingLeft:12}}>
              <EvilIcons name="location" size={45} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Endereço</Text>
              <Text style={styles.textInformation2}>Rua dos sensores N. 44</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Data de nascimento*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{paddingRight:30, paddingLeft:20}}>
              <FontAwesome6 name="face-smile" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Data de nascimento</Text>
              <Text style={styles.textInformation2}>1 de janeiro de 2000</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Idioma*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{paddingRight:30, paddingLeft:20}}>
              <Ionicons name="earth-outline" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Idioma</Text>
              <Text style={styles.textInformation2}>Português (Brasil)</Text>
            </View>
          </View>
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
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F', 
  },
  //Caixas de informações
  boxRooms: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    margin: 10,
    justifyContent: 'center', 

  },
  columnsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems:'center'
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
})
