import React, { useState, useEffect } from "react";
import "./homePage.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import {
  GetTitle,
  GetTitleImage,
  DeleteTitleImage,
} from "../../../services/HomePageService";

import "react-toastify/dist/ReactToastify.css";
import "@fontsource/dancing-script";
import { Link } from "react-router-dom";
import ImageSlider, { Slide } from "react-auto-image-slider";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const HomePage = (props) => {
  const [titleName, setTitleName] = useState("");
  const [imgs, setImgs] = useState([]);
  // const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    GetTitle()
      .then((response) => {
        setTitleName(response.data[0].titleName);
      })
      .catch((err) => {
        console.log(err);
      });
    GetTitleImage()
      .then((response) => {
        setImgs(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [titleName, imgs]);

  const handleDeleteImg = (id) => {
    Swal.fire({
      title: "Thông báo",
      text: "Bạn muốn xóa ảnh quảng cáo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy bỏ",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteTitleImage(id)
          .then((response) => {
            toast("Xóa thành công ảnh dịch vụ");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <div className="new">
      <Sidebar Logout={props.Logout} />
      <div className="newContainer">
        <div className="top">
          <h1>Quản lý trang chủ</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <div className="homePage">
              <div className="divTitle">
                <h2 className="title">
                  {/* Khám phá vũ trụ làm đẹp {"\n"}BeautyNEM nhé, {"\n"}Bạn mới! */}
                  {titleName}
                </h2>
                <Link
                  to={`/homePage/editTitle`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="viewButton">Chỉnh sửa</div>
                </Link>
              </div>
              <div className="divSlides">
                <div id="slider">
                  <ImageSlider effectDelay={500} autoPlayDelay={2000}>
                    {imgs.map((img, index) => {
                      return (
                        <Slide key={index}>
                          <div className="slide-Img">
                            <img
                              alt=""
                              src={`https://res.cloudinary.com/dpwifnuax/image/upload/TitleImage/${img.image}`}
                            />
                            <span
                              className="btnDelete"
                              onClick={() => handleDeleteImg(img.id)}
                            >
                              <DeleteForeverIcon />
                            </span>
                          </div>
                        </Slide>
                      );
                    })}
                  </ImageSlider>
                </div>
                <Link
                  to={`/homePage/addSlides`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="viewButton">Thêm ảnh</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
