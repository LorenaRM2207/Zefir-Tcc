import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'




export default function TelaBuy() {

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

      <View style={{ flexDirection: 'row', marginTop: 120, alignItems: 'center', marginBottom: 10, marginLeft: 30, width: '50%', justifyContent: 'space-around' }}>
        <SimpleLineIcons name="handbag" size={30} color="black" />
        <Text style={styles.textTitle}>Produtos (2)</Text>
      </View>

      {/* Produto*/}
      <View style={styles.container}>
        <View style={styles.boxProduct}>
          <View style={styles.columnsRow}>
            {/* Imagem */}
            <Image
              source={require('../assets/Logo.png')}
              style={styles.image}
            />
            {/* Texto */}
            <View>
              <Text style={styles.textInformation3}>Sensor Zefir</Text>
              <Text style={styles.textInformation2}>R$: ---</Text>
            </View>
            {/* Icone2 */}
            <View style={styles.bottomAdd}>
              <TouchableOpacity>
                <AntDesign name="minus-circle" size={15} color="blue" />
              </TouchableOpacity>
              <Text style={styles.textNegrito}>2</Text>
              <TouchableOpacity>
                <AntDesign name="minus-circle" size={15} color="blue" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{ margin: 20, marginLeft: 30 }}>
        <Text style={styles.textTitle}>Formas de pagamento</Text>
        <Text style={styles.textInformation2}>Cadastradas</Text>
      </View>
      {/* Cartão 1*/}
      <View style={styles.container}>
        <View style={styles.boxCard}>
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
              <Feather name="circle" size={24} color="#6C7072" />
            </View>
          </View>
        </View>
      </View>
      {/* Cartão 2*/}
      <View style={styles.container}>
        <View style={styles.boxCard}>
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
              <AntDesign name="check-circle" size={24} color="#6C7072" />
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
      {/* Endereço 1*/}
      <View style={styles.container}>
        <View style={styles.boxProduct}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{marginRight: 25}}>
              <Text style={styles.textInformation3}>Endereço</Text>
              <Text style={styles.textInformation2}>Rua dos sensores N.44</Text>

              <Text style={styles.textInformation2}>Frete  7-14 dias </Text>
              <Text style={styles.textInformation2}>R$: ---</Text>

            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Valor Total</Text>
              <Text style={styles.textInformation2}>R$: ---</Text>
            </View>
            {/* Icone2 */}
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxBottom}
          onPress={() => navigation.navigate('TelaOrder')}
        >
          <Text style={styles.textBottons}>Comprar</Text>
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
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 20
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },
  boxProduct: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    height: 120,
    borderRadius: 20,
    margin: 10,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  textInformation: {
    fontTitle: 'Manrope',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },
  textInformation3: {
    fontTitle: 'ManropeBold',
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
  bottomAdd: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: 100,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5,
    margin:20
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },
  columnsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  boxCard: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '80%',
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    margin: 10,
    justifyContent: 'center',
  },
  //Bottom adicionar pagamento
  boxAdd: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 10
  },
  //Bottom finalizar
  textBottons: {
    fontFamily: 'ManropeBold',
    fontSize: 19,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },

  boxBottom: {
    backgroundColor: '#071739',
    width: '45%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    margin: 10
  },
})
