import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const List = () => {
  const rows = [
    {
      id: 1143155,
      fullName: "Lý Quốc A",
      date: "29/05/2001",
      phone: "0123456789",
      address: "98 XVNT, P.19, Q.Bình Thạnh",
      status: "Đã tạo",
      role: "Chủ cửa hàng",
    },
    {
      id: 2235235,
      fullName: "Lý Quốc B",
      date: "29/05/2001",
      phone: "0123456789",
      address: "98 XVNT, P.19, Q.Bình Thạnh",
      status: "Đã tạo",
      role: "Khách hàng",
    },
    {
      id: 2342353,
      fullName: "Lý Quốc C",
      date: "29/05/2001",
      phone: "0123456789",
      address: "98 XVNT, P.19, Q.Bình Thạnh",
      status: "Đã tạo",
      role: "Thợ của cửa hàng",
    },
    {
      id: 2357741,
      fullName: "Lý Quốc D",
      date: "29/05/2001",
      phone: "0123456789",
      address: "98 XVNT, P.19, Q.Bình Thạnh",
      status: "Đã tạo",
      role: "Thợ tự do",
    },
    {
      id: 2342355,
      fullName: "Lý Quốc E",
      date: "29/05/2001",
      phone: "0123456789",
      address: "98 XVNT, P.19, Q.Bình Thạnh",
      status: "Đã tạo",
      role: "Thợ tự do",
    },
  ];
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">ID</TableCell>
            <TableCell className="tableCell">Họ và tên</TableCell>
            <TableCell className="tableCell">Ngày sinh</TableCell>
            <TableCell className="tableCell">Số điện thoại</TableCell>
            <TableCell className="tableCell">Địa chỉ</TableCell>
            <TableCell className="tableCell">Vai trò</TableCell>
            <TableCell className="tableCell">Trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">{row.id}</TableCell>
              {/* <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.img} alt="" className="image" />
                  {row.product}
                </div>
              </TableCell> */}
              <TableCell className="tableCell">{row.fullName}</TableCell>
              <TableCell className="tableCell">{row.date}</TableCell>
              <TableCell className="tableCell">{row.phone}</TableCell>
              <TableCell className="tableCell">{row.address}</TableCell>
              <TableCell className="tableCell">{row.role}</TableCell>
              <TableCell className="tableCell">
                <span className="status Approved">{row.status}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
