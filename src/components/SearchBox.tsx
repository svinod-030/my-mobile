import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import React from "react";
import { ArrowRight } from "../assets/ArrowRight";
import {Camera} from "../assets/Camera";
import {Gallery} from "../assets/Gallery";
import {CAMERA_SOURCE, GALLERY_SOURCE} from "../constants/index";

export const SearchBox = ({onSearch, onSearchWithImage, searchInProgress}): React.JSX.Element => {
    const [text, onChangeText] = React.useState('');

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Start typing..."
                    placeholderTextColor="#999"
                />
                <View style={styles.buttonGroup}>
                    <TouchableOpacity
                        disabled={searchInProgress}
                        style={styles.iconButton}
                        onPress={() => onSearchWithImage(CAMERA_SOURCE)}>
                        <Camera
                            height="24"
                            width="24"
                            color="#6C63FF"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={searchInProgress}
                        style={styles.iconButton}
                        onPress={() => onSearchWithImage(GALLERY_SOURCE)}>
                        <Gallery
                            height="24"
                            width="24"
                            color="#6C63FF"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        disabled={searchInProgress}
                        style={[styles.sendButton, (!text && !searchInProgress) && styles.sendButtonDisabled]}
                        onPress={() => text && onSearch(text)}>
                        <ArrowRight
                            height="24"
                            width="24"
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    inputContainer: {
        backgroundColor: '#F8F9FE',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    input: {
        color: '#333',
        fontSize: 16,
        padding: 16,
        paddingRight: 150,
    },
    buttonGroup: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 8,
    },
    iconButton: {
        padding: 8,
        marginHorizontal: 4,
        borderRadius: 12,
        backgroundColor: '#F0F2FE',
    },
    sendButton: {
        padding: 8,
        marginHorizontal: 4,
        borderRadius: 12,
        backgroundColor: '#6C63FF',
    },
    sendButtonDisabled: {
        backgroundColor: '#E8E8E8',
        opacity: 0.5,
    }
});
