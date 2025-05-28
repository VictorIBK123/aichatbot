import { View,Pressable, Image , StyleSheet, Text, TouchableOpacity, Clipboard} from "react-native"
import { memo, useContext } from "react"
import Ionicons from '@expo/vector-icons/Ionicons'
import { ThemeColor } from "../myContext/mycontext"

// component for each user chat
const ListChildUser: React.FC<any> =({item})=>{
    const {themeColor}= useContext(ThemeColor)
    return(
        <View>
    <View style={{alignSelf: 'flex-end', flexDirection:'row-reverse', maxWidth: '80%',}}>
        <Image source={require('../assets/user.jpg')} style={styles.profileIcon} />
        <Pressable style={[{marginRight:3, backgroundColor:'#24a2f0', borderTopRightRadius:0}, styles.mainChat]}>
            <Text style={{color:'white'}}>{item.message}</Text>
        </Pressable>
        
    </View>
    <TouchableOpacity onPress={()=>{Clipboard.setString(item.message), alert('Copied')}} style={{marginBottom:10}}>
        <Ionicons name="copy-outline" style={{ paddingLeft:40,alignSelf:'flex-end', marginRight:40}} size={15} color={themeColor[3]} />
    </TouchableOpacity>
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
        marginBottom:10, 
        paddingHorizontal:8, 
        borderRadius:5, 
        padding:8
    }
})
export default memo(ListChildUser)