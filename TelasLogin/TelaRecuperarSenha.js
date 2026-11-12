import { useState, useEffect } from 'react'
import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, TextInput, Alert, ActivityIndicator } from 'react-native'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../config/firebase'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'


const MAX_TENTATIVAS = 3
const ESPERA_SEGUNDOS = 60

function emailValido(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
}

export default function RecuperarSenha() {

  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [tentativas, setTentativas] = useState(0)
  const [segundos, setSegundos] = useState(0)
  const [mensagem, setMensagem] = useState(null)

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  useEffect(() => {
    if (segundos <= 0) return
    const t = setTimeout(() => setSegundos((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [segundos])

  if (!fontsLoaded) {
    return null;
  }
  async function enviarLink() {
    if (enviando || segundos > 0) return

    if (tentativas >= MAX_TENTATIVAS) {
      setMensagem({
        texto: 'Limite de tentativas atingido. Tente novamente mais tarde.',
        tipo: 'erro',
      })
      return
    }
    const emailLimpo = email.trim()
    if (!emailLimpo) {
      setMensagem({ texto: 'Digite seu e-mail.', tipo: 'erro' })
      return
    }
    if (!emailValido(emailLimpo)) {
      setMensagem({ texto: 'E-mail inválido. Use o formato nome@dominio.com.', tipo: 'erro' })
      return
    }
    try {
      setEnviando(true)
      setMensagem(null)
      await sendPasswordResetEmail(auth, emailLimpo)
      setTentativas((t) => t + 1)
      setSegundos(ESPERA_SEGUNDOS)
      setMensagem({
        texto: 'Se esse e-mail estiver cadastrado, você receberá um link para criar uma nova senha. Confira também o spam.',
        tipo: 'sucesso',
      })
    } catch (erro) {
      console.error('Erro ao enviar link: ', erro)
      let texto = 'Não foi possível enviar o e-mail. Tente novamente.'
      if (erro.code === 'auth/invalid-email') texto = 'E-mail inválido.'
      else if (erro.code === 'auth/too-many-requests') texto = 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
      else if (erro.code === 'auth/network-request-failed') texto = 'Sem conexão. Verifique sua internet.'
      setMensagem({ texto, tipo: 'erro' })
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
        {mensagem && (
          <View style={[styles.aviso, mensagem.tipo === 'sucesso' ? styles.avisoSucesso : styles.avisoErro]}>
            <Text style={styles.textAviso}>{mensagem.texto}</Text>
          </View>
        )}
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
            onChangeText={(t) => { setEmail(t); setMensagem(null) }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {/* Botão */}
          <TouchableOpacity
            style={[styles.bottom, (enviando || segundos > 0 || tentativas >= MAX_TENTATIVAS) && styles.bottomDesativado]}
            onPress={enviarLink}
            disabled={enviando || segundos > 0 || tentativas >= MAX_TENTATIVAS}
          >
            {enviando ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.textBottom}>
                {tentativas >= MAX_TENTATIVAS
                  ? 'Limite atingido'
                  : segundos > 0
                    ? `Reenviar em ${segundos}s`
                    : tentativas > 0
                      ? 'Reenviar link'
                      : 'Enviar link'}
              </Text>
            )}
          </TouchableOpacity>
          {tentativas > 0 && tentativas < MAX_TENTATIVAS && (
            <Text style={styles.textInfo}>
              Tentativas restantes: {MAX_TENTATIVAS - tentativas}
            </Text>
          )}

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.textVoltar}>Voltar ao login</Text>
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
  },
  bottomDesativado: {
    opacity: 0.5,
  },
  textInfo: {
    fontFamily: 'Manrope',
    fontSize: 14,
    color: '#E3E6DC',
  },
  textVoltar: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: '#ffff',
    textDecorationLine: 'underline',
  },
  aviso: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 15,
    zIndex: 10,
    elevation: 10,
  },
  avisoSucesso: { backgroundColor: '#1FC72A' },
  avisoErro: { backgroundColor: '#D64545' },
  textAviso: {
    fontFamily: 'ManropeBold',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
})