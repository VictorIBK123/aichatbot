import React, { memo, useEffect, useContext, Dispatch, SetStateAction } from "react"
import { View, Text, FlatList, TouchableOpacity, Dimensions } from "react-native"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { CompleteChatsContext, HistoryDataContext, ThemeColor, ThemeContext } from "../myContext/mycontext";

interface Data{
    title: string,
    message: string,
    role: string,
    key: string,
    id: number
}
interface Props{
    navigation: any,
    title: string,
    setTitle: Dispatch<SetStateAction<string>>
    setId: Dispatch<SetStateAction<number>>
    id:number
}
interface CompleteChats{
    completeChats: Data[],
    setCompleteChats: Dispatch<SetStateAction<Data[]>>,
}
interface ThemeColor{
    themeColor: string[],
}
interface HistoryData{
    historyData: { key: string, title: string, id:number }[],
    setHistoryData: Dispatch<SetStateAction<{ key: string, title: string }[]>>
}
interface Theme{
    theme: string,
    setTheme: Dispatch<SetStateAction<string>>
}
const ChatHistory:React.FC<Props> =({navigation, title, setTitle,id, setId})=>{
    const {completeChats } = useContext<CompleteChats>(CompleteChatsContext)
    const {historyData, setHistoryData}= useContext<HistoryData>(HistoryDataContext)
    const {theme, setTheme} = useContext<Theme>(ThemeContext)
    const {themeColor} = useContext<ThemeColor>(ThemeColor)
    const {height, width} = Dimensions.get('screen')
    const menuWidth:number= width - width/4
    const menuLeft = useSharedValue<number>(-menuWidth)
    const animatedMenuStyle = useAnimatedStyle(()=>({left:menuLeft.value}))
    const switchMenuPosition =()=>{
        menuLeft.value==0? menuLeft.value= withTiming(-menuWidth, {duration:300}):menuLeft.value= withTiming(0, {duration:300})
    }
    useEffect(()=>{
        const newArray: ({key:string, title: string, id:number})[] =[]
        const originalArray = completeChats.map((e, index)=>({key:index.toString(),title:e.title, id:e.id}))
        var element
        while (originalArray.length>0){
            element= originalArray.shift()
            if (element?.id !== undefined && !newArray.map((e)=>e.id).includes(element.id)){
                newArray.push(element)
            }
        }
        setHistoryData(newArray.reverse())
    },[title])
    useEffect(()=>{
        navigation.setOptions({headerLeft: ()=>(<TouchableOpacity onPress={switchMenuPosition} style={{marginLeft:10}}><Entypo name='menu' size={24} color={themeColor[3]} /></TouchableOpacity> )})
    },[themeColor])
    const historyClicked =(title: string, id:number): void=>{
        menuLeft.value= withTiming(-menuWidth, {duration:300}, (finished)=>{
            if (finished){
                runOnJS(setAfterHistoryClicked)(title, id)
            }
        })
    }
    const setAfterHistoryClicked = (title: string, id:number): void=>{
        setId(id)
        setTitle(title)
        
    }
    const toggleMode = (): void=>{
        if (theme=='dark'){
            setTheme('light')
        }else{
            setTheme('dark')
        }
    }
    return (<Animated.View style={[{position:'absolute', height:height-height/5, flex:1, zIndex:12,backgroundColor:themeColor[2],  width: width-width/4,}, animatedMenuStyle]}>
        <FlatList
            style={{ flex:9/10}}
            data={historyData}
            renderItem={({item})=>{
                return (
                    <TouchableOpacity  style={{paddingVertical:8, paddingLeft:5, paddingRight:3}} onPress={()=>{historyClicked(item.title, item.id)}}>
                        <Text style={{color:themeColor[3]}}>{item.title}</Text>
                    </TouchableOpacity>
                )
            }}
         />
         <View style={{flex:1/10, alignItems:'center', flexDirection:'row',  marginLeft:5, }}>
            <Text style={{color:themeColor[3], marginRight:5}}>Dark Mode Enabled</Text>
            <TouchableOpacity onPress={toggleMode} style={{alignItems:'center'}} >
                <MaterialIcons name={theme=='dark'? "toggle-on":"toggle-off"} size={50} color={themeColor[3]} />
            </TouchableOpacity>
         </View>
    </Animated.View>)
}


export default memo(ChatHistory)