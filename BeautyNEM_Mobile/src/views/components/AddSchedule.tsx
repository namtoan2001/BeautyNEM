import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, Header } from "@rneui/themed";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import { CreateSchedule } from "../../../services/scheduleService";

const style = StyleSheet.create({
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FFF",
    color: "#000",
    fontSize: 17,
    fontWeight: "bold",
  },
  containter: {
    backgroundColor: "#FF9494",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: "#f7b2b2",
  },
  input: {
    backgroundColor: "#f7b2b2",
    color: "#FFF",
  },
  icon: {
    color: "#FFF",
    fontSize: 20,
  },
  childrenContainer: {
    backgroundColor: "#FFF",
    padding: 30,
    paddingTop: 15,
    marginBottom: 10,
  },
  selectDropdownButton: {
    height: 40,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 5,
    margin: 10,
  },
  selectDropdownButtonText: {
    color: "#000",
    fontSize: 15,
    textAlign: "left",
  },
  weekDayButton: {
    width: 38,
    height: 38,
    alignSelf: "flex-start",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#A9A9A9",
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  weekDayButtonOnPress: {
    width: 38,
    height: 38,
    backgroundColor: "#FF9494",
    alignSelf: "flex-start",
    textAlign: "center",
    borderRadius: 20,
    borderColor: "#FF9494",
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  weekDayTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#A9A9A9",
  },
  weekDayTitleOnPress: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFF",
  },
  dateTimePickerAndroid: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#808080",
  },
  dateTimePickerIOS: {
    width: 100,
    flexDirection: "column",
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#808080",
  },
});

interface WeekDay {
  id: number;
  title: string;
  isSelected: boolean;
}

const weekDayList: Array<WeekDay> = [
  { id: 0, title: "CN", isSelected: false },
  { id: 1, title: "T2", isSelected: true },
  { id: 2, title: "T3", isSelected: true },
  { id: 3, title: "T4", isSelected: true },
  { id: 4, title: "T5", isSelected: true },
  { id: 5, title: "T6", isSelected: true },
  { id: 6, title: "T7", isSelected: false },
];

const AddSchedule = ({ navigation }) => {
  const [isIOS, setIsIOS] = useState(false);
  //fromTime
  const [fromTime, setFromTime] = useState(new Date());
  const [showFromTime, setShowFromTime] = useState(false);
  //toTime
  const toTimeMinutes = new Date().setMinutes(new Date().getMinutes() + 30);
  const [toTime, setToTime] = useState(new Date(toTimeMinutes));
  const diff = moment(toTime).diff(moment(fromTime));
  const diffDuration = moment.duration(diff);
  const [durationText, setDurationText] = useState(
    diffDuration.minutes() + "m"
  );
  const [showToTime, setShowToTime] = useState(false);
  const [weekDays, setWeekDays] = useState(weekDayList);

  const onCreateSchedule = () => {
    let formData = new FormData();
    const list: Array<WeekDay> = [...weekDays];
    const daysOfWeek = list
      .filter((x) => x.isSelected === true)
      .map((x) => x.title);
    formData.append("DaysOfWeek", daysOfWeek.join(";"));
    formData.append("StartTime", moment(fromTime).format("HH:mm"));
    formData.append("EndTime", moment(toTime).format("HH:mm"));

    CreateSchedule(formData)
      .then((response) => {
        if (response.data) {
          Alert.alert("Thông báo tạo lịch", "Tạo lịch thành công !", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        }
      })
      .catch((error) => {
        Alert.alert("Thông báo tạo lịch", error.response.data);
      });
  };

  const handleAddSchedule = () => {
    Alert.alert(
      "Thông báo tạo lịch",
      "Bạn có muốn tạo lịch làm việc này không ?",
      [
        {
          text: "Xác nhận",
          onPress: () => onCreateSchedule(),
        },
        {
          text: "Hủy",
          style: "cancel",
        },
      ]
    );
  };

  const onSelectWeekDay = (weekDay) => {
    const list: Array<WeekDay> = [...weekDays];
    const checkSelectedList = list.filter((x) => x.isSelected === true);
    if (checkSelectedList.length > 1) {
      list.map((x) => {
        if (x.id === weekDay.id) {
          x.isSelected = !x.isSelected;
        }
      });
    } else {
      list.map((x) => {
        if (x.id === weekDay.id) {
          x.isSelected = true;
        }
      });
    }
    setWeekDays(list);
  };

  const onChangeFromTimePicker = (event, selectedTime: Date) => {
    var currentTime = selectedTime;
    setShowFromTime(false);
    setFromTime(currentTime);
    onUpdateTimePicker(currentTime, toTime, true);
  };

  const onChangeToTimePicker = (event, selectedTime: Date) => {
    var currentTime = selectedTime;
    setShowToTime(false);
    setToTime(currentTime);
    onUpdateTimePicker(fromTime, currentTime, false);
  };

  const onUpdateTimePicker = (
    fromTime: Date,
    toTime: Date,
    isSelectedFromTime: boolean
  ) => {
    const _diff = moment(toTime).diff(fromTime);
    const _diffDuration = moment.duration(_diff);
    if (_diffDuration.asMinutes() < 30) {
      if (isSelectedFromTime) {
        const _toTime = new Date(fromTime);
        const toTimeAdd30Minutes = new Date(
          new Date(_toTime.setMinutes(_toTime.getMinutes() + 30)).setDate(
            new Date().getDate()
          )
        );
        if (fromTime.getHours() > toTimeAdd30Minutes.getHours()) {
          setFromTime(toTimeAdd30Minutes);
          setToTime(fromTime);
        } else {
          setToTime(toTimeAdd30Minutes);
        }
      } else {
        const _fromTime = new Date(toTime);
        const fromTimeMinus30Minutes = new Date(
          new Date(_fromTime.setMinutes(_fromTime.getMinutes() - 30)).setDate(
            new Date().getDate()
          )
        );
        if (fromTimeMinus30Minutes.getHours() > toTime.getHours()) {
          setFromTime(toTime);
          setToTime(fromTimeMinus30Minutes);
        } else {
          setFromTime(fromTimeMinus30Minutes);
        }
      }
    }
  };

  useEffect(() => {
    const _diff = moment(toTime).diff(fromTime);
    const _diffDuration = moment.duration(_diff);
    var _durationText = "";
    if (_diffDuration.hours() > 0 && _diffDuration.minutes() > 0) {
      _durationText =
        _diffDuration.hours() + "h" + _diffDuration.minutes() + "m";
    } else if (_diffDuration.hours() > 0) {
      _durationText = _diffDuration.hours() + "h";
    } else if (_diffDuration.minutes() > 0) {
      _durationText = _diffDuration.minutes() + "m";
    }
    if (_diffDuration.asMinutes() > 0) {
      setDurationText(_durationText);
    }
  }, [fromTime, toTime]);

  return (
    <View style={{ flex: 1 }}>
      <Header
        centerComponent={{
          text: "Tạo lịch mới",
          style: [style.header, { color: "#FF9494" }],
        }}
        containerStyle={[style.header, { borderBottomWidth: 2 }]}
        leftComponent={
          <MaterialIcons
            name="arrow-back"
            size={23}
            color="#000"
            onPress={() => navigation.navigate("ScheduleScreen")}
          />
        }
      />
      <ScrollView>
        <View style={[style.childrenContainer, { paddingTop: 30 }]}>
          <Text
            style={{
              color: "#696969",
              fontSize: 16,
            }}
          >
            Hãy cho khách hàng biết lịch làm việc phù hợp của bạn nhé!
          </Text>
        </View>
        <View style={style.childrenContainer}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Chọn thời gian
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              paddingTop: 20,
              paddingLeft: 20,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text>Bắt đầu</Text>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === "ios") {
                    setIsIOS(true);
                  }
                  setShowFromTime(true);
                }}
                style={
                  isIOS ? style.dateTimePickerIOS : style.dateTimePickerAndroid
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name="access-time"
                    size={20}
                    color="#808080"
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={{
                      color: "#808080",
                      fontSize: 15,
                    }}
                  >
                    {moment(fromTime).format("HH:mm")}
                  </Text>
                </View>

                {showFromTime && (
                  <DateTimePicker
                    value={fromTime}
                    mode="time"
                    display="default"
                    onChange={onChangeFromTimePicker}
                    is24Hour={true}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginTop: 25,
              }}
            >
              <MaterialIcons name="arrow-forward" size={20} color="#000" />
              <Text style={{ fontSize: 13, color: "#000" }}>
                {durationText}
              </Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text>Kết thúc</Text>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === "ios") {
                    setIsIOS(true);
                  }
                  setShowToTime(true);
                }}
                style={
                  isIOS ? style.dateTimePickerIOS : style.dateTimePickerAndroid
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name="access-time"
                    size={20}
                    color="#808080"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={{ color: "#808080", fontSize: 15 }}>
                    {moment(toTime).format("HH:mm")}
                  </Text>
                </View>
                {showToTime && (
                  <DateTimePicker
                    value={toTime}
                    mode="time"
                    display="default"
                    onChange={onChangeToTimePicker}
                    is24Hour={true}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={style.childrenContainer}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Chọn ngày</Text>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 20,
              paddingBottom: 10,
            }}
          >
            <Text style={{ fontSize: 14 }}>
              Chọn các ngày trong tuần để lặp lại
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                paddingTop: 10,
              }}
            >
              {weekDays.map((weekDay, index) => (
                <Button
                  key={index}
                  buttonStyle={
                    !weekDay.isSelected
                      ? style.weekDayButton
                      : style.weekDayButtonOnPress
                  }
                  titleStyle={
                    !weekDay.isSelected
                      ? style.weekDayTitle
                      : style.weekDayTitleOnPress
                  }
                  title={weekDay.title}
                  type="outline"
                  onPress={() => onSelectWeekDay(weekDay)}
                />
              ))}
            </View>
          </View>
          <View style={{ paddingTop: 20 }}>
            <Button
              titleStyle={{ color: "#FF9494", fontSize: 15 }}
              containerStyle={{
                borderWidth: 1,
                borderColor: "#FF9494",
                borderRadius: 5,
              }}
              type="clear"
              title="TẠO LỊCH"
              onPress={handleAddSchedule}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddSchedule;
