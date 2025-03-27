import './gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ChatScreen } from './screens/chat';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createContext, useEffect, useState } from 'react';
import { myContext } from './myContext/mycontext';
import { data } from './chats/chats';
import { retrieveData, saveData} from './functions/retrievestoredata';

export default function App() {
  interface Data{
    title: string,
    message: string,
    role: string,
    key: string,
  }
  const [completeChats, setCompleteChats] = useState<Data[]|unknown>([{title: 'Technological Invention', message:'Hello, What can I do for you today', role:'assistant', key:'0'}])
  const [theme, setTheme] = useState<string>('dark')
  const Stack = createStackNavigator()
  useEffect(()=>{
    retrieveData(completeChats, setCompleteChats, setTheme, theme)
  },[])

  useEffect(()=>{
    saveData(completeChats, theme)}, 
    [completeChats, theme]
  )
  return (
    <myContext.Provider value={{completeChats, setCompleteChats, theme, setTheme}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerTitleAlign:'center'}}>
          <Stack.Screen component={ChatScreen} name='chatScreen' options={{headerStyle:{height:70}, title:'Chat Screen'}}  />
        </Stack.Navigator>
      </NavigationContainer>
    </myContext.Provider>
    
  );
}

