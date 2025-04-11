import React, { useContext, useRef } from "react"
import { memo } from "react"
import { View, Text, StyleSheet,Dimensions, FlatList, Image } from "react-native"
import ListChildUser from "./listchilduser"
import ListChildBot from "./listchildbot"
import { ThemeColor } from "../myContext/mycontext"

interface Data{
    title: string,
    message: string,
    role: string,
    key: string,
}
interface props {
    chats: Data[],
    chatRefFL: any
}

const ChatList:React.FC<props> = ({chatRefFL, chats})=>{
    const {height}  =Dimensions.get('screen')
    const {themeColor} = useContext(ThemeColor)
    return (
        chats.length>0?
        <FlatList
            ref={chatRefFL}
            style={{ paddingHorizontal:5, marginTop:10, flex:8/10}}
            data={chats}
            renderItem={({item})=>{
                return(
                    item.role=='assistant'?
                    <ListChildBot item={item} />: <ListChildUser  item={item}/>
                )
            }}
            />
            :
        <View style={{flex:1,  paddingHorizontal:8, justifyContent:'center', alignItems:'center'}}>
            <Image style={{ height:150, width:150, borderRadius:150}} source={require('../assets/bot.jpg')} />
            <Text style={{color:themeColor[3], textAlign:'center', marginTop:20, fontSize:17, fontWeight:'bold'}}>Hello, I am your AI Personal Assistant ?</Text>
            <Text style={{color:themeColor[3], textAlign:'center', marginTop:5, fontSize:15}}>How can I help you today?</Text>
        </View>
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