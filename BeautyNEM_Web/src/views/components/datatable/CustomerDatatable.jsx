import React, { useState, useEffect, createContext } from "react";
import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

import { GetCustomerStatisticals } from "../../../services/StatisticalService";

const datatable = [
  {
    id: 0,
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    address: "",
  },
];

const CustomerDatatable = () => {
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
      width: 160,
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      width: 260,
    },
  ];

  useEffect(() => {
    GetCustomerStatisticals()
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="datatable">
      <div className="datatableTitle">Danh sách tài khoản Khách hàng</div>
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

export default CustomerDatatable;
