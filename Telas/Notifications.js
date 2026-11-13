import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import EvilIcons from '@expo/vector-icons/EvilIcons'
import Feather from '@expo/vector-icons/Feather'

function formatarDataHora(ts) {
  if (!ts) return ''
  const data = ts.toDate ? ts.toDate() : new Date(ts)
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()
  const hora = String(data.getHours()).padStart(2, '0')
  const min = String(data.getMinutes()).padStart(2, '0')
  return `${dia}/${mes}/${ano} às ${hora}:${min}`
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
      alert('Não foi possível limpar as notificações.')
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
          notificacoes.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => {
                if (!item.lida) {
                  marcarLida(item.id)
                }
              }}
              style={styles.container}
            >
              <View
                style={[
                  styles.boxNotification,
                  item.lida && styles.boxLida
                ]}
              >
                <View style={styles.linhaNotificacao}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.textNotification}>
                      {item.titulo || 'Notificação'}
                    </Text>
                    <Text style={styles.text2Notification}>
                      {item.texto || 'Você recebeu uma nova notificação.'}
                    </Text>
                    <Text style={styles.dataHora}>
                      {formatarDataHora(item.data_hora)}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <EvilIcons
                      name="exclamation"
                      size={35}
                      color={item.lida ? 'gray' : 'red'}
                    />
                    {!item.lida && (
                      <View style={styles.pontoNaoLida} />
                    )}
                  </View>
                </View>
                <Text style={styles.textStatus}>
                  {item.lida ? 'Lida' : 'Não lida'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
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
  imageHeader: {
    width: 50,
    height: 50,
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
    height: 250,
    borderRadius: 15,
    margin: 10,
    padding: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
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
    fontSize: 13,
    color: '#6C7072',
    marginTop: 10,
    textAlign: 'center',
  },
  textStatus: {
    fontFamily: 'ManropeSemiBold',
    fontSize: 12,
    color: '#6C7072',
    textAlign: 'right',
    marginTop: 8,
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
