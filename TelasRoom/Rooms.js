import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, ScrollView, ActivityIndicator, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { useState, useEffect } from 'react'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icone
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import AvatarPerfil from '../components/AvatarPerfil'


export default function Rooms() {

  const navigation = useNavigation()
  const [ambientes, setAmbientes] = useState([])
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [modoExcluir, setModoExcluir] = useState(false)
  const [alvo, setAlvo] = useState(null)
  const [excluindo, setExcluindo] = useState(false)
  const [erroExcluir, setErroExcluir] = useState('')

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
  async function confirmarExclusao() {
    if (!alvo) return
    try {
      setExcluindo(true)
      await deleteDoc(doc(db, 'Ambiente', alvo.id))
      setAlvo(null)
      setErroExcluir('')
    } catch (erro) {
      console.error('Erro ao excluir ambiente: ', erro)
      setErroExcluir('Não foi possível excluir. Tente novamente.')
    } finally {
      setExcluindo(false)
    }
  }

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
          <AvatarPerfil/>
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
        {ambientes.length > 0 && (
          <View style={styles.linhaExcluir}>
            <TouchableOpacity onPress={() => setModoExcluir((atual) => !atual)}>
              <Text style={[styles.textExcluir, modoExcluir && { color: '#071739' }]}>
                {modoExcluir ? 'Concluir' : 'Excluir ambiente'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
                activeOpacity={modoExcluir ? 1 : 0.2}
                onPress={() => {
                  if (!modoExcluir) navigation.navigate('Rooms2', { ambiente: a })
                }}
              >
                <Image
                  source={a.foto ? { uri: a.foto } : require('../assets/presentation3.png')}
                  style={styles.image}
                />
                <Text style={styles.textRooms} numberOfLines={2}>{a.nome_comodo}</Text>
                {modoExcluir && (
                  <TouchableOpacity
                    style={styles.botaoLixeira}
                    onPress={() => {
                      setErroExcluir('')
                      setAlvo(a)
                    }}
                  >
                    <Feather name="trash-2" size={24} color="#D64545" />
                  </TouchableOpacity>
                )}
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
      <Modal transparent animationType="fade" visible={!!alvo} onRequestClose={() => setAlvo(null)}>
        <View style={styles.fundoModal}>
          <View style={styles.caixaModal}>
            <Text style={styles.textModalTitulo}>Excluir ambiente</Text>
            <Text style={styles.textModal}>
              Deseja excluir "{alvo?.nome_comodo}"? Essa ação não pode ser desfeita.
            </Text>
            {!!erroExcluir && <Text style={styles.textErroModal}>{erroExcluir}</Text>}
            <View style={styles.botoesModal}>
              <TouchableOpacity style={styles.botaoCancelar} onPress={() => setAlvo(null)} disabled={excluindo}>
                <Text style={styles.textCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao} disabled={excluindo}>
                {excluindo ? <ActivityIndicator color="white" /> : <Text style={styles.textExcluirBtn}>Excluir</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  linhaExcluir: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  textExcluir: {
    fontFamily: 'ManropeBold',
    fontSize: 14,
    color: '#D64545',
  },
  botaoLixeira: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  caixaModal: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  textModalTitulo: {
    fontFamily: 'ManropeBold',
    fontSize: 20, color: '#0F0F0F'
  },
  textModal: {
    fontFamily: 'Manrope',
    fontSize: 16,
    color: '#0F0F0F',
    lineHeight: 22
  },
  textErroModal: {
    fontFamily: 'Manrope',
    fontSize: 14,
    color: '#D64545'
  },
  botoesModal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6
  },
  botaoCancelar: {
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCancelar: {
    fontFamily: 'ManropeBold',
    fontSize: 16,
    color: '#0F0F0F'
  },
  botaoExcluir: {
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D64545',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textExcluirBtn: {
    fontFamily: 'ManropeBold',
    fontSize: 16,
    color: 'white'
  },
})
