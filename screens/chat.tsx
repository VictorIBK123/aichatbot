import React, { useCallback, useEffect, useRef, useState } from "react"
import { View,FlatList,TextInput, Dimensions } from "react-native"
import { CompleteChatsContext,ThemeColor } from "../myContext/mycontext";
import { useContext } from "react";
import ChatList from "../components/chatlist";
import Chathistory from "../components/chathistory";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import Footer from "../components/chatfooter";
import { GoogleGenAI } from "@google/genai";


interface NewChatProps{
    setTitle: Dispatch<SetStateAction<string>>,
    navigation:any
}

interface props{
    navigation: any
}
interface Data{
    title: string,
    message: string,
    role: string,
    key: string,
    id: number
}
export const ChatScreen: React.FC<props> =({navigation})=>{
    const [title, setTitle] = useState('New Chat')
    const {completeChats, setCompleteChats} = useContext(CompleteChatsContext)
    const [id, setId] = useState<number>(completeChats.length>0?Math.max(...completeChats.map((e: { id: number; })=>e.id))+1:1)
    const chatRefFL = useRef<FlatList>(null)
    const textIn = useRef<TextInput>(null)
    const {themeColor} = useContext(ThemeColor)
    const [data, setData] = useState<Data[]>([]) //data to render in the chat flatlist
    const [showActivityIndicatoe, setShowActivityInndicator] = useState<boolean>(false)
    const [userMessage, setUserMessage] = useState<string>('')
    const {height, width} = Dimensions.get('screen')
    const ai = new GoogleGenAI({ apiKey: "AIzaSyCqNxXZMBNGqQamU9pHXO2wWLvmfCIPR4I" });
    
    useEffect(()=>{
        navigation.setOptions({
        title: title+'...'
        })
    },[title])
    // to scroll down and hide keyboard after a message is added from the bot or user
    useEffect (()=>{
        if (chatRefFL.current){
            chatRefFL.current.scrollToEnd({animated: true})
        }
        if (textIn.current){
            textIn.current.blur()
        }
    },[completeChats])
    useEffect(()=>{
        setData(completeChats.filter((element: { title: string;id:number })=>element.title==title && element.id==id))
    },[title, completeChats,id])
    useEffect(()=>{
        // setting title for new chat
        if (title=='New Chat' && data.length>=2){
                const newTitle = data[0].message.slice(0, 20)
                setTitle(newTitle+'...')
                setCompleteChats(completeChats.map((element: { title: string})=>{
                    if (element.title=='New Chat'){
                        return ({...element, title: newTitle+'...' })
                    }
                    else{
                        return element
                    }
                }))
                
        }
    },[title, data])
    const scrollToEnd =useCallback(()=>{
        chatRefFL.current?.scrollToEnd({animated: true})
    },[chatRefFL])
    
    const sendToModel: ()=>void = useCallback(
        async()=>{
            setShowActivityInndicator(true)
            var message = userMessage
            setUserMessage('')
            if (completeChats.length==0){
                setCompleteChats([{title, role: 'user', message:userMessage, key: '1', id: 1}])
            }
            else {
                setCompleteChats((prev: Data[])=>[...prev, {title, role: 'user', message:userMessage, id, key: (parseInt(prev[prev.length-1].key)+1).toString()}])
            }
            
            
            var chatForwarding = completeChats.length>0?completeChats.filter((item: { title: string; })=>item.title==title).map((element:Data)=>({role:element.role=='assistant'?'model':'user', parts:[{text: element.message}]})).slice(-10):[]

            const chat = ai.chats.create({
                model: "gemini-2.0-flash",
                history: chatForwarding
              });
              try{
                const stream1 = await chat.sendMessage({
                  message
                });
                setShowActivityInndicator(false)
                setCompleteChats((prev: string | any[])=>[...prev, {title, role: 'assistant', message: stream1.text, id, key: (parseInt(prev[prev.length-1].key)+1).toString()}])
              }
              catch(error){
                setShowActivityInndicator(false)
                alert( error);
              }
        },[setShowActivityInndicator, userMessage, setUserMessage, setCompleteChats, completeChats,title]
    ) 
    const storeMessage =useCallback((text: string): void =>{
        setUserMessage(text)
    },[setUserMessage])
    useEffect(()=>{
        navigation.setOptions({title})
    },[])
    const newChatPressed =useCallback(()=>{
        if (showActivityIndicatoe) setShowActivityInndicator(false)
        setData([])
        setId(completeChats.length>0?Math.max(...completeChats.map((e: { id: number; })=>e.id))+1:1)
        setTitle('New Chat')
        navigation.setOptions({
            title: 'New Chat'
        })
    },[setShowActivityInndicator, setData,showActivityIndicatoe, setTitle, navigation])
    return (
        <View style={{flex:1, backgroundColor:themeColor[0]}}>
            <Chathistory navigation={navigation} title={title} id={id} setId={setId} setTitle={setTitle}/>
            <ChatList chatRefFL={chatRefFL} chats={data}/>
            <Footer textIn={textIn} userMessage={userMessage} storeMessage={storeMessage} showActivityIndicatoe={showActivityIndicatoe} sendToModel={sendToModel} scrollToEnd={scrollToEnd} newChatPressed={newChatPressed} />
        </View>
    )
}