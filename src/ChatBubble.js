import React,{useState} from 'react';
import {View, Text, TextInput, TouchableOpacity,StyleSheet} from 'react-native';
import {Ionicons} from "react-native-vector-icons"

const ChatBubble=({role,text})=> {
    return (
        <View style={[styles.chatItem,role==="user"?styles.userChatItem:styles.modelChatItem]}>
            <Text style={styles.chatText}>
                {text}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    chatItem: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        maxWidth: "70%",
        position: "relative"
    },
    userChatItem: {
        alignSelf: "flex-end",
        backgroundColor: "#007AFF"
    },
    modelChatItem: {
        alignSelf: "flex-start",
        backgroundColor: "#000"
    },
    chatText: {
        fontSize: 16,
        color: "#fff"
    }
});

export default ChatBubble;