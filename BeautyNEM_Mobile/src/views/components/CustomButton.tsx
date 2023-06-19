import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function CustomButton({label, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#FF9494',
        padding: 10,
        borderRadius: 10,
            
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 25,
          fontFamily: 'DancingScript_700Bold',
          color: '#fff',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}