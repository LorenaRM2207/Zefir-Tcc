import { Vibration, Platform } from 'react-native'
import * as Notifications from 'expo-notifications'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function criarNotificacao(tipo, titulo, texto, chave) {
  const usuario = auth.currentUser
  if (!usuario) return

  try {
    const ref = doc(db, 'Notificacao', `${usuario.uid}_${chave}`)
    if ((await getDoc(ref)).exists()) return   // já avisou isso

    await setDoc(ref, {
      uid: usuario.uid,
      tipo_notificacao: tipo,
      titulo,
      texto,
      lida: false,
      data_hora: serverTimestamp(),
    })

    const cfg = await getDoc(doc(db, 'Configuracoes', usuario.uid))
    const d = cfg.exists() ? cfg.data() : {}
    if (d.notificacoes === 'Desativadas') return

    const modo = d.alertas || 'Vibrar'
    if (modo === 'Vibrar') {
      Vibration.vibrate([0, 400, 200, 400])
    } else if (modo === 'Sonoro' && Platform.OS !== 'web') {
      const perm = await Notifications.requestPermissionsAsync()
      if (perm.granted) {
        await Notifications.scheduleNotificationAsync({
          content: { title: titulo, body: texto, sound: true },
          trigger: null,
        })
      }
    }
  } catch (erro) {
    console.error('Erro ao criar notificação:', erro.code, erro.message)
  }
}