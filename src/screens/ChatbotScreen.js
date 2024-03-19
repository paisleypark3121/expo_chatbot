import React,{useState} from 'react';
import {View, Text, TextInput, Pressable, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import OpenAI from "openai";
import ChatBubble from '../ChatBubble';

const Chatbot = ()=> {
    const [chat, setChat]= useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const openai = new OpenAI({
        apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
        //dangerouslyAllowBrowser: true
    });

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
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            console.log(response.choices[0]);

            const updatedChatWithModel = [
                ...updatedChat,
                {
                    role:"model",
                    parts:[{text:response.choices[0]["message"]["content"]}]
                },
            ];

            setChat(updatedChatWithModel);
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
            text={item.parts[0].text}
        />
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>OpenAI ChatBot</Text>
            <FlatList
                data={chat}
                renderItem={renderChatItem}
                keyExtractor={(item, index)=>index.toString()}
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
    );
};

const styles = StyleSheet.create({
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