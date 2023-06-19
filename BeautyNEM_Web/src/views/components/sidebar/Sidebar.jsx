import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import HomeRepairServiceOutlinedIcon from "@mui/icons-material/HomeRepairServiceOutlined";
import { Link } from "react-router-dom";

const Sidebar = (props) => {
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">BeautyNEM</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">Bảng điều khiển</p>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Thống kê</span>
            </li>
          </Link>
          <p className="title">Tài khoản</p>
          <Link to="/customers" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Khách hàng</span>
            </li>
          </Link>
          <Link to="/beauticians" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Thợ làm đẹp</span>
            </li>
          </Link>
          {/* <Link to="/beautyShop" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Chủ cửa hàng</span>
            </li>
          </Link> */}
          <p className="title">Quản lý</p>
          <Link to="/service" style={{ textDecoration: "none" }}>
            <li>
              <HomeRepairServiceOutlinedIcon className="icon" />
              <span>Dịch vụ</span>
            </li>
          </Link>
          <Link to="/homePage" style={{ textDecoration: "none" }}>
            <li>
              <PhoneIphoneIcon className="icon" />
              <span>Trang chủ</span>
            </li>
          </Link>
          <p className="title">Tiện ích</p>

          <Link
            style={{ textDecoration: "none" }}
            onClick={() => {
              props.Logout();
            }}
          >
            <li>
              <ExitToAppIcon className="icon" />
              <span>Đăng xuất</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
