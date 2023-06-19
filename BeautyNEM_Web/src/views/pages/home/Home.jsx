import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import BookingChart from "../../components/featured/BookingChart";
import Table from "../../components/table/Table";

const Home = (props) => {
  return (
    <div className="home">
      <Sidebar Logout={props.Logout} />
      <div className="homeContainer">
        <div className="widgets">
          <Widget type="customer" />
          <Widget type="beautician" />
        </div>
        <div className="charts">
          <Featured />
          <BookingChart />

          {/* <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} /> */}
        </div>
        {/* <div className="listContainer">
          <div className="listTitle">Tài khoản đã tạo gần đây</div>
          <Table />
        </div> */}
      </div>
    </div>
  );
};

export default Home;
