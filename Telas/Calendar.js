import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native'
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

const mesesParaNumero = {
  'Jan': 0, 'Fev': 1, 'Mar': 2, 'Abr': 3,
  'Mai': 4, 'Jun': 5, 'Jul': 6, 'Ago': 7,
  'Set': 8, 'Out': 9, 'Nov': 10, 'Dez': 11,
}

export default function Calendar() {
  //Dados do gráfico
  const [abaAtiva, setAbaAtiva] = useState('Diário')
  const [loading, setLoading] = useState(true)

  //Um estado pra cada gráfico
  const [dadosQualidade, setDadosQualidade] = useState([])
  const [dadosUmidade, setDadosUmidade] = useState([])
  const [dadosGas, setDadosGas] = useState([])

  //Filtro dos gráficos
  const [diaSelecionado, setDiaSelecionado] = useState(28)
  const [mesSelecionado, setMesSelecionado] = useState('Set')
  const [anoSelecionado, setAnoSelecionado] = useState(2026)

  //Fontes
  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  //função para puxar os dados 
  useEffect(() => {
    async function buscarDados() {
      //nome da coleção 
      try {
        const querySnapshot = await getDocs(collection(db, 'Leitura_sensor'))

        const qualidade = []
        const umidade = []
        const gas = []

        //nome dos campos
        querySnapshot.docs.forEach((doc) => {

          const item = doc.data()
          const dataDoDocumento = item.data_hora.toDate()

          const mesNumero = mesesParaNumero[mesSelecionado]

          if (
            dataDoDocumento.getDate() === diaSelecionado &&
            dataDoDocumento.getMonth() === mesNumero &&
            dataDoDocumento.getFullYear() === anoSelecionado
          ) {
            const horaFormatada = dataDoDocumento.toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })

            qualidade.push({ value: item.ppm_gas, label: horaFormatada })
            umidade.push({ value: item.umidade, label: horaFormatada })
            gas.push({ value: item.nivel_fumaca, label: horaFormatada })
          }
        })
        // Atualiza os dados
        setDadosQualidade(qualidade)
        setDadosUmidade(umidade)
        setDadosGas(gas)
        //Em caso de erro
      } catch (error) {
        console.error("Erro ao buscar dados: ", error)
      } finally {
        setLoading(false)
      }
    }
    buscarDados()
  }, [diaSelecionado, mesSelecionado, anoSelecionado])
  if (!fontsLoaded) {
    return null
  }
  return (
    <View style={styles.screen}>
      <View style={styles.dataContainer}>

        {/* Filtro dos dia */}
        <View style={styles.boxData}>
          <Picker
            selectedValue={diaSelecionado}
            onValueChange={(valor) => setDiaSelecionado(valor)}
            style={styles.picker}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dia) => (
              <Picker.Item key={dia} label={String(dia)} value={dia} />
            ))}
          </Picker>
        </View>

        {/* Filtro do mês */}
        <View style={styles.boxData}>
          <Picker
            selectedValue={mesSelecionado}
            onValueChange={(valor) => setMesSelecionado(valor)}
            style={styles.picker}
          >
            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((mes) => (
              <Picker.Item key={mes} label={mes} value={mes} />
            ))}
          </Picker>
        </View>

        {/* Filro do ano ano */}
        <View style={styles.boxData}>
          <Picker
            selectedValue={anoSelecionado}
            onValueChange={(valor) => setAnoSelecionado(valor)}
            style={styles.picker}
          >
            {[2024, 2025, 2026, 2027].map((ano) => (
              <Picker.Item key={ano} label={String(ano)} value={ano} />
            ))}
          </Picker>
        </View>

      </View>
      {/* Abas */}
      <View style={styles.abasContainer}>
        {['Anual', 'Mensal', 'Semanal', 'Diário'].map((aba) => (
          <TouchableOpacity key={aba} onPress={() => setAbaAtiva(aba)}>
            <Text style={[styles.textAba, abaAtiva === aba && styles.textAbaAtiva]}>
              {aba}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {loading ? (
          <ActivityIndicator size="large" color="#071739" style={{ marginTop: 50 }} />
        ) : (
          <>
            {/* Gráfico de qualidade do ar */}
            <View style={styles.cardGrafico}>
              <Text style={styles.tituloGrafico}>Qualidade do ar</Text>
              {dadosQualidade.length > 0 ? (
                <BarChart
                  data={dadosQualidade}
                  barWidth={18}
                  spacing={16}
                  roundedTop
                  hideRules
                  xAxisThickness={1}
                  yAxisThickness={0}
                  yAxisTextStyle={{ color: '#0F0F0F' }}
                  xAxisLabelTextStyle={{ color: '#0F0F0F', fontSize: 11 }}
                  noOfSections={4}
                  frontColor="#071739"
                />
              ) : (
                <Text style={styles.textVazio}>Nenhum dado encontrado.</Text>
              )}
            </View>

            {/* Gráfico de umidade relativa do ar */}
            <View style={styles.cardGrafico}>
              <Text style={styles.tituloGrafico}>Umidade relativa do ar</Text>
              {dadosUmidade.length > 0 ? (
                <BarChart
                  data={dadosUmidade}
                  barWidth={18}
                  spacing={16}
                  roundedTop
                  hideRules
                  xAxisThickness={1}
                  yAxisThickness={0}
                  yAxisTextStyle={{ color: '#0F0F0F' }}
                  xAxisLabelTextStyle={{ color: '#0F0F0F', fontSize: 11 }}
                  noOfSections={4}
                  frontColor="#071739"
                />
              ) : (
                <Text style={styles.textVazio}>Nenhum dado encontrado.</Text>
              )}
            </View>

            {/* Gráfico vazamento de gás */}
            <View style={styles.cardGrafico}>
              <Text style={styles.tituloGrafico}>Vazamento de gás detectado</Text>
              {dadosGas.length > 0 ? (
                <BarChart
                  data={dadosGas}
                  barWidth={18}
                  spacing={16}
                  roundedTop
                  hideRules
                  xAxisThickness={1}
                  yAxisThickness={0}
                  yAxisTextStyle={{ color: '#0F0F0F' }}
                  xAxisLabelTextStyle={{ color: '#0F0F0F', fontSize: 11 }}
                  noOfSections={4}
                  frontColor="#D64545"
                />
              ) : (
                <Text style={styles.textVazio}>Nenhum dado encontrado.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  abasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingTop: 60,
    paddingBottom: 15,
  },
  textAba: {
    fontFamily: 'Manrope',
    fontSize: 15,
    color: '#A4B5C4',
  },
  textAbaAtiva: {
    fontFamily: 'ManropeBold',
    color: '#071739',
    textDecorationLine: 'underline',
  },
  cardGrafico: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  tituloGrafico: {
    fontFamily: 'ManropeBold',
    fontSize: 16,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  textVazio: {
    fontFamily: 'Manrope',
    fontSize: 14,
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
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    width: 100,
    height: 40,
  },
})