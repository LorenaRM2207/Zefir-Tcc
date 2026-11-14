import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import Feather from '@expo/vector-icons/Feather'


export default function NewRoom() {

  const navigation = useNavigation()
  const [nome, setNome] = useState('')
  const [foto, setFoto] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState(null)

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  function mostrarMensagem(texto) {
    setMensagem(texto)
    setTimeout(() => setMensagem(null), 3500)
  }

  async function selecionarImagem() {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if (resultado.canceled) return

      const contexto = ImageManipulator.manipulate(resultado.assets[0].uri)
      contexto.resize({ width: 600 })
      const imagem = await contexto.renderAsync()
      const salva = await imagem.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.5,
        base64: true,
      })
      setFoto(`data:image/jpeg;base64,${salva.base64}`)
    } catch (erro) {
      console.error('Erro ao escolher imagem: ', erro)
      mostrarMensagem('Não foi possível carregar a imagem.')
    }
  }
  async function salvarAmbiente() {
    const nomeLimpo = nome.trim()

    if (nomeLimpo.length < 2) {
      mostrarMensagem('Digite o nome do ambiente.')
      return
    }
    if (!foto) {
      mostrarMensagem('Selecione uma imagem do ambiente.')
      return
    }
    if (foto.length > 900000) {
      mostrarMensagem('A imagem ficou grande demais. Escolha outra.')
      return
    }

    const usuario = auth.currentUser
    if (!usuario) {
      mostrarMensagem('Você precisa estar logada.')
      return
    }

    try {
      setSalvando(true)
      await addDoc(collection(db, 'Ambiente'), {
        uid: usuario.uid,
        id_ambiente: Date.now(),
        nome_comodo: nomeLimpo,
        foto: foto,
        criado_em: serverTimestamp(),
      })
      navigation.navigate('Rooms')
    } catch (erro) {
      console.error('Erro ao salvar ambiente: ', erro)
      mostrarMensagem('Não foi possível salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (!fontsLoaded) {
    return null
  }
  return (
    <View style={styles.screen}>
      {mensagem && (
        <View style={styles.aviso}>
          <Text style={styles.textAviso}>{mensagem}</Text>
        </View>
      )}
      {/* Cabeçalho*/}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TelaSuporte')}
          >
            <Feather name="message-square" size={35} color="black" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Ambientes</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
          >
            <Image
              source={require('../assets/Avatar.png')}
              style={styles.imageHeader}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.boxAddRoom}>
            <Text style={styles.textRooms}>Adicionar ambiente</Text>
          </View>
        </View>
        <Text style={styles.textTitle}>Nome</Text>
        <View style={styles.container}>
          <View style={styles.boxAddNome}>
            <View style={styles.textInputNome}>
              <TextInput
                style={{ fontSize: 17, fontFamily: 'Manrope', width: '100%' }}
                placeholder='Ex.: Cozinha'
                placeholderTextColor="#6C757D"
                value={nome}
                onChangeText={setNome}
                maxLength={30}
              />
            </View>
          </View>
        </View>
        <Text style={styles.textTitle}>Foto</Text>
        <View style={styles.container}>
          <View style={styles.boxFoto}>
            <View style={styles.boxFoto2}>
              {foto && <Image source={{ uri: foto }} style={styles.preview} />}
            </View>
            <TouchableOpacity style={styles.bottonSelect} onPress={selecionarImagem}>
              <Text style={styles.textBottons}>{foto ? 'Trocar imagem' : 'Selecionar imagem'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container}>
          <TouchableOpacity
            style={[styles.bottomAdd, salvando && { opacity: 0.5 }]}
            onPress={salvarAmbiente}
            disabled={salvando}
          >
            {salvando
              ? <ActivityIndicator color="white" />
              : <Text style={styles.textBottons}>Atribuir sensor</Text>}
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
    lineHeight: 30,
    color: '#0F0F0F',
    marginHorizontal: 50
  },
  imageHeader: {
    width: 50,
    height: 50,
  },
  boxAddRoom: {
    backgroundColor: 'rgba(217, 217, 217, 0.44)',
    width: '90%',
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20
  },
  textRooms: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: 'black'
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 20,
    color: 'black',
    marginLeft: 50
  },
  //Box Add Nome
  boxAddNome: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    height: 90,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  textInputNome: {
    backgroundColor: 'white',
    borderRadius: 50,
    width: '90%',
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  // Box Add Foto 
  boxFoto: {
    backgroundColor: 'rgba(164, 181, 196, 0.5)',
    width: '90%',
    height: 330,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  boxFoto2: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    height: 210,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden'
  },
  bottonSelect: {
    backgroundColor: 'rgb(164, 181, 196)',
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  textBottons: {
    fontFamily: 'ManropeBold',
    fontSize: 17,
    color: 'white'
  },
  bottomAdd: {
    backgroundColor: '#071739',
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    margin: 10
  },
  preview: {
    width: '100%',
    height: '100%',
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
})