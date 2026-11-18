import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../config/firebase'
import { criarNotificacao } from './notificacoes'

const LIMITE_GAS = 210
const UMIDADE_MIN = 40
const UMIDADE_MAX = 60

function verificarLeitura(id, leitura, estado) {
  // ---- Gás ----
  const gas = Number(leitura.ppm_gas)
  if (Number.isFinite(gas)) {
    const novoGas = gas > LIMITE_GAS ? 'alerta' : 'normal'

    if (novoGas === 'alerta' && estado.gas !== 'alerta') {
      criarNotificacao(
        'gas',
        'Possível vazamento de gás!',
        `O sensor detectou ${gas} ppm, acima do limite de ${LIMITE_GAS} ppm.`,
        `gas_${id}`
      )
    }
    estado.gas = novoGas
  }

  // ---- Umidade ----
  const umidade = Number(leitura.umidade)
  if (Number.isFinite(umidade)) {
    let novaUmidade = 'normal'
    if (umidade < UMIDADE_MIN) novaUmidade = 'seca'
    else if (umidade > UMIDADE_MAX) novaUmidade = 'umida'

    if (novaUmidade !== 'normal' && novaUmidade !== estado.umidade) {
      criarNotificacao(
        'umidade',
        novaUmidade === 'seca' ? 'Ambiente seco' : 'Ambiente muito úmido',
        novaUmidade === 'seca'
          ? `A umidade do ar está em ${umidade}%, abaixo de ${UMIDADE_MIN}%.`
          : `A umidade do ar está em ${umidade}%, acima de ${UMIDADE_MAX}%.`,
        `umidade_${novaUmidade}_${id}`
      )
    }
    estado.umidade = novaUmidade
  }
}

export function iniciarMonitoramentoSensor() {
  let cancelarLeitura = null
  const estado = { gas: 'normal', umidade: 'normal' }

  const cancelarAuth = onAuthStateChanged(auth, (usuario) => {
    if (cancelarLeitura) {
      cancelarLeitura()
      cancelarLeitura = null
    }
    estado.gas = 'normal'
    estado.umidade = 'normal'

    if (!usuario) return

    // só a leitura mais recente do usuário
    const consulta = query(
      collection(db, 'Leitura_sensor'),
      where('uid', '==', usuario.uid),
      orderBy('data_hora', 'desc'),
      limit(1)
    )

    cancelarLeitura = onSnapshot(
      consulta,
      (snapshot) => {
        if (snapshot.empty) return
        const d = snapshot.docs[0]
        verificarLeitura(d.id, d.data(), estado)
      },
      (erro) => console.error('Erro ao monitorar sensor:', erro)
    )
  })

  return () => {
    cancelarAuth()
    if (cancelarLeitura) cancelarLeitura()
  }
}