import { useState, useEffect } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

export default function AvatarPerfil({ tamanho = 50 }) {
  const navigation = useNavigation()
  const [foto, setFoto] = useState(null)

  useEffect(() => {
    let cancelarLeitura = null

    const cancelarAuth = onAuthStateChanged(auth, (usuario) => {
      if (cancelarLeitura) cancelarLeitura()

      if (!usuario) {
        setFoto(null)
        return
      }

      cancelarLeitura = onSnapshot(
        doc(db, 'Usuario', usuario.uid),
        (snap) => setFoto(snap.exists() ? snap.data().foto || null : null),
        (erro) => console.error('Erro ao ler foto: ', erro)
      )
    })

    return () => {
      cancelarAuth()
      if (cancelarLeitura) cancelarLeitura()
    }
  }, [])

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Principal', { screen: 'Profile' })}>
      <Image
        source={foto ? { uri: foto } : require('../assets/Avatar.png')}
        style={{ width: tamanho, height: tamanho, borderRadius: tamanho / 2 }}
      />
    </TouchableOpacity>
  )
}