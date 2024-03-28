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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
//import Voice from '@react-native-voice/voice';

const default_system_role_message="You are an helpful assistant"
const default_voice="com.apple.ttsbundle.siri_Nicky_en-US_compact"

const Chatbot = ({ navigation, route })=> {

    const {language}=useAppContext();
    const [systemRole, setSystemRole]=useState( 
        (language) => {
            if (language=="it") 
                return "Sei una assistente virtuale";
            else 
                return default_system_role_message;
        }
    )
    //console.log(systemRole)

    const maxMessages = 10;
    const [chat, setChat] = useState([
        {
            role: "system",
            parts: [{ text: systemRole }],
            streaming: false
        }
    ]);    

    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [voice, setVoice] = useState((language) => {
        if (language=="it") 
            return "com.apple.voice.compact.it-IT.Alice";
        else 
            return default_voice;
    });
    //const [isLoadingVoice, setLoadingVoice] = useState(false);
    const { t } = useTranslation();
    
    useEffect(() => {
        if (route.params?.reset) {
            resetChatbot();
            navigation.setParams({ reset: undefined });
        }
    }, [route.params?.reset]);

    useEffect( () => {
        if (language === "it") {
            setSystemRole("Sei una assistente virtuale");
            setVoice("com.apple.voice.compact.it-IT.Alice")
        } else {
            setSystemRole(default_system_role_message);
            setVoice(default_voice)
        }
    }, [language]);

    useEffect ( () =>{
        setChat([{
            role: "system",
            parts: [{ text: systemRole }],
            streaming: false
        }]);
    }, [systemRole]);

    const resetChatbot = () => {
        setChat([{
            role: "system",
            parts: [{ text: systemRole }],
            streaming: false
        }]);
        setUserInput(""); 
        setLoading(false); 
        setError(null); 
    };

    const appendMessage = (newMessage) => {

        setChat((currentChat) => {
            const messagesWithoutSystem = currentChat.slice(1);
            const updatedMessages = [...messagesWithoutSystem, newMessage];
            if (updatedMessages.length > maxMessages - 1) {
                updatedMessages.shift();
            }
            return [currentChat[0], ...updatedMessages];
        });
    };
    
    const openai = new OpenAI({
        apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });

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
                
                setChat(currentChat => [
                    ...currentChat,
                    {
                        role: "assistant",
                        htmlContent: jsonResponse.html,
                        type: 'mindmap',
                        streaming: false
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
        const newMessageForAPI = { role: "user", content: userInput };
    
        setLoading(true);
    
        try {
            setError(null);
    
            appendMessage({
                role: "user",
                parts: [{ text: userInput }],
                streaming: false
            });

            const messagesForAPI = chat
            .filter(c => c.type !== 'mindmap')
            .map(c => ({ role: c.role, content: c.parts?.[0]?.text || '' })) 
            .concat(newMessageForAPI);
    
            const response = await openai.chat.completions.create({
                model: process.env.EXPO_PUBLIC_MODEL,
                messages: messagesForAPI,
                temperature: 1,
                max_tokens: 512,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
    
            appendMessage({
                role: "assistant",
                parts: [{ text: response.choices[0].message.content }],
                streaming: true
            });
    
            flatListRef.current?.scrollToEnd({ animated: true });
            Keyboard.dismiss();
            setUserInput("");
        }
        catch (error) {
            console.error(error);
            setError("An error occurred. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    

    // const renderChatItem=({item}) => (
    //         <ChatBubble
    //             role={item.role}
    //             text={item.parts ? item.parts[0].text : null}
    //             voice={voice} 
    //             streaming={item.streaming}
    //             onGenerateMindMap={() => handleGenerateMindMap(item.parts[0].text)}
    //             setLoading={setLoading}            
    //         />
    // );

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
                data={chat.filter(item => item.role !== "system")}
                renderItem={({ item }) => (
                    <ChatBubble
                        role={item.role}
                        text={item.parts ? item.parts[0].text : null}
                        voice={voice} 
                        streaming={item.streaming}
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
                    placeholder={t('Type your message here...')}
                    placeholderTextColor="#aaa"
                    value={userInput}
                    onChangeText={setUserInput}
                ></TextInput>
                <Pressable style={styles.micButton} >
                    <Icon name="mic" size={24} color="#fff" />
                </Pressable>
                {/* {isLoadingVoice ? (
                    <Pressable style={styles.micButton} onPress={stopRecording}>
                        <Icon name="stop-circle" size={24} color="#fff" />
                    </Pressable> */}
                {/* ) : (
                    <Pressable style={styles.micButton} onPress={startRecording}>
                        <Icon name="mic" size={24} color="#fff" />
                    </Pressable>
                )} */}
                <Pressable style={styles.button} onPress={handleUserInput}>
                    <Text style={styles.buttonText}>{t('send')}</Text>
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
    },
    micButton: {
        padding: 10,
        marginRight: 10,
        backgroundColor: "#007AFF", // Adatta questo colore se necessario
        borderRadius: 25,
    },
})

export default Chatbot;