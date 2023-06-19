import { useEffect, useState } from "react";
import "./App.css";
import { createUseStyles } from "react-jss";
import React from "react";
import LoginAdmin from "./views/pages/Administrator/LoginAdmin";
import NotFound from "./views/pages/NotFound";
import Forbidden from "./views/pages/Forbidden";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "reactstrap";

import Home from "./views/pages/home/Home";
import ListCustomer from "./views/pages/listCustomer/ListCustomer";
import ListBeautician from "./views/pages/listBeautician/ListBeautician";
import HomePage from "./views/pages/HomePage/homePage";
import EditTitle from "./views/pages/HomePage/editTitle";
import AddSlides from "./views/pages/HomePage/addSlides";
import ListBeautyShop from "./views/pages/listBeautyShop/ListBeautyShop";
import ServiceList from "./views/pages/serviceList/serviceList.jsx";
import AddService from "./views/pages/serviceList/addService";
import EditService from "./views/pages/serviceList/editService";

const useStyles = createUseStyles({
  loader: {
    position: "fixed",
    zIndex: 9999,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    width: "100%",
    height: "100%",
    display: "flex !important",
    alignItems: "center",
    justifyContent: "center",
  },
});

function App() {
  let location = useLocation();
  let navigate = useNavigate();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("fullName"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    if (location.pathname.includes("/")) {
      if (user) {
        if (location.pathname === "/login") {
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    }
  }, [user]);

  const handleDrawerOpen = () => {
    if (user) {
      setOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const Logout = () => {
    setIsLoading(true);
    setTimeout(() => {
      handleDrawerClose();
      setUser(null);
      setRole(null);
      setIsLoading(false);
      localStorage.removeItem("fullName");
      localStorage.removeItem("role");
      localStorage.removeItem("jwtToken");
      toast.success("Bạn đã đăng xuất thành công!", { theme: "colored" });
    }, 1000);
  };

  return (
    <Container>
      <ScaleLoader
        className={classes.loader}
        color="#FF9494"
        loading={isLoading}
      />
      <ToastContainer />
      <Routes>
        <Route
          exact
          path="/login"
          element={
            <LoginAdmin
              setUser={setUser}
              setRole={setRole}
              setIsLoading={setIsLoading}
            />
          }
        />
        <Route path="/">
          <Route
            index
            element={
              role === "Admin" ? (
                <React.Fragment>
                  <Home
                    setIsLoading={setIsLoading}
                    user={user}
                    role={role}
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    Logout={Logout}
                  />
                </React.Fragment>
              ) : (
                <Forbidden />
              )
            }
          />
          <Route path="customers">
            <Route
              index
              element={
                role === "Admin" ? (
                  <ListCustomer
                    setIsLoading={setIsLoading}
                    user={user}
                    role={role}
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    Logout={Logout}
                  />
                ) : (
                  <Forbidden />
                )
              }
            />
          </Route>
          <Route path="beauticians">
            <Route
              index
              element={
                role === "Admin" ? (
                  <ListBeautician
                    setIsLoading={setIsLoading}
                    user={user}
                    role={role}
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    Logout={Logout}
                  />
                ) : (
                  <Forbidden />
                )
              }
            />
          </Route>
          <Route path="beautyShop">
            <Route
              index
              element={
                role === "Admin" ? (
                  <ListBeautyShop
                    setIsLoading={setIsLoading}
                    user={user}
                    role={role}
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    Logout={Logout}
                  />
                ) : (
                  <Forbidden />
                )
              }
            />
          </Route>
          <Route path="service">
            <Route
              index
              element={
                role === "Admin" ? (
                  <ServiceList
                    setIsLoading={setIsLoading}
                    user={user}
                    role={role}
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    Logout={Logout}
                  />
                ) : (
                  <Forbidden />
                )
              }
            />
            <Route
              path="addService"
              element={
                role === "Admin" ? (
                  <AddService
                    setIsLoading={setIsLoading}
                    user={user}
                    role={role}
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    Logout={Logout}
                  />
                ) : (
                  <Forbidden />
                )
              }
            />
            <Route
              path="editService/:id"
              element={
                role === "Admin" ? (
                  <EditService
                    setIsLoading={setIsLoading}
                    user={user}
                    role={role}
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    Logout={Logout}
                  />
                ) : (
                  <Forbidden />
                )
              }
            />
          </Route>
          <Route path="homePage">
            <Route
              index
              element={
                role === "Admin" ? (
                  <HomePage
                    setIsLoading={setIsLoading}
                    user={user}
                    role={role}
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    Logout={Logout}
                  />
                ) : (
                  <Forbidden />
                )
              }
            />
            <Route
              path="editTitle"
              element={
                role === "Admin" ? (
                  <EditTitle
                    setIsLoading={setIsLoading}
                    user={user}
                    role={role}
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    Logout={Logout}
                  />
                ) : (
                  <Forbidden />
                )
              }
            />
            <Route
              path="addSlides"
              element={
                role === "Admin" ? (
                  <AddSlides
                    setIsLoading={setIsLoading}
                    user={user}
                    role={role}
                    open={open}
                    handleDrawerOpen={handleDrawerOpen}
                    Logout={Logout}
                  />
                ) : (
                  <Forbidden />
                )
              }
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Container>
  );
}

export default App;
