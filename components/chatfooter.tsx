import React, { memo } from "react"
import { useContext } from "react"
import { ThemeColor } from "../myContext/mycontext"
import { View, TextInput,TouchableOpacity, ActivityIndicator, Text } from "react-native"
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import Ionicons from '@expo/vector-icons/Ionicons';

interface FooterProps {
    textIn: React.RefObject<TextInput>;
    userMessage: string;
    storeMessage: (text: string) => void;
    showActivityIndicatoe: boolean;
    sendToModel: () => void;
    scrollToEnd: () => void;
    newChatPressed: () => void;
}

const Footer: React.FC<FooterProps> = ({textIn, userMessage, storeMessage, showActivityIndicatoe, sendToModel, scrollToEnd, newChatPressed}) => {
    const {themeColor}= useContext(ThemeColor)
    return (
        <View style={{marginHorizontal:8, flex:2/10, marginBottom:10 }}>
                <View style={{flexDirection:'row',}}>
                    <View style={{height:50, alignItems:'center', borderWidth:1, borderColor:themeColor[3], borderRadius:20, flexDirection:'row', backgroundColor:themeColor[1], flex:9/10}}>
                        {/* <TouchableOpacity style={{flex:1/7, alignItems:'center'}} >
                            <Ionicons name="add-circle-outline" size={30} color={themeColor[3]} />
                        </TouchableOpacity> */}
                        <TextInput ref={textIn} value={userMessage} multiline={true} onChangeText={storeMessage} style={{paddingLeft:20,maxHeight:150, minHeight:50, color:themeColor[3],flex:6/7 }}/>
                        <View style={{flex:1/7, alignItems:'center'}}>
                            { showActivityIndicatoe &&
                                <TouchableOpacity  >
                                    <ActivityIndicator size={30} color={themeColor[3]} />
                                </TouchableOpacity>}
                            {userMessage.trim().length>0 && !showActivityIndicatoe &&
                                <TouchableOpacity onPress={sendToModel}>
                                    <Ionicons name="send-sharp" size={25} color={themeColor[3]} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>  
                    <TouchableOpacity onPress={scrollToEnd} style={{zIndex:10, alignItems:'center', justifyContent:'center', flex:1/10}}>
                        <FontAwesome5 name='arrow-circle-down' size={30} color={themeColor[3]} />
                    </TouchableOpacity> 
                </View>
                <View style={{flexDirection:'row'}}>
                    {/* <TouchableOpacity style={{marginLeft:20, padding:5,borderColor:themeColor[3],borderWidth:1, paddingHorizontal:10, marginTop:10, borderRadius:5, backgroundColor:themeColor[2]}}>
                        <Text style={{color:themeColor[3]}}>Search</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={newChatPressed} style={{marginLeft:20, padding:5,borderColor:themeColor[3],borderWidth:1, paddingHorizontal:10, marginTop:10, borderRadius:5, backgroundColor:themeColor[2]}}>
                        <Text style={{color:themeColor[3], fontWeight:'bold'}}>New Chat</Text>
                    </TouchableOpacity>
                </View>
            </View>
    )
}

export default memo(Footer)