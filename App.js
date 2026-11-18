import Route from './Route'
import { iniciarMonitoramentoSensor } from '../services/monitorSensor'
import {NavigationContainer} from '@react-navigation/native'
import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
  const parar = iniciarMonitoramentoSensor()
  return parar
}, [])
  return (
    <NavigationContainer>
      <Route/>
    </NavigationContainer>
  );
}