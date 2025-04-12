import React, {PropsWithChildren} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Colors} from "react-native/Libraries/NewAppScreen";

export type SectionProps = PropsWithChildren<{
    title: string;
}>;

export function Section({children, title}: SectionProps): React.JSX.Element {
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    { color: Colors.white },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    { color: Colors.light },
                ]}>
                {children}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
        alignItems: "center"
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600'
    },
    sectionDescription: {
        padding: 8,
        fontSize: 12,
        fontWeight: '600',
    }
});
