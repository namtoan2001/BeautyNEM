import React, { useContext, useState, useEffect, useCallback } from "react";
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Button
} from "react-native";
import { useFonts } from "expo-font";
import moment from 'moment';

import {
    GetBeauticianDetailsWithToken,
} from "../../../../services/BeauticianProfileService";
import {
    GetMoneyByMonth,
    GetMoneyByYear
} from "../../../../services/BeauticianIncomeService";
import MonthSelectorCalendar from 'react-native-month-selector';
const data = [
    {
        sumMoney: "",
        month: "",
        year: "",
    },
];
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    incomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    sumAmount: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FF9494',
        textAlign: 'center',
    },
});
const IncomeScreen = () => {
    const [beauticianId, setBeauticianId] = useState();
    const [incomeData, setIncomeData] = useState(data);
    const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1); // set initial selected month to the current month
    const [selectedYear, setSelectedYear] = useState(moment().year().toString());
    const currencyRegex = /(\d)(?=(\d{3})+(?!\d))/g;
    useEffect(() => {
        GetBeauticianDetailsWithToken()
            .then((response) => {
                setBeauticianId(response.data.id);
            })
            .catch((error) => {
                console.log(`Không lấy được thông tin: ` + error);
            });


    });

    useEffect(() => {
        // call the appropriate function based on the selected month or year
        const fetchData = async () => {
            GetMoneyByMonth(beauticianId, selectedMonth, selectedYear)
                .then((response) => {
                    setIncomeData([
                        {
                            sumMoney: response.data.sumMoney,
                            month: response.data.month,
                            year: response.data.year,
                        },
                    ]);
                })
                .catch((error) => console.log(error));
        };

        fetchData();
    }, [beauticianId, selectedMonth, selectedYear]);

    const handleMonthYearSelect = (date) => {
        const month = moment(date).month() + 1; // add 1 to get the month number (1-12)
        const year = moment(date).year().toString();
        setSelectedMonth(month);
        setSelectedYear(year);
    };
    return (
        <SafeAreaView>
            <MonthSelectorCalendar
                nextText=">"
                prevText="<"
                selectedDate={moment().month(selectedMonth - 1)}
                currentMonthTextStyle={{ fontWeight: "bold" }}
                selectedMonthTextStyle={{ color: "#FF9494" }}
                currentDate={moment()}
                onMonthTapped={(date) => handleMonthYearSelect(date)}
                monthTextStyle={{ fontSize: 11 }}
                yearTextStyle={{ color: "#FF9494", fontWeight: "bold", fontSize: 20 }}
                localeLanguage="vi"
                monthFormat="TM"
            />
            <Text></Text>
            <Text style={styles.incomeText}>
                Thu nhập tháng {selectedMonth} năm {selectedYear} của bạn:
            </Text>
            <Text style={styles.sumAmount}>
                {incomeData[0].sumMoney.toString().replace(currencyRegex, '$1,')} đ
            </Text>
        </SafeAreaView>
    );
};

export default IncomeScreen;
