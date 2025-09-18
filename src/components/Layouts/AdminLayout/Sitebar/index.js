import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import Style from "./Sitebar.module.css";

function Sitebar() {
  return (
    <div className="container color-red">
      <div>
        <h3>Dashboard</h3>
        <NavLink
          to="/quan-tri/tong-quan"
          className={({ isActive }) => (isActive ? Style.active : "")}
        >
          {" "}
          Tổng quan
        </NavLink>
      </div>
      <div>
        <h3>Sản phẩm</h3>
        <NavLink
          to="/quan-tri/san-pham"
          className={({ isActive }) => (isActive ? Style.active : "")}
        >
          {" "}
          Tất cả sản phẩm
        </NavLink>
        <NavLink
          to="/quan-tri/loai-san-pham"
          className={({ isActive }) => (isActive ? Style.active : "")}
        >
          {" "}
          Loại sản phẩm
        </NavLink>
      </div>
      <div>
        <h3>Đơn hàng</h3>
        <NavLink
          to="/quan-tri/hoa-don"
          className={({ isActive }) => (isActive ? Style.active : "")}
        >
          {" "}
            Tất cả đơn hàng
        </NavLink>
      </div>
      <div>
        <h3>Chức năng</h3>
        <NavLink
          to="/quan-tri/quan-ly-tai-khoan"
          className={({ isActive }) => (isActive ? Style.active : "")}
        >
          {" "}
          quản lý tài khoản
        </NavLink>
        <NavLink
          to="/quan-tri/banner"
          className={({ isActive }) => (isActive ? Style.active : "")}
        >
          {" "}
          Banner
        </NavLink>
      </div>
      <div>
        <h3>LuckyWheel</h3>
        <NavLink
          to="/quan-tri/LuckyWheel"
          className={({ isActive }) => (isActive ? Style.active : "")}
        >
          {" "}
          Vòng quay may mắn
        </NavLink>
      </div>
    </div>
  );
}

export default Sitebar;
