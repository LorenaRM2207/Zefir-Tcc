import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import EvilIcons from '@expo/vector-icons/EvilIcons'

const MODOS = ['Vibrar', 'Sonoro', 'Mudo']

export default function TelaConfigAlert() {
  const navigation = useNavigation()
  const [modo, setModo] = useState(0)
  const [desativado, setDesativado] = useState(false)
  const [carregando, setCarregando] = useState(true)

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
      try {
        const snap = await getDoc(doc(db, 'Configuracoes', usuario.uid))
        if (snap.exists()) {
          const d = snap.data()
          const posicao = MODOS.indexOf(d.alertas)
          setModo(posicao >= 0 ? posicao : 0)
          setDesativado(d.notificacoes === 'Desativadas')
        }
      } catch (erro) {
        console.error('Erro ao ler configurações: ', erro)
      } finally {
        setCarregando(false)
      }
    })
    return cancelarAuth
  }, [])

  async function salvar(campos) {
    const usuario = auth.currentUser
    if (!usuario) return
    try {
      await setDoc(
        doc(db, 'Configuracoes', usuario.uid),
        { ...campos, atualizado_em: serverTimestamp() },
        { merge: true }
      )
    } catch (erro) {
      console.error('Erro ao salvar configurações: ', erro)
    }
  }

  function trocarModo() {
    const proximo = (modo + 1) % MODOS.length
    setModo(proximo)
    salvar({ alertas: MODOS[proximo] })
  }

  function alternarDesativado() {
    const novo = !desativado
    setDesativado(novo)
    salvar({ notificacoes: novo ? 'Desativadas' : 'Ativadas' })
  }

  if (!fontsLoaded) {
    return null
  }
  if (carregando) {
    return <View style={styles.screen} />
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flexDirection: 'row', marginTop: 120, alignItems: 'center', marginBottom: 10 }}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
          <Text style={styles.textTitle}>Alertas e notificações</Text>
        </TouchableOpacity>
      </View>
      {/* Alertas*/}
      <View style={styles.container}>
        <TouchableOpacity style={styles.boxRooms} onPress={trocarModo}>
          <View style={styles.columnsRow}>
            <View style={{ paddingRight: 30, paddingLeft: 20 }}>
              <Ionicons
                name={modo === 0 ? 'phone-portrait-outline' : modo === 1 ? 'volume-high-outline' : 'volume-mute-outline'}
                size={30}
                color="#6C7072"
              />
            </View>
            <View>
              <Text style={styles.textInformation}>Alerta e notificações</Text>
              <Text style={styles.textInformation2}>{MODOS[modo]}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* Desativar*/}
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.boxRooms, desativado && styles.boxSelecionada]}
          onPress={alternarDesativado}
        >
          <View style={styles.columnsRow}>
            <View style={{ paddingRight: 30, paddingLeft: 20 }}>
              <Ionicons name="notifications-off-outline" size={24} color={desativado ? '#0F0F0F' : '#6C7072'} />
            </View>
            <View>
              <Text style={styles.textInformation}>Desativar notificações</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* Volume*/}
      <View style={styles.container}>
        <View style={styles.boxRooms}>
          <View style={styles.columnsRow}>
            {/* Icone */}
            <View style={{ paddingRight: 30, paddingLeft: 20 }}>
              <EvilIcons name="exclamation" size={35} color="#6C7072" />
            </View>
            {/* Texto */}
            <View>
              <Text style={styles.textInformation}>Volume do alarme</Text>
              <Text style={styles.textInformation2}>Alto</Text>
            </View>
          </View>
        </View>
      </View>

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
    width: '90%',
    justifyContent: 'center',
    marginTop: 50,
    paddingHorizontal: 10
  },
  textHeader: {
    fontFamily: 'ManropeBold',
    fontSize: 30,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginHorizontal: 60
  },
  //Caixas de informações
  boxRooms: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '85%',
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
    color: '#0F0F0F'
  },
  textInformation3: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: 'red'
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },
  boxSelecionada: {
    backgroundColor: 'rgba(108, 114, 112, 0.6)',
  },

})
