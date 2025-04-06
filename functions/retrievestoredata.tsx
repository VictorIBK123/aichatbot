import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import { SetStateAction , Dispatch} from "react"
interface Data{
    title: string,
    message: string,
    role: string,
    key: string,
}
export const retrieveData=  async(completeChats: Data|unknown, setCompleteChats: Dispatch<SetStateAction<Data[]>> , setTheme: React.Dispatch<React.SetStateAction<string>>, theme:string)=>{
      const data=  await AsyncStorage.getItem('aichat')
      const {completeChats1, theme1} = data? await JSON.parse(data): {completeChats1: [{title: 'New Chat', message:'Hello, What can I do for you today', role:'assistant', key:'0'}], theme1:'dark'}
      setCompleteChats(completeChats1)
      setTheme(theme1)
}

export const saveData = async(completeChats: Data|unknown, theme:string)=>{
    await AsyncStorage.setItem('aichat', JSON.stringify({completeChats1: completeChats, theme1: theme}))
}