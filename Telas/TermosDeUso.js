import { View, StyleSheet, TouchableOpacity, Text, ScrollView} from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default function TermosDeUso() {

  const [fontsLoaded] = useFonts({
    Manrope: Manrope_400Regular,
    ManropeMedium: Manrope_500Medium,
    ManropeSemiBold: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }
  const navigation = useNavigation()
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="keyboard-arrow-left" size={30} color="black" />
          <Text style={styles.textTitle}>Termos De Uso </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
      <View style={[styles.container,{ paddingHorizontal:25}]}>
        <Text style={styles.textInformation}>1. ACEITAÇÃO DOS TERMOS</Text>
        <Text style={styles.textInformation2}> Ao baixar, instalar, acessar ou usar o aplicativo e os serviços do ZEFIR: Detectando riscos, 
          protegendo vidas,  você concorda em cumprir e estar legalmente vinculado a estes Termos de Uso e à Política de Privacidade. 
          Se você não concorda com estes termos, não deve utilizar o software nem conectar os sensores IoT.</Text>
        <Text style={styles.textInformation}>2. LICENÇA DE USO</Text>
        <Text style={styles.textInformation2}>2.1 Concessão de Licença: O ZEFIR concede a você uma licença limitada, não exclusiva, 
          intransferível e revogável para utilizar o aplicativo em seus dispositivos móveis exclusivamente para fins pessoais e 
          residenciais de monitoramento de segurança.</Text>
        <Text style={styles.textInformation2}>2.2 Restrições de Uso: Você concorda em não: (a) copiar, modificar ou criar obras 
          derivadas do software ou do firmware do sensor; (b) realizar engenharia reversa ou tentar extrair o código-fonte do aplicativo 
          ou das transmissões IoT; (c) alugar, sublicenciar ou redistribuir o software a terceiros sem autorização prévia.</Text>
        <Text style={styles.textInformation}>3. ATUALIZAÇÕES</Text>
        <Text style={styles.textInformation2}>O ZEFIR poderá fornecer atualizações, correções de segurança e melhorias do software e do 
          firmware dos sensores periodicamente. Essas atualizações podem ser instaladas automaticamente para garantir a proteção contínua
           da sua residência.</Text>
        <Text style={styles.textInformation}>4. PROPRIEDADE INTELECTUAL</Text>
        <Text style={styles.textInformation2}>Todos os direitos, títulos e interesses relacionados ao software ZEFIR, marcas, logotipos, 
          interface gráfica e código-fonte são de propriedade exclusiva da equipe de desenvolvimento do projeto. Estes termos não concedem 
          a você qualquer direito de propriedade intelectual.</Text>
        <Text style={styles.textInformation}>5. LIMITAÇÃO DE RESPONSABILIDADE</Text>
        <Text style={styles.textInformation2}>O sistema ZEFIR é uma ferramenta auxiliar e preventiva de monitoramento de risco. Em nenhuma 
          circunstância o ZEFIR será responsável por danos decorrentes de falhas na rede Wi-Fi da residência do usuário, interrupções no 
          fornecimento de energia elétrica ou pela falta de manutenção preventiva no imóvel pelo morador.</Text>

        <Text style={styles.textInformation}>6. GARANTIA LIMITADA</Text>
        <Text style={styles.textInformation2}>O software e as transmissões de dados são fornecidos “como estão”. O ZEFIR emprega os melhores 
          esforços técnicos de mercado para assegurar a máxima precisão nas leituras, mas recomenda a manutenção regular dos equipamentos 
          físicos de gás da residência.</Text>

        <Text style={styles.textInformation}>7. RESCISÃO</Text>
        <Text style={styles.textInformation2}>Estes Termos de Uso são efetivos até serem rescindidos. Você pode rescindir estes termos a qualquer 
          momento excluindo sua conta no aplicativo (Excluir Conta). O ZEFIR poderá rescindir o acesso imediatamente caso ocorra descumprimento de 
          qualquer disposição destes termos.</Text>

        <Text style={styles.textInformation}>8. DISPOSIÇÕES GERAIS</Text>
        <Text style={styles.textInformation2}>8.1 Legislação Aplicável: Estes Termos de Uso são regidos e interpretados segundo as leis da República 
          Federativa do Brasil, em especial a LGPD e o Código de Defesa do Consumidor.</Text>
        <Text style={styles.textInformation2}>8.2 Alterações aos Termos: O ZEFIR reserva-se o direito de modificar estes termos a qualquer momento. 
          As alterações serão notificadas diretamente no aplicativo via notificação push.</Text>
        <Text style={styles.textInformation2}>8.3 Acordo Integral: Estes termos constituem o acordo integral entre o usuário e o ZEFIR com
          relação ao uso do software e dos sensores vinculados.</Text>

        <Text style={styles.textInformation}>9. CONTATO E ACEITE</Text>
        <Text style={styles.textInformation2}>Se você tiver dúvidas sobre estes Termos de Uso, entre em contato pelo e-mail: irmaosmetralhaetec@gmail.com.</Text>

      </View>
      </ScrollView>


    </View>
  )
}
const styles = StyleSheet.create({
  //Geral
  screen: {
    flex: 1,
    backgroundColor: 'rgba(164, 181, 196, 0.37)',
  },
  //alinhamento
  container: {
    alignItems: 'center',
  },
  //Cabeçalho
  header: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 10, 
    backgroundColor: 'white', 
    width:'100%',
    height: 90,
    justifyContent:'flex-start',
   paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 15,
  },
  textInformation: {
    fontFamily: 'ManropeBold',
    fontSize: 19,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginVertical:5, 
    alignSelf:'flex-start'
  },
  textInformation2: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginVertical:5
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },


})
