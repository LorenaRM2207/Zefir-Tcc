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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import AntDesign from '@expo/vector-icons/AntDesign'

export default function Wallet() {

  const navigation = useNavigation()
  const [cartoes, setCartoes] = useState([])
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
        setCartoes([])
        return
      }
      const q = query(collection(db, 'Forma_pagamento'), where('uid', '==', usuario.uid))
      cancelarLeitura = onSnapshot(
        q,
        (snapshot) => {
          const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          lista.sort((a, b) => (a.criado_em?.seconds || 0) - (b.criado_em?.seconds || 0))
          setCartoes(lista)
        },
        (erro) => console.error('Erro ao ler cartões: ', erro)
      )
    })
    return () => {
      cancelarAuth()
      if (cancelarLeitura) cancelarLeitura()
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
            <Text style={styles.textInformation2}>Nenhum cartão cadastrado.</Text>
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

        <View style={{ margin: 20, marginLeft: 30 }}>
          <Text style={styles.textTitle}>Seus Dispositivos</Text>
          <Text style={styles.textInformation2}>Conectados</Text>
        </View>
        {/* Ultimas compras*/}
        <View style={styles.container}>
          <View style={styles.boxRooms}>
            <View style={styles.columnsRow}>
              {/* Icone */}
              <View style={{ paddingRight: 25, paddingLeft: 20 }}>
                <Ionicons name="wallet-outline" size={35} color="#6C7072" />
              </View>
              {/* Texto */}
              <View style={{ paddingRight: 33 }}>
                <Text style={styles.textInformation}>Cartão de débito</Text>
                <Text style={styles.textInformation2}>Sensor Zefir, R$------</Text>
              </View>
            </View>
          </View>
        </View>
        {/* Ultimas compras*/}
        <View style={styles.container}>
          <View style={styles.boxRooms}>
            <View style={styles.columnsRow}>
              {/* Icone */}
              <View style={{ paddingRight: 23, paddingLeft: 20 }}>
                <Ionicons name="wallet-outline" size={35} color="#6C7072" />
              </View>
              {/* Texto */}
              <View style={{ paddingRight: 70 }}>
                <Text style={styles.textInformation}> Cartão de débito</Text>
                <Text style={styles.textInformation2}>Sensor Zefir, R$------</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <TouchableOpacity
            style={{ flexDirection: 'row', margin: 20, alignItems: 'center' }}
          >
            <MaterialCommunityIcons name="location-exit" size={27} color="red" />
            <Text style={styles.textInformation3}>Desconectar todos</Text>
          </TouchableOpacity>
        </View>
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
    width: '90%',
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    margin: 10,
    justifyContent: 'center',
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
    lineHeight: 20,
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
  textInformation3: {
    fontFamily: 'ManropeBold',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginLeft: 10
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
  //
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
