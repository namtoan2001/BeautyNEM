import React, { useState, useEffect } from "react";
import "./widget.scss";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import {
  GetBeauticianStatisticals,
  GetBeautyShopStatisticals,
  GetCustomerStatisticals,
} from "../../../services/StatisticalService";

const Widget = ({ type }) => {
  const [customers, setCustomers] = useState();
  const [beauticians, setBeauticians] = useState();
  const [owners, setOwners] = useState();
  let data;

  useEffect(() => {
    GetBeauticianStatisticals().then((respone) => {
      setBeauticians(respone.data.length);
    });
    GetBeautyShopStatisticals().then((respone) => {
      setOwners(respone.data.length);
    });
    GetCustomerStatisticals().then((respone) => {
      setCustomers(respone.data.length);
    });
  }, []);

  switch (type) {
    case "customer":
      data = {
        title: "Khách hàng",
        numbers: customers,
        isMoney: false,
        link: "Xem danh sách tài khoản",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "beautician":
      data = {
        title: "Thợ tự do",
        numbers: beauticians,
        isMoney: false,
        link: "Xem danh sách tài khoản",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "owner":
      data = {
        title: "Chủ cửa hàng",
        numbers: owners,
        isMoney: false,
        link: "Xem danh sách tài khoản",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "shopBeautician":
      data = {
        title: "Thợ của cửa hàng",
        // numbers: shopBeauticians,
        isMoney: false,
        link: "Xem danh sách tài khoản",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.numbers}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">{data.icon}</div>
    </div>
  );
};

export default Widget;
