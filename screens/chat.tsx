import React, { useEffect, useRef, useState } from "react"
import { View,Text, FlatList, Image, TextInput, Dimensions, Pressable, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"

import { myContext } from "../myContext/mycontext";
import { useContext } from "react";
import Markdown from "react-native-markdown-display";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ChatList from "../components/chatlist";
import Ionicons from '@expo/vector-icons/Ionicons';
import Chathistory from "../components/chathistory";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Dispatch, SetStateAction } from "react";
import axios from "axios";

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
}
export const ChatScreen: React.FC<props> =({navigation})=>{
    const [title, setTitle] = useState('New Chat')
    const chatRefFL = useRef<FlatList>(null)
    const textIn = useRef<TextInput>(null)
    const {completeChats, setCompleteChats} = useContext(myContext)
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
        setData(completeChats.filter((element: { title: string; })=>element.title==title))
    },[title, completeChats])
    useEffect(()=>{
        // setting title for new chat
        if (title=='New Chat' && data.length>=2){
            console.log('fetching title')
            console.log(data.length)
                const newTitle = data[0].message.slice(0, 20)
                console.log(newTitle)
                setTitle(newTitle)
                setCompleteChats(completeChats.map((element: { title: string; })=>{
                    if (element.title=='New Chat'){
                        return ({...element, title: newTitle })
                    }
                    else{
                        return element
                    }
                }))
        }
    },[title, data])
    const scrollToEnd =()=>{
        chatRefFL.current?.scrollToEnd({animated: true})
    }
    
    const sendToModel: ()=>void = async()=>{
        setShowActivityInndicator(true)
        var message = userMessage
        setUserMessage('')
        setCompleteChats((prev: Data[])=>[...prev, {title, role: 'user', message:userMessage, key: (parseInt(prev[prev.length-1].key)+1).toString()}])
        var chatForwarding = completeChats.filter((item: { title: string; })=>item.title==title).map((element:Data)=>({role:element.role, content:element.message})).concat({role:'user', content:message}).slice(-10)
        axios.post("https://openrouter.ai/api/v1/chat/completions", 
            {
                model: model,
                messages: chatForwarding
              },
            {headers: fetchHeaders}
          )
          .then((response)=>{
            setShowActivityInndicator(false)
            setCompleteChats((prev: Data[])=>[...prev, {title, role: response.data.choices[0].message.role, message: response.data.choices[0].message.content, key: (parseInt(prev[prev.length-1].key)+1).toString()}])
            }
        )
          .catch((e)=>{setShowActivityInndicator(false); alert(e.message)})
    }
    const storeMessage =(text: string): void =>{
        setUserMessage(text)
    }
    useEffect(()=>{
        navigation.setOptions({title})
    },[])
    const newChatPressed =()=>{
        if (showActivityIndicatoe) setShowActivityInndicator(false)
        setData([])
        setTitle('New Chat')
        navigation.setOptions({
            title: 'New Chat'
        })
    }
    const onOffSearch =()=>{
        setModel(model=="deepseek/deepseek-chat-v3-0324:free"?"deepseek/deepseek-chat-v3-0324:free:online":"deepseek/deepseek-chat-v3-0324:free")
    }
    return (
        <View style={{flex:1, backgroundColor:'#101010'}}>
            <Chathistory navigation={navigation} title={title} setTitle={setTitle}/>
            <ChatList chatRefFL={chatRefFL} chats={data}/>
            <View style={{marginHorizontal:8, flex:2/10, marginBottom:10 }}>
                <View style={{flexDirection:'row',}}>
                    <View style={{height:50, alignItems:'center', borderWidth:1, borderColor:'white', borderRadius:20, flexDirection:'row', backgroundColor:'#202020', flex:9/10}}>
                        <TouchableOpacity style={{flex:1/7, alignItems:'center'}} >
                            <Ionicons name="add-circle-outline" size={30} color="white" />
                        </TouchableOpacity>
                        <TextInput ref={textIn} value={userMessage} multiline={true} onChangeText={storeMessage} style={{maxHeight:150, minHeight:50, color:'white',flex:5/7 }}/>
                        <View style={{flex:1/7, alignItems:'center'}}>
                            { showActivityIndicatoe &&
                                <TouchableOpacity  >
                                    <ActivityIndicator size={30} color={'white'} />
                                </TouchableOpacity>}
                            {userMessage.trim().length>0 && !showActivityIndicatoe &&
                                <TouchableOpacity onPress={sendToModel}>
                                    <MaterialCommunityIcons name="send-circle-outline" size={30} color="white" />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>  
                    <TouchableOpacity onPress={scrollToEnd} style={{zIndex:10, alignItems:'center', justifyContent:'center', flex:1/10}}>
                        <FontAwesome5 name='arrow-circle-down' size={30} color='white' />
                    </TouchableOpacity> 
                </View>
                <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={onOffSearch} style={{marginLeft:20, padding:5,borderColor:'white',borderWidth:1, paddingHorizontal:10, marginTop:10, borderRadius:5, backgroundColor:model=="deepseek/deepseek-chat-v3-0324:free"?'#222222':'#24a2f0'}}>
                        <Text style={{color:'white'}}>Search</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={newChatPressed} style={{marginLeft:20, padding:5,borderColor:'white',borderWidth:1, paddingHorizontal:10, marginTop:10, borderRadius:5, backgroundColor:'#222222'}}>
                        <Text style={{color:'white', fontWeight:'bold'}}>New Chat</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}