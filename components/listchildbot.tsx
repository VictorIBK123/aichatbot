import { View,Pressable, Image , StyleSheet,Platform, TouchableOpacity, Clipboard} from "react-native"
import { memo, useContext } from "react"
import Markdown from "react-native-markdown-display"
import { ThemeColor } from "../myContext/mycontext"
import Ionicons from '@expo/vector-icons/Ionicons'
// component for each bot chat
const ListChildBot: React.FC<any> =({item})=>{
  const {themeColor}= useContext(ThemeColor)
  return (
    <View style={{alignSelf: "flex-start", flexDirection:'row', maxWidth: '80%',}}>
        <Image source={require('../assets/bot.jpg')} style={styles.profileIcon} />
        <Pressable style={[styles.mainChat,{marginLeft:3}]}>
            <Markdown style={{
            body: { color: themeColor[3]},
            heading1: { color: themeColor[3], backgroundColor:themeColor[0]},
            codeBlock: {
                borderWidth: 1,
                borderColor: '#CCCCCC',
                backgroundColor: themeColor[1],
                padding: 10,
                borderRadius: 4,
                ...Platform.select({
                  ['ios']: {
                    fontFamily: 'Courier',
                  },
                  ['android']: {
                    fontFamily: 'monospace',
                  },
                }),
              },                code_inline: {backgroundColor: themeColor[0],color: themeColor[3],fontFamily: "monospace",paddingHorizontal: 5,borderRadius: 3,},
                hr: {borderBottomWidth: 1,borderBottomColor: themeColor[3],marginVertical: 10,},
                table: {borderWidth: 1,borderColor: themeColor[3],borderRadius: 3,},
                thead: {borderWidth:1, borderColor:themeColor[3] },
                th:{borderWidth:1, borderColor:themeColor[3],fontWeight:'bold' },
                td: {borderWidth:1, borderColor:themeColor[3]},
                link: {color:'#24a2f0', textDecorationLine: 'underline',},

        }}>{item.message}</Markdown>
        <TouchableOpacity onPress={()=>{Clipboard.setString(item.message);alert('Copied')}} style={{marginBottom:10}}>
          <Ionicons name="copy-outline" style={{alignSelf:'flex-end', paddingRight:20}} size={15} color={themeColor[3]} />
        </TouchableOpacity>
        </Pressable>
        
    </View>
)}
const styles = StyleSheet.create({
    profileIcon:{
        height:30,
        width:30, 
        borderRadius:100,
        marginTop:8
    },
    mainChat:{
        paddingHorizontal:8, 
        borderRadius:5, 
        padding:8
    }
})

export default memo(ListChildBot)