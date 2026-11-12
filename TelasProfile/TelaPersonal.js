import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import Ionicons from '@expo/vector-icons/Ionicons'

//validação dos campos 
function formatarTelefone(t) {
  const d = t.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function formatarData(t) {
  const d = t.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

function dataValida(t) {
  const m = t.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return false
  const dia = Number(m[1])
  const mes = Number(m[2])
  const ano = Number(m[3])
  const data = new Date(ano, mes - 1, dia)
  return (
    data.getFullYear() === ano &&
    data.getMonth() === mes - 1 &&
    data.getDate() === dia &&
    ano >= 1900 &&
    data <= new Date()
  )
}

function Campo({ icone, rotulo, children, obrigatorio, vazio }) {
  return (
    <View style={styles.container}>
      <View style={styles.boxRooms}>
        {obrigatorio && vazio && (
          <View style={styles.exclamacao}>
            <Text style={styles.textExclamacao}>!</Text>
          </View>
        )}
        <View style={styles.columnsRow}>
          <View style={styles.boxIcone}>{icone}</View>
          <View style={styles.boxTexto}>
            <Text style={styles.textInformation}>{rotulo}</Text>
            {children}
          </View>
        </View>
      </View>
    </View>
  )
}
function SeletorGenero({ valor, aoMudar }) {
  const opcoes = ['Feminino', 'Masculino', 'Não-binário']
  return (
    <View style={styles.opcoes}>
      {opcoes.map((o) => (
        <TouchableOpacity
          key={o}
          style={[styles.opcao, valor === o && styles.opcaoAtiva]}
          onPress={() => aoMudar(o)}
        >
          <Text style={[styles.textOpcao, valor === o && styles.textOpcaoAtiva]}>{o}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default function Personal() {

  const navigation = useNavigation()
  const [editando, setEditando] = useState(false)
  const [dadosSalvos, setDadosSalvos] = useState(null)
  const [dados, setDados] = useState({
    nome: '',
    genero: '',
    telefone: '',
    endereco: '',
    nascimento: '',
  })
  const [email, setEmail] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState(null)

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  useEffect(() => {
    const cancelarAuth = onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) {
        setCarregando(false)
        return
      }
      setEmail(usuario.email || '')
      try {
        const snap = await getDoc(doc(db, 'Usuario', usuario.uid))
        if (snap.exists()) {
          const d = snap.data()
          if (snap.exists()) {
            const d = snap.data()
            const carregado = {
              nome: d.nome || '',
              genero: d.genero || '',
              telefone: formatarTelefone(d.telefone || ''),
              endereco: d.endereco || '',
              nascimento: d.data_nascimento || '',
              idioma: d.idioma || 'Português (Brasil)',
            }
            setDados(carregado)
            setDadosSalvos(carregado)
            if (d.e_mail) setEmail(d.e_mail)
          }
        }
      } catch (erro) {
        console.error('Erro ao carregar dados: ', erro)
        mostrarMensagem('Não foi possível carregar seus dados.', 'erro')
      } finally {
        setCarregando(false)
      }
    })
    return cancelarAuth
  }, [])
  function mudar(chave, valor) {
    setDados((anterior) => ({ ...anterior, [chave]: valor }))
  }

  function mostrarMensagem(texto, tipo) {
    setMensagem({ texto, tipo })
    setTimeout(() => setMensagem(null), 3500)
  }

  async function salvar() {
    const telefoneNumeros = dados.telefone.replace(/\D/g, '')

    if (!dados.nome.trim()) {
      mostrarMensagem('Digite o seu nome.', 'erro')
      return
    }
    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      mostrarMensagem('Digite o telefone com DDD.', 'erro')
      return
    }
    if (dados.nascimento && !dataValida(dados.nascimento)) {
      mostrarMensagem('Data de nascimento inválida. Use DD/MM/AAAA.', 'erro')
      return
    }

    const usuario = auth.currentUser
    if (!usuario) {
      mostrarMensagem('Você precisa estar logada.', 'erro')
      return
    }

    try {
      setSalvando(true)
      await setDoc(
        doc(db, 'Usuario', usuario.uid),
        {
          nome: dados.nome.trim(),
          genero: dados.genero.trim(),
          telefone: telefoneNumeros,
          endereco: dados.endereco.trim(),
          data_nascimento: dados.nascimento,
          atualizado_em: serverTimestamp(),
        },
        { merge: true }
      )
      mostrarMensagem('Alterações salvas com sucesso!', 'sucesso')
      setDadosSalvos(dados)
      setEditando(false)
    } catch (erro) {
      console.error('Erro ao salvar: ', erro)
      mostrarMensagem('Não foi possível salvar. Tente novamente.', 'erro')
    } finally {
      setSalvando(false)
    }
  }
  function cancelar() {
    setDados(dadosSalvos || dados)
    setEditando(false)
  }
  if (!fontsLoaded) {
    return null;
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
            <Text style={styles.textTitle}>Informações pessoais</Text>
          </TouchableOpacity>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#071739" style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* E-mail (somente leitura) */}
            <Campo icone={<MaterialCommunityIcons name="email-outline" size={32} color="#6C7072" />} rotulo="E-mail">
              <Text style={[styles.textInformation2, { color: '#6C7072' }]}>{email}</Text>
            </Campo>

            {/* Nome (obrigatório) */}
            <Campo icone={<FontAwesome5 name="user" size={30} color="#6C7072" />} rotulo="Nome" obrigatorio vazio={!dados.nome.trim()}>
              {editando ? (
                <TextInput
                  style={styles.textInformation2}
                  placeholder="Seu nome"
                  placeholderTextColor="#6C757D"
                  value={dados.nome}
                  onChangeText={(t) => mudar('nome', t)}
                  autoCapitalize="words"
                />
              ) : (
                <Text style={styles.textInformation2}>{dados.nome || 'Não informado'}</Text>
              )}
            </Campo>

            {/* Gênero */}
            <Campo icone={<EvilIcons name="user" size={45} color="#6C7072" />} rotulo="Gênero" obrigatorio vazio={!dados.genero.trim()}>
              {editando ? (
                <SeletorGenero valor={dados.genero} aoMudar={(v) => mudar('genero', v)} />
              ) : (
                <Text style={styles.textInformation2}>{dados.genero || 'Não informado'}</Text>
              )}
            </Campo>

            {/* Telefone (obrigatório) */}
            <Campo icone={<Feather name="phone" size={32} color="#6C7072" />} rotulo="Telefone" obrigatorio vazio={dados.telefone.replace(/\D/g, '').length < 10}>
              {editando ? (
                <TextInput
                  style={styles.textInformation2}
                  placeholder="(11) 91234-5678"
                  placeholderTextColor="#6C757D"
                  value={dados.telefone}
                  onChangeText={(t) => mudar('telefone', formatarTelefone(t))}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              ) : (
                <Text style={styles.textInformation2}>{dados.telefone || 'Não informado'}</Text>
              )}
            </Campo>

            {/* Endereço */}
            <Campo icone={<EvilIcons name="location" size={45} color="#6C7072" />} rotulo="Endereço" obrigatorio vazio={!dados.endereco.trim()}>
              {editando ? (
                <TextInput
                  style={styles.textInformation2}
                  placeholder="Rua, número"
                  placeholderTextColor="#6C757D"
                  value={dados.endereco}
                  onChangeText={(t) => mudar('endereco', t)}
                />
              ) : (
                <Text style={styles.textInformation2}>{dados.endereco || 'Não informado'}</Text>
              )}
            </Campo>

            {/* Data de nascimento */}
            <Campo icone={<FontAwesome6 name="face-smile" size={30} color="#6C7072" />} rotulo="Data de nascimento" obrigatorio vazio={!dataValida(dados.nascimento)}>
              {editando ? (
                <TextInput
                  style={styles.textInformation2}
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#6C757D"
                  value={dados.nascimento}
                  onChangeText={(t) => mudar('nascimento', formatarData(t))}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              ) : (
                <Text style={styles.textInformation2}>{dados.nascimento || 'Não informado'}</Text>
              )}
            </Campo>

            {/* Botão salvar */}
            <View style={styles.container}>
              {editando ? (
                <View style={styles.botoesLinha}>
                  <TouchableOpacity style={styles.bottomCancelar} onPress={cancelar} disabled={salvando}>
                    <Text style={styles.textCancelar}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.bottomSalvar} onPress={salvar} disabled={salvando}>
                    {salvando
                      ? <ActivityIndicator color="white" />
                      : <Text style={styles.textBottons}>Salvar</Text>}
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.bottomSalvar} onPress={() => setEditando(true)}>
                  <Text style={styles.textBottons}>Editar</Text>
                </TouchableOpacity>
              )}
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
    marginTop: 4,
    padding: 0,
  },
  boxIcone: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxTexto: {
    flex: 1,
    paddingRight: 15,
  },
  exclamacao: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D64545',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  textExclamacao: {
    fontFamily: 'ManropeBold',
    fontSize: 15,
    lineHeight: 18,
    color: 'white',
  },
  bottomSalvar: {
    backgroundColor: '#071739',
    width: 140,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 60,
  },
  textBottons: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: 'white',
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
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 6,
  },
  opcao: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  opcaoAtiva: {
    backgroundColor: '#071739',
  },
  textOpcao: {
    fontFamily: 'Manrope',
    fontSize: 13,
    color: '#0F0F0F',
  },
  textOpcaoAtiva: {
    color: 'white',
  },
  botoesLinha: {
    flexDirection: 'row',
    gap: 15,
  },
  bottomCancelar: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: 140,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 60,
  },
  textCancelar: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: '#0F0F0F',
  },
})
