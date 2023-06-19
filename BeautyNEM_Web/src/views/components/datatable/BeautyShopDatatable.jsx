import React, { useState, useEffect } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

import { GetBeautyShopStatisticals } from "../../../services/StatisticalService";

const datatable = [
  {
    id: 0,
    username: "",
    phoneNumber: "",
    birthDate: "",
    districtName: "",
    cityName: "",
  },
];

const BeautyShopDatatable = () => {
  const [data, setData] = useState(datatable);

  const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "username",
      headerName: "Họ và Tên",
      width: 200,
    },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      width: 160,
    },
    {
      field: "districtName",
      headerName: "Quận",
      width: 160,
    },
    {
      field: "cityName",
      headerName: "Thành phố",
      width: 160,
    },
  ];

  useEffect(() => {
    GetBeautyShopStatisticals()
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="datatable">
      <div className="datatableTitle">Danh sách tài khoản Chủ cửa hàng</div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default BeautyShopDatatable;
