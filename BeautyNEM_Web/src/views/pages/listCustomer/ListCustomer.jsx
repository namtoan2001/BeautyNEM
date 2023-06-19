import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import CustomerDatatable from "../../components/datatable/CustomerDatatable";

const ListCustomer = (props) => {
  return (
    <div className="list">
      <Sidebar Logout={props.Logout} />
      <div className="listContainer">
        <CustomerDatatable />
      </div>
    </div>
  );
};

export default ListCustomer;
