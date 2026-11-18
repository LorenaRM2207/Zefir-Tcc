import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Feather from '@expo/vector-icons/Feather'
import AvatarPerfil from '../components/AvatarPerfil'

function estiloDoTipo(tipo, lida) {
  if (lida) {
    return { fundo: 'rgba(217, 217, 217, 0.53)', texto: 'gray', icone: 'gray', data: '#8A8F94' }
  }
  if (tipo === 'pedido' || tipo === 'pagamento') {
    return { fundo: 'rgba(82, 130, 189, 0.53)', texto: '#0F0F0F', icone: '#0F0F0F', data: '#0F0F0F' }
  }
  if (tipo === 'umidade') {
    return { fundo: '#D9D9D9', texto: '#0F0F0F', icone: 'red', data: '#0F0F0F' }
  }
  return { fundo: '#FFEAD0', texto: '#0F0F0F', icone: 'red', data: '#0F0F0F' }
}

export default function Notifications() {

  const navigation = useNavigation()
  const [notificacoes, setNotificacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [uid, setUid] = useState(null)

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  useEffect(() => {
    let cancelarNotificacoes = null

    const cancelarAuth = onAuthStateChanged(auth, (usuario) => {

      if (!usuario) {
        setUid(null)
        setNotificacoes([])
        setCarregando(false)
        return
      }

      setUid(usuario.uid)
      setCarregando(true)

      const consulta = query(
        collection(db, 'Notificacao'),
        where('uid', '==', usuario.uid)
      )

      cancelarNotificacoes = onSnapshot(
        consulta,
        (snapshot) => {

          const lista = snapshot.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
          }))

          lista.sort((a, b) => {
            const dataA = a.data_hora?.toDate
              ? a.data_hora.toDate().getTime()
              : new Date(a.data_hora).getTime()

            const dataB = b.data_hora?.toDate
              ? b.data_hora.toDate().getTime()
              : new Date(b.data_hora).getTime()

            return dataB - dataA
          })

          setNotificacoes(lista)
          setCarregando(false)
        },
        (erro) => {
          console.error('Erro ao buscar notificações:', erro)
          setCarregando(false)
        }
      )
    })

    return () => {
      cancelarAuth()
      if (cancelarNotificacoes) {
        cancelarNotificacoes()
      }
    }
  }, [])
  function formatarDataHora(data) {
    if (!data) return ''

    const dataConvertida = data.toDate
      ? data.toDate()
      : new Date(data)

    if (isNaN(dataConvertida.getTime())) return ''

    return dataConvertida.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  async function marcarLida(id) {
    try {
      await updateDoc(
        doc(db, 'Notificacao', id),
        {
          lida: true
        }
      )
    } catch (erro) {
      console.error('Erro ao marcar notificação como lida:', erro)
      Alert.alert('Erro', 'Não foi possível atualizar a notificação.')
    }
  }
  async function limparNotificacoes() {
    try {
      await Promise.all(
        notificacoes.map((item) =>
          deleteDoc(doc(db, 'Notificacao', item.id))
        )
      )

      console.log('Notificações apagadas!')
    } catch (erro) {
      console.error('Erro ao limpar notificações:', erro)
      Alert.alert('Não foi possível limpar as notificações.')
    }
  }

  if (!fontsLoaded) {
    return null
  }

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
          <Text style={styles.textHeader}>Notificação</Text>
          <AvatarPerfil />
        </View>
      </View>
      <ScrollView>
        {notificacoes.length > 0 && (
          <View style={styles.containerLimpar}>
            <TouchableOpacity onPress={limparNotificacoes}>
              <Text style={styles.textLimpar}>Limpar notificações</Text>
            </TouchableOpacity>
          </View>
        )}
        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#071739"
            style={{ marginTop: 50 }}
          />
        ) : notificacoes.length === 0 ? (
          <View style={[styles.container, { marginTop: 40 }]}>
            <Feather name="bell-off" size={55} color="#A4B5C4" />
            <Text style={styles.textNotification}>
              Nenhuma notificação por enquanto!
            </Text>
            <Text style={styles.text2Notification}>
              Quando houver novidades sobre seu sensor, pedidos ou pagamentos,
              elas aparecerão aqui.
            </Text>
          </View>
        ) : (
          notificacoes.map((item) => {
            const c = estiloDoTipo(item.tipo_notificacao, item.lida)
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => {
                  if (!item.lida) marcarLida(item.id)
                }}
                style={styles.container}
              >
                <View style={[styles.boxNotification, { backgroundColor: c.fundo }]}>
                  <View style={styles.linhaNotificacao}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.textNotification, { color: c.texto }]}>
                        {item.titulo || 'Notificação'}
                      </Text>
                      <Text style={[styles.text2Notification, { color: c.texto }]}>
                        {item.texto || 'Você recebeu uma nova notificação.'}
                      </Text>
                      <Text style={[styles.dataHora, { color: c.data }]}>
                        {formatarDataHora(item.data_hora)}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <EvilIcons name="exclamation" size={35} color={c.icone} />
                      {!item.lida && <View style={styles.pontoNaoLida} />}
                    </View>
                  </View>
                  <Text style={[styles.textStatus, { color: c.texto }]}>
                    {item.lida ? 'Lida' : 'Não lida'}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
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
  //Cabeçalho
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    justifyContent: 'center',
    marginTop: 50,
    marginHorizontal: 10,
    paddingHorizontal: 10
  },
  textHeader: {
    fontFamily: 'ManropeBold',
    fontSize: 30,
    letterSpacing: 1,
    lineHeight: 36,
    color: '#0F0F0F',
    marginHorizontal: 50
  },
  //Style Box Notification - Umidade do ar
  box2Notification: {
    backgroundColor: '#D9D9D9',
    width: '90%',
    height: 170,
    borderRadius: 15,
    margin: 10,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //Style Box Notification - Vazamento de gás
  boxNotification: {
    backgroundColor: '#FFEAD0',
    width: '90%',
    borderRadius: 15,
    margin: 10,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textNotification: {
    fontFamily: 'ManropeBold',
    fontSize: 21,
    letterSpacing: 1,
    lineHeight: 25,
    textAlign: 'center',
    marginVertical: 5
  },
  text2Notification: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    textAlign: 'center'
  },
  text3Notification: {
    fontFamily: 'Manrope',
    fontSize: 18,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },
  bottom: {
    backgroundColor: "#071739",
    borderRadius: 20,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  boxLida: {
    backgroundColor: 'rgba(217, 217, 217, 0.53)',
  },
  linhaNotificacao: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataHora: {
    fontFamily: 'Manrope',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },
  textStatus: {
    fontFamily: 'ManropeSemiBold',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 3,
  },
  pontoNaoLida: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: 'red',
    marginTop: 2,
  },
  containerLimpar: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'flex-end',
    marginVertical: 10,
  },
  textLimpar: {
    fontFamily: 'ManropeSemiBold',
    fontSize: 14,
    color: '#D64545',
  },


})
