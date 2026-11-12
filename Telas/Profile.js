import { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, Alert, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fontes
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import Feather from '@expo/vector-icons/Feather'



export default function Home() {

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  const navigation = useNavigation()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [foto, setFoto] = useState(null)
  const [salvandoFoto, setSalvandoFoto] = useState(false)

  useEffect(() => {
    let cancelarLeitura = null
    const cancelarAuth = onAuthStateChanged(auth, (usuario) => {
      if (cancelarLeitura) cancelarLeitura()
      if (!usuario) {
        setNome('')
        setEmail('')
        setFoto(null)
        return
      }
      setEmail(usuario.email || '')
      cancelarLeitura = onSnapshot(
        doc(db, 'Usuario', usuario.uid),
        (snap) => {
          const d = snap.exists() ? snap.data() : {}
          setNome(d.nome || (usuario.email ? usuario.email.split('@')[0] : ''))
          setFoto(d.foto || null)
          if (d.e_mail) setEmail(d.e_mail)
        },
        (erro) => console.error('Erro ao ler perfil: ', erro)
      )
    })

    return () => {
      cancelarAuth()
      if (cancelarLeitura) cancelarLeitura()
    }
  }, [])
  async function trocarFoto() {
    const usuario = auth.currentUser
    if (!usuario) {
      Alert.alert('Atenção', 'Você precisa estar logada.')
      return
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (resultado.canceled) return

    try {
      setSalvandoFoto(true)

      const contexto = ImageManipulator.manipulate(resultado.assets[0].uri)
      contexto.resize({ width: 300 })
      const imagem = await contexto.renderAsync()
      const salva = await imagem.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.6,
        base64: true,
      })
      const dataUri = `data:image/jpeg;base64,${salva.base64}`

      await setDoc(
        doc(db, 'Usuario', usuario.uid),
        { foto: dataUri, atualizado_em: serverTimestamp() },
        { merge: true }
      )
    } catch (erro) {
      console.error('Erro ao salvar foto: ', erro)
      Alert.alert('Erro', 'Não foi possível salvar a foto.')
    } finally {
      setSalvandoFoto(false)
    }
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    //View principal
    <View style={styles.screen}>
      <ScrollView>
        {/* Cabeçalho*/}
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TelaSuporte')}
            >
              <Feather name="message-square" size={35} color="black" />
            </TouchableOpacity>
            <Text style={styles.textHeader}>Perfil</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TelaConfiguration')}
            >
              <Ionicons name="settings-outline" size={40} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Usuário */}
        <View style={styles.containerImage}>
          <TouchableOpacity onPress={trocarFoto} disabled={salvandoFoto}>
            <Image
              source={foto ? { uri: foto } : require('../assets/Avatar.png')}
              style={styles.image}
            />
            {salvandoFoto && (
              <View style={styles.carregandoFoto}>
                <ActivityIndicator color="white" />
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={trocarFoto} disabled={salvandoFoto}>
            <FontAwesome6 name="pen-to-square" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Text style={styles.textUser}>{nome}</Text>
          <Text style={styles.textEmail}>{email}</Text>
        </View>
        {/* Box Informações pessoais*/}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.boxRooms}
            onPress={() => navigation.navigate('Personal')}
          >
            <View style={styles.columnsRow}>
              {/* Icone */}
              <View style={{ paddingRight: 20, paddingLeft: 10 }}>
                <FontAwesome5 name="user" size={30} color="#6C7072" />
              </View>
              {/* Texto */}
              <View>
                <Text style={styles.textTitle}>Informações pessoais</Text>
                <Text style={styles.textEmail}>Nome, e-mail, telefone</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Segurança e login*/}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.boxRooms}
            onPress={() => navigation.navigate('Security')}
          >
            <View style={styles.columnsRow}>
              {/* Icone */}
              <View>
                <MaterialCommunityIcons name="cloud-lock-outline" size={35} color="#6C7072" />
              </View>
              {/* Texto */}
              <View>
                <Text style={styles.textTitle}>Segurança e login</Text>
                <Text style={styles.textEmail}>Dispositivos, senha</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {/* Box Carteira*/}
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.boxRooms}
            onPress={() => navigation.navigate('Wallet')}
          >
            <View style={styles.columnsRow}>
              {/* Icone */}
              <View style={{ paddingRight: 20, paddingLeft: 10 }}>
                <MaterialIcons name="payment" size={35} color="#6C7072" />
              </View>
              {/* Texto */}
              <View>
                <Text style={styles.textTitle}>Carteira</Text>
                <Text style={styles.textEmail}>Transações e pagamento</Text>
              </View>
            </View>
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
  containerImage: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
  },
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
    lineHeight: 36,
    color: '#0F0F0F',
    marginHorizontal: 90
  },
  imageHeader: {
    width: 50,
    height: 50,
  },
  //Caixas de informações
  boxRooms: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    height: 90,
    borderRadius: 30,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 10,
    margin: 10,
    justifyContent: 'center'
  },
  columnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingRight: 70
  },
  //User
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 50
  },
  textUser: {
    fontFamily: 'ManropeBold',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginTop: 20,
  },
  textTitle: {
    fontFamily: 'Manrope',
    fontSize: 20,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },
  textEmail: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F'
  },
  carregandoFoto: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

})
