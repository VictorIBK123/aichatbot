import './gesture-handler';
import { ChatScreen } from './screens/chat';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useMemo, useState } from 'react';
import { CompleteChatsContext, ThemeContext, HistoryDataContext, ThemeColor } from './myContext/mycontext';
import { retrieveData, saveData} from './functions/retrievestoredata';
import {Text, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

export default function App() {
  interface Data{
    title: string,
    message: string,
    role: string,
    key: string,
    id: number,
  }
  const [completeChats, setCompleteChats] = useState<Data[]>([])
  const [historyData, setHistoryData] = useState<{key: string, title:string}[]>([])
  const [theme, setTheme] = useState<string>('dark')
  const darkTheme =['#101010','#202020','#222222', '#ffffff']
  const lightTheme = ['#ffffff','#f0f0f0','#e0e0e0', '#000000']
  const [themeColor, setThemeColor] = useState<string[]>(darkTheme)
  const Stack = createStackNavigator()
  useEffect(()=>{
    retrieveData(completeChats, setCompleteChats, setTheme, theme, setHistoryData)
  },[])
  useEffect(()=>{
    if (theme=='dark'){
      setThemeColor(darkTheme)
    }else{
      setThemeColor(lightTheme)
    }
  },[theme])

  useEffect(()=>{
    saveData(completeChats, theme)}, 
    [completeChats, theme]
  )
  return (
    <ThemeColor.Provider value={useMemo(()=>({themeColor}),[themeColor])}>
    <HistoryDataContext.Provider value={useMemo(()=>({historyData, setHistoryData}),[historyData,setHistoryData])}>
    <ThemeContext.Provider value={useMemo(()=>({theme, setTheme}),[theme,setTheme])}>
    <CompleteChatsContext.Provider value={useMemo(()=>({completeChats, setCompleteChats}),[completeChats,setCompleteChats])}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerTintColor:themeColor[3],headerTitleAlign:'center', headerStyle:{backgroundColor:themeColor[1], height:70, }, headerLeft: ()=>(<TouchableOpacity style={{marginLeft:10}}><Entypo name='menu' size={24} color={'white'} /><Text style={{color:'white'}}>New</Text></TouchableOpacity> )}}>
          <Stack.Screen component={ChatScreen} name='chatScreen' options={{ title:'Chat Screen'}}  />
        </Stack.Navigator>
      </NavigationContainer>
    </CompleteChatsContext.Provider>
    </ThemeContext.Provider>
    </HistoryDataContext.Provider>
    </ThemeColor.Provider>
    
  );
}

