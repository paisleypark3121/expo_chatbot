// import React from 'react';
// import { WebView } from 'react-native-webview';
// import { StyleSheet, View } from 'react-native';

// const NetworkGraphPage = () => {
//     return (
//         <View style={styles.container}>
//             <WebView
//                 originWhitelist={['*']}
//                 source={require('../../assets/network_graph.html')}
//                 style={styles.webView}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     webView: {
//         flex: 1,
//     },
// });

// export default NetworkGraphPage;

import React, { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';

const NetworkGraphPage = () => {
    const [htmlContent, setHtmlContent] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://mindmap2024.replit.app/mm', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'mm_generation_1234',
                    },
                    body: JSON.stringify({
                        language: 'italian',
                        message: 'Velletri è una città del lazio situata su una collina ai pendici del Monte Artemisio',
                        type: 'small',
                        physics: 'False',
                    }),
                });

                const jsonResponse = await response.json();
                if (jsonResponse.success && jsonResponse.html) {
                    setHtmlContent(jsonResponse.html);
                } else {
                    console.error('Failed to fetch the HTML content. Response:', jsonResponse);
                    setHtmlContent('<p>Failed to load content.</p>');
                }
            } catch (error) {
                console.error('Error fetching the HTML content:', error);
                setHtmlContent('<p>Error loading content.</p>');
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <WebView
                originWhitelist={['*']}
                source={{ html: htmlContent || '<p>Loading...</p>' }} // Render the HTML or a loading message
                style={styles.webView}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webView: {
        flex: 1,
    },
});

export default NetworkGraphPage;
