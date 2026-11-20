import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
//fonte de aplicativo
import { useFonts } from 'expo-font'
import { Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
//icones
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome from '@expo/vector-icons/FontAwesome'

export default function PoliticaDePrivacidade() {

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
          <Text style={styles.textTitle}>Política De Privaciade </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
      <View style={[styles.container,{ paddingHorizontal:25}]}>
        <Text style={styles.textInformation}>1. INTRODUÇÃO</Text>
        <Text style={styles.textInformation2}>Esta política descreve como o ZEFIR trata os 
          dados pessoais dos usuários, em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD, Lei nº 13.709/2018), 
          que estabelece as normas de governança de dados aplicáveis ao aplicativo e ao sistema embarcado Zefir.</Text>

        <Text style={styles.textInformation}>2. DADOS COLETADOS</Text>
        <Text style={styles.textInformation2}>O ZEFIR coleta dados cadastrais (nome, e-mail, telefone, endereço) e dados de 
          telemetria preventiva (níveis de gás, fumaça, umidade e temperatura).</Text>

        <Text style={styles.textInformation}>3. BASES LEGAIS</Text>
        <Text style={styles.textInformation2}>A coleta ampara-se nas bases legais de Consentimento (Art. 7º, I da LGPD), 
          Proteção da Vida (Art. 11, II, “a” da LGPD) e Execução de Contrato (Art. 7º, V da LGPD).</Text>

        <Text style={styles.textInformation}>4. CLASSIFICAÇÃO DAS INFORMAÇÕES</Text>
        <Text style={[styles.textInformation2, {marginVertical:2}]}> - Pública: informações que podem ser divulgadas ao público sem restrições.</Text>
        <Text style={[styles.textInformation2, {marginVertical:2}]}> - Confidencial: informações pessoais de identificação que podem causar 
          danos ao usuário se divulgadas indevidamente.</Text>
        <Text style={[styles.textInformation2, {marginVertical:2}]}> - Restrita: informações altamente sensíveis referentes à segurança da residência
           e à proteção da vida humana, que exigem o mais alto nível de proteção.</Text>

        <Text style={styles.textInformation}>5. COMO PROTEGEMOS SEUS DADOS</Text>
        <Text style={[styles.textInformation2, {marginVertical:2}]}> - Confidencialidade: dados pessoais de identificação (nome, CPF, e-mail, 
          telefone, endereço residencial e credenciais de acesso), dados financeiros de cartão de crédito e a lista de contatos de emergência ficam 
          acessíveis apenas aos titulares autorizados e a processos autenticados, com criptografia na camada de transporte (TLS 1.3/HTTPS) e em repouso
           no banco de dados NoSQL (Firebase Firestore).</Text>
        <Text style={[styles.textInformation2, {marginVertical:2}]}> - Integridade: as leituras enviadas pelos sensores IoT (níveis de PPM de gás
           GLP/natural, concentração de fumaça, umidade) chegam ao aplicativo sem alteração, adulteração ou ruído não autorizado.</Text>
        <Text style={[styles.textInformation2, {marginVertical:2}]}> - Disponibilidade: o ambiente em nuvem e os canais de notificação push têm prioridade 
          máxima, com mecanismos de tolerância a falhas para o disparo imediato dos alertas.</Text>
        <Text style={[styles.textInformation2, {marginVertical:2}]}> - Senhas: armazenadas com algoritmos de hash seguros (bcrypt/PBKDF2), nunca em texto claro.</Text>
        <Text style={[styles.textInformation2, {marginVertical:2}]}> - Comunicação: entre o sensor, o aplicativo e o Firebase Firestore, ocorre obrigatoriamente 
          por canais criptografados (TLS 1.3/HTTPS).</Text>

        <Text style={styles.textInformation}>6. ARMAZENAMENTO LOCAL E COOKIES</Text>
        <Text style={styles.textInformation2}>O ZEFIR utiliza Local Storage e cookies estritamente necessários para manter a sessão de login ativa e armazenar 
          temporariamente o cache das últimas leituras para navegação offline. Não são utilizados cookies de terceiros para rastreamento publicitário.</Text>

        <Text style={styles.textInformation}>7. DIREITOS DO TITULAR (Art. 18 da LGPD)</Text>
        <Text style={styles.textInformation2}>O usuário pode exercer a qualquer momento os direitos de confirmar a existência de tratamento, 
          acessar seus dados, corrigir dados incompletos ou requerer a eliminação total de sua conta e histórico, por meio das funcionalidades Consultar Dados Pessoais, 
          Retificar Dados e Excluir Conta.</Text>

        <Text style={styles.textInformation}>8. INCIDENTES DE SEGURANÇA</Text>
        <Text style={styles.textInformation2}>Em conformidade com o Art. 48 da LGPD, a equipe de segurança investigará, conterá e notificará a Autoridade Nacional de 
          Proteção de Dados (ANPD) e os titulares afetados caso ocorra um incidente relevante de segurança.</Text>

        <Text style={styles.textInformation}>9. ENCARREGADO (DPO) E CONTATO</Text>
        <Text style={styles.textInformation2}>Para dúvidas sobre o tratamento de seus dados pessoais ou para exercer seus direitos, entre em contato com nosso Encarregado 
          pelo tratamento de dados (DPO): irmaosmetralhaetec@gmail.com.</Text>

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
    width: '100%',
    height: 90,
    justifyContent: 'flex-start',
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
    marginVertical: 5,
    alignSelf: 'flex-start'
  },
  textInformation2: {
    fontFamily: 'Manrope',
    fontSize: 17,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
    marginVertical: 5
  },
  textTitle: {
    fontFamily: 'ManropeBold',
    fontSize: 22,
    letterSpacing: 1,
    lineHeight: 20,
    color: '#0F0F0F',
  },

})
