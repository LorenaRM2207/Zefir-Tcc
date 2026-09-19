import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Feather from '@expo/vector-icons/Feather'
import Ionicons from '@expo/vector-icons/Ionicons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
//import tela de iniciação
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//exportação das telas
import Profile from './Telas/Profile'
import Notifications from './Telas/Notifications'
import Calendar from './Telas/Calendar'
import Home from './Telas/Home'
import Presentation from './TelasWelcome/Presentation'
import Presentation2 from './TelasWelcome/Presentation2'
import Presentation3 from './TelasWelcome/Presentation3'
import Presentation4 from './TelasWelcome/Presentation4'
import Presentation5 from './TelasWelcome/Presentation5'
import Cadastro from './TelasLogin/TelaCadastro'
import Login from './TelasLogin/TelaLogin'
import RecuperarSenha from './TelasLogin/TelaRecuperarSenha'
import RecuperarSenha2 from './TelasLogin/TelaRecuperarSenha2'
import Rooms from './TelasRoom/Rooms'
import Rooms2 from './TelasRoom/Rooms2'
import Rooms3 from './TelasRoom/Rooms3'
import NewRoom from './TelasRoom/NewRoom'
import Personal from './TelasProfile/TelaPersonal'
import Wallet from './TelasProfile/TelaWallet'
import TelaAddCard from './TelasProfile/TelaAddCard'
import Security from './TelasProfile/TelaSecurity'
import TelaBuy from './Telas/TelaBuy'
import TelaPayment from './Telas/TelaPayment'
import TelaOrder from './Telas/TelaOrder'
import TelaSuporte from './Telas/TelaSuporte'
import TelaConfiguration from './Telas/TelaConfiguration'
import TelaConfigSensor from './Telas/TelaConfigSensor'
import TelaConfigAlert from './Telas/TelaConfigAlert'



const Stack = createNativeStackNavigator()
const MyTabs = createBottomTabNavigator()

function BottomTabs() {
  return (
    //Rodapé - icones e nome
    <MyTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#071739",
        tabBarInactiveTintColor: '#A4B5C4',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          position: 'absolute',
          margin: 30,
          height: 70,
          borderRadius: 45,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOnset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarIconStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        },
      }}
    >
      <MyTabs.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) =>
            (<Ionicons name="home-sharp" size={30} color={color} />)
        }}
      />
      <MyTabs.Screen
        name='Calendar'
        component={Calendar}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" size={30} color={color} />)
        }}
      />
      <MyTabs.Screen
        name='Notifications'
        component={Notifications}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) =>
            (<Ionicons name="notifications" size={30} color={color} />)
        }}
      />
      <MyTabs.Screen
        name='Profile'
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) =>
            (<FontAwesome5 name="user-alt" size={30} color={color} />)
        }}
      />
    </MyTabs.Navigator>
  )
}
//navegação das telas de apresentação 
export default function Route() {
  return (
    //Tela de inicio 
    <Stack.Navigator
      initialRouteName="Presentation"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Telas Welcome*/}
      <Stack.Screen
        name="Presentation"
        component={Presentation}
      />
      <Stack.Screen
        name="Presentation2"
        component={Presentation2}
      />
      <Stack.Screen
        name="Presentation3"
        component={Presentation3}
      />
      <Stack.Screen
        name="Presentation4"
        component={Presentation4}
      />
      <Stack.Screen
        name="Presentation5"
        component={Presentation5}
      />
      {/* Telas Login*/}
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
      />

      <Stack.Screen
        name="RecuperarSenha"
        component={RecuperarSenha}
      />
      <Stack.Screen
        name="RecuperarSenha2"
        component={RecuperarSenha2}
      />
      {/* Tela Home */}
      <Stack.Screen
        name="Principal"
        component={BottomTabs}
      />
      <Stack.Screen
        name="TelaSuporte"
        component={TelaSuporte}
      />
      {/* Tela Configurações */}
      <Stack.Screen
        name="TelaConfiguration"
        component={TelaConfiguration}
      />
      <Stack.Screen
        name="TelaConfigAlert"
        component={TelaConfigAlert}
      />
      <Stack.Screen
        name="TelaConfigSensor"
        component={TelaConfigSensor}
      />
      {/* Tela Ambientes */}
      <Stack.Screen
        name="Rooms"
        component={Rooms}
      />
      <Stack.Screen
        name="Rooms2"
        component={Rooms2}
      />
      <Stack.Screen
        name="Rooms3"
        component={Rooms3}
      />
      <Stack.Screen
        name="NewRoom"
        component={NewRoom}
      />
      {/* Tela dentro do Perfil*/}
      <Stack.Screen
        name="Personal"
        component={Personal}
      />
      <Stack.Screen
        name="Wallet"
        component={Wallet}
      />
      <Stack.Screen
        name="Security"
        component={Security}
      />
      <Stack.Screen
        name="TelaAddCard"
        component={TelaAddCard}
      />
      {/* Telas de compra*/}
      <Stack.Screen
        name="TelaBuy"
        component={TelaBuy}
      />
      <Stack.Screen
        name="TelaPayment"
        component={TelaPayment}
      />
      <Stack.Screen
        name="TelaOrder"
        component={TelaOrder}
      />
    </Stack.Navigator>
  )
}