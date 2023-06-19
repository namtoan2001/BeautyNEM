import React, { useState, useEffect } from "react";
import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "react-circular-progressbar/dist/styles.css";
import Chart from "react-apexcharts";
import {
  GetBeauticianStatisticals,
  GetBeautyShopStatisticals,
  GetCustomerStatisticals,
} from "../../../services/StatisticalService";

const Featured = () => {
  const [customers, setCustomers] = useState();
  const [beauticians, setBeauticians] = useState();
  // const [beautyShops, setBeautyShops] = useState();
  const test = 0;
  const label = ["Khách hàng", "Thợ tự do"];
  const series = [].concat(customers, beauticians);

  useEffect(() => {
    GetCustomerStatisticals().then((respone) => {
      setCustomers(respone.data.length);
    });
    GetBeauticianStatisticals().then((respone) => {
      setBeauticians(respone.data.length);
    });
    // GetBeautyShopStatisticals().then((respone) => {
    //   setBeautyShops(respone.data.length);
    // });
  }, []);

  const arr = [];
  const a = 10;
  const b = 10;
  const c = 10;

  const newArr = arr.concat(a, b, c);

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Tổng số tài khoản đã tạo</h1>
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
                enabled: true,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Featured;
