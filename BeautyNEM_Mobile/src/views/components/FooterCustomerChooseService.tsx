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


    const goback = () => {
        props.navigation.navigate("CustomerBookingScreen", {
            beauticianID: props.id,
            serviceIds : props.serviceIds,
            serviceIdsNoPrice : props.serviceIdsNoPrice
          })
    };

    return (
        <View style={{ height: 60 }}>
            <View style={styles.container}>
                <View style={{
                    flexDirection: "row",
                    flexWrap: 'wrap',
                    width: "85%",
                }}>
                </View>
                <TouchableOpacity style={styles.button} onPress={goback}>
                    <Text
                        style={{ alignItems: "center", fontSize: 20, color: "white" }}
                    >
                        Xong
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};
