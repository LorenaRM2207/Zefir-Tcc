import { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//informações do firebase
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'

function moeda(valor) {
  return 'R$ ' + Number(valor || 0).toFixed(2).replace('.', ',')
}

function formatarDataHora(ts) {
  if (!ts || !ts.toDate) return ''
  const d = ts.toDate()
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} às ${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function Wallet() {

  const navigation = useNavigation()
  const [cartoes, setCartoes] = useState([])
  const [transacoes, setTransacoes] = useState([])
  const [carregandoTransacoes, setCarregandoTransacoes] = useState(true)
  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  useEffect(() => {
    let cancelarCartoes = null
    let cancelarTransacoes = null

    const cancelarAuth = onAuthStateChanged(auth, (usuario) => {
      if (cancelarCartoes) cancelarCartoes()
      if (cancelarTransacoes) cancelarTransacoes()

      if (!usuario) {
        setCartoes([])
        setTransacoes([])
        setCarregandoTransacoes(false)
        return
      }

      cancelarCartoes = onSnapshot(
        query(collection(db, 'Forma_pagamento'), where('uid', '==', usuario.uid)),
        (snapshot) => {
          const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          lista.sort((a, b) => (a.criado_em?.seconds || 0) - (b.criado_em?.seconds || 0))
          setCartoes(lista)
        },
        (erro) => console.error('Erro ao ler cartões: ', erro)
      )

      cancelarTransacoes = onSnapshot(
        query(collection(db, 'Pagamento'), where('uid', '==', usuario.uid)),
        (snapshot) => {
          const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          lista.sort((a, b) => (b.data?.seconds || 0) - (a.data?.seconds || 0))
          setTransacoes(lista.slice(0, 5))
          setCarregandoTransacoes(false)
        },
        (erro) => {
          console.error('Erro ao ler transações: ', erro)
          setCarregandoTransacoes(false)
        }
      )
    })

    return () => {
      cancelarAuth()
      if (cancelarCartoes) cancelarCartoes()
      if (cancelarTransacoes) cancelarTransacoes()
    }
  }, [])

  function removerCartao(cartao) {
    Alert.alert(
      'Remover cartão',
      `Deseja remover ${cartao.bandeira} final ${cartao.final}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'Forma_pagamento', cartao.id))
            } catch (erro) {
              console.error('Erro ao remover cartão: ', erro)
              Alert.alert('Erro', 'Não foi possível remover o cartão.')
            }
          },
        },
      ]
    )
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 120, alignItems: 'center', marginBottom: 10 }}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
            <Text style={styles.textTitle}>Carteira</Text>
          </TouchableOpacity>
        </View>
        <View style={{ margin: 20, marginLeft: 30 }}>
          <Text style={styles.textTitle}>Forma de pagamento</Text>
          <Text style={styles.textInformation2}>Cadastradas</Text>
        </View>

        {/* Cartões*/}
        {cartoes.length === 0 ? (
          <View style={styles.container}>
            <Text style={styles.textVazio}>Nenhum cartão cadastrado.</Text>
          </View>
        ) : (
          cartoes.map((c) => (
            <View key={c.id} style={styles.container}>
              <View style={styles.boxRooms}>
                <View style={styles.columnsRow}>
                  <View style={{ paddingRight: 25, paddingLeft: 20 }}>
                    <MaterialIcons name="payment" size={35} color="#6C7072" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.textInformation}>{c.apelido}</Text>
                    <Text style={styles.textInformation2}>{c.bandeira}  **** {c.final}</Text>
                  </View>
                  <TouchableOpacity style={{ paddingHorizontal: 20 }} onPress={() => removerCartao(c)}>
                    <AntDesign name="minus-circle" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

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

        {/* Histórico de transações */}
        <View style={{ margin: 20, marginLeft: 30 }}>
          <Text style={styles.textTitle}>Últimas transações</Text>
          <Text style={styles.textInformation2}>Suas compras mais recentes</Text>
        </View>

        {carregandoTransacoes ? (
          <View style={styles.container}>
            <Text style={styles.textVazio}>Carregando...</Text>
          </View>
        ) : transacoes.length === 0 ? (
          <View style={styles.container}>
            <Text style={styles.textVazio}>Você ainda não fez nenhuma compra.</Text>
          </View>
        ) : (
          transacoes.map((t) => (
            <View key={t.id} style={styles.container}>
              <View style={styles.boxRooms}>
                <View style={styles.columnsRow}>
                  <View style={{ paddingRight: 25, paddingLeft: 20 }}>
                    <Ionicons name="wallet-outline" size={35} color="#6C7072" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.textInformation}>Sensor Zefir</Text>
                    <Text style={styles.textData}>{formatarDataHora(t.data)}</Text>
                    <Text style={styles.textInformation2} numberOfLines={1}>
                      {t.forma_pagamento || 'Pagamento'}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', paddingRight: 15 }}>
                    <Text style={styles.textValor}>{moeda(t.valor)}</Text>
                    <Text style={styles.textStatus}>{t.status}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}

        {/* Bottom Add */}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.bottomAdd}
            onPress={() => navigation.navigate('TelaOrder')}
          >
            <Text style={styles.textBottons}>Ver compras</Text>
          </TouchableOpacity>
        </View>
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
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 30,
    color: '#0F0F0F',
  },
  //Caixas de informações
  boxRooms: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '85%',
    minHeight: 80,
    borderRadius: 20,
    alignItems: 'center',
    margin: 10,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  columnsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  textInformation: {
    fontFamily: 'Manrope',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 24,
    color: '#0F0F0F',
  },
  textInformation2: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 24,
    color: '#0F0F0F',
    marginTop: 5
  },
  textData: {
    fontFamily: 'Manrope',
    fontSize: 13,
    color: '#4A4F54',
    marginTop: 2,
  },
  textValor: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: '#071739',
  },
  textStatus: {
    fontFamily: 'Manrope',
    fontSize: 13,
    color: '#1B8A2A',
    marginTop: 4,
  },
  textVazio: {
    fontFamily: 'Manrope',
    fontSize: 17,
    color: '#6C757D',
    textAlign: 'center',
    marginVertical: 10,
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
  bottomAdd: {
    backgroundColor: '#071739',
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    margin: 10,
    marginBottom: 50
  },
})