import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Linking,
    Platform,
    Alert
} from 'react-native';
import { Icon } from "@rneui/themed";
import MaterialIcons from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        height: 80,
        alignItems: "center",
        margin: "auto",
    },
    button: {
        backgroundColor: "#FF9494",
        height: 40,
        width: "95%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 5,

    },
    item: {
        width: '50%',

    }
});
export default function FooterBeauticianDetailsScreen(props) {
    return (
        <View style={{ height: 80 }}>
            <View style={styles.container}>
                <View style={{
                    flexDirection: "row",
                    flexWrap: 'wrap',
                    width: "85%",
                }}>
                    <View style={styles.item}>
                        <View style={{
                            flexDirection: "row",
                        }}>
                        </View>

                    </View>
                    <View style={styles.item}>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => {props.formik.handleSubmit()}}>
                    <Text
                        style={{ alignItems: "center", fontSize: 20, color: "white" }}
                    >
                        Tiếp tục
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};
