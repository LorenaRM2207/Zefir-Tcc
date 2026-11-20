import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, TextInput, Alert, ActivityIndicator, Modal, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import Feather from '@expo/vector-icons/Feather'

//validação do e-mail
function emailValido(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
}

function formatarTelefone(t) {
  const d = t.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

//resumo dos documentos exibidos na caixinha
const DOCUMENTOS = {
  termos: {
    titulo: 'Termos de Uso',
    icone: 'file-text',
    intro: 'O ZEFIR detecta riscos como vazamento de gás e fumaça por meio de sensores IoT e do aplicativo, ajudando a proteger vidas.',
    chamada: 'Ao utilizar o aplicativo, você concorda que:',
    itens: [
      'A licença de uso é pessoal, limitada e apenas para monitoramento residencial.',
      'Não é permitido copiar, modificar, fazer engenharia reversa ou redistribuir o software.',
      'O ZEFIR é uma ferramenta auxiliar e não substitui a manutenção preventiva dos equipamentos de gás.',
      'Não nos responsabilizamos por falhas de Wi-Fi ou de energia elétrica na residência.',
      'Você pode encerrar o uso a qualquer momento excluindo sua conta.',
    ],
    outro: 'privacidade',
    outroTexto: 'Política de Privacidade',
  },
  privacidade: {
    titulo: 'Política de Privacidade',
    icone: 'shield',
    intro: 'Tratamos seus dados de acordo com a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).',
    chamada: 'Ao utilizar o aplicativo, você está ciente de que:',
    itens: [
      'Coletamos dados cadastrais (nome, e-mail, telefone, CPF e endereço) e dados dos sensores (gás, fumaça, umidade e temperatura).',
      'Seus dados são protegidos com criptografia (TLS/HTTPS e banco de dados Firebase Firestore).',
      'Usamos apenas armazenamento local necessário para manter seu login e as últimas leituras. Não há rastreamento publicitário.',
      'Você pode acessar, corrigir seus dados ou excluir sua conta a qualquer momento.',
      'Incidentes relevantes de segurança serão comunicados à ANPD e aos titulares afetados.',
    ],
    outro: 'termos',
    outroTexto: 'Termos de Uso',
  },
}

const EMAIL_CONTATO = 'irmaosmetralhaetec@gmail.com'

export default function Cadastro() {

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [telefone, setTelefone] = useState('')
  const [nomeUsuario, setNomeUsuario] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigation = useNavigation()

  //termos e privacidade
  const [modalAberto, setModalAberto] = useState(null) // null | 'termos' | 'privacidade'
  const [leu, setLeu] = useState({ termos: false, privacidade: false })
  const [aceitou, setAceitou] = useState({ termos: false, privacidade: false })

  const podeCadastrar = aceitou.termos && aceitou.privacidade

  //abrir a caixinha conta como "leu"
  function abrirDocumento(tipo) {
    setLeu((anterior) => ({ ...anterior, [tipo]: true }))
    setModalAberto(tipo)
  }

  //só deixa marcar se já abriu para ler
  function alternarAceite(tipo) {
    if (!leu[tipo]) {
      abrirDocumento(tipo)
      return
    }
    setAceitou((anterior) => ({ ...anterior, [tipo]: !anterior[tipo] }))
  }

  async function realizarCadastro() {
    const emailLimpo = email.trim()
    const nomeLimpo = nomeUsuario.trim()
    const telefoneNumeros = telefone.replace(/\D/g, '')

    if (!emailLimpo || !telefoneNumeros || !senha || !nomeUsuario) {
      Alert.alert('Atenção', 'Preencha todos os campos.')
      return
    }
    if (!emailValido(emailLimpo)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail no formato nome@dominio.com.')
      return
    }
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      Alert.alert('Telefone inválido', 'Digite o telefone com DDD.')
      return
    }
    if (senha.length < 6) {
      Alert.alert('Senha fraca', 'A senha precisa ter pelo menos 6 caracteres.')
      return
    }
    if (!aceitou.termos || !aceitou.privacidade) {
      Alert.alert('Atenção', 'Leia e aceite os Termos de Uso e a Política de Privacidade para continuar.')
      return
    }
    try {
      setCarregando(true)

      const cred = await createUserWithEmailAndPassword(auth, emailLimpo, senha)
      await setDoc(doc(db, 'Usuario', cred.user.uid), {
        id_usuario: Date.now(),
        nome: nomeLimpo,
        e_mail: emailLimpo,
        telefone: telefoneNumeros,
        aceitou_termos: true,
        aceitou_privacidade: true,
        aceite_em: serverTimestamp(),
        criado_em: serverTimestamp(),
      })
      await sendEmailVerification(cred.user)
      await signOut(auth)

      Alert.alert(
        'Verifique seu e-mail',
        'Enviamos um link de confirmação. Clique nele e depois faça login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      )

    } catch (erro) {
      console.error('Erro no cadastro: ', erro)
      if (erro.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Esse e-mail já está cadastrado.')
      } else if (erro.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'E-mail inválido.')
      } else if (erro.code === 'auth/weak-password') {
        Alert.alert('Erro', 'A senha precisa ter pelo menos 6 caracteres.')
      } else {
        Alert.alert('Erro', 'Não foi possível criar a conta.')
      }
    } finally {
      setCarregando(false)
    }
  }

  if (!fontsLoaded) {
    return null
  }

  const doc_ = modalAberto ? DOCUMENTOS[modalAberto] : null

  return (
    <View style={styles.screen}>
      {/* imagem do fundo */}
      <ImageBackground
        source={require('../assets/fundo.png')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Cabeçalho */}
        <View style={{ alignSelf: 'center', justifyContent: 'flex-start', marginTop: 90, marginBottom: 10 }}>
          <Text style={styles.textPrincipal}>Cadastre-se</Text>
        </View>
        {/* Card */}
        <View style={styles.box1}>
          <Text style={styles.textBox1}> Criar Conta</Text>
          <View style={styles.line}></View>
          {/* Infomações */}
          <TextInput
            style={styles.boxTextInput}
            placeholder='E-mail'
            placeholderTextColor="#6C757D"
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <TextInput
            style={styles.boxTextInput}
            placeholder='Nome usuário'
            placeholderTextColor="#6C757D"
            value={nomeUsuario}
            onChangeText={setNomeUsuario}
          />
          <TextInput
            style={styles.boxTextInput}
            placeholder='Telefone (com DDD)'
            placeholderTextColor="#6C757D"
            value={telefone}
            onChangeText={(t) => setTelefone(formatarTelefone(t))}
            keyboardType='phone-pad'
            maxLength={15}
          />
          <TextInput
            style={styles.boxTextInput}
            placeholderTextColor="#6C757D"
            placeholder='Senha'
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          {/* Aceite: Termos de Uso e Política de Privacidade */}
          <View style={styles.boxAceites}>
            <View style={styles.linhaAceite}>
              <TouchableOpacity style={styles.checkbox} onPress={() => alternarAceite('termos')}>
                {aceitou.termos && <Feather name="check" size={18} color="#071739" />}
              </TouchableOpacity>
              <Text style={styles.textAceite}>
                Li e aceito os{' '}
                <Text style={styles.textLink} onPress={() => abrirDocumento('termos')}>Termos de Uso</Text>
              </Text>
            </View>
            <View style={styles.linhaAceite}>
              <TouchableOpacity style={styles.checkbox} onPress={() => alternarAceite('privacidade')}>
                {aceitou.privacidade && <Feather name="check" size={18} color="#071739" />}
              </TouchableOpacity>
              <Text style={styles.textAceite}>
                Li e concordo com a{' '}
                <Text style={styles.textLink} onPress={() => abrirDocumento('privacidade')}>Política de Privacidade</Text>
              </Text>
            </View>
          </View>

          {/* Botão - Criar */}
          <TouchableOpacity
            style={[styles.bottom, !podeCadastrar && styles.bottomDesativado]}
            onPress={realizarCadastro}
            disabled={carregando || !podeCadastrar}
          >
            {carregando
              ? <ActivityIndicator color="white" />
              : <Text style={styles.textBottom}> Criar</Text>}
          </TouchableOpacity>

          {/* Botão - Logar 2 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.textBottom2}> Já tem conta? </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Caixinha com o resumo */}
      <Modal
        visible={modalAberto !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAberto(null)}
      >
        <View style={styles.overlay}>
          {doc_ && (
            <View style={styles.modalCard}>
              <TouchableOpacity style={styles.botaoX} onPress={() => setModalAberto(null)}>
                <Feather name="x" size={26} color="#4B5563" />
              </TouchableOpacity>

              <View style={styles.circuloIcone}>
                <Feather name={doc_.icone} size={28} color="#071739" />
              </View>
              <Text style={styles.modalTitle}>{doc_.titulo}</Text>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator>
                <Text style={styles.modalText}>{doc_.intro}</Text>
                <Text style={[styles.modalText, { marginTop: 14 }]}>{doc_.chamada}</Text>
                {doc_.itens.map((item) => (
                  <Text key={item} style={styles.modalText}>{'\u2022 ' + item}</Text>
                ))}
                <Text style={[styles.modalText, { marginTop: 14 }]}>
                  Para mais informações, entre em contato conosco pelo e-mail: {EMAIL_CONTATO}
                </Text>
              </ScrollView>

              <TouchableOpacity style={styles.modalBotton} onPress={() => setModalAberto(null)}>
                <Text style={styles.modalBntText}>Fechar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => abrirDocumento(doc_.outro)}>
                <Text style={styles.modalLink}>{doc_.outroTexto}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
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
    color: 'black'
  },
  //Card 
  box1: {
    backgroundColor: '#4B6382',
    width: '90%',
    height: '70%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    margin: 25,
    paddingVertical: 25
  },
  textBox1: {
    fontFamily: 'ManropeBold',
    fontSize: 25,
    color: '#E3E6DC'
  },
  line: {
    backgroundColor: 'white',
    width: '50%',
    height: 2,
    marginTop: 2,
    margin: 15
  },
  boxTextInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    width: '90%',
    height: 45
  },
  //Aceite
  boxAceites: {
    width: '90%',
  },
  linhaAceite: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkbox: {
    backgroundColor: 'white',
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textAceite: {
    fontFamily: 'Manrope',
    fontSize: 15,
    color: 'white',
    flexShrink: 1,
  },
  textLink: {
    fontFamily: 'ManropeSemiBold',
    textDecorationLine: 'underline',
    color: 'white',
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
  bottomDesativado: {
    opacity: 0.45,
  },
  textBottom: {
    fontFamily: 'Manrope',
    fontSize: 20,
    color: '#ffff',
  },
  //Botões em texto
  textBottom2: {
    fontFamily: 'Manrope',
    fontSize: 17,
    color: '#ffff',
  },
  //Caixinha (modal)
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: 'white',
    width: '100%',
    maxHeight: '85%',
    borderRadius: 25,
    padding: 22,
    alignItems: 'center',
  },
  botaoX: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 1,
  },
  circuloIcone: {
    backgroundColor: '#C9D6F5',
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    color: '#0F0F0F',
    marginVertical: 14,
  },
  modalScroll: {
    width: '100%',
    flexGrow: 0,
    marginBottom: 16,
  },
  modalText: {
    fontFamily: 'Manrope',
    fontSize: 16,
    lineHeight: 24,
    color: '#0F0F0F',
  },
  modalBotton: {
    backgroundColor: '#071739',
    width: '100%',
    height: 46,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBntText: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: 'white',
  },
  modalLink: {
    fontFamily: 'Manrope',
    fontSize: 16,
    color: '#071739',
    textDecorationLine: 'underline',
    marginTop: 14,
    marginBottom: 4,
  },
})