import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, Alert, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//Add newRoom
import * as ImagePicker from 'expo-image-picker'
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import Feather from '@expo/vector-icons/Feather'

export default function NewRoom() {

  const [nome, setNome] = useState('')
  const [foto, setFoto] = useState(null)
  const [salvando, setSalvando] = useState(false)

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  const navigation = useNavigation()
  if (!fontsLoaded) {
    return null
  }
  async function selecionarImagem() {
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
  }
  async function salvarAmbiente() {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Digite o nome do ambiente.')
      return
    }
    if (!foto) {
      Alert.alert('Atenção', 'Selecione uma imagem.')
      return
    }
    try {
      setSalvando(true)
      await addDoc(collection(db, 'Ambiente'), {
        id_ambiente: Date.now(),
        nome_comodo: nome.trim(),
        foto: foto,
        criado_em: serverTimestamp(),
      })
      navigation.navigate('Rooms')
    } catch (erro) {
      console.error('Erro ao salvar ambiente: ', erro)
      Alert.alert('Erro', 'Não foi possível salvar o ambiente.')
    } finally {
      setSalvando(false)
    }
  }
  return (
    <View style={styles.screen}>
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
              style={{ fontSize: 17, fontFamily: 'Manrope' }}
              placeholder='Pesquisar ambiente'
              placeholderTextColor="#6C757D"
              value={nome}
              onChange={setNome}
            />
          </View>
        </View>
      </View>
      <Text style={styles.textTitle}>Foto</Text>
      <View style={styles.container}>
        <View style={styles.boxFoto}>
          <View style={styles.boxFoto2}>
            {foto && (
              <Image
                souce={{ uri: foto}}
                style={{ width :'100%', height: '100%', borderRadius: 30}}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.bottonSelect}
            onPress={selecionarImagem}
          >
            <Text style={styles.textBottons}>Selecionar imagem</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.bottomAdd}
          onPress={salvarAmbiente}
          disabled={salvando}
        >
          ? <ActivityIndicator color='white' />
          : <Text style={styles.textBottons}>Atribuir sensor </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 50
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
  //
  bottomAdd: {
    backgroundColor: '#071739',
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    margin: 10
  },
})
