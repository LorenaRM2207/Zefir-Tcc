import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Modal, TextInput, ActivityIndicator, Platform } from 'react-native'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Device from 'expo-device'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc, collection, onSnapshot, writeBatch, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'

function emailValido(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
}
function formatarTelefone(t) {
  const d = t.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

async function obterIdDispositivo() {
  let id = await AsyncStorage.getItem('zefir_device_id')
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
    await AsyncStorage.setItem('zefir_device_id', id)
  }
  return id
}

function nomeDoDispositivo() {
  if (Platform.OS === 'web') return 'Navegador web'
  return Device.deviceName || Device.modelName || (Platform.OS === 'ios' ? 'iPhone' : 'Android')
}

function formatarAcesso(ts) {
  if (!ts || !ts.toDate) return 'agora'
  const d = ts.toDate()
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`
}


export default function Security() {

  const navigation = useNavigation()
  const [emailRec, setEmailRec] = useState('')
  const [telRec, setTelRec] = useState('')
  const [dispositivos, setDispositivos] = useState([])
  const [idAtual, setIdAtual] = useState(null)
  const [editor, setEditor] = useState(null)
  const [confirmacao, setConfirmacao] = useState(null)
  const [processando, setProcessando] = useState(false)
  const [mensagem, setMensagem] = useState(null)

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  useEffect(() => {
    let cancelarLista = null
    let ativo = true

    const cancelarAuth = onAuthStateChanged(auth, async (usuario) => {
      if (cancelarLista) cancelarLista()
      if (!usuario) return

      try {
        const snap = await getDoc(doc(db, 'Usuario', usuario.uid))
        if (snap.exists()) {
          setEmailRec(snap.data().email_recuperacao || '')
          setTelRec(snap.data().telefone_recuperacao || '')
        }

        const id = await obterIdDispositivo()
        const chave = 'zefir_registrado_' + usuario.uid
        const refMeu = doc(db, 'Usuario', usuario.uid, 'Dispositivos', id)
        const [meu, jaRegistrado] = await Promise.all([getDoc(refMeu), AsyncStorage.getItem(chave)])

        if (!meu.exists() && jaRegistrado) {
          await AsyncStorage.removeItem(chave)
          await signOut(auth)
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
          return
        }

        await setDoc(
          refMeu,
          { nome: nomeDoDispositivo(), plataforma: Platform.OS, ultimo_acesso: serverTimestamp() },
          { merge: true }
        )
        await AsyncStorage.setItem(chave, '1')
        if (!ativo) return
        setIdAtual(id)

        cancelarLista = onSnapshot(
          collection(db, 'Usuario', usuario.uid, 'Dispositivos'),
          (snapshot) => {
            const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
            lista.sort((a, b) => {
              if (a.id === id) return -1
              if (b.id === id) return 1
              return (b.ultimo_acesso?.seconds || 0) - (a.ultimo_acesso?.seconds || 0)
            })
            setDispositivos(lista)
          },
          (erro) => console.error('Erro ao ler dispositivos: ', erro)
        )
      } catch (erro) {
        console.error('Erro ao carregar segurança: ', erro)
      }
    })

    return () => {
      ativo = false
      cancelarAuth()
      if (cancelarLista) cancelarLista()
    }
  }, [])
  function mostrarMensagem(texto, tipo) {
    setMensagem({ texto, tipo })
    setTimeout(() => setMensagem(null), 3500)
  }

  function abrirEditor(campo) {
    setEditor({
      campo,
      valor: campo === 'email' ? emailRec : telRec,
      erro: '',
    })
  }

  async function salvarEditor() {
    const usuario = auth.currentUser
    if (!usuario || !editor) return
    const valor = editor.valor.trim()

    if (editor.campo === 'email') {
      if (!emailValido(valor)) {
        setEditor({ ...editor, erro: 'Digite um e-mail válido (nome@dominio.com).' })
        return
      }
      if (valor.toLowerCase() === (usuario.email || '').toLowerCase()) {
        setEditor({ ...editor, erro: 'O e-mail de recuperação deve ser diferente do e-mail de login.' })
        return
      }
    } else {
      const numeros = valor.replace(/\D/g, '')
      if (numeros.length < 10 || numeros.length > 11) {
        setEditor({ ...editor, erro: 'Digite o telefone com DDD.' })
        return
      }
    }

    try {
      setProcessando(true)
      const dados =
        editor.campo === 'email'
          ? { email_recuperacao: valor }
          : { telefone_recuperacao: valor.replace(/\D/g, '') }

      await setDoc(
        doc(db, 'Usuario', usuario.uid),
        { ...dados, atualizado_em: serverTimestamp() },
        { merge: true }
      )

      if (editor.campo === 'email') setEmailRec(valor)
      else setTelRec(valor.replace(/\D/g, ''))

      setEditor(null)
      mostrarMensagem('Salvo com sucesso!', 'sucesso')
    } catch (erro) {
      console.error('Erro ao salvar: ', erro)
      setEditor({ ...editor, erro: 'Não foi possível salvar. Tente novamente.' })
    } finally {
      setProcessando(false)
    }
  }

  function pedirDesconexao(dispositivo) {
    const eEste = dispositivo.id === idAtual
    setConfirmacao({
      titulo: 'Desconectar dispositivo',
      texto: eEste
        ? 'Você sairá da sua conta neste aparelho. Deseja continuar?'
        : `Deseja desconectar "${dispositivo.nome}" da sua conta?`,
      acao: () => desconectar([dispositivo]),
    })
  }

  function pedirDesconexaoTodos() {
    if (dispositivos.length === 0) return
    setConfirmacao({
      titulo: 'Desconectar todos',
      texto: 'Todos os dispositivos serão desconectados, inclusive este. Deseja continuar?',
      acao: () => desconectar(dispositivos),
    })
  }

  async function desconectar(alvos) {
    const usuario = auth.currentUser
    if (!usuario) return
    try {
      setProcessando(true)

      const batch = writeBatch(db)
      alvos.forEach((d) => batch.delete(doc(db, 'Usuario', usuario.uid, 'Dispositivos', d.id)))
      await batch.commit()

      setConfirmacao(null)

      if (alvos.some((d) => d.id === idAtual)) {
        await AsyncStorage.removeItem('zefir_registrado_' + usuario.uid)
        await signOut(auth)
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
      } else {
        mostrarMensagem('Dispositivo desconectado.', 'sucesso')
      }
    } catch (erro) {
      console.error('Erro ao desconectar: ', erro)
      setConfirmacao(null)
      mostrarMensagem('Não foi possível desconectar. Tente novamente.', 'erro')
    } finally {
      setProcessando(false)
    }
  }

  if (!fontsLoaded) {
    return null
  }
  return (
    <View style={styles.screen}>
      {mensagem && (
        <View style={[styles.aviso, mensagem.tipo === 'sucesso' ? styles.avisoSucesso : styles.avisoErro]}>
          <Text style={styles.textAviso}>{mensagem.texto}</Text>
        </View>
      )}

      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 120, alignItems: 'center', marginBottom: 10 }}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
            <Text style={styles.textTitle}>Segurança e Login</Text>
          </TouchableOpacity>
        </View>

        {/* Senha */}
        <View style={styles.container}>
          <TouchableOpacity style={styles.boxRooms} onPress={() => navigation.navigate('RecuperarSenha')}>
            <View style={styles.columnsRow}>
              <View style={styles.boxIcone}>
                <FontAwesome5 name="user" size={30} color="#6C7072" />
              </View>
              <View style={styles.boxTexto}>
                <Text style={styles.textInformation}>Senha</Text>
                <Text style={styles.textInformation2}>Toque para redefinir</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* E-mail de recuperação */}
        <View style={styles.container}>
          <TouchableOpacity style={styles.boxRooms} onPress={() => abrirEditor('email')}>
            <View style={styles.columnsRow}>
              <View style={styles.boxIcone}>
                <MaterialCommunityIcons name="email-outline" size={32} color="#6C7072" />
              </View>
              <View style={styles.boxTexto}>
                <Text style={styles.textInformation}>E-mail de recuperação</Text>
                <Text style={styles.textInformation2}>{emailRec || 'Não cadastrado'}</Text>
              </View>
              <Feather name="edit-2" size={20} color="#6C7072" style={{ marginRight: 15 }} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Telefone de recuperação */}
        <View style={styles.container}>
          <TouchableOpacity style={styles.boxRooms} onPress={() => abrirEditor('telefone')}>
            <View style={styles.columnsRow}>
              <View style={styles.boxIcone}>
                <Feather name="phone" size={32} color="#6C7072" />
              </View>
              <View style={styles.boxTexto}>
                <Text style={styles.textInformation}>Telefone de recuperação</Text>
                <Text style={styles.textInformation2}>
                  {telRec ? formatarTelefone(telRec) : 'Não cadastrado'}
                </Text>
              </View>
              <Feather name="edit-2" size={20} color="#6C7072" style={{ marginRight: 15 }} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ margin: 20, marginLeft: 30 }}>
          <Text style={styles.textTitle}>Seus Dispositivos</Text>
          <Text style={styles.textInformation2}>Conectados</Text>
        </View>

        {/* Dispositivos */}
        {dispositivos.length === 0 ? (
          <View style={styles.container}>
            <ActivityIndicator color="#071739" style={{ margin: 20 }} />
          </View>
        ) : (
          dispositivos.map((d) => (
            <View key={d.id} style={styles.container}>
              <View style={styles.boxRooms}>
                <View style={styles.columnsRow}>
                  <View style={styles.boxIcone}>
                    {d.plataforma === 'web' ? (
                      <FontAwesome6 name="computer" size={24} color="#6C7072" />
                    ) : (
                      <MaterialCommunityIcons name="cellphone" size={28} color="#6C7072" />
                    )}
                  </View>
                  <View style={styles.boxTexto}>
                    <Text style={styles.textInformation}>{d.nome}</Text>
                    <Text style={styles.textInformation2}>
                      {d.id === idAtual ? 'Este dispositivo' : `Último acesso: ${formatarAcesso(d.ultimo_acesso)}`}
                    </Text>
                  </View>
                  <TouchableOpacity style={{ paddingHorizontal: 15 }} onPress={() => pedirDesconexao(d)}>
                    <MaterialCommunityIcons name="location-exit" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        <View style={styles.container}>
          <TouchableOpacity style={{ flexDirection: 'row', margin: 20, marginBottom: 60 }} onPress={pedirDesconexaoTodos}>
            <MaterialCommunityIcons name="location-exit" size={24} color="red" />
            <Text style={styles.textInformation3}>Desconectar todos</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Janela de edição */}
      <Modal transparent animationType="fade" visible={!!editor} onRequestClose={() => setEditor(null)}>
        <View style={styles.fundoModal}>
          <View style={styles.boxModal}>
            <Text style={styles.textTitle}>
              {editor?.campo === 'email' ? 'E-mail de recuperação' : 'Telefone de recuperação'}
            </Text>
            <TextInput
              style={styles.inputModal}
              placeholder={editor?.campo === 'email' ? 'nome@dominio.com' : '(11) 91234-5678'}
              placeholderTextColor="#6C757D"
              value={editor?.valor || ''}
              onChangeText={(t) =>
                setEditor({
                  ...editor,
                  valor: editor.campo === 'telefone' ? formatarTelefone(t) : t,
                  erro: '',
                })
              }
              keyboardType={editor?.campo === 'email' ? 'email-address' : 'phone-pad'}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={editor?.campo === 'telefone' ? 15 : 80}
            />
            {!!editor?.erro && <Text style={styles.textErro}>{editor.erro}</Text>}
            <View style={styles.bottonModal}>
              <TouchableOpacity style={styles.bottonCancelar} onPress={() => setEditor(null)} disabled={processando}>
                <Text style={styles.textCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bottonConfirmar} onPress={salvarEditor} disabled={processando}>
                {processando ? <ActivityIndicator color="white" /> : <Text style={styles.textConfirmar}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Janela de confirmação */}
      <Modal transparent animationType="fade" visible={!!confirmacao} onRequestClose={() => setConfirmacao(null)}>
        <View style={styles.fundoModal}>
          <View style={styles.caixaModal}>
            <Text style={styles.textTitle}>{confirmacao?.titulo}</Text>
            <Text style={styles.textInformation2}>{confirmacao?.texto}</Text>
            <View style={styles.bottonModal}>
              <TouchableOpacity style={styles.bottonCancelar} onPress={() => setConfirmacao(null)} disabled={processando}>
                <Text style={styles.textCancelar}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottonConfirmar, { backgroundColor: '#D64545' }]}
                onPress={confirmacao?.acao}
                disabled={processando}
              >
                {processando ? <ActivityIndicator color="white" /> : <Text style={styles.textConfirmar}>Desconectar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    minHeight: 80,
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
    marginLeft: 10
  },
  boxIcone: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxTexto: {
    flex: 1,
    paddingRight: 10
  },
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  boxModal: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    padding: 20,
    gap: 12,
  },
  inputModal: {
  fontFamily: 'Manrope',
  fontSize: 17,
  color: '#0F0F0F',
  backgroundColor: 'rgba(164, 181, 196, 0.3)',
  borderRadius: 12,
  paddingHorizontal: 12,
  height: 48,
},
textErro: { 
  fontFamily: 'Manrope', 
  fontSize: 14, 
  color: '#D64545' 
},
bottonModal: { 
  flexDirection: 'row', 
  justifyContent: 'flex-end', 
  gap: 10, 
  marginTop: 6 
},
bottonCancelar: {
  paddingHorizontal: 20, 
  height: 44, 
  borderRadius: 22,
  backgroundColor: 'rgba(164, 181, 196, 0.5)',
  alignItems: 'center', 
  justifyContent: 'center',
},
textCancelar: { 
  fontFamily: 'ManropeBold', 
  fontSize: 16, 
  color: '#0F0F0F' 
},
bottonConfirmar: {
  paddingHorizontal: 20, 
  height: 44, 
  borderRadius: 22,
  backgroundColor: '#071739',
  alignItems: 'center', 
  justifyContent: 'center',
},
textConfirmar: { 
  fontFamily: 'ManropeBold', 
  fontSize: 16, 
  color: 'white' 
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
avisoSucesso: { 
  backgroundColor: '#1FC72A' 
},
avisoErro: { 
  backgroundColor: '#D64545' 
},
textAviso: { 
  fontFamily: 'ManropeBold', 
  fontSize: 15, 
  color: 'white', 
  textAlign: 'center' 
},
})
