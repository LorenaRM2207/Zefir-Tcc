import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator, Platform } from 'react-native'
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { useNavigation } from '@react-navigation/native'
//fontes
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//Gráficos
import { useState, useEffect } from 'react'
import { Picker } from '@react-native-picker/picker'
import { BarChart } from 'react-native-gifted-charts'
import { db } from '../config/firebase'
import { collection, getDocs } from 'firebase/firestore'
//icones
import Feather from '@expo/vector-icons/Feather'
import AvatarPerfil from '../components/AvatarPerfil'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

function graficoSvg(dados, cor, opcoes = {}) {
  const W = 640, H = 230, topo = 15, base = 34, esq = 48
  const max = opcoes.max || Math.max(...dados.map((d) => d.value), 1)
  const area = (W - esq) / dados.length
  const larg = Math.min(area * 0.6, 30)
  const alturaUtil = H - topo - base

  const barras = dados.map((d, i) => {
    const h = (d.value / max) * alturaUtil
    const x = esq + i * area + (area - larg) / 2
    return `
      <rect x="${x}" y="${H - base - h}" width="${larg}" height="${h}" fill="${cor}" rx="3"/>
      <text x="${x + larg / 2}" y="${H - base + 14}" font-size="9" text-anchor="middle" fill="#0F0F0F">${d.label}</text>`
  }).join('')

  const linha = opcoes.linha
    ? `<line x1="${esq}" x2="${W}" y1="${H - base - (opcoes.linha / max) * alturaUtil}" y2="${H - base - (opcoes.linha / max) * alturaUtil}" stroke="#D64545" stroke-dasharray="5 4"/>
       <text x="${W}" y="${H - base - (opcoes.linha / max) * alturaUtil - 4}" font-size="9" text-anchor="end" fill="#D64545">limite ${opcoes.linha} ppm</text>`
    : ''

  return `<svg width="100%" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <line x1="${esq}" x2="${W}" y1="${H - base}" y2="${H - base}" stroke="#999"/>
    <text x="${esq - 6}" y="${H - base}" font-size="9" text-anchor="end">0</text>
    <text x="${esq - 6}" y="${topo + 4}" font-size="9" text-anchor="end">${Math.round(max)}</text>
    ${linha}${barras}
  </svg>`
}

const mesesParaNumero = {
  'Jan': 0, 'Fev': 1, 'Mar': 2, 'Abr': 3,
  'Mai': 4, 'Jun': 5, 'Jul': 6, 'Ago': 7,
  'Set': 8, 'Out': 9, 'Nov': 10, 'Dez': 11,
}
const numerosParaMes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

//Rótulos fixos de cada aba
const faixasHorarias = Array.from({ length: 24 }, (_, h) => `${h}h`)
const faixasDeDias = ['1-7', '8-14', '15-21', '22-28', '29-30']
const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

//Dias
function faixaDiaIndex(dia) {
  if (dia <= 7) return 0
  if (dia <= 14) return 1
  if (dia <= 21) return 2
  if (dia <= 28) return 3
  return 4
}
function somar(balde, valor) {
  const n = Number(valor)
  if (Number.isFinite(n)) {
    balde.soma += n
    balde.contagem += 1
  }
}
export default function Calendar() {

  const navigation = useNavigation()
  //Inicio da tela
  const [abaAtiva, setAbaAtiva] = useState('Diário')
  const [loading, setLoading] = useState(true)
  //Dados de cada gráfico
  const [dadosQualidade, setDadosQualidade] = useState([])
  const [dadosUmidade, setDadosUmidade] = useState([])
  const [dadosGas, setDadosGas] = useState([])
  //Filtros
  const [diaSelecionado, setDiaSelecionado] = useState(() => new Date().getDate())
  const [mesSelecionado, setMesSelecionado] = useState(() => numerosParaMes[new Date().getMonth()])
  const [anoSelecionado, setAnoSelecionado] = useState(() => new Date().getFullYear())
  //Compartilhar
  const [gerandoPdf, setGerandoPdf] = useState(false)
  //Fontes
  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  //Cria os rótuloes para cada filtro
  function criarBaldes(rotulos) {
    return rotulos.map((rotulo) => ({ rotulo, soma: 0, contagem: 0 }))
  }
  //Gera o formato final do gráfico
  function finalizarBaldes(baldes) {
    return baldes.map((balde) => ({
      value: balde.contagem > 0 ? balde.soma / balde.contagem : 0,
      label: balde.rotulo,
    }))
  }

  //Filtro Diário
  function processarDiario(querySnapshot) {
    const mesNumero = mesesParaNumero[mesSelecionado]
    const baldesQualidade = criarBaldes(faixasHorarias)
    const baldesUmidade = criarBaldes(faixasHorarias)
    const baldesGas = criarBaldes(faixasHorarias)

    querySnapshot.docs.forEach((doc) => {
      const item = doc.data()
      if (!item.data_hora || typeof item.data_hora.toDate !== 'function') return

      const data = item.data_hora.toDate()
      const bateComFiltro =
        data.getDate() === diaSelecionado &&
        data.getMonth() === mesNumero &&
        data.getFullYear() === anoSelecionado

      if (!bateComFiltro) return

      const indice = data.getHours()

      somar(baldesQualidade[indice], item.ppm_gas)
      somar(baldesUmidade[indice], item.umidade)
      somar(baldesGas[indice], item.ppm_gas)
    })

    setDadosQualidade(finalizarBaldes(baldesQualidade))
    setDadosUmidade(finalizarBaldes(baldesUmidade))
    setDadosGas(finalizarBaldes(baldesGas))
  }

  //Filtro Semanal
  function processarSemanal(querySnapshot) {
    const mesNumero = mesesParaNumero[mesSelecionado]
    const baldesQualidade = criarBaldes(diasDaSemana)
    const baldesUmidade = criarBaldes(diasDaSemana)
    const baldesGas = criarBaldes(diasDaSemana)

    querySnapshot.docs.forEach((doc) => {
      const item = doc.data()
      if (!item.data_hora || typeof item.data_hora.toDate !== 'function') return

      const data = item.data_hora.toDate()
      const bateComFiltro =
        data.getMonth() === mesNumero &&
        data.getFullYear() === anoSelecionado

      if (!bateComFiltro) return

      const indice = data.getDay()

      somar(baldesQualidade[indice], item.ppm_gas)
      somar(baldesUmidade[indice], item.umidade)
      somar(baldesGas[indice], item.ppm_gas)
    })

    setDadosQualidade(finalizarBaldes(baldesQualidade))
    setDadosUmidade(finalizarBaldes(baldesUmidade))
    setDadosGas(finalizarBaldes(baldesGas))
  }

  //Filtro Mensal
  function processarMensal(querySnapshot) {
    const mesNumero = mesesParaNumero[mesSelecionado]
    const baldesQualidade = criarBaldes(faixasDeDias)
    const baldesUmidade = criarBaldes(faixasDeDias)
    const baldesGas = criarBaldes(faixasDeDias)

    querySnapshot.docs.forEach((doc) => {
      const item = doc.data()
      if (!item.data_hora || typeof item.data_hora.toDate !== 'function') return

      const data = item.data_hora.toDate()
      const bateComFiltro =
        data.getMonth() === mesNumero &&
        data.getFullYear() === anoSelecionado

      if (!bateComFiltro) return

      const indice = faixaDiaIndex(data.getDate())

      somar(baldesQualidade[indice], item.ppm_gas)
      somar(baldesUmidade[indice], item.umidade)
      somar(baldesGas[indice], item.ppm_gas)
    })

    setDadosQualidade(finalizarBaldes(baldesQualidade))
    setDadosUmidade(finalizarBaldes(baldesUmidade))
    setDadosGas(finalizarBaldes(baldesGas))
  }

  //Filtro Anual
  function processarAnual(querySnapshot) {
    const baldesQualidade = criarBaldes(numerosParaMes)
    const baldesUmidade = criarBaldes(numerosParaMes)
    const baldesGas = criarBaldes(numerosParaMes)

    querySnapshot.docs.forEach((doc) => {
      const item = doc.data()
      if (!item.data_hora || typeof item.data_hora.toDate !== 'function') return

      const data = item.data_hora.toDate()
      const bateComFiltro = data.getFullYear() === anoSelecionado

      if (!bateComFiltro) return

      const indice = data.getMonth() // 0 a 11

      baldesQualidade[indice].soma += item.ppm_gas
      baldesQualidade[indice].contagem += 1

      baldesUmidade[indice].soma += item.umidade
      baldesUmidade[indice].contagem += 1

      baldesGas[indice].soma += item.nivel_fumaca
      baldesGas[indice].contagem += 1
    })

    setDadosQualidade(finalizarBaldes(baldesQualidade))
    setDadosUmidade(finalizarBaldes(baldesUmidade))
    setDadosGas(finalizarBaldes(baldesGas))
  }

  //Busca dos dados
  useEffect(() => {
    async function buscarDados() {
      try {
        const querySnapshot = await getDocs(collection(db, 'Leitura_sensor'))

        if (abaAtiva === 'Diário') {
          processarDiario(querySnapshot)
        } else if (abaAtiva === 'Semanal') {
          processarSemanal(querySnapshot)
        } else if (abaAtiva === 'Mensal') {
          processarMensal(querySnapshot)
        } else if (abaAtiva === 'Anual') {
          processarAnual(querySnapshot)
        }
      } catch (error) {
        console.error("Erro ao buscar dados: ", error)
      } finally {
        setLoading(false)
      }
    }

    buscarDados()
  }, [abaAtiva, diaSelecionado, mesSelecionado, anoSelecionado])

  function descricaoPeriodo() {
    if (abaAtiva === 'Diário') return `Diário: ${String(diaSelecionado).padStart(2, '0')}/${mesSelecionado}/${anoSelecionado}`
    if (abaAtiva === 'Semanal') return `Semanal: média por dia da semana em ${mesSelecionado}/${anoSelecionado}`
    if (abaAtiva === 'Mensal') return `Mensal: ${mesSelecionado}/${anoSelecionado}`
    return `Anual: ${anoSelecionado}`
  }

  //Gerar PDF
  async function gerarPdf() {
    try {
      setGerandoPdf(true)
      const html = `
      <html><head><meta charset="utf-8"/>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #0F0F0F; }
        h1 { color: #071739; font-size: 22px; margin: 0; }
        h2 { font-size: 16px; margin: 22px 0 4px; }
        p { margin: 4px 0; color: #555; font-size: 13px; }
      </style></head><body>
        <h1>Relatório Zefir</h1>
        <p><b>${descricaoPeriodo()}</b></p>
        <p>Gerado em ${new Date().toLocaleString('pt-BR')}</p>
        <h2>Qualidade do ar</h2>${graficoSvg(dadosQualidade, '#071739')}
        <h2>Umidade relativa do ar (%)</h2>${graficoSvg(dadosUmidade, '#071739')}
        <h2>Vazamento de gás detectado (ppm)</h2>${graficoSvg(dadosGas, '#D64545', { max: 2500, linha: 2100 })}
      </body></html>`

      if (Platform.OS === 'web') {
        await Print.printAsync({ html })
      } else {
        const { uri } = await Print.printToFileAsync({ html })
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Relatório Zefir' })
        }
      }
    } catch (erro) {
      console.error('Erro ao gerar PDF: ', erro)
    } finally {
      setGerandoPdf(false)
    }
  }


  if (!fontsLoaded) {
    return null
  }
  return (
    <View style={styles.screen}>
      {/* Cabeçalho*/}
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TelaSuporte')}
          >
            <MaterialIcons name="support-agent" size={40} color="black" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Calendário</Text>
          <AvatarPerfil />
        </View>
      </View>
      {/* Abas */}
      <View style={styles.container}>
        <View style={styles.boxAbas}>
          {['Anual', 'Mensal', 'Semanal', 'Diário'].map((aba) => (
            <TouchableOpacity key={aba} onPress={() => setAbaAtiva(aba)}>
              <Text style={[styles.textAba, abaAtiva === aba && styles.textAbaAtiva]}>
                {aba}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.dataContainer}>

        {/* Filtro dos dia */}
        <View style={styles.boxData}>
          <Picker
            selectedValue={diaSelecionado}
            onValueChange={(valor) => setDiaSelecionado(Number(valor))}
            style={styles.filtro}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((dia) => (
              <Picker.Item key={dia} label={String(dia)} value={dia} />
            ))}
          </Picker>
        </View>

        {/* Filtro do mês */}
        <View style={styles.boxData}>
          <Picker
            selectedValue={mesSelecionado}
            onValueChange={(valor) => setMesSelecionado(valor)}
            style={styles.filtro}
          >
            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mes) => (
              <Picker.Item key={mes} label={mes} value={mes} />
            ))}
          </Picker>
        </View>

        {/* Filro do ano */}
        <View style={styles.boxData}>
          <Picker
            selectedValue={anoSelecionado}
            onValueChange={(valor) => setAnoSelecionado(Number(valor))}
            style={styles.filtro}
          >
            {[2024, 2025, 2026, 2027].map((ano) => (
              <Picker.Item key={ano} label={String(ano)} value={ano} />
            ))}
          </Picker>
        </View>

      </View>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator size="large" color="#071739" style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* Gráfico de qualidade do ar */}
            <View style={styles.boxGrafico}>
              <View style={{ flexDirection: 'row', }}>
                <TouchableOpacity onPress={gerarPdf} disabled={gerandoPdf || loading}>
                  {gerandoPdf
                    ? <ActivityIndicator size="small" color="#071739" />
                    : <Feather name="share" size={24} color="black" />}
                </TouchableOpacity>
                <Text style={[styles.titleGrafico, { paddingHorizontal: 50 }]}>Qualidade do ar</Text>
              </View>
              {dadosQualidade.length > 0 ? (
                <BarChart
                  data={dadosQualidade}
                  barWidth={18}
                  spacing={22}
                  initialSpacing={10}
                  labelWidth={40}
                  roundedTop
                  hideRules
                  scrollToEnd
                  xAxisThickness={1}
                  yAxisThickness={0}
                  yAxisLabelWidth={70}
                  yAxisLabelTexts={['Péssima', 'Muito Ruim', 'Ruim', 'Moderada', 'Boa']}
                  yAxisTextStyle={{ color: '#0F0F0F', fontSize: 15 }}
                  xAxisLabelTextStyle={{ color: '#0F0F0F', fontSize: 15, textAlign: 'center' }}
                  noOfSections={4}
                  frontColor="#071739"
                />
              ) : (
                <Text style={styles.textVazio}>Nenhum dado encontrado.</Text>
              )}
            </View>

            {/* Gráfico de umidade relativa do ar */}
            <View style={styles.boxGrafico}>
              <Text style={styles.titleGrafico}>Umidade relativa do ar</Text>
              {dadosUmidade.length > 0 ? (
                <BarChart
                  data={dadosUmidade}
                  barWidth={18}
                  spacing={22}
                  initialSpacing={10}
                  roundedTop
                  hideRules
                  scrollToEnd
                  xAxisThickness={1}
                  yAxisThickness={0}
                  maxValue={100}
                  noOfSections={10}
                  stepValue={10}
                  yAxisLabelWidth={50}
                  yAxisTextStyle={{ color: '#0F0F0F', fontSize: 15 }}
                  xAxisLabelTextStyle={{ color: '#0F0F0F', fontSize: 15, textAlign: 'center' }}
                  frontColor="#071739"
                />
              ) : (
                <Text style={styles.textVazio}>Nenhum dado encontrado.</Text>
              )}
            </View>

            {/* Gráfico vazamento de gás */}
            <View style={styles.boxGrafico}>
              <Text style={styles.titleGrafico}>Vazamento de gás detectado</Text>
              {dadosGas.length > 0 ? (
                <BarChart
                  data={dadosGas}
                  barWidth={18}
                  spacing={22}
                  initialSpacing={10}
                  labelWidth={40}
                  roundedTop
                  hideRules
                  scrollToEnd
                  xAxisThickness={1}
                  yAxisThickness={0}
                  maxValue={3000}
                  noOfSections={6}
                  stepValue={500}
                  yAxisLabelWidth={50}
                  yAxisTextStyle={{ color: '#0F0F0F', fontSize: 15 }}
                  xAxisLabelTextStyle={{ color: '#0F0F0F', fontSize: 15, textAlign: 'center' }}
                  showReferenceLine1
                  referenceLine1Position={2100}
                  referenceLine1Config={{ color: '#D64545', dashWidth: 6, dashGap: 4, thickness: 1.5 }}
                  frontColor="#D64545"
                />
              ) : (
                <Text style={styles.textVazio}>Nenhum dado encontrado.</Text>
              )}
            </View>
            <View style={{ height: 100 }} />
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    alignItems: 'center',
    marginTop: 10
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
    marginHorizontal: 50
  },
  boxAbas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 15,
    width: '70%'
  },
  textAba: {
    fontFamily: 'Manrope',
    fontSize: 17,
    color: '#A4B5C4',
  },
  textAbaAtiva: {
    fontFamily: 'ManropeBold',
    color: '#071739',

  },
  boxGrafico: {
    width: '90%',
    borderRadius: 15,
    padding: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  titleGrafico: {
    fontFamily: 'ManropeBold',
    fontSize: 20,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  textVazio: {
    fontFamily: 'Manrope',
    fontSize: 17,
    color: '#0F0F0F',
    paddingVertical: 30,
  },
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 15,
  },
  boxData: {
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A4B5C4',
    justifyContent: 'center',
  },
  filtro: {
    width: 100,
    height: 50,
    color: '#0F0F0F',
  },
})