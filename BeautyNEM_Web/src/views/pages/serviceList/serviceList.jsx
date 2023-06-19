import React, { useState, useEffect, createContext } from "react";
import "./serviceList.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { GetServiceList, DeleteService } from "../../../services/Service";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

export const ServiceNameContext = createContext();

const servicesList = [
  {
    id: 0,
    serviceName: "",
  },
];

const ServiceList = (props) => {
  const [services, setServices] = useState(servicesList);

  const serviceColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "serviceName",
      headerName: "Dịch vụ làm đẹp",
      width: 230,
    },
  ];

  const handleDelete = (id) => {
    Swal.fire({
      title: "Thông báo",
      text: "Bạn muốn xóa dịch vụ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteService(id)
          .then((response) => {
            setServices(services.filter((item) => item.id !== id));
            toast("Xóa thành công dịch vụ");
          })
          .catch((error) => {
            console.log(error.response.data);
            toast(`${error.response.data}`);
          });
      }
    });
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Chức năng",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/service/editService/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Chỉnh sửa</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Xóa
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    GetServiceList()
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="serviceList">
      <Sidebar Logout={props.Logout} />
      <div className="serviceListContainer">
        <div className="datatable">
          <div className="datatableTitle">
            Danh sách dịch vụ
            <Link to="/service/addService" className="link">
              Thêm dịch vụ
            </Link>
          </div>

          <DataGrid
            className="datagrid"
            rows={services}
            columns={serviceColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceList;
