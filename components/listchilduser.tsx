import { View,Pressable, Image , StyleSheet, Text} from "react-native"
import { memo } from "react"
// component for each user chat
const ListChildUser: React.FC<any> =({item})=>(
    <View style={{alignSelf: 'flex-end', flexDirection:'row-reverse', maxWidth: '80%',}}>
        <Image source={require('../assets/user.jpg')} style={styles.profileIcon} />
        <Pressable style={[{marginRight:3, backgroundColor:'#24a2f0', borderTopRightRadius:0}, styles.mainChat]}>
            <Text>{item.message}</Text>
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
export default memo(ListChildUser)