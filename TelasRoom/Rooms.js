import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { useState, useEffect } from 'react'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icone
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'


export default function Rooms() {

  const navigation = useNavigation()
  const [ambientes, setAmbientes] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  useEffect(() => {
    let cancelarLeitura = null

    const cancelarAuth = onAuthStateChanged(auth, (usuario) => {
      if (cancelarLeitura) cancelarLeitura()

      if (!usuario) {
        setAmbientes([])
        setCarregando(false)
        return
      }

      const q = query(collection(db, 'Ambiente'), where('uid', '==', usuario.uid))
      cancelarLeitura = onSnapshot(
        q,
        (snapshot) => {
          const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          lista.sort((a, b) => (a.criado_em?.seconds || 0) - (b.criado_em?.seconds || 0))
          setAmbientes(lista)
          setCarregando(false)
        },
        (erro) => {
          console.error('Erro ao ler ambientes: ', erro)
          setCarregando(false)
        }
      )
    })

    return () => {
      cancelarAuth()
      if (cancelarLeitura) cancelarLeitura()
    }
  }, [])
  const ambientesFiltrados = ambientes.filter((a) =>
    (a.nome_comodo || '').toLowerCase().includes(busca.trim().toLowerCase())
  )

  if (!fontsLoaded) {
    return null
  }
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
      <ScrollView>
        {/* Box Search*/}
        <View style={styles.container}>
          <View style={styles.boxSearch}>
            <View style={styles.textInputSearch}>
              <Feather name="search" size={24} color="black" />
              <TextInput
                style={{ fontSize: 17, fontFamily: 'Manrope' }}
                placeholder='Pesquisar ambiente'
                placeholderTextColor="#6C757D"
                value={busca}
                onChangeText={setBusca}
              />
            </View>
          </View>
        </View>
        {carregando ? (
          <ActivityIndicator size="large" color="#071739" style={{ marginTop: 30 }} />
        ) : ambientes.length === 0 ? (
          <View style={styles.container}>
            <Text style={styles.textVazio}>Você ainda não tem ambientes.</Text>
            <Text style={styles.textVazio}>Toque em "Adicionar ambiente".</Text>
          </View>
        ) : ambientesFiltrados.length === 0 ? (
          <View style={styles.container}>
            <Text style={styles.textVazio}>Nenhum ambiente encontrado.</Text>
          </View>
        ) : (
          ambientesFiltrados.map((a) => (
            <View key={a.id} style={styles.container}>
              <TouchableOpacity
                style={styles.boxRooms}
                onPress={() => navigation.navigate('Rooms2', { ambiente: a })}
              >
                <Image
                  source={a.foto ? { uri: a.foto } : require('../assets/presentation3.png')}
                  style={styles.image}
                />
                <Text style={styles.textRooms} numberOfLines={2}>{a.nome_comodo}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
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
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 20
  },
  //Box Rooms
  boxRooms: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    minHeight: 90,
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
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
    marginHorizontal: 20,
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
  },
  textVazio: {
  fontFamily: 'Manrope',
  fontSize: 17,
  color: '#6C757D',
  textAlign: 'center',
  marginTop: 10,
},
})
