// import React,{useState} from 'react';
// import {View, Text, TextInput, TouchableOpacity,StyleSheet} from 'react-native';
// import {Ionicons} from "react-native-vector-icons"

// const ChatBubble=({role,text})=> {
//     return (
//         <View style={[styles.chatItem,role==="user"?styles.userChatItem:styles.modelChatItem]}>
//             <Text style={styles.chatText}>
//                 {text}
//             </Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     chatItem: {
//         marginBottom: 10,
//         padding: 10,
//         borderRadius: 10,
//         maxWidth: "70%",
//         position: "relative"
//     },
//     userChatItem: {
//         alignSelf: "flex-end",
//         backgroundColor: "#007AFF"
//     },
//     modelChatItem: {
//         alignSelf: "flex-start",
//         backgroundColor: "#000"
//     },
//     chatText: {
//         fontSize: 16,
//         color: "#fff"
//     }
// });

// export default ChatBubble;

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import * as Speech from 'expo-speech';
import { WebView } from 'react-native-webview'; // Make sure this is correctly imported

const ChatBubble = ({ role, text, onGenerateMindMap, type, htmlContent }) => {
    const [showWebView, setShowWebView] = useState(false);

    const speak = () => {
        Speech.speak(text);
    };

    const handleMindMap = () => {
        if (onGenerateMindMap) {
            onGenerateMindMap(text);
        }
        setShowWebView(true);
    };

    if (type === 'mindmap' && htmlContent) {
        return (
            // <View style={[styles.chatItem, styles.modelChatItem]}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: htmlContent }}
                    style={styles.webView}
                />
            //</View>
        );
    }

    return (
        <View style={[styles.chatItem, role === "user" ? styles.userChatItem : styles.modelChatItem]}>
            <Text style={styles.chatText}>{text}</Text>
            {role === "model" && (
                <View style={styles.buttonsContainer}>
                    <Pressable style={styles.button} onPress={speak}>
                        <Text style={styles.buttonText}>Speak</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={handleMindMap}>
                        <Text style={styles.buttonText}>Mind Map</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    webView: {
        //width: '100%',
        height: 200,
        // Other styles as needed
    },
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
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
});

export default ChatBubble;
