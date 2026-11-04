import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, TextInput, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'

//validação dos numeros 
function cartaoValido(n) {
  const d = n.replace(/\D/g, '')
  if (d.length < 13 || d.length > 19) return false
  let soma = 0
  let dobrar = false
  for (let i = d.length - 1; i >= 0; i--) {
    let x = Number(d[i])
    if (dobrar) {
      x *= 2
      if (x > 9) x -= 9
    }
    soma += x
    dobrar = !dobrar
  }
  return soma % 10 === 0
}
//validação da bandeira
function bandeira(n) {
  const d = n.replace(/\D/g, '')
  if (/^4/.test(d)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard'
  if (/^(636368|438935|504175|451416|636297|5067|4576|4011|506699)/.test(d)) return 'Elo'
  if (/^3[47]/.test(d)) return 'Amex'
  return 'Desconhecida'
}
// validação da data de validade
function validadeValida(v) {
  const m = v.match(/^(\d{2})\/(\d{2})$/)
  if (!m) return false
  const mes = Number(m[1])
  const ano = 2000 + Number(m[2])
  if (mes < 1 || mes > 12) return false
  const hoje = new Date()
  return ano > hoje.getFullYear() || (ano === hoje.getFullYear() && mes >= hoje.getMonth() + 1)
}



export default function TelaAddCard() {
  const navigation = useNavigation()
  //dados
  const [nome, setNome] = useState('')
  const [numero, setNumero] = useState('')
  const [validade, setValidade] = useState('')
  const [cvv, setCvv] = useState('')
  const [apelido, setApelido] = useState('')
  //fontes
  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }
  return (
    <View style={styles.screen}>
      <ScrollView>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flexDirection: 'row', marginTop: 160, alignItems: 'center', marginBottom: 10, width: '60%' }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
          <Text style={styles.textTitle}>Adicionar forma de pagamentos</Text>
        </TouchableOpacity>
      </View>
      {/* Nome*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 30, paddingLeft: 25 }}>
              <FontAwesome5 name="user" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Nome dp cartão</Text>
              <Text style={styles.textInformation2}>Zefir</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Numero do cartão*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 25, paddingLeft: 20 }}>
              <MaterialIcons name="payment" size={35} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Número do cartão</Text>
              <Text style={styles.textInformation2}>1234 5678 9012 3456</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Data de venciamento */}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 25, paddingLeft: 25 }}>
              <Feather name="calendar" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Mês / Ano de vencimento</Text>
              <Text style={styles.textInformation2}>2036</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Cvv*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 23, paddingLeft: 25 }}>
              <MaterialIcons name="password" size={30} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}> CVV</Text>
              <Text style={styles.textInformation2}>123</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Apelido do cartão*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 25, paddingLeft: 20 }}>
              <MaterialCommunityIcons name="credit-card-check-outline" size={35} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Apelido do cartão</Text>
              <Text style={styles.textInformation2}>Principal</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Bottom Add */}
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.bottomAdd}
          onPress={() => navigation.navigate('Principal')}
        >
          <Text style={styles.textBottons}>Adicionar</Text>
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
    fontTitle: 'Manrope',
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
    marginTop: 5
  },
   textBottons: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: 'white'
  },
  //
  bottomAdd: {
    backgroundColor: '#071739',
    width: '40%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: 20,
    marginBottom:50
  },
})
