import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones



export default function NewRoom() {

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
        <View style={styles.boxAddRoom}>
          <Text style={styles.textRooms}>Adicionar ambiente</Text>
        </View>
      </View>
      <Text style={styles.textTitle}>Nome</Text>
      <View style={styles.container}>
        <View style={styles.boxAddNome}>
        <View style={styles.textInputNome}>
          <TextInput
            style={{ fontSize: 17, fontFamily: 'Manrope' }}
            placeholder='Pesquisar ambiente'
            placeholderTextColor="#6C757D"
          />
        </View>
      </View>
      </View>
      <Text style={styles.textTitle}>Foto</Text>
      <View style={styles.container}>
        <View style={styles.boxFoto}>
          <View style={styles.boxFoto2}>

          </View>
          <TouchableOpacity
            style={styles.bottonSelect}
          >
            <Text style={styles.textBottons}>Selecionar imagem</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.bottomAdd}
          onPress={() => navigation.navigate('Rooms')}
        >
          <Text style={styles.textBottons}>Ver compars </Text>
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
  boxAddRoom: {
    backgroundColor: 'rgba(217, 217, 217, 0.44)',
    width: '90%',
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 150,
    marginBottom: 20
  },
  textRooms: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: 'black'
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 20,
    color: 'black', 
    marginLeft: 50
  },
  //Box Add Nome
  boxAddNome: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    height: 90,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin:10
  },
  textInputNome: {
    backgroundColor: 'white',
    borderRadius: 50,
    width: '90%',
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50
  },
  // Box Add Foto 
  boxFoto: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    height: 330,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin:10
  },
  boxFoto2:{
    backgroundColor: '#FFFFFF',
    width: '90%',
    height: 210,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20, 
  },
  bottonSelect:{
    backgroundColor: 'rrgb(164, 181, 196)', 
    width: '50%', 
    height: 50, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 30,
  },
  textBottons: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: 'white'
  },
  //
  bottomAdd:{
    backgroundColor: '#071739', 
    width: '40%', 
    height: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 30,
    margin:10
  },
})
