import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./homePage.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { GetTitle, UpdateTitle } from "../../../services/HomePageService";

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

const EditTitle = (props) => {
  const styles = useStyles();
  const [idTitle, setIdTitle] = useState(0);
  const [titleName, setTitleName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    GetTitle().then((response) => {
      setIdTitle(response.data[0].id);
      setTitleName(response.data[0].titleName);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
    },
  });

  const ServiceInput = React.forwardRef((items, ref) => (
    <Input innerRef={ref} {...items} />
  ));

  const editService = (data) => {
    const formdata = new FormData();
    formdata.append("Id", idTitle);
    formdata.append("TitleName", data.title);
    Swal.fire({
      title: "Thông báo",
      text: "Bạn muốn thay đổi tiêu đề?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        UpdateTitle(formdata)
          .then((response) => {
            setTimeout(() => {
              toast("Chỉnh sửa tiêu đề thành công");
              navigate("/homePage");
            }, 500);
          })
          .catch((error) => {
            console.log("Chỉnh sửa tiêu đề thất bại" + error);
            setTimeout(() => {
              toast.error(error.response.data, { theme: "colored" });
            }, 1000);
          });
      }
    });
  };

  return (
    <div className="new">
      <Sidebar Logout={props.Logout} />
      <div className="newContainer">
        <div className="top">
          <h1>Chỉnh sửa tiêu đề</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <Form onSubmit={handleSubmit(editService)}>
              <FormGroup className="formInput">
                <Label for="services">Tên tiêu đề</Label>
                <ServiceInput
                  type="text"
                  id="title"
                  name="title"
                  placeholder={titleName}
                  {...register("title", {
                    required: {
                      value: true,
                      message: "Vui lòng không được bỏ trống tên tiêu đề.",
                    },
                  })}
                />
                {errors && (
                  <Container className={styles.error}>
                    {errors.title?.message}
                  </Container>
                )}
              </FormGroup>
              <Container>
                <ServiceInput
                  type="submit"
                  value="Thay đổi"
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

export default EditTitle;
