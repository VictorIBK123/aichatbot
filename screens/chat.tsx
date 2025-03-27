import React, { useEffect, useRef, useState } from "react"
import { View,Text, FlatList, Image, TextInput, Dimensions, Pressable, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"

import { myContext } from "../myContext/mycontext";
import { useContext } from "react";
import Markdown from "react-native-markdown-display";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ChatList from "../components/chatlist";
import Ionicons from '@expo/vector-icons/Ionicons';

interface props{
    navigation: any
}
export const ChatScreen: React.FC<props> =({navigation})=>{
    interface Data{
        title: string,
        message: string,
        role: string,
        key: string,
    }
    const chatRefFL = useRef<FlatList>(null)
    const textIn = useRef<TextInput>(null)
    const {completeChats, setCompleteChats} = useContext(myContext)
    const [showActivityIndicatoe, setShowActivityInndicator] = useState<boolean>(false)
    const [userMessage, setUserMessage] = useState<string>('')
    
    
    // to scroll down and hide keyboard after a message is added from the bot or user
    useEffect (()=>{
        if (chatRefFL.current){
            chatRefFL.current.scrollToEnd ({animated: true})
        }
        if (textIn.current){
            textIn.current.blur()
        }
    },[completeChats])

    const sendToModel: ()=>void = async()=>{
        setShowActivityInndicator(true)
        var message = userMessage
        setUserMessage('')
        setCompleteChats((prev: Data[])=>[...prev, {title:'Technological Invention', role: 'user', message:userMessage, key: (parseInt(prev[prev.length-1].key)+1).toString()}])
        var chatForwarding = completeChats.map((element:Data)=>({role:element.role, content:element.message})).concat({role:'user', content:message}).slice(-10)
        fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": "Bearer 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",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "model": "deepseek/deepseek-chat-v3-0324:free",
              "messages": chatForwarding
            })
          })
          .then((res)=>res.json())
          .then((response)=>{
            setShowActivityInndicator(false)
            setCompleteChats((prev: Data[])=>[...prev, {title:'Technological Invention', role: response.choices[0].message.role, message: response.choices[0].message.content, key: (parseInt(prev[prev.length-1].key)+1).toString()}])
            }
        )
          .catch((e)=>{setShowActivityInndicator(false); alert(e.message)})
    }
    const storeMessage =(text: string): void =>{
        setUserMessage(text)
    }
    useEffect(()=>{
        navigation.setOptions({title:'Technology Innovation'})
    },[])
    return (
        <View style={{flex:1, backgroundColor:'#000000e1'}}>
            <ChatList chatRefFL={chatRefFL} completeChats={completeChats} />
            <View style={{height:50, borderWidth:1, borderColor:'white',alignItems:'center', marginHorizontal:10, borderRadius:20, flexDirection:'row'}}>
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
        </View>
    )
}

