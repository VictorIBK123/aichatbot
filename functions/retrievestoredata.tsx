import AsyncStorage from "@react-native-async-storage/async-storage"
import React from "react"
import { SetStateAction , Dispatch} from "react"
interface Data{
    title: string,
    message: string,
    role: string,
    key: string,
    id: number
}
export const retrieveData=  async(completeChats: Data|unknown, setCompleteChats: Dispatch<SetStateAction<Data[]>> , setTheme: React.Dispatch<React.SetStateAction<string>>, theme:string, setHistoryData: Dispatch<SetStateAction<{ key: string, title: string }[]>>)=>{
      const data=  await AsyncStorage.getItem('aichat')
      const {completeChats1, theme1} = data? await JSON.parse(data): {completeChats1: [], theme1:'dark'}
      setCompleteChats(completeChats1)
      setTheme(theme1)
      setHistoryData(completeChats1.map((element:{title: string, id:number}, index: number)=>{
        return ({key:index.toString(), title:element.title, id:element.id})
    }).reverse().filter((element: { key: string; title: string }, index: number, self: { key: string; title: string }[]) => {
        if (index==0) return true
        else if(index>0 && self[index].title!=self[index-1].title) return true
        else return false
    }))
}

export const saveData = async(completeChats: Data|unknown, theme:string)=>{
    await AsyncStorage.setItem('aichat', JSON.stringify({completeChats1: completeChats, theme1: theme}))
}