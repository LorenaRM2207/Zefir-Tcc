import { useState } from 'react'
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, TextInput, Alert, ActivityIndicator } from 'react-native'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'


export default function RecuperarSenha() {

  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  if (!fontsLoaded) {
    return null;
  }
  async function enviarLink() {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Digite seu e-mail.')
      return
    }
    try {
      setEnviando(true)
      await sendPasswordResetEmail(auth, email.trim())
      navigation.navigate('Login')
    } catch (erro) {
      if (erro.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'E-mail inválido.')
      } else if (erro.code === 'auth/too-many-requests') {
        Alert.alert('Erro', 'Muitas tentativas. Tente de novo mais tarde.')
      } else {
        Alert.alert('Erro', 'Não foi possível enviar o e-mail.')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <View style={styles.screen}>
      {/* imagem do fundo */}
      <ImageBackground
        source={require('../assets/fundo.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Cabeçalho */}
        <View style={{ alignSelf: 'center', justifyContent: 'flex-start', marginTop: 90, marginBottom: 130 }}>
          <Text style={styles.textPrincipal}>Recuperar Senha</Text>
        </View>
        {/* Card */}
        <View style={styles.box1}>
          {/* Titulo */}
          <View style={{ width: '90%', alignItems: 'center', }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', }}>
              <TouchableOpacity
                style={{ alignSelf: 'flex-start', marginRight: 22 }}
                onPress={() => navigation.navigate('Login')}
              >
                <MaterialIcons name="arrow-back-ios-new" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.textBox1}>Recuperar Senha</Text>
            </View>
            <View style={styles.line}></View>
          </View>
          {/* Informações*/}
          <TextInput
            style={styles.boxTextInput}
            placeholder='Digite seu email'
            placeholderTextColor="#6C757D"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {/* Botão */}
          <TouchableOpacity style={styles.bottom} onPress={enviarLink} disabled={enviando}>
            {enviando
              ? <ActivityIndicator color="white" />
              : <Text style={styles.textBottom}>Enviar link</Text>}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}
const styles = StyleSheet.create({
  //Tela geral
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  screen: {
    flex: 1,
  },
  textPrincipal: {
    fontFamily: 'ManropeBold',
    fontSize: 30,
    color: 'black',
  },
  //Card
  box1: {
    backgroundColor: '#4B6382',
    width: '90%',
    height: '40%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    margin: 25,
    paddingVertical: 60
  },
  textBox1: {
    fontFamily: 'ManropeBold',
    fontSize: 25,
    color: '#E3E6DC'
  },
  line: {
    backgroundColor: 'white',
    width: '60%',
    height: 2,
    margin: 10
  },
  boxTextInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    width: '90%',
    height: 45
  },
  //Botão
  bottom: {
    backgroundColor: "#071739",
    borderRadius: 20,
    width: '90%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  textBottom: {
    fontFamily: 'Manrope',
    fontSize: 20,
    color: '#ffff',
  }
})