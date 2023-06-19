import React, { useContext, useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { createUseStyles } from "react-jss";
import { Col, Container, Form, FormGroup, Label, Row } from "reactstrap";
import Input from "../../components/CustomInput";
import { useNavigate, useParams } from "react-router-dom";
import "@fontsource/dancing-script";
import { Login } from "../../../services/AdminService";
import loginImg from "../../../assets/image/login.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = createUseStyles({
  container: {
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundImage: `url(${LoginIMG})`,
    // backgroundPosition: 'center',
    // backgroundSize: 'cover',
    // backgroundRepeat: 'no-repeat',
    background: "linear-gradient(135deg, #FF9494 0%, white 100%)",
    width: "100vw",
    height: "100vh",
  },
  formLogin: {
    backgroundColor: "white",
    height: 400,
    width: 500,
    borderRadius: 20,
    position: "absolute",
    top: "50%",
    left: "75%",
    transform: "translate(-50%, -50%)",
  },
  head: {
    color: "#FF9494",
    fontSize: 40,
    position: "absolute",
    marginTop: 40,
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontFamily: "Dancing Script",
  },
  username: {
    height: 30,
    width: 200,
    borderColor: "#FF9494",
    borderRadius: 10,
  },
  usernamearea: {
    flexDirection: "row",
    marginTop: 130,
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 360,
    justifyContent: "center",
    alignItems: "center",
  },
  password: {
    height: 30,
    width: 200,
    borderColor: "#FF9494",
    borderRadius: 10,
  },
  passwordarea: {
    flexDirection: "row",
    marginTop: 230,
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 360,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "gray",
    float: "left",
    width: 150,
    fontFamily: "Dancing Script",
    fontSize: 20,
  },
  button: {
    marginTop: 320,
    position: "absolute",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 50,
    width: 150,
    border: 0,
    backgroundColor: "#FF9494",
    borderRadius: 10,
    color: "white",
    fontSize: 20,
    fontFamily: "Dancing Script",
    "&:hover": {
      backgroundColor: "#FFB6C1",
      color: "white",
    },
  },
  imageLogin: {
    position: "absolute",
    top: "40%",
    left: "30%",
    transform: "translate(-50%, -50%)",
  },
  error: {
    fontSize: "14px",
    color: "red",
    paddingTop: "5px",
  },
});

const LoginAdmin = (props) => {
  const navigate = useNavigate();
  const styles = useStyles();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onLogin = (data) => {
    props.setIsLoading(true);
    const formdata = new FormData();
    formdata.append("Username", data.username);
    formdata.append("Password", data.password);
    console.log(data.username);
    console.log(data.password);
    console.log(formdata);
    Login(formdata)
      .then((response) => {
        setTimeout(() => {
          props.setIsLoading(false);
          localStorage.setItem("fullName", response.data.fullName);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("jwtToken", response.data.jwtToken);
          props.setUser(response.data.fullName);
          props.setRole(response.data.role);
          toast("Đăng nhập thành công");
          console.log("Đăng nhập thành công");
        }, 1000);
      })
      .catch((error) => {
        // console.log("Đăng nhập thất bại" + error);
        console.log(error);
        setTimeout(() => {
          props.setIsLoading(false);
          toast.error(error.response.data, { theme: "colored" });
        }, 1000);
      });
  };
  // const onError = (error) => {
  //   console.log(error);
  // };

  return (
    <Container className={styles.container}>
      <img src={loginImg} className={styles.imageLogin} />
      <Form className={styles.formLogin} onSubmit={handleSubmit(onLogin)}>
        <Label className={styles.head}>Đăng nhập</Label>
        <FormGroup className={styles.usernamearea}>
          <Row>
            <Label className={styles.label} for="username">
              Tên đăng nhập:
            </Label>
            <Col>
              <Input
                type="text"
                className={styles.username}
                id="username"
                name="username"
                {...register("username", {
                  required: {
                    value: true,
                    message: "Bắt buộc phải có tên đăng nhập.",
                  },
                })}
              />
              {errors && (
                <Container className={styles.error}>
                  {errors.username?.message}
                </Container>
              )}
            </Col>
          </Row>
        </FormGroup>
        <FormGroup className={styles.passwordarea}>
          <Row>
            <Label className={styles.label} for="password">
              Mật khẩu:
            </Label>
            <Col>
              <Input
                type="password"
                className={styles.password}
                id="password"
                name="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Bắt buộc phải có mật khẩu.",
                  },
                })}
              />
              {errors && (
                <Container className={styles.error}>
                  {errors.password?.message}
                </Container>
              )}
            </Col>
          </Row>
        </FormGroup>
        <Container>
          <Input
            type="submit"
            value="Đăng nhập"
            className={styles.button}
            required
          />
        </Container>
      </Form>
    </Container>
  );
};
export default LoginAdmin;
