import React,{useState} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import ProfileScreen from '../screens/Beautician/ProfileScreen';

const HeaderServiceDetails = () => {
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      setRefreshing(!refreshing);
    }, [])
  );

  return (
    <View
      style={{
        backgroundColor: "#FF9494",
        flexDirection: "row",
        alignItems: "center",
        height: 70,
        marginTop: 20
      }}
    >
      <TouchableOpacity
        onPress={() => {navigation.goBack()}}
        style={{ marginLeft: 10 }}
      >
        <Icon name="arrow-back-outline" size={25} color="#fff" />
      </TouchableOpacity>
      <Text
        style={{
          color: "#fff",
          fontSize: 25,
          fontWeight: "bold",
          flex: 1,
          textAlign: "center",
        }}
      >
        Chi tiết dịch vụ
      </Text>
      <View style={{ width: 40 }} />
    </View>
  );
};

export default HeaderServiceDetails;