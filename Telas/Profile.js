import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather'



export default function Home() {

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
          <Text style={styles.textHeader}>Perfil</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('TelaConfiguration')}
          >
          <Ionicons name="settings-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Usuário */}
      <View style={styles.containerImage}>
        <Image
          source={require('../assets/Avatar.png')}
          style={styles.image}
        />
        <FontAwesome6 name="pen-to-square" size={24} color="black" />
      </View>
      <View style={styles.container}>
        <Text style={styles.textUser}>Zefir</Text>
        <Text style={styles.textEmail}>zefir.sensor@gmail.com</Text>
      </View>
      {/* Box Informações pessoais*/}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxRooms}
          onPress={() => navigation.navigate('Personal')}
        >
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View>
              <FontAwesome5 name="user" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textTitle}>Informações pessoais</Text>
              <Text style={styles.textEmail}>Nome, e-mail, telefone</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* Segurança e login*/}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxRooms}
          onPress={() => navigation.navigate('Security')}
        >
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View>
              <MaterialCommunityIcons name="cloud-lock-outline" size={35} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textTitle}>Segurança e login</Text>
              <Text style={styles.textEmail}>Dispositivos, senha</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* Box Carteira*/}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxRooms}
          onPress={() => navigation.navigate('Wallet')}
        >
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View>
              <MaterialIcons name="payment" size={35} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textTitle}>Carteira</Text>
              <Text style={styles.textEmail}>Transações e pagamento</Text>
            </View>
          </View>
        </TouchableOpacity>
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
  containerImage: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
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
    marginHorizontal: 90
  },
  imageHeader: {
    width: 50,
    height: 50,
  },
  //Caixas de informações
  boxRooms: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    height: 90,
    borderRadius: 30,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 10,
    margin: 10,
    justifyContent: 'center'
  },
  columnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingRight: 70
  },
  //User
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginTop: 50
  },
  textUser: {
    fontFamily: 'ManropeBold',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginTop: 20, 
  },
  textTitle: {
    fontTitle: 'Manrope',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },
  textEmail: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F'
  },

})
