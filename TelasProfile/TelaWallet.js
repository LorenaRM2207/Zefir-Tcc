import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'



export default function Wallet() {

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
          onPress={() => navigation.navigate('Principal')}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
          <Text style={styles.textTitle}>Carteira</Text>
        </TouchableOpacity>
      </View>
      <View style={{ margin: 20, marginLeft: 30 }}>
        <Text style={styles.textTitle}>Formar de pagamento</Text>
        <Text style={styles.textInformation2}>Cadastradas</Text>
      </View>
      {/* Cartão 1*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 30, paddingLeft: 20 }}>
              <MaterialIcons name="payment" size={35} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Cartão de crédito</Text>
              <Text style={styles.textInformation2}>Visa  **** 1234</Text>
            </View>
            {/* Icone2 */}
            <View style={{ paddingRight: 20, paddingLeft: 60 }}>
              <AntDesign name="minus-circle" size={24} color="red" />
            </View>
          </View>
        </View>
      </View>
      {/* Cartão 2*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 25, paddingLeft: 20 }}>
              <MaterialIcons name="payment" size={35} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Cartão de débito</Text>
              <Text style={styles.textInformation2}>Mastercard  **** 4321</Text>
            </View>
            {/* Icone2 */}
            <View style={{ paddingRight: 20, paddingLeft: 50 }}>
              <AntDesign name="minus-circle" size={24} color="red" />
            </View>
          </View>
        </View>
      </View>
      {/* Add forma de pagamento*/}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxAdd}
          onPress={() => navigation.navigate('TelaAddCard')}
        >
          <Ionicons name="add-circle-outline" size={25} color="#A4B5C4" />
          <Text style={styles.textInformation2}>Adicionar forma de pagamento</Text>
        </TouchableOpacity>
      </View>

      <View style={{ margin: 20, marginLeft: 30 }}>
        <Text style={styles.textTitle}>Seus Dispositivos</Text>
        <Text style={styles.textInformation2}>Conectados</Text>
      </View>
      {/* Ultimas compras*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 25, paddingLeft: 20 }}>
              <Ionicons name="wallet-outline" size={35} color="#6C7072" />
            </View>
            {/* Texto */}
            <View style={{ paddingRight: 33 }}>
              <Text style={styles.textInformation}>Cartão de débito</Text>
              <Text style={styles.textInformation2}>Sensor Zefir, R$------</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Ultimas compras*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 23, paddingLeft: 20 }}>
              <Ionicons name="wallet-outline" size={35} color="#6C7072" />
            </View>
            {/* Texto */}
            <View style={{ paddingRight: 70 }}>
              <Text style={styles.textInformation}> Cartão de débito</Text>
              <Text style={styles.textInformation2}>Sensor Zefir, R$------</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flexDirection: 'row', margin: 20, alignItems: 'center' }}
        >
          <MaterialCommunityIcons name="location-exit" size={27} color="red" />
          <Text style={styles.textInformation3}>Desconectar todos</Text>
        </TouchableOpacity>
      </View>
      {/* Bottom Add */}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.bottomAdd}
          onPress={() => navigation.navigate('TelaOrder')}
        >
          <Text style={styles.textBottons}>Ver compras</Text>
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
    color: '#0F0F0F',
    marginTop: 5
  },
  textInformation3: {
    fontFamily: 'ManropeBold',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginLeft: 10
  },
  //Bottom adicionar pagamento
  boxAdd: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 10
  },
  textBottons: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },
  //
  bottomAdd: {
    backgroundColor: '#071739',
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    margin: 10
  },
})
