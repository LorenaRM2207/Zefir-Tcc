import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, query, where, onSnapshot, doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'
import Feather from '@expo/vector-icons/Feather'
import AvatarPerfil from '../components/AvatarPerfil'

const PRECO_UNIDADE = 109.99
const FRETE_FIXO = 19.9
const LIMITE_POR_PESSOA = 10

function moeda(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',')
}

export default function TelaPayment() {

  const navigation = useNavigation()
  const route = useRoute()

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  const [valorResultado, setValorResultado] = React.useState(route.params?.quantidade ?? 0)
  const [aviso, setAviso] = React.useState(null)
  const [cartoes, setCartoes] = React.useState([])
  const [cartaoId, setCartaoId] = React.useState(null)
  const [endereco, setEndereco] = React.useState('')
  const [carregando, setCarregando] = React.useState(true)
  const [comprando, setComprando] = React.useState(false)

  const subtotal = Math.round(valorResultado * PRECO_UNIDADE * 100) / 100
  const frete = valorResultado > 0 ? FRETE_FIXO : 0
  const total = Math.round((subtotal + frete) * 100) / 100

  React.useEffect(() => {
    let cancelarCartoes = null

    const cancelarAuth = onAuthStateChanged(auth, async (usuario) => {
      if (cancelarCartoes) cancelarCartoes()

      if (!usuario) {
        setCartoes([])
        setCarregando(false)
        return
      }

      const q = query(collection(db, 'Forma_pagamento'), where('uid', '==', usuario.uid))
      cancelarCartoes = onSnapshot(
        q,
        (snapshot) => {
          const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          lista.sort((a, b) => (a.criado_em?.seconds || 0) - (b.criado_em?.seconds || 0))
          setCartoes(lista)
          setCartaoId((atual) => (lista.some((c) => c.id === atual) ? atual : null))
          setCarregando(false)
        },
        (erro) => {
          console.error('Erro ao ler cartões: ', erro)
          setCarregando(false)
        }
      )

      try {
        const snap = await getDoc(doc(db, 'Usuario', usuario.uid))
        if (snap.exists() && snap.data().endereco) setEndereco(snap.data().endereco)
      } catch (erro) {
        console.error('Erro ao ler endereço: ', erro)
      }
    })

    return () => {
      cancelarAuth()
      if (cancelarCartoes) cancelarCartoes()
    }
  }, [])

  const mostrarAviso = (texto) => {
    setAviso(texto)
    setTimeout(() => setAviso(null), 3500)
  }

  const somar = () => {
    if (valorResultado >= LIMITE_POR_PESSOA) {
      mostrarAviso(`Limite de ${LIMITE_POR_PESSOA} sensores por pessoa.`)
      return
    }
    setValorResultado(valorResultado + 1)
  }

  const subtratir = () => {
    if (valorResultado <= 0) return
    setValorResultado(valorResultado - 1)
  }
  async function comprar() {
    if (valorResultado < 1) {
      mostrarAviso('Seu carrinho está vazio.')
      return
    }
    if (cartoes.length === 0) {
      mostrarAviso('Cadastre uma forma de pagamento para continuar.')
      return
    }
    if (!cartaoId) {
      mostrarAviso('Selecione uma forma de pagamento.')
      return
    }
    if (endereco.trim().length < 10) {
      mostrarAviso('Informe o endereço de entrega completo.')
      return
    }

    const usuario = auth.currentUser
    if (!usuario) {
      mostrarAviso('Você precisa estar logada.')
      return
    }
    const cartao = cartoes.find((c) => c.id === cartaoId)

    try {
      setComprando(true)
      const idPedido = Date.now()
      const batch = writeBatch(db)

      batch.set(doc(collection(db, 'Pedido')), {
        uid: usuario.uid,
        id_pedido: idPedido,
        data_pedido: serverTimestamp(),
        endereco_entrega: endereco.trim(),
        status_pedido: 'processando',
        valor_frete: frete,
        valor_total: total,
      })

      batch.set(doc(collection(db, 'Item_pedido')), {
        uid: usuario.uid,
        id_pedido: idPedido,
        id_item: 1,
        produto: 'Sensor Zefir',
        preco_unidade: PRECO_UNIDADE,
        quantidade: valorResultado,
      })

      batch.set(doc(collection(db, 'Pagamento')), {
        uid: usuario.uid,
        id_pedido: idPedido,
        id_pagamento: idPedido,
        data: serverTimestamp(),
        valor: total,
        status: 'Concluída',
        forma_pagamento: `${cartao.bandeira} final ${cartao.final}`,
      })
      batch.set(doc(collection(db, 'Notificacao')), {
        uid: usuario.uid,
        id_pedido: idPedido,
        titulo: 'Pedido realizado!',
        texto: `Seu pedido de ${valorResultado} sensor(es) Zefir foi realizado com sucesso.`,
        tipo_notificacao: 'pedido',
        status: 'Informativo',
        data_hora: serverTimestamp(),
        lida: false,
      })

      await batch.commit()
      navigation.navigate('TelaOrder', { idPedido })
    } catch (erro) {
      console.error('Erro ao finalizar compra: ', erro)
      mostrarAviso('Não foi possível finalizar a compra. Tente novamente.')
    } finally {
      setComprando(false)
    }
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={styles.screen}>
      {aviso && (
        <View style={styles.aviso}>
          <Text style={styles.textAviso}>{aviso}</Text>
        </View>
      )}
      <ScrollView>
        {/* Cabeçalho*/}
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TelaSuporte')}
            >
              <Feather name="message-square" size={35} color="black" />
            </TouchableOpacity>
            <Text style={styles.textHeader}>Adquirir sensor</Text>
            <AvatarPerfil />
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: 30, width: '50%', justifyContent: 'space-around' }}>
          <SimpleLineIcons name="handbag" size={30} color="black" />
          <Text style={styles.textTitle}>Produtos ({valorResultado})</Text>
        </View>
        {valorResultado === 0 ? (
          <View style={styles.container}>
            <View style={styles.boxVazio}>
              <SimpleLineIcons name="handbag" size={50} color="#6C7072" />
              <Text style={styles.textTitle}>Seu carrinho está vazio</Text>
              <Text style={styles.textInformation2}>Escolha um sensor para continuar.</Text>
              <TouchableOpacity style={styles.boxBottom} onPress={() => navigation.goBack()}>
                <Text style={styles.textBottons}>Ver sensor</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
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
                    <Text style={styles.textInformation2}>{moeda(subtotal)}</Text>
                  </View>
                  {/* Icone2 */}
                  <View style={styles.bottomAdd}>
                    <TouchableOpacity
                      onPress={subtratir}
                    >
                      <AntDesign name="minus-circle" size={15} color="#A4B5C4" />
                    </TouchableOpacity>
                    <Text style={styles.textNegrito}>{valorResultado}</Text>
                    <TouchableOpacity
                      onPress={somar}
                    >
                      <Feather name="plus-circle" size={18} color="#A4B5C4" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ margin: 20, marginLeft: 30 }}>
              <Text style={styles.textTitle}>Formas de pagamento</Text>
              <Text style={styles.textInformation2}>Cadastradas</Text>
            </View>
            {/* Formas de pagamento*/}
            {carregando ? (
              <ActivityIndicator color="#071739" style={{ margin: 20 }} />
            ) : cartoes.length === 0 ? (
              <View style={styles.container}>
                <View style={styles.boxCard}>
                  <Text style={[styles.textInformation2, { textAlign: 'center' }]}>Nenhuma forma de pagamento cadastrada.</Text>
                </View>
              </View>
            ) : (
              cartoes.map((c) => (
                <TouchableOpacity key={c.id} style={styles.container} onPress={() => setCartaoId(c.id)}>
                  <View style={[styles.boxCard, cartaoId === c.id && styles.boxCardAtivo]}>
                    <View style={styles.columnsRow}>
                      <View style={{ paddingRight: 25, paddingLeft: 20 }}>
                        <MaterialIcons name="payment" size={35} color="#6C7072" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.textInformation}>{c.apelido}</Text>
                        <Text style={styles.textInformation2}>{c.bandeira}  **** {c.final}</Text>
                      </View>
                      <View style={{ paddingHorizontal: 20 }}>
                        {cartaoId === c.id
                          ? <AntDesign name="check-circle" size={24} color="#6C7072" />
                          : <Feather name="circle" size={24} color="#6C7072" />}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
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
            <View style={{ margin: 20, marginLeft: 30 }}>
              <Text style={styles.textTitle}>Entrega</Text>
              <Text style={styles.textInformation2}>Endereço obrigatório</Text>
            </View>
            <View style={styles.container}>
              <View style={[styles.boxEndereco, endereco.trim().length < 10 && styles.boxEnderecoVazio]}>
                <TextInput
                  style={styles.inputEndereco}
                  placeholder="Rua, número, bairro, cidade"
                  placeholderTextColor="#6C757D"
                  value={endereco}
                  onChangeText={setEndereco}
                  multiline
                />
              </View>
            </View>
            {/* Endereço 1*/}
            <View style={styles.container}>
              <View style={styles.boxResumo}>
                <View style={styles.linhaResumo}>
                  <Text style={styles.textInformation2}>Subtotal ({valorResultado}x)</Text>
                  <Text style={styles.textInformation2}>{moeda(subtotal)}</Text>
                </View>
                <View style={styles.linhaResumo}>
                  <Text style={styles.textInformation2}>Frete (7-14 dias)</Text>
                  <Text style={styles.textInformation2}>{moeda(frete)}</Text>
                </View>
                <View style={styles.linhaResumo}>
                  <Text style={styles.textInformation}>Valor total</Text>
                  <Text style={styles.textTotal}>{moeda(total)}</Text>
                </View>
              </View>
            </View>
            <View style={{ justifyContent: 'space-between', marginHorizontal: 60, flexDirection: 'row', alignItems:'center' }}>
              <View style={styles.container}>
                <TouchableOpacity
                  style={[styles.bottomAdd, { backgroundColor: 'red',width: 110, height: 50, }]}
                  onPress={() => navigation.navigate('Rooms')}
                >
                  <Text style={styles.textBottons}>Cancelar</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.container}>
                <TouchableOpacity
                  style={[styles.boxBottom, comprando && { opacity: 0.5 }]}
                  onPress={comprar}
                  disabled={comprando}
                >
                  {comprando
                    ? <ActivityIndicator color="white" />
                    : <Text style={styles.textBottons}>Comprar</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </>
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
    marginTop: 5,
  },
  bottomAdd: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: 100,
    height: 35,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 5,
    margin: 20
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 30,
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
    width: 110,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    margin: 10
  },
  aviso: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#D64545',
    zIndex: 10,
    elevation: 10,
  },
  textAviso: {
    fontFamily: 'ManropeBold',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
  boxVazio: {
    width: '90%',
    alignItems: 'center',
    gap: 10,
    padding: 30,
    borderRadius: 20,
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
  },
  textObrigatorio: {
    fontFamily: 'ManropeBold',
    fontSize: 15,
    color: '#D64545',
    marginTop: 4,
  },
  boxEndereco: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    minHeight: 40,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  boxEnderecoVazio: {
    borderColor: '#D64545',
  },
  inputEndereco: {
    fontFamily: 'Manrope',
    fontSize: 17,
    color: '#0F0F0F',
    padding: 0,
  },
  boxResumo: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    gap: 6,
  },
  linhaResumo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTotal: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    color: '#071739',
  },
})
