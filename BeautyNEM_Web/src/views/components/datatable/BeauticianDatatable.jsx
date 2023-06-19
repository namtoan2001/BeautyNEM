import React, { useState, useEffect } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

import { GetBeauticianStatisticals } from "../../../services/StatisticalService";

const datatable = [
  {
    id: 0,
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    districtName: "",
    cityName: "",
  },
];

const BeauticianDatatable = () => {
  const [data, setData] = useState(datatable);

  const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "fullName",
      headerName: "Họ và Tên",
      width: 230,
    },
    {
      field: "phoneNumber",
      headerName: "Số điện thoại",
      width: 160,
    },

    {
      field: "birthDate",
      headerName: "Ngày sinh",
      width: 170,
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
    GetBeauticianStatisticals()
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (
    <div className="datatable">
      <div className="datatableTitle">Danh sách tài khoản Thợ làm đẹp</div>
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

export default BeauticianDatatable;
