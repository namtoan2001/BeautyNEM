import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { Button, Avatar, Header } from "@rneui/themed";
import {
  CalendarProvider,
  ExpandableCalendar,
  TimelineList,
  TimelineEventProps,
  CalendarUtils,
  TimelineProps,
} from "react-native-calendars";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import groupBy from "lodash/groupBy";
import filter from "lodash/filter";
import find from "lodash/find";
import {
  GetSchedules,
  SearchFilterSortSchedule,
} from "../../../services/scheduleService";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import moment from "moment";
import SearchFilterSortForSchedule from "../components/SearchFilterSortForSchedule";

const style = StyleSheet.create({
  header: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: "#FF9494",
    color: "#FFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  containter: {
    flex: 1,
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
  addButton: {
    width: 45,
    height: 45,
    backgroundColor: "#FF9494",
    borderWidth: 2,
  },
  itemView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
  containterItem: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 5,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activityIndicator: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "#FFF",
    width: "100%",
    height: "100%",
  },
  listEmpty: {
    height: Dimensions.get("window").height,
    alignItems: "center",
    paddingTop: 50,
  },
});

interface SearchFilterSortScheduleRequest {
  daysOfWeek: string;
  startTime: string;
  endTime: string;
}

interface Schedule {
  id: number;
  startTime: string;
  endTime: string;
  daysOfWeek: string;
}

interface WeekDay {
  id: number;
  title: string;
  isSelected: boolean;
}

const weekDayList: Array<WeekDay> = [
  { id: 0, title: "CN", isSelected: false },
  { id: 1, title: "T2", isSelected: false },
  { id: 2, title: "T3", isSelected: false },
  { id: 3, title: "T4", isSelected: false },
  { id: 4, title: "T5", isSelected: false },
  { id: 5, title: "T6", isSelected: false },
  { id: 6, title: "T7", isSelected: false },
];

const ScheduleScreen = ({ navigation }) => {
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabledSwitch, setIsEnabledSwitch] = useState(true);
  const [weekDays, setWeekDays] = useState(weekDayList);
  const [daysOfWeek, setDaysOfWeek] = useState("");
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
  const [request, setRequest] = useState<SearchFilterSortScheduleRequest>({
    daysOfWeek: "",
    startTime: "",
    endTime: "",
  });

  const weekDayText = (dayOfWeek: string) => {
    switch (dayOfWeek) {
      case "T2":
        return "Thứ 2";
      case "T3":
        return "Thứ 3";
      case "T4":
        return "Thứ 4";
      case "T5":
        return "Thứ 5";
      case "T6":
        return "Thứ 6";
      case "T7":
        return "Thứ 7";
      case "CN":
        return "Chủ Nhật";
    }
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
    setRequest({
      ...request,
      startTime: moment(fromTime).format("HH:mm"),
      endTime: moment(toTime).format("HH:mm"),
    });
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

  const HeaderComponent = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: 10,
          paddingRight: 5,
          paddingTop: 5,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#808080",
          }}
        >
          Bạn có tổng cộng {schedules.length} lịch làm việc
        </Text>
        <Button
          title="Reset"
          type="clear"
          titleStyle={{ fontSize: 14 }}
          buttonStyle={{ padding: 0 }}
          onPress={onResetFilter}
        />
      </View>
    );
  };

  const onResetFilter = () => {
    const resetData: SearchFilterSortScheduleRequest = {
      daysOfWeek: "",
      startTime: "",
      endTime: "",
    };
    setRequest({ daysOfWeek: "", startTime: "", endTime: "" });
    setIsLoading(true);
    const listDaysOfWeek: Array<WeekDay> = weekDays;
    listDaysOfWeek.map((x) => (x.isSelected = false));
    setWeekDays(listDaysOfWeek);
    setDaysOfWeek("");
    const _toTimeMinutes = new Date().setMinutes(new Date().getMinutes() + 30);
    setFromTime(new Date());
    setToTime(new Date(_toTimeMinutes));
    setDurationText("30m");
    setIsEnabledSwitch(true);
    fetchSchedules(resetData);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchSchedules(request);
    }, [])
  );

  const fetchSchedules = (_request: SearchFilterSortScheduleRequest) => {
    setIsLoading(true);
    SearchFilterSortSchedule(_request)
      .then((response) => {
        setSchedules(response.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        setTimeout(() => {
          Alert.alert("Thông báo lịch làm việc", error.response.data);
          setIsLoading(false);
        }, 1000);
      });
  };

  const renderItem = ({ item, index }) => {
    const schedule: Schedule = item;
    const daysOfWeekList = schedule.daysOfWeek.split(";");
    return (
      <TouchableOpacity
        style={style.containterItem}
        onPress={() =>
          navigation.navigate("EditSchedule", {
            scheduleId: schedule.id,
          })
        }
      >
        <View style={{ padding: 10, paddingTop: 2 }}>
          <Text>Các thứ trong tuần: </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {daysOfWeekList.map((x, index) => (
            <Text
              key={index}
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#FF9494",
                paddingRight: 10,
              }}
            >
              {weekDayText(x)}
            </Text>
          ))}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ padding: 10 }}>
            Giờ bắt đầu:{" "}
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {moment(schedule.startTime, "HH:mm:ss").format("HH:mm")}
            </Text>
          </Text>
          <Text style={{ padding: 10 }}>
            Giờ kết thúc:{" "}
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {moment(schedule.endTime, "HH:mm:ss").format("HH:mm")}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View style={style.listEmpty}>
        <Image
          style={{ width: 300, height: 300, opacity: 0.8 }}
          source={require("../../assets/images/noResultFound.png")}
        />
        <Text>Lịch làm việc chưa có hoặc không tìm thấy !</Text>
      </View>
    );
  };

  return (
    <View style={style.containter}>
      <Header
        centerComponent={{ text: "Lịch làm việc", style: style.header }}
        containerStyle={style.header}
        rightComponent={
          <MaterialIcons
            name="add"
            size={27}
            color="#FFF"
            onPress={() => navigation.navigate("AddSchedule")}
          />
        }
        leftComponent={
          <MaterialIcons
            name="arrow-back"
            size={23}
            color="#FFF"
            onPress={() => navigation.goBack()}
          />
        }
      />
      <SearchFilterSortForSchedule
        fetchData={fetchSchedules}
        request={request}
        setRequest={setRequest}
        setIsLoading={setIsLoading}
        weekDays={weekDays}
        setWeekDays={setWeekDays}
        daysOfWeek={daysOfWeek}
        setDaysOfWeek={setDaysOfWeek}
        isIOS={isIOS}
        setIsIOS={setIsIOS}
        fromTime={fromTime}
        showFromTime={showFromTime}
        setShowFromTime={setShowFromTime}
        toTime={toTime}
        showToTime={showToTime}
        setShowToTime={setShowToTime}
        durationText={durationText}
        isEnabledSwitch={isEnabledSwitch}
        setIsEnabledSwitch={setIsEnabledSwitch}
        onChangeFromTimePicker={onChangeFromTimePicker}
        onChangeToTimePicker={onChangeToTimePicker}
      />
      <View style={{ flex: 1 }}>
        {isLoading && (
          <ActivityIndicator
            style={style.activityIndicator}
            color="#FF9494"
            animating={isLoading}
            size={50}
          />
        )}
        <FlatList
          key={1}
          style={style.containter}
          data={schedules}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={1}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={HeaderComponent}
        />
      </View>
    </View>
  );
};

export default ScheduleScreen;
