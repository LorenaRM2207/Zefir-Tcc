import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, ActivityIndicator, ScrollView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import Feather from '@expo/vector-icons/Feather'

function moeda(valor) {
  return 'R$ ' + Number(valor || 0).toFixed(2).replace('.', ',')
}

export default function TelaBuy() {
  const navigation = useNavigation()
  const route = useRoute()
  const idPedido = route.params?.idPedido

  const [pedido, setPedido] = React.useState(null)
  const [itens, setItens] = React.useState([])
  const [pagamento, setPagamento] = React.useState(null)
  const [carregando, setCarregando] = React.useState(true)

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  React.useEffect(() => {
    const cancelarAuth = onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) {
        setCarregando(false)
        return
      }
      try {
        const snapPedidos = await getDocs(
          query(collection(db, 'Pedido'), where('uid', '==', usuario.uid))
        )
        const lista = snapPedidos.docs.map((d) => ({ id: d.id, ...d.data() }))
        lista.sort((a, b) => (b.data_pedido?.seconds || 0) - (a.data_pedido?.seconds || 0))

        const escolhido = lista.find((p) => p.id_pedido === idPedido) || lista[0]
        if (!escolhido) {
          setCarregando(false)
          return
        }
        setPedido(escolhido)

        const [snapItens, snapPag] = await Promise.all([
          getDocs(query(collection(db, 'Item_pedido'),
            where('uid', '==', usuario.uid), where('id_pedido', '==', escolhido.id_pedido))),
          getDocs(query(collection(db, 'Pagamento'),
            where('uid', '==', usuario.uid), where('id_pedido', '==', escolhido.id_pedido))),
        ])
        setItens(snapItens.docs.map((d) => ({ id: d.id, ...d.data() })))
        setPagamento(snapPag.docs.length > 0 ? snapPag.docs[0].data() : null)
      } catch (erro) {
        console.error('Erro ao carregar pedido: ', erro)
      } finally {
        setCarregando(false)
      }
    })
    return cancelarAuth
  }, [])

  if (!fontsLoaded) {
    return null
  }
  return (
    <View style={styles.screen}>
      <ScrollView>
        {/* Cabeçalho*/}
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('TelaSuporte')}>
              <Feather name="message-square" size={35} color="black" />
            </TouchableOpacity>
            <Text style={styles.textHeader}>Sensor adquirido</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image source={require('../assets/Avatar.png')} style={styles.imageHeader} />
            </TouchableOpacity>
          </View>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#071739" style={{ marginTop: 50 }} />
        ) : !pedido ? (
          <View style={styles.container}>
            <Text style={styles.textInformation2}>Nenhuma compra encontrada.</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.Card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%', justifyContent: 'space-around', margin: 10 }}>
                <SimpleLineIcons name="handbag" size={30} color="black" />
                <Text style={styles.textTitle}>Compra finalizada</Text>
              </View>
              <View style={{ marginBottom: 20, marginTop: 10 }}>
                <Text style={styles.textInformation2}>Agradecemos pela compra!</Text>
                <Text style={[styles.textInformation2, { textAlign: 'center' }]}>
                  Pedido nº {pedido.id_pedido}
                </Text>
              </View>

              {/* Produtos */}
              {itens.map((item) => (
                <View key={item.id} style={styles.container}>
                  <View style={styles.boxProduct}>
                    <View style={styles.columnsRow}>
                      <Image source={require('../assets/Logo.png')} style={styles.image} />
                      <View>
                        <Text style={styles.textInformation3}>{item.produto || 'Sensor Zefir'}</Text>
                        <Text style={styles.textInformation2}>
                          {moeda(item.preco_unidade * item.quantidade)}
                        </Text>
                      </View>
                      <View style={styles.bottomAdd}>
                        <Text style={styles.textInformation3}>{item.quantidade}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              {/* Entrega e valores */}
              <View style={styles.boxProduct2}>
                <Text style={styles.textInformation3}>Endereço</Text>
                <Text style={styles.textInformation2}>{pedido.endereco_entrega}</Text>
                <Text style={styles.textInformation2}>
                  Frete 7-14 dias   {moeda(pedido.valor_frete)}
                </Text>
                <Text style={[styles.textInformation3, { marginTop: 10 }]}>Valor Pago</Text>
                <Text style={styles.textInformation2}>{moeda(pagamento?.valor ?? pedido.valor_total)}</Text>
                {pagamento?.forma_pagamento && (
                  <Text style={styles.textInformation2}>{pagamento.forma_pagamento}</Text>
                )}
                <Text style={[styles.textInformation2, { marginTop: 10 }]}>
                  Status: {pedido.status_pedido}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.container}>
          <TouchableOpacity style={styles.boxBottom} onPress={() => navigation.navigate('Principal')}>
            <Text style={styles.textBottons}>Voltar ao Início</Text>
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
  //Cabeçalho
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    justifyContent: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
    margin: 10
  },
  textHeader: {
    fontFamily: 'ManropeBold',
    fontSize: 30,
    letterSpacing: 2,
    lineHeight: 40,
    color: '#0F0F0F',
    marginHorizontal: 10,
    textAlign: 'center'
  },
  imageHeader: {
    width: 50,
    height: 50,
  },
  image: {
    width: 90,
    height: 90,
    margin: 5
  },
  Card: {
    backgroundColor: 'rgba(164, 181, 196, 0.2)',
    width: '80%',
    minHeight: 550,
    borderRadius: 30,
    margin: 10,
    alignItems: 'center',
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 30,
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
  },
  boxProduct: {
    backgroundColor: 'rgba(164, 181, 196, 0.3)',
    width: '95%',
    height: 120,
    borderRadius: 20,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',

  },
  columnsRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomAdd: {
    backgroundColor: 'white',
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  boxProduct2: {
    backgroundColor: 'rgba(164, 181, 196, 0.31)',
    width: '85%',
    minHeight: 220,
    borderRadius: 30,
    marginVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
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
  textBottons: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'white'
  },
})
