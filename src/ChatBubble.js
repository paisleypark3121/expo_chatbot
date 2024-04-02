import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import * as Speech from 'expo-speech';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppContext } from './context/AppContext';

const ChatBubble = ({ role, text, voice, onGenerateMindMap, type, htmlContent, streaming }) => {
    const [showWebView, setShowWebView] = useState(false);
    const { font, setFont } = useAppContext();
    const [visibleText, setVisibleText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const chatTextStyle = {
        ...styles.chatText,
        fontFamily: font === 'OpenDyslexic-Regular' ? 'OpenDyslexic-Regular' : 'System',
    };

    // useEffect(() => {
    //     if (streaming) {
    //         let index = 0;
    //         setVisibleText('');
    
    //         const intervalId = setInterval(() => {
    //             //console.log(`Index: ${index}, Char: '${text.charAt(index)}'`);
                
    //             if (index < text.length) {
    //                 setVisibleText(
    //                     (prevText) => {
    //                         //console.log(prevText)
    //                         prevText + text.charAt(index)
    //                     }
    //                 );
    //                 index++;
    //             } else {
    //                 clearInterval(intervalId);
    //             }
    //         }, 80);
    
    //         return () => clearInterval(intervalId); 
    //     } else {
    //         setVisibleText(text);
    //     }
    // }, [text, streaming]); 

    useEffect(() => {
        if (streaming) {
            let index = 0;
            const step=1;
            const sleepTime=100;
            let localVisibleText = ''; // Use a local variable to build up text in chunks

            // Function to update text in chunks
            const updateText = () => {
                // Determine the next chunk of text to add
                const nextChunk = text.substring(index, index + step); // Chunk size of 5, adjust as needed
                localVisibleText += nextChunk;
                index += step; // Move index by chunk size

                // Update state with the new chunk of text
                setVisibleText(localVisibleText);

                // If there's more text to display, schedule the next update
                if (index < text.length) {
                    setTimeout(updateText, sleepTime ); // Update interval, adjust as needed
                }
            };

            updateText(); // Start the text update process

            // Cleanup function to clear the timeout if the component unmounts
            return () => {
                setVisibleText(''); // Optionally reset visibleText on cleanup
            };
        } else {
            setVisibleText(text); // If not streaming, immediately display the full text
        }
    }, [text, streaming]);

    const speak = async () => {
        //console.log(voice)
        if (isSpeaking) {
            Speech.stop();
        } else {
            Speech.speak(text, {
                voice: voice,
                // rate: 0.7,
                // pitch: 1.5,
                // volume: 0.8,
                onDone: () => setIsSpeaking(false),
                onError: () => setIsSpeaking(false),
            });
        }
        setIsSpeaking(!isSpeaking);
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
            {/* <Text style={chatTextStyle}>{text}</Text> */}
            <Text style={chatTextStyle}>{visibleText}</Text>
        </View>
        {role === "assistant" && (
            <View style={styles.buttonsContainer}>
                <Pressable style={styles.button} onPress={speak}>
                    {/* <Text style={styles.buttonText}>Speak</Text> */}
                    <Icon name={isSpeaking ? "stop" : "play-arrow"} size={20} color="#fff" />
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
