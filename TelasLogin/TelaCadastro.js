import { View, ImageBackground, StyleSheet, TouchableOpacity, Text, TextInput, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'

import { cadastrar } from '../services/auth'

export default function Cadastro() {

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigation = useNavigation()

  if (!fontsLoaded) {
    return null;
  }
  async function realizarCadastro() {
    if (!email || !senha) {
      alert('Preencha todos os campos.')
      return
    }

    try {
      await cadastrar(email, senha)
      alert('Usuário cadastrado!')
      navigation.navigate('Login')
    } catch (error) {
      alert('Não foi possível cadastrar o usuário.')
      console.log(error)
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
            placeholder='email'
            placeholderTextColor="#6C757D"
            value={email}
            onChangeText={setEmail}
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <TextInput
            style={styles.boxTextInput}
            placeholder='telefone'
            placeholderTextColor="#6C757D"
          />
          <TextInput
            style={styles.boxTextInput}
            placeholderTextColor="#6C757D"
            placeholder='senha'
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
          <TextInput
            style={styles.boxTextInput}
            placeholder='Confirmar Senha'
            placeholderTextColor="#6C757D"
          />
          {/* Botão - Logar */}
          <TouchableOpacity
            style={styles.bottom}
            onPress={realizarCadastro}
          >
            <Text style={styles.textBottom}> Criar</Text>
          </TouchableOpacity>
          <Text style={styles.textCard1}>ou crie com</Text>
          <View style={styles.boxAling}>
            {/* Imagens */}
            <View style={styles.boxMoldura}>
              <Image
                source={require('../assets/GoogleLogo.png')}
                style={styles.image}
              />
            </View>
            <View style={styles.boxMoldura}>
              <Image
                source={require('../assets/AppleLogo.png')}
                style={styles.image}
              />
            </View>
            <View style={styles.boxMoldura}>
              <Image
                source={require('../assets/MicrosoftLogo.png')}
                style={styles.image}
              />
            </View>
          </View>
          {/* Botão - Logar 2 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.textBottom2}> Já tem conta? </Text>
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
  //Botões em texto
  textBottom2: {
    fontFamily: 'Manrope',
    fontSize: 17,
    color: '#ffff',
  },
  textCard1: {
    fontFamily: 'Manrope',
    fontSize: 17,
    margin: 10,
    color: 'white'
  },
  //Imagens logins
  image: {
    width: 40,
    height: 40,
    margin: 10,
  },
  boxAling: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%'
  },
  boxMoldura: {
    backgroundColor: 'white',
    width: 70,
    height: 60,
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  }
})