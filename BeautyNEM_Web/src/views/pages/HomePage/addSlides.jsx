import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./homePage.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  AddTitleImage,
  GetTitleImage,
} from "../../../services/HomePageService";

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

const AddSlides = (props) => {
  const [values, setValues] = useState(initialFileValue);
  const [lengthImage, setLengthImage] = useState(0);
  const [chooseImages, setChooseImages] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [validateImages, setValidateImages] = useState("");

  useEffect(() => {
    GetTitleImage().then((response) => {
      setLengthImage(response.data.length);
    });
    if (
      chooseImages + lengthImage >= 1 &&
      chooseImages + lengthImage <= 5 &&
      chooseImages >= 1
    ) {
      setValidateImages("");
    }
  }, [validateImages, chooseImages]);

  const handleFileSelect = async (event) => {
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
    setChooseImages(fileList.length);
    setValues({
      imgSource: filesArray.map((data) => data.imgSource),
      imgFile: filesArray.map((data) => data.imgFile),
    });
  };
  const styles = useStyles();

  const navigate = useNavigate();

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const ServiceInput = React.forwardRef((props, ref) => (
    <Input innerRef={ref} {...props} />
  ));

  const addImages = async (data) => {
    const formdata = new FormData();
    if (values.imgFile !== undefined)
      for (const key of Object.keys(values.imgFile)) {
        formdata.append("ImageFile", values.imgFile[key]);
      }

    if (chooseImages >= 1) {
      if (chooseImages + lengthImage >= 1 && chooseImages + lengthImage <= 5) {
        Swal.fire({
          title: "Thông báo",
          text: "Bạn muốn thêm ảnh dịch vụ?",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Hủy bỏ",
        }).then((result) => {
          if (result.isConfirmed) {
            AddTitleImage(formdata)
              .then((response) => {
                setTimeout(() => {
                  toast("Chỉnh sửa ảnh thành công");
                  navigate("/homePage");
                }, 500);
              })
              .catch((error) => {
                setTimeout(() => {
                  toast.error(error.response.data, { theme: "colored" });
                }, 500);
              });
          }
        });
      } else if (chooseImages + lengthImage >= 5) {
        setValidateImages(
          `Chỉ được tạo tối đa 5 ảnh quảng cáo. Hiện tại đã có ${lengthImage} ảnh quảng cáo được tạo.`
        );
      }
    } else {
      setValidateImages("Vui lòng chọn ít nhất 1 ảnh.");
    }
  };

  return (
    <div className="new">
      <Sidebar Logout={props.Logout} />
      <div className="newContainer">
        <div className="top">
          <h1>Thêm ảnh quảng cáo</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <Form onSubmit={handleSubmit(addImages)}>
              <FormGroup className="formInput">
                <Label for="services">Chọn ảnh</Label>
                <ServiceInput
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  multiple
                  onChange={handleFileSelect}
                  accept=".jpg, .jpeg, .png"
                />
                {validateImages && (
                  <Container className={styles.error}>
                    {validateImages}
                  </Container>
                )}
              </FormGroup>
              <Container>
                <ServiceInput
                  type="submit"
                  value="Tạo"
                  className="btnAdd"
                  required
                />
              </Container>
            </Form>
            <div className="imgShow">
              {selectedImages.map((image, index) => (
                <img key={index} src={image} alt="" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSlides;
