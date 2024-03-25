import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import * as Speech from 'expo-speech';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatBubble = ({ role, text, voice, onGenerateMindMap, type, htmlContent }) => {
    const [showWebView, setShowWebView] = useState(false);

    const speak = async () => {
        try {
            //console.log(voice.identifier)
            voide_id=voice.identifier
            voice_id='com.apple.ttsbundle.siri_Nicky_en-US_compact'
            //console.log({text})
            Speech.speak(text, {
                voice: voice ? voice_id : undefined,
                rate: 0.7, // Slower rate
                pitch: 1.5, // Slightly higher pitch
                volume: 0.8 // Slightly lower volume than the max
            });
            // Speech.speak("Hello world", {
            //     voice: voice ? voice.identifier : undefined,
            // });
        }
        catch(error) {
            console.error(error)
        }
    };

    // const speak = async (text) => {
    //     const voices = await Speech.getVoicesAsync();
    //     const voice = voices.find(v => v.language === 'en-US' && v.quality === 'Enhanced' && v.gender === 'Female');
    
    //     Speech.speak(text, {
    //         voice: voice ? voice.identifier : undefined,
    //         //rate: 0.75, // Slower rate
    //         //pitch: 1.2, // Slightly higher pitch
    //         //volume: 0.8 // Slightly lower volume than the max
    //     });
    // };

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
        <View style={role === "user" ? styles.userContainer : styles.modelContainer}>
        <View style={[
            styles.chatItem, 
            role === "user" ? styles.userChatItem : styles.modelChatItem
        ]}>
            <Text style={styles.chatText}>{text}</Text>
        </View>
        {role === "model" && (
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
    modelChatItem: {
        alignSelf: "flex-start",
        backgroundColor: "#00796b",
        flex: 7
    },
    chatText: {
        fontSize: 16,
        color: "#fff"
    },
    modelContainer: {
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
