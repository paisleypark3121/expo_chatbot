import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import * as Speech from 'expo-speech';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from './context/AppContext';

const ChatBubble = ({ role, text, voice, onGenerateMindMap, type, htmlContent }) => {
    const [showWebView, setShowWebView] = useState(false);
    const { font, setFont } = useAppContext();

    const chatTextStyle = {
        ...styles.chatText,
        fontFamily: font === 'OpenDyslexic-Regular' ? 'OpenDyslexic-Regular' : 'System',
    };

    const speak = async () => {
        // try {
        //     //console.log(voice.identifier)
        //     voide_id=voice.identifier
        //     voice_id='com.apple.ttsbundle.siri_Nicky_en-US_compact'
        //     //console.log({text})
        //     Speech.speak(text, {
        //         voice: voice ? voice_id : undefined,
        //         rate: 0.7, // Slower rate
        //         pitch: 1.5, // Slightly higher pitch
        //         volume: 0.8 // Slightly lower volume than the max
        //     });
        //     // Speech.speak("Hello world", {
        //     //     voice: voice ? voice.identifier : undefined,
        //     // });
        // }
        // catch(error) {
        //     console.error(error)
        // }
        try {
            Speech.speak(text, {
                voice: voice,
                rate: 0.7,
                pitch: 1.5,
                volume: 0.8
            });
        }
        catch(error) {
            console.error(error)
        }
    };

    const handleMindMap = () => {
        if (onGenerateMindMap) {
            onGenerateMindMap(text);
        }
        setShowWebView(true);
    };

    if (type === 'mindmap' && htmlContent) {
        return (
            // <View style={[styles.chatItem, styles.assistantChatItem]}>
                <WebView
                    originWhitelist={['*']}
                    source={{ html: htmlContent }}
                    style={styles.webView}
                />
            //</View>
        );
    }

    return (
        <View style={role === "user" ? styles.userContainer : styles.assistantContainer}>
        <View style={[
            styles.chatItem, 
            role === "user" ? styles.userChatItem : styles.assistantChatItem
        ]}>
            {/* <Text style={styles.chatText}>{text}</Text> */}
            <Text style={chatTextStyle}>{text}</Text>
        </View>
        {role === "assistant" && (
            <View style={styles.buttonsContainer}>
                <Pressable style={styles.button} onPress={speak}>
                    {/* <Text style={styles.buttonText}>Speak</Text> */}
                    <Icon name="volume-up" size={20} color="#fff" />
                </Pressable>
                <Pressable style={styles.button} onPress={handleMindMap}>
                    {/* <Text style={styles.buttonText}>Mind Map</Text> */}
                    <Icon name="map" size={20} color="#fff" />
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
    },
    chatItem: {
        marginBottom: 10,
        padding: 10,
        borderRadius: 10,
        maxWidth: "70%",
        position: "relative",
    },
    userChatItem: {
        alignSelf: "flex-end",
        backgroundColor: "#007AFF",
        maxWidth: '100%'
    },
    assistantChatItem: {
        alignSelf: "flex-start",
        backgroundColor: "#00796b",
        flex: 7
    },
    chatText: {
        fontSize: 16,
        color: "white"
    },
    assistantContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        width: '100%'
    },
    userContainer: {
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        width: '100%'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        //marginTop: 10,
        flex: 3 
    },
    button: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
    },
});

export default ChatBubble;
