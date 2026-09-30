import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator, Image } from 'react-native'
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


const mesesParaNumero = {
  'Jan': 0, 'Fev': 1, 'Mar': 2, 'Abr': 3,
  'Mai': 4, 'Jun': 5, 'Jul': 6, 'Ago': 7,
  'Set': 8, 'Out': 9, 'Nov': 10, 'Dez': 11,
}
const numerosParaMes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

//Rótulos fixos de cada aba
const faixasHorarias = ['1-3', '4-6', '7-9', '10-12', '13-15', '16-18', '19-21', '22-00']
const faixasDeDias = ['1-7', '8-14', '15-21', '22-28', '29-30']
const diasDaSemana = [1, 2, 3, 4, 5, 6, 7]

//Horário
function faixaHorariaIndex(hora) {
  if (hora >= 1 && hora <= 3) return 0
  if (hora >= 4 && hora <= 6) return 1
  if (hora >= 7 && hora <= 9) return 2
  if (hora >= 10 && hora <= 12) return 3
  if (hora >= 13 && hora <= 15) return 4
  if (hora >= 16 && hora <= 18) return 5
  if (hora >= 19 && hora <= 21) return 6
  return 7 
}
//Dias
function faixaDiaIndex(dia) {
  if (dia <= 7) return 0
  if (dia <= 14) return 1
  if (dia <= 21) return 2
  if (dia <= 28) return 3
  return 4
}
export default function Calendar() {

  //Inicio da tela
  const [abaAtiva, setAbaAtiva] = useState('Diário')
  const [loading, setLoading] = useState(true)
  //Dados de cada gráfico
  const [dadosQualidade, setDadosQualidade] = useState([])
  const [dadosUmidade, setDadosUmidade] = useState([])
  const [dadosGas, setDadosGas] = useState([])
  //Filtros
  const [diaSelecionado, setDiaSelecionado] = useState(10)
  const [mesSelecionado, setMesSelecionado] = useState('Jul')
  const [anoSelecionado, setAnoSelecionado] = useState(2026)
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

      const indice = faixaHorariaIndex(data.getHours())

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

  //Filtro Semanal
  function processarSemanal(querySnapshot) {
    const mesNumero = mesesParaNumero[mesSelecionado]
    const baldesQualidade = criarBaldes(diasDaSemana.map(String))
    const baldesUmidade = criarBaldes(diasDaSemana.map(String))
    const baldesGas = criarBaldes(diasDaSemana.map(String))

    querySnapshot.docs.forEach((doc) => {
      const item = doc.data()
      if (!item.data_hora || typeof item.data_hora.toDate !== 'function') return

      const data = item.data_hora.toDate()
      const bateComFiltro =
        data.getMonth() === mesNumero &&
        data.getFullYear() === anoSelecionado

      if (!bateComFiltro) return

      const indice = data.getDay() // 0 a 6

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
            <Feather name="message-square" size={35} color="black" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Calendário</Text>
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((dia) => (
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
                <Feather name="share" size={24} color="black" />
                <Text style={[styles.titleGrafico, { paddingHorizontal: 50 }]}>Qualidade do ar</Text>
              </View>
              {dadosQualidade.length > 0 ? (
                <BarChart
                  data={dadosQualidade}
                  barWidth={18}
                  spacing={16}
                  roundedTop
                  hideRules
                  xAxisThickness={1}
                  yAxisThickness={0}
                  yAxisTextStyle={{ color: '#0F0F0F', fontSize: 17 }}
                  xAxisLabelTextStyle={{ color: '#0F0F0F', fontSize: 15 }}
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
                  spacing={16}
                  roundedTop
                  hideRules
                  xAxisThickness={1}
                  yAxisThickness={0}
                  yAxisTextStyle={{ color: '#0F0F0F', fontSize: 17 }}
                  xAxisLabelTextStyle={{ color: '#0F0F0F', fontSize: 15 }}
                  noOfSections={4}
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
                  spacing={16}
                  roundedTop
                  hideRules
                  xAxisThickness={1}
                  yAxisThickness={0}
                  yAxisTextStyle={{ color: '#0F0F0F', fontSize: 17 }}
                  xAxisLabelTextStyle={{ color: '#0F0F0F', fontSize: 16 }}
                  noOfSections={4}
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
    lineHeight: 20,
    color: '#0F0F0F',
    marginHorizontal: 50
  },
  imageHeader: {
    width: 50,
    height: 50,
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
  },
  filtro: {
    width: 100,
    height: 40,
  },
})