import React from "react"
import { memo } from "react"
import { View, Text,Pressable, TouchableOpacity, StyleSheet,Dimensions, FlatList, Image } from "react-native"
import Markdown from "react-native-markdown-display"
import ListChildUser from "./listchilduser"
import ListChildBot from "./listchildbot"

interface Data{
    title: string,
    message: string,
    role: string,
    key: string,
}
interface props {
    completeChats: Data[],
    chatRefFL: any
}
const ChatList:React.FC<props> = ({chatRefFL, completeChats})=>{
    
    const {height}  =Dimensions.get('screen')
    return (
        <FlatList
                ref={chatRefFL}
                style={{ paddingHorizontal:5, marginTop:10, height:height-50}}
                data={completeChats}
                renderItem={({item})=>{
                    return(
                        item.role=='assistant'?
                        <ListChildBot item={item} />: <ListChildUser  item={item}/>
                    )
                }}
             />
    )
}
const styles = StyleSheet.create({
    profileIcon:{
        height:30,
        width:30, 
        borderRadius:100,
        marginTop:8
    },
    mainChat:{
        marginBottom:10, 
        paddingHorizontal:8, 
        borderRadius:5, 
        padding:8
    }
})





export default memo(ChatList)