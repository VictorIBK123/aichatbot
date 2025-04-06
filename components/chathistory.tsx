import React, { memo, useEffect, useState, useContext, Dispatch, SetStateAction } from "react"
import { View, Text, FlatList, TouchableOpacity, Dimensions } from "react-native"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import Entypo from '@expo/vector-icons/Entypo';
import { myContext } from "../myContext/mycontext";

interface Data{
    title: string,
    message: string,
    role: string,
    key: string,
}
interface Props{
    navigation: any,
    title: string,
    setTitle: Dispatch<SetStateAction<string>>
}
interface Context{
    completeChats: Data[],
    setCompleteChats: Dispatch<SetStateAction<Data[]>>
}
const ChatHistory:React.FC<Props> =({navigation, title, setTitle})=>{
    console.log('history rendered')
    const {completeChats, setCompleteChats} = useContext<Context>(myContext)
    const {height, width} = Dimensions.get('screen')
    const menuWidth:number= width - width/4
    const menuLeft = useSharedValue<number>(-menuWidth)
    const animatedMenuStyle = useAnimatedStyle(()=>({left:menuLeft.value}))
    const [data, setData] = useState<{key: string, title:string}[]>()
    const switchMenuPosition =()=>{
        menuLeft.value==0? menuLeft.value= withTiming(-menuWidth, {duration:300}):menuLeft.value= withTiming(0, {duration:300})
    }
    useEffect(()=>{
        setData(completeChats.map((element, index)=>{
            return ({key:index.toString(), title:element.title})
        }).reverse().filter((element,index, self)=>{
            if(index>0 && self[index].title!=self[index-1].title){
                return true
            }
            else return false
        }))
    },[title])
    useEffect(()=>{
        navigation.setOptions({headerLeft: ()=>(<TouchableOpacity onPress={switchMenuPosition} style={{marginLeft:10}}><Entypo name='menu' size={24} color={'white'} /></TouchableOpacity> )})
    },[])
    const historyClicked =(title: string): void=>{
        menuLeft.value= withTiming(-menuWidth, {duration:300}, (finished)=>{
            if (finished){
                runOnJS(setTitle)(title)
            }
        })
        
        
    }
    return (<Animated.View style={[{position:'absolute', height, flex:1, zIndex:12}, animatedMenuStyle]}>
        <FlatList
            style={{backgroundColor:'#222222',  zIndex:10, width: width-width/4}}
            data={data}
            renderItem={({item})=>{
                return (
                    <TouchableOpacity  style={{paddingVertical:8, paddingLeft:5, paddingRight:3}} onPress={()=>{historyClicked(item.title)}}>
                        <Text style={{color:'white'}}>{item.title}</Text>
                    </TouchableOpacity>
                )
            }}
         />
    </Animated.View>)
}

export default memo(ChatHistory)