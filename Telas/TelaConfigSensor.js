import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'



export default function TelaConfigSensor() {

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
      {/* Cabeçalho*/}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TelaSuporte')}
          >
            <Feather name="message-square" size={35} color="black" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Notificação</Text>
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
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flexDirection: 'row', marginTop: 120, alignItems: 'center', marginBottom: 10 }}
          onPress={() => navigation.navigate('TelaConfiguration')}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
          <Text style={styles.textTitle}>Alertas e notificações</Text>
        </TouchableOpacity>
      </View>
      {/* Alertas*/}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxRooms}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 30, paddingLeft: 20 }}>
              <Ionicons name="notifications-outline" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Alerta local</Text>
              <Text style={styles.textInformation2}>Ativado</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* Sensibilidade*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 30, paddingLeft: 20 }}>
              <Ionicons name="eye-outline" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Nível de sensibilidade</Text>
              <Text style={styles.textInformation2}>Médio</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Valvula*/}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxRooms}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 30, paddingLeft: 20 }}>
              <Ionicons name="hardware-chip-sharp" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Vínculo com a válvula </Text>
              <Text style={styles.textInformation2}>Desativado</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* Diagnóstico*/}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxRooms}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 30, paddingLeft: 20 }}>
              <MaterialIcons name="sensors" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Autoteste e Diagnóstico</Text>
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
    backgroundColor: '#F6F6F6',
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
  imageHeader: {
    width: 50,
    height: 50,
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
