import React, { useState, useEffect } from "react";
import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "react-circular-progressbar/dist/styles.css";
import Chart from "react-apexcharts";
import { GetEventStatisticals } from "../../../services/StatisticalService";

const BookingChart = () => {
  const [bookingNumber, setBookingNumber] = useState();
  const label = ["Tổng số lần đặt lịch"];
  const series = [].concat(bookingNumber);

  useEffect(() => {
    GetEventStatisticals()
      .then((respone) => {
        setBookingNumber(respone.data.length);
        console.log(respone);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const arr = [];
  const a = 10;

  const newArr = arr.concat(a);

  console.log(newArr);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Tổng số lần đặt lịch</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          {/* <CircularProgressbar value={100} text={"400"} strokeWidth={5} /> */}
          <Chart
            type="donut"
            width={500}
            height={400}
            series={series}
            options={{
              labels: label,
              // title: {
              //   text: "Biểu đồ thống kê tài khoản App BeautyNEM",
              //   align: "center",
              // },

              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      show: true,
                      total: {
                        show: true,
                        showAlways: true,
                        // formatter: () => '343',
                        fontSize: 30,
                        color: "#f90000",
                      },
                    },
                  },
                },
              },

              dataLabels: {
                enabled: false,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingChart;
