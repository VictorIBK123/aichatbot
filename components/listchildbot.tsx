import { View,Pressable, Image , StyleSheet, Text, Platform} from "react-native"
import { memo } from "react"
import Markdown from "react-native-markdown-display"
// component for each bot chat
const ListChildBot: React.FC<any> =({item})=>(
    <View style={{alignSelf: "flex-start", flexDirection:'row', maxWidth: '80%',}}>
        <Image source={require('../assets/bot.jpg')} style={styles.profileIcon} />
        <Pressable style={[styles.mainChat,{marginLeft:3}]}>
            <Markdown style={{
            body: { color: "white"},
            heading1: { color: "white" , backgroundColor:'black'},
            codeBlock: {
                borderWidth: 1,
                borderColor: '#CCCCCC',
                backgroundColor: '#000000',
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
              },                code_inline: {backgroundColor: "#000000",color: "#ffffff",fontFamily: "monospace",paddingHorizontal: 5,borderRadius: 3,},
                hr: {borderBottomWidth: 1,borderBottomColor: "#fff",marginVertical: 10,},
                table: {borderWidth: 1,borderColor: '#ffffff',borderRadius: 3,},
                thead: {borderWidth:1, borderColor:'white' },
                th:{borderWidth:1, borderColor:'white',fontWeight:'bold' },
                td: {borderWidth:1, borderColor:'white', },
                link: {color:'#24a2f0', textDecorationLine: 'underline',},

        }}>{item.message}</Markdown>
        </Pressable>
    </View>
)
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

export default memo(ListChildBot)