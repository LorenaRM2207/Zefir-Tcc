import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icone
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'


export default function Rooms() {

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
    //View geral
    <View style={styles.screen}>
      {/* Cabeçalho*/}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Principal')}
          >
          <Ionicons name="home-sharp" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Ambientes</Text>
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
      {/* Box Search*/}
      <View style={styles.container}>
        <View style={styles.boxSearch}>
          <View style={styles.textInputSearch}>
            <Feather name="search" size={24} color="black" />
            <TextInput
              style={{ fontSize: 17, fontFamily: 'Manrope' }}
              placeholder='Pesquisar ambiente'
              placeholderTextColor="#6C757D"
            />
          </View>
        </View>
      </View>
      {/* Box Room 1 */}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxRooms}
          onPress={() => navigation.navigate('Rooms2')}
        >
          <Image
            source={require('../assets/presentation3.png')}
            style={styles.image}
          />
          <Text style={styles.textRooms}>Cozinha da hamburgueria</Text>
        </TouchableOpacity>
      </View>
      {/* Box Room 2 */}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxRooms}
          onPress={() => navigation.navigate('Rooms3')}
        >
          <Image
            source={require('../assets/Cozinha.png')}
            style={styles.image}
          />
          <Text style={styles.textRooms}>Cozinha da familia Zefir</Text>
        </TouchableOpacity>
      </View>
      {/* Box adicionar ambiente */}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.boxAdd}
          onPress={() => navigation.navigate('NewRoom')}
        >
          <Ionicons name="add-circle-outline" size={25} color="#A4B5C4" />
          <Text style={styles.textAdd}>Adicionar ambiente</Text>
        </TouchableOpacity>
      </View>



    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  //Cabeçalho
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'center',
    marginTop: 50, 
    paddingHorizontal: 10,
    marginBottom: 20
  },
  textHeader: {
    fontFamily: 'ManropeBold',
    fontSize: 30,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginHorizontal: 50
  },
  imageHeader: {
    width: 50,
    height: 50,
  },
  //Box Search
  boxSearch: {
    backgroundColor: 'rgba(217, 217, 217, 0.44)',
    width: '90%',
    height: 110,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  textInputSearch: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 50,
    width: '85%',
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50

  },
  //Box Rooms
  boxRooms: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    height: 90,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10
  },
  textRooms: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: 'black'
  },
  image: {
    width: 90,
    height: 60,
    borderRadius: 10,
  },
  //Box Add
  boxAdd: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 10
  },
  textAdd: {
    fontFamily: 'Manrope',
    fontSize: 17,
    color: '#0F0F0F'
  }
})
