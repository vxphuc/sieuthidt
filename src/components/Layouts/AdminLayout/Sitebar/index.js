import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import Style from "./Sitebar.module.css";

function Sitebar() {
  return (
    <div className="container color-red">
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
          to="/quan-tri/banner"
          className={({ isActive }) => (isActive ? Style.active : "")}
        >
          {" "}
          Banner
        </NavLink>
      </div>
    </div>
  );
}

export default Sitebar;
