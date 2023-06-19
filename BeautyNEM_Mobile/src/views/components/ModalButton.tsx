import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
export type ButtonProps = {
  title: string;
  onPress: () => void;
};
export const ModalButton = ({ title, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FF9494",
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 25,
    width: "45%",
    alignItems: "center",
    marginLeft: 10,
  },
  text: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    fontFamily: 'DancingScript_700Bold',
  },
});