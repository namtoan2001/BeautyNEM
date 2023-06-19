import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import BeauticianDatatable from "../../components/datatable/BeauticianDatatable";

const ListBeautician = (props) => {
  return (
    <div className="list">
      <Sidebar Logout={props.Logout} />
      <div className="listContainer">
        <BeauticianDatatable />
      </div>
    </div>
  );
};

export default ListBeautician;
