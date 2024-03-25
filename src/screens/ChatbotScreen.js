import React,{useState, useEffect} from 'react';
import {
    View, 
    Text, 
    TextInput, 
    Pressable, 
    FlatList, 
    ActivityIndicator, 
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import OpenAI from "openai";
import ChatBubble from '../ChatBubble';
import { Keyboard } from 'react-native';
import * as Speech from 'expo-speech';



const Chatbot = ()=> {
    const [chat, setChat]= useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [voice, setVoice] = useState([]);

    const openai = new OpenAI({
        apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });

    useEffect(() => {
        const manageVoice = async () => {
            let voices = await Speech.getAvailableVoicesAsync();
            //console.log(voices);
            //const voice = voices.find(v => v.language === 'en-US' && v.gender === 'Female');
            const voice = voices.find(v => v.language === 'en-US');
            //const voice_test = voices.filter(v => v.language == 'en-US');
            //console.log(voice.identifier)
            setVoice(voice);
        };
        manageVoice();
    }, []);

    const flatListRef = React.useRef();

    const handleGenerateMindMap = async (text) => {
        setLoading(true);
    
        try {
            const response = await fetch('https://mindmap2024.replit.app/mm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'mm_generation_1234',
                },
                body: JSON.stringify({
                    language: 'italian',
                    message: text,
                    type: 'small',
                    physics: 'False',
                }),
            });
    
            const jsonResponse = await response.json();
    
            if (jsonResponse.success && jsonResponse.html) {
                
                //console.log(jsonResponse.html)
                
                setChat(currentChat => [
                    ...currentChat,
                    {
                        role: "model",
                        htmlContent: jsonResponse.html,
                        type: 'mindmap',
                    }
                ]);

                Keyboard.dismiss();
                flatListRef.current?.scrollToEnd({ animated: true });
            } else {
                throw new Error('Failed to generate mind map');
            }
        } catch (error) {
            console.error('Error generating mind map:', error);
            setError("An error occurred while generating the mind map. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleUserInput = async () => {
        let updatedChat = [
            ...chat,
            {
                role:"user",
                parts: [{text: userInput}]
            },
        ];

        setLoading(true);

        try {
            setError(null);

            const response = await openai.chat.completions.create({
                model: process.env.EXPO_PUBLIC_MODEL,
                messages: [
                    {
                    "role": "user",
                    "content": userInput
                    }
                ],
                temperature: 1,
                max_tokens: 512,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            //console.log(response.choices[0]);

            const updatedChatWithModel = [
                ...updatedChat,
                {
                    role:"model",
                    parts:[{text:response.choices[0]["message"]["content"]}]
                },
            ];

            setChat(updatedChatWithModel);
            flatListRef.current?.scrollToEnd({ animated: true });
            Keyboard.dismiss();
            setUserInput("");
        }
        catch(error) {
            console.log(error);
            setError("An error occurred. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };

    const renderChatItem=({item}) => (
        <ChatBubble
            role={item.role}
            text={item.parts ? item.parts[0].text : null}
            voice={voice} 
            onGenerateMindMap={() => handleGenerateMindMap(item.parts[0].text)}
            setLoading={setLoading}            
        />
    );

    return (
        <KeyboardAvoidingView
            style={{flex: 1}} // Make sure it fills the screen
            behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust the behavior based on the platform
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust the vertical offset
        >
        <View style={styles.container}>
            {/* <Text style={styles.title}>OpenAI ChatBot</Text> */}
            <View style={styles.imageContainer}>
                <Image
                source={require('../../assets/DyslexIA.png')}
                style={styles.image}
                resizeMode="contain"
                />
            </View>
            <FlatList
                ref={flatListRef}
                data={chat}
                renderItem={({ item }) => (
                    <ChatBubble
                        role={item.role}
                        text={item.parts ? item.parts[0].text : null}
                        voice={voice} 
                        htmlContent={item.htmlContent}
                        type={item.type}                        
                        onGenerateMindMap={() => handleGenerateMindMap(item.parts[0].text)}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type your message here..."
                    placeholderTextColor="#aaa"
                    value={userInput}
                    onChangeText={setUserInput}
                ></TextInput>
                <Pressable style={styles.button} onPress={handleUserInput}>
                    <Text style={styles.buttonText}>Send</Text>
                </Pressable>
            </View>
            {loading && <ActivityIndicator style={styles.loading} color="#333" />}
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        height: 80,
        width: '100%',
        maxWidth: '100%',
        paddingBottom: 20
    },
    image: {
        height: '100%',
        width: '100%',
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f8f8"
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
        marginTop: 40,
        textAlign: "center"
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems:"center",
        marginTop: 10
    },
    input: {
        flex: 1,
        height: 50,
        marginRight: 10,
        padding: 8,
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 25,
        color: "#333",
        backgroundColor: "#fff"
    },
    button: {
        padding: 10,
        backgroundColor: "#007AFF",
        borderRadius: 25
    },
    buttonText: {
        color: "#fff",
        textAlign: "center"
    },
    loading: {
        marginTop: 10,
    },
    error: {
        color: "red",
        marginTop: 10,
    }
})

export default Chatbot;