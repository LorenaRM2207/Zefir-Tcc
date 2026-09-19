import { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
import AntDesign from '@expo/vector-icons/AntDesign'

//Componente reutilizável do gráfico de barras
function GraficoBarras({ dados, corBarra }) {
  const maiorValor = Math.max(...dados.map((item) => item.valor))

  return (
    <View style={styles.graficoContainer}>
      {dados.map((item, index) => (
        <View key={index} style={styles.colunaBarra}>
          <View style={styles.areaBarra}>
            <View
              style={[
                styles.barra,
                {
                  height: `${(item.valor / maiorValor) * 100}%`,
                  backgroundColor: corBarra,
                },
              ]}
            />
          </View>
          <Text style={styles.labelBarra}>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}

export default function Calendar() {

  const [abaAtiva, setAbaAtiva] = useState('Diário')

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }

  //Dados de exemplo — troque pelos valores reais depois
  const dadosQualidadeAr = [
    { label: '3', valor: 30 },
    { label: '4', valor: 25 },
    { label: '5', valor: 45 },
    { label: '6', valor: 60 },
    { label: '7', valor: 50 },
  ]

  const dadosUmidade = [
    { label: '1-3', valor: 40 },
    { label: '4-6', valor: 55 },
    { label: '7-9', valor: 65 },
    { label: '10-12', valor: 70 },
    { label: '13-15', valor: 60 },
    { label: '16-18', valor: 75 },
    { label: '19-21', valor: 50 },
    { label: '22-00', valor: 35 },
  ]

  const dadosGas = [
    { label: '1-3', valor: 5 },
    { label: '4-6', valor: 8 },
    { label: '7-9', valor: 3 },
    { label: '10-12', valor: 12 },
    { label: '13-15', valor: 6 },
    { label: '16-18', valor: 4 },
    { label: '19-21', valor: 2 },
    { label: '22-00', valor: 5 },
  ]

  return (
    <View style={styles.screen}>
      {/* Abas Anual / Mensal / Semanal / Diário */}
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

        {/* Seletor de data */}
        <View style={styles.dataContainer}>
          <TouchableOpacity style={styles.boxData}>
            <Text style={styles.textData}>1</Text>
            <AntDesign name="down" size={14} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.boxData}>
            <Text style={styles.textData}>Set</Text>
            <AntDesign name="down" size={14} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.boxData}>
            <Text style={styles.textData}>2026</Text>
            <AntDesign name="down" size={14} color="black" />
          </TouchableOpacity>
        </View>

        {/* Qualidade do ar */}
        <View style={styles.cardGrafico}>
          <Text style={styles.tituloGrafico}>Qualidade do ar</Text>
          <GraficoBarras dados={dadosQualidadeAr} corBarra="#071739" />
        </View>

        {/* Umidade relativa do ar */}
        <View style={styles.cardGrafico}>
          <Text style={styles.tituloGrafico}>Umidade relativa do ar</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.legendaContainer}>
              <Text style={styles.textLegenda}>Nível adequado</Text>
              <Text style={styles.textLegenda}>Observação</Text>
              <Text style={styles.textLegenda}>Atenção</Text>
              <Text style={styles.textLegenda}>Alerta</Text>
              <Text style={styles.textLegenda}>Emergência</Text>
            </View>
            <GraficoBarras dados={dadosUmidade} corBarra="#071739" />
          </View>
        </View>

        {/* Vazamento de gás detectado */}
        <View style={styles.cardGrafico}>
          <Text style={styles.tituloGrafico}>Vazamento de gás detectado</Text>
          <GraficoBarras dados={dadosGas} corBarra="#D64545" />
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  //Abas
  abasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#0F0F0F',
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  textAba: {
    fontFamily: 'Manrope',
    fontSize: 15,
    color: '#A4B5C4',
  },
  textAbaAtiva: {
    fontFamily: 'ManropeBold',
    color: 'white',
    textDecorationLine: 'underline',
  },
  //Seletor de data
  dataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  boxData: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 5,
  },
  textData: {
    fontFamily: 'Manrope',
    fontSize: 15,
  },
  //Cards dos gráficos
  cardGrafico: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
  },
  tituloGrafico: {
    fontFamily: 'ManropeBold',
    fontSize: 18,
    marginBottom: 15,
  },
  //Gráfico de barras
  graficoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 150,
    flex: 1,
  },
  colunaBarra: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  areaBarra: {
    height: '85%',
    justifyContent: 'flex-end',
  },
  barra: {
    width: 18,
    borderRadius: 6,
  },
  labelBarra: {
    fontFamily: 'Manrope',
    fontSize: 11,
    marginTop: 5,
    color: '#0F0F0F',
  },
  //Legenda (Umidade)
  legendaContainer: {
    justifyContent: 'space-between',
    height: 150,
    marginRight: 10,
    paddingBottom: 20,
  },
  textLegenda: {
    fontFamily: 'Manrope',
    fontSize: 10,
    color: '#0F0F0F',
  },
})