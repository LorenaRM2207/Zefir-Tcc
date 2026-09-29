import { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, ActivityIndicator } from 'react-native'
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
import { BarChart } from 'react-native-gifted-charts'
import AntDesign from '@expo/vector-icons/AntDesign'
import { db } from '../config/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function Calendar() {

  const [abaAtiva, setAbaAtiva] = useState('Diário')
  const [loading, setLoading] = useState(true)

  //Um estado pra cada gráfico
  const [dadosQualidade, setDadosQualidade] = useState([])
  const [dadosUmidade, setDadosUmidade] = useState([])
  const [dadosGas, setDadosGas] = useState([])

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })
  //função para puxar os dados 
  useEffect(() => {
    async function buscarDados() {
      try {
        const querySnapshot = await getDocs(collection(db, 'Leitura_sensor'))
        const qualidade = []
        const umidade = []
        const gas = []
        //dados que estão puxando para cada campo 
        querySnapshot.docs.forEach((doc) => {
          const item = doc.data()
          qualidade.push({
            value: item.ppm_gas,       
            label: item.data_hora,
          })
          umidade.push({
            value: item.umidade,
            label: item.data_hora,
          })
          gas.push({
            value: item.nivel_fumaca,
            label: item.data_hora,
          })
        })
        setDadosQualidade(qualidade)
        setDadosUmidade(umidade)
        setDadosGas(gas)
      } catch (error) {
        console.error("Erro ao buscar dados: ", error)
      } finally {
        setLoading(false)
      }
    }
    buscarDados()
  }, [])
  if (!fontsLoaded) {
    return null
  }
  return (
    <View style={styles.screen}>
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
})