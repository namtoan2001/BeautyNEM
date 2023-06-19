import { Button, SearchBar } from "@rneui/themed";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";
import SelectDropdown from "react-native-select-dropdown";
import { GetServices } from "../../../services/beauticianRegisterService";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Switch } from "react-native";

const style = StyleSheet.create({
  container: { flex: 1 },
  containterSearch: {
    width: "80%",
    backgroundColor: "#F0F0F0",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    height: 40,
  },
  input: {
    backgroundColor: "#FFF",
    color: "#000",
  },
  icon: {
    color: "#000",
    fontSize: 20,
  },
  filter: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFF",
    marginLeft: 5,
  },
  viewFilter: { paddingTop: 0, paddingBottom: 10 },
  serviceButton: {
    alignSelf: "flex-start",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#A9A9A9",
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  serviceButtonOnPress: {
    alignSelf: "flex-start",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FF9494",
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  serviceTitle: {
    fontSize: 12,
    color: "#A9A9A9",
  },
  serviceTitleOnPress: {
    fontSize: 12,
    color: "#FF9494",
  },
  selectDropdownButtonPrices: {
    width: "80%",
    height: 40,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#A9A9A9",
    borderRadius: 5,
    margin: 5,
    padding: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  selectDropdownButtonTextPrices: {
    color: "#000",
    fontSize: 12,
    textAlign: "left",
  },
  modal: {
    backgroundColor: "#FFF",
    marginTop: 200,
    borderRadius: 10,
    justifyContent: "flex-start",
  },
  weekDayButton: {
    width: 36,
    height: 36,
    alignSelf: "flex-start",
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#A9A9A9",
    margin: 3,
  },
  weekDayButtonOnPress: {
    width: 36,
    height: 36,
    backgroundColor: "#FF9494",
    alignSelf: "flex-start",
    textAlign: "center",
    borderRadius: 20,
    borderColor: "#FF9494",
    margin: 3,
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

const SearchFilterSortForSchedule = ({
  fetchData,
  request,
  setRequest,
  weekDays,
  setWeekDays,
  daysOfWeek,
  setDaysOfWeek,
  setIsLoading,
  isIOS,
  setIsIOS,
  fromTime,
  showFromTime,
  setShowFromTime,
  toTime,
  showToTime,
  setShowToTime,
  durationText,
  isEnabledSwitch,
  setIsEnabledSwitch,
  onChangeFromTimePicker,
  onChangeToTimePicker,
}) => {
  const timeOutRef = useRef(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEnableSroll, setIsEnableScroll] = useState(true);
  const [isPress, setIsPress] = useState(false);

  const handleApplyFilter = () => {
    setIsOpenModal(!isOpenModal);
    setIsLoading(true);
    fetchData({
      daysOfWeek: request.daysOfWeek,
      startTime: request.startTime && !isEnabledSwitch ? request.startTime : "",
      endTime: request.endTime && !isEnabledSwitch ? request.endTime : "",
    });
  };

  const onSelectWeekDay = (weekDay) => {
    const list: Array<WeekDay> = [...weekDays];
    list.map((x) => {
      if (x.id === weekDay.id) {
        x.isSelected = !x.isSelected;
      }
    });
    setWeekDays(list);
    setIsPress(!isPress);
    onChangeDaysOfWeek();
  };

  const onChangeDaysOfWeek = () => {
    if (weekDays.length > 0) {
      var daysOfWeekString = "";
      weekDays.map((x) => {
        if (x.isSelected) {
          daysOfWeekString += x.title + ";";
        }
      });
      const _daysOfWeek = daysOfWeekString.replace(/^\;+|\;+$/g, "");
      setDaysOfWeek(_daysOfWeek);
      setRequest({ ...request, daysOfWeek: _daysOfWeek });
    }
  };

  const toggleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const toggleSwitch = () => {
    setIsEnabledSwitch(!isEnabledSwitch);
    if (!isEnabledSwitch) {
      setRequest({
        ...request,
        startTime: "",
        endTime: "",
      });
    } else {
      setRequest({
        ...request,
        startTime: moment(fromTime).format("HH:mm"),
        endTime: moment(toTime).format("HH:mm"),
      });
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: 5,
          paddingTop: 10,
        }}
      >
        <Button
          buttonStyle={style.filter}
          icon={
            <FontAwesome name="sliders" size={20} style={{ color: "#000" }} />
          }
          onPress={toggleModal}
        />
      </View>
      <View style={{}}>
        <Modal
          isVisible={isOpenModal}
          onSwipeComplete={toggleModal}
          style={style.modal}
        >
          <ScrollView stickyHeaderIndices={[0]} scrollEnabled={isEnableSroll}>
            <View style={{ alignItems: "flex-end" }}>
              <Button
                buttonStyle={style.filter}
                icon={
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#989898"
                  />
                }
                onPress={toggleModal}
              />
            </View>
            <View style={style.viewFilter}>
              <Text style={{ fontWeight: "bold", paddingLeft: 20 }}>
                Chọn khoảng thời gian
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 10,
                  paddingTop: 5,
                }}
              >
                <Switch
                  trackColor={{ false: "#767577", true: "#03C03C" }}
                  thumbColor={isEnabledSwitch ? "#FFF" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabledSwitch}
                />
                <Text onPress={toggleSwitch}>Toàn bộ thời gian</Text>
              </View>
              {!isEnabledSwitch && (
                <View
                  style={{
                    margin: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-around",
                      paddingTop: 10,
                      paddingBottom: 10,
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
                          isIOS
                            ? style.dateTimePickerIOS
                            : style.dateTimePickerAndroid
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
                      <MaterialIcons
                        name="arrow-forward"
                        size={20}
                        color="#000"
                      />
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
                          isIOS
                            ? style.dateTimePickerIOS
                            : style.dateTimePickerAndroid
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
              )}
            </View>
            <View style={style.viewFilter}>
              <Text style={{ fontWeight: "bold", paddingLeft: 20 }}>
                Chọn thứ trong tuần
              </Text>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  paddingTop: 20,
                  paddingBottom: 10,
                }}
              >
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
            </View>
            <View
              style={[
                style.viewFilter,
                {
                  flexDirection: "row",
                  margin: 20,
                },
              ]}
            >
              <Button
                titleStyle={{ color: "#318CE7", fontSize: 15 }}
                containerStyle={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#318CE7",
                  borderRadius: 5,
                }}
                type="clear"
                title="ÁP DỤNG"
                onPress={handleApplyFilter}
              />
            </View>
          </ScrollView>
        </Modal>
      </View>
    </View>
  );
};

export default SearchFilterSortForSchedule;
