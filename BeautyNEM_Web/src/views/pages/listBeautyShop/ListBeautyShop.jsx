import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import BeautyShopDatatable from "../../components/datatable/BeautyShopDatatable";

const ListBeautyShop = (props) => {
  return (
    <div className="list">
      <Sidebar Logout={props.Logout} />
      <div className="listContainer">
        <BeautyShopDatatable />
      </div>
    </div>
  );
};

export default ListBeautyShop;
