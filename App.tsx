/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef, useState} from 'react';
import {
    Image,
    PermissionsAndroid,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text, TouchableHighlight, useWindowDimensions,
    View,
    StatusBar,
    LinearGradient,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import {SearchBox} from "./src/components/SearchBox";
import {Section} from "./src/components/Section";
import {GoogleGenerativeAI} from "@google/generative-ai";
import Markdown from 'react-native-markdown-display';
import LottieView from "lottie-react-native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {CAMERA_SOURCE} from "./src/constants/index";

function App(): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const [aiResponse, setAiResponse] = useState<string>("Hello, I am Plif, AI model, Integrated with gemini (developed by google). I am designed to provide information and assist users with a wide range of topics and tasks.");
  const [searchInProgress, setSearchInProgress] = useState<boolean>(false);
  const [image, setImage] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string>();
  const geminiProModel = useRef(new GoogleGenerativeAI("")
      .getGenerativeModel({ model: "gemini-1.5-flash"}));

    const onSearch = async (prompt) => {
        setSearchInProgress(true)
        try {
            let request = prompt;
            if(image != null && prompt != null) {
             request = [prompt, image];
            } else if((prompt == undefined || prompt == null) && image != null) {
                request = [image];
            }
            const result = await geminiProModel.current.generateContent(request);
            const response = await result.response;
            const responseAsText = response.text();
            if(responseAsText) {
                setAiResponse(responseAsText);
            } else {
                setAiResponse("No Response");
            }
        } catch (e) {
            setAiResponse("Error Response for prompt '" + prompt + "' -: " + e);
        }
        setSearchInProgress(false);
    }

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
            }
            // } else {
            //     console.log('Camera permission denied');
            // }
        } catch (err) {
            console.warn(err);
        }
    };

    const onSearchWithImage = async (source) => {
        await requestCameraPermission();
        let response
        if(source === CAMERA_SOURCE) {
            response = await launchCamera({
                mediaType: 'mixed',
                includeBase64: true,
            });
        } else {
            response = await launchImageLibrary({
                mediaType: 'mixed',
                includeBase64: true,
            });
        }
        setSearchInProgress(true);
        try {
            if(response.assets && response.assets[0]) {
                const imageData = {
                    inlineData: {
                        data: response.assets[0].base64,
                        mimeType: response.assets[0].type,
                    },
                };
                setImage(imageData);
                console.warn("image uri: " + response.assets[0].uri);
                setImageUri(response.assets[0].uri);
            }
        } catch (e) {
            // console.warn("Error occurred: " + e);
            setAiResponse("Error occurred: " + e);
        }
        setSearchInProgress(false);
    }

    const clearImageSelection = async () => {
        setImage(null);
        setImageUri(undefined);
    }

  const backgroundStyle = {
    backgroundColor: Colors.darker,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>MyAI</Text>
            <Text style={styles.subtitle}>
                Powered by Google Gemini
            </Text>
          </View>
        <View style={styles.responseContainer}>
            {searchInProgress
                ? <LottieView autoPlay loop style={styles.loading}
                      source={require('./src/assets/Lottie/Loading.json')}/>
                : (<View style={styles.messageContainer}>
                    <Markdown style={markdownStyles}>
                        {aiResponse}
                    </Markdown>
                   </View>)
            }
        </View>
          { (imageUri != null) &&
          <View style={styles.thumbnail}>
            <Image
              style={styles.thumbnailImage}
              source={{uri: imageUri}}
              alt={imageUri}/>
            <TouchableHighlight 
              style={styles.clearButton}
              underlayColor="#f0f0f0"
              onPress={clearImageSelection}>
              <Text style={styles.clearButtonText}>×</Text>
            </TouchableHighlight>
          </View>
          }
        <SearchBox
            onSearch={onSearch}
            onSearchWithImage={onSearchWithImage}
            searchInProgress={searchInProgress}
        />
      </ScrollView>
      <Text style={styles.copyright}>
          Copyright © Vinod Sigadana
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  responseContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F8F9FE',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  messageContainer: {
    padding: 16,
  },
  thumbnail: {
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#F8F9FE',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnailImage: {
    height: 60,
    width: 60,
    borderRadius: 12,
  },
  clearButton: {
    marginLeft: 12,
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loading: {
    height: 100,
    width: 100,
    alignSelf: "center",
    margin: 20,
  },
  copyright: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  }
});

const markdownStyles = StyleSheet.create({
    body: {
        color: '#333',
    },
    paragraph: {
        color: '#333',
        fontSize: 16,
        lineHeight: 24,
    },
    heading1: {
        color: '#6C63FF',
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 12,
    },
    heading2: {
        color: '#6C63FF',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    link: {
        color: '#6C63FF',
    },
    list: {
        color: '#333',
    },
    listItem: {
        color: '#333',
    },
    code_inline: {
        backgroundColor: '#F0F2FE',
        color: '#6C63FF',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    code_block: {
        backgroundColor: '#F0F2FE',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
    },
});

export default App;
