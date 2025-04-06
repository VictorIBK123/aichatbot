import './gesture-handler';
import { ChatScreen } from './screens/chat';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { myContext } from './myContext/mycontext';
import { retrieveData, saveData} from './functions/retrievestoredata';
import { View, Text, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

export default function App() {
  interface Data{
    title: string,
    message: string,
    role: string,
    key: string,
  }
  const [completeChats, setCompleteChats] = useState<Data[]>([])
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
        <Stack.Navigator screenOptions={{headerTintColor:'white',headerTitleAlign:'center', headerStyle:{backgroundColor:'#000000e1', height:70, }, headerLeft: ()=>(<TouchableOpacity style={{marginLeft:10}}><Entypo name='menu' size={24} color={'white'} /><Text style={{color:'white'}}>New</Text></TouchableOpacity> )}}>
          <Stack.Screen component={ChatScreen} name='chatScreen' options={{ title:'Chat Screen'}}  />
        </Stack.Navigator>
      </NavigationContainer>
    </myContext.Provider>
    
  );
}

