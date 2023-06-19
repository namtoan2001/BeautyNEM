import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./serviceList.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { GetServiceList, AddServiceName } from "../../../services/Service";

import { createUseStyles } from "react-jss";
import { Container, Form, FormGroup, Label, Input } from "reactstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fontsource/dancing-script";
import Swal from "sweetalert2";

const useStyles = createUseStyles({
  error: {
    fontSize: "14px",
    color: "red",
    paddingTop: "5px",
  },
});

const initialFileValue = [
  {
    imgSource: "",
    imgFile: [],
  },
];

const AddService = (props) => {
  const styles = useStyles();
  const [values, setValues] = useState(initialFileValue);
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      services: "",
    },
  });

  const ServiceInput = React.forwardRef((props, ref) => (
    <Input innerRef={ref} {...props} />
  ));

  const handleFileSelect = async (event) => {
    setError(false);
    const fileList = event.target.files;
    const filesArray = [];
    const images = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const fileObject = {
        imgSource: URL.createObjectURL(file),
        imgFile: file,
      };

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (event) => {
        images.push(event.target.result);
        if (images.length === fileList.length) {
          setSelectedImages(images);
        }
      };
      filesArray.push(fileObject);
    }
    setValues({
      imgSource: filesArray.map((data) => data.imgSource),
      imgFile: filesArray.map((data) => data.imgFile),
    });
  };

  const addService = (data) => {
    const formdata = new FormData();
    formdata.append("ServiceName", data.services);
    if (values.imgFile !== undefined)
      for (const key of Object.keys(values.imgFile)) {
        formdata.append("IconFile", values.imgFile[key]);
      }
    if (data.services !== "" && values.imgFile !== undefined) {
      setError(false);
      Swal.fire({
        title: "Thông báo",
        text: "Bạn muốn tạo dịch vụ?",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy bỏ",
      }).then((result) => {
        if (result.isConfirmed) {
          AddServiceName(formdata)
            .then((response) => {
              setTimeout(() => {
                toast("Thêm thành công dịch vụ");
                navigate("/service");
              }, 500);
            })
            .catch((error) => {
              setTimeout(() => {
                toast.error(error.response.data, { theme: "colored" });
              }, 1000);
            });
        }
      });
    } else {
      setError(true);
    }
  };

  return (
    <div className="new">
      <Sidebar Logout={props.Logout} />
      <div className="newContainer">
        <div className="top">
          <h1>Thêm dịch vụ</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <Form onSubmit={handleSubmit(addService)}>
              <FormGroup className="formInput">
                <Label for="services">Tên dịch vụ</Label>
                <ServiceInput
                  type="text"
                  id="services"
                  name="services"
                  placeholder="Nhập tên dịch vụ"
                  {...register("services", {
                    required: {
                      value: false,
                      message: "Vui lòng không được bỏ trống tên dịch vụ.",
                    },
                  })}
                />
                <br />
                <br />

                <Label for="serviceIcon">Biểu tượng dịch vụ</Label>
                <ServiceInput
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  onChange={handleFileSelect}
                  accept=".jpg, .jpeg, .png"
                />
                <div className="imgShow">
                  {selectedImages.map((image, index) => (
                    <img key={index} src={image} alt="" />
                  ))}
                </div>
                {error && (
                  <Container className={styles.error}>
                    Vui lòng nhập tên dịch vụ và chọn biểu tượng dịch vụ trước
                    khi xác nhận.
                  </Container>
                )}
              </FormGroup>
              <Container>
                <ServiceInput
                  type="submit"
                  value="Xác nhận"
                  className="btnAdd"
                  required
                />
              </Container>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddService;
