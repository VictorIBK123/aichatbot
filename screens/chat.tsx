import React, { useCallback, useEffect, useRef, useState } from "react"
import { View,Text, FlatList,TextInput, Dimensions } from "react-native"
import { CompleteChatsContext,ThemeColor } from "../myContext/mycontext";
import { useContext } from "react";
import Markdown from "react-native-markdown-display";
import ChatList from "../components/chatlist";
import Chathistory from "../components/chathistory";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import Footer from "../components/chatfooter";

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
    const [id, setId] = useState<number>(completeChats.length>0?completeChats[completeChats.length-1].id+1:1)
    const chatRefFL = useRef<FlatList>(null)
    const textIn = useRef<TextInput>(null)
    const {themeColor} = useContext(ThemeColor)
    const [data, setData] = useState<Data[]>([]) //data to render in the chat flatlist
    const [showActivityIndicatoe, setShowActivityInndicator] = useState<boolean>(false)
    const [userMessage, setUserMessage] = useState<string>('')
    const {height, width} = Dimensions.get('screen')
    const [model, setModel] = useState<string>("deepseek/deepseek-chat-v3-0324:free")
    const fetchHeaders = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      }
     
    useEffect(()=>{
        navigation.setOptions({
        title
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
        console.log(completeChats)
        console.log(id)
        setData(completeChats.filter((element: { title: string;id:number })=>element.title==title && element.id==id))
    },[title, completeChats,id])
    useEffect(()=>{
        // setting title for new chat
        if (title=='New Chat' && data.length>=2){
                const newTitle = data[0].message.slice(0, 20)
                setTitle(newTitle)
                setCompleteChats(completeChats.map((element: { title: string})=>{
                    if (element.title=='New Chat'){
                        return ({...element, title: newTitle })
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
            else if (title=='New Chat'){
                setCompleteChats((prev: Data[])=>[...prev, {title, role: 'user', message:userMessage, id: prev[prev.length-1].id+1, key: (parseInt(prev[prev.length-1].key)+1).toString()}])
            }
            else{
                setCompleteChats((prev: Data[])=>[...prev, {title, role: 'user', message:userMessage, id: prev[prev.length-1].id, key: (parseInt(prev[prev.length-1].key)+1).toString()}])
            }
            
            var chatForwarding = completeChats.length>0?completeChats.filter((item: { title: string; })=>item.title==title).map((element:Data)=>({role:element.role, content:element.message})).concat({role:'user', content:message}).slice(-10):[{role:'user', content:message}]
            axios.post("https://openrouter.ai/api/v1/chat/completions", 
                {
                    model: model,
                    messages: chatForwarding
                  },
                {headers: fetchHeaders}
              )
              .then((response)=>{
                setShowActivityInndicator(false)
                setCompleteChats((prev: Data[])=>[...prev, {title, role: response.data.choices[0].message.role, message: response.data.choices[0].message.content, id:prev[prev.length-1].id, key: (parseInt(prev[prev.length-1].key)+1).toString()}])
                }
            )
              .catch((e)=>{setShowActivityInndicator(false); alert(e.message)})
        },[setShowActivityInndicator, userMessage, setUserMessage, setCompleteChats, completeChats,title, model, fetchHeaders, ]
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
        setId(completeChats.length>0?completeChats[completeChats.length-1].id+1:1)
        setTitle('New Chat')
        navigation.setOptions({
            title: 'New Chat'
        })
    },[setShowActivityInndicator, setData,showActivityIndicatoe, setTitle, navigation])
    const onOffSearch =useCallback(()=>{
        setModel(model=="deepseek/deepseek-chat-v3-0324:free"?"deepseek/deepseek-chat-v3-0324:free:online":"deepseek/deepseek-chat-v3-0324:free")
    },[model, setModel])
    return (
        <View style={{flex:1, backgroundColor:themeColor[0]}}>
            <Chathistory navigation={navigation} title={title} id={id} setId={setId} setTitle={setTitle}/>
            <ChatList chatRefFL={chatRefFL} chats={data}/>
            <Footer textIn={textIn} userMessage={userMessage} storeMessage={storeMessage} showActivityIndicatoe={showActivityIndicatoe} sendToModel={sendToModel} scrollToEnd={scrollToEnd} onOffSearch={onOffSearch} newChatPressed={newChatPressed} model={model}/>
        </View>
    )
}