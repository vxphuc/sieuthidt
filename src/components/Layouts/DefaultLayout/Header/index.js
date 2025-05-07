import { NavLink, useLocation, useNavigate } from "react-router-dom";
import style from "./Header.module.css";
import Auth from "../../../Auth";
import Search from "../../Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBars } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

function Header() {
  const [showMenu, setShowMenu] = useState(false); // toggle menu trạng thái mở/đóng
  const menuRef = useRef(null);
  const [searh, setSearch] = useState("");
  const [userRole, setUserRole] = useState(null); // dữ liệu người dùng đăng nhập
  const [cartCount, setCartCount] = useState(0);

  // lấy số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("https://dtweb.onrender.com/cart", {
          withCredentials: true,
        });
        
        setCartCount(res.data.itemCount);
      } catch (err) {
        console.error("Không lấy được số lượng sản phẩm trong giỏ hàng:", err);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //phần ẩn quản trị viên
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://dtweb.onrender.com/sign-in/user-profile",
          {
            withCredentials: true, // cho phép gửi cookie authToken
          }
        );
        setUserRole(res.data.role); // lưu lại role từ response
      } catch (err) {
        console.error("Không lấy được user:", err);
        setUserRole(null); // nếu lỗi hoặc chưa đăng nhập
      }
    };

    fetchUser();
  }, []);
  const showAdminLink = userRole === "admin" || userRole === "editor";

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className={style.container}>
      <div className={`container ${style.header}`}>
        {/* Logo bên trái */}
        <div className={style.logo}>
          <NavLink to="/">
            <img
              width="70%"
              height="100%"
              src="https://dtweb.onrender.com/uploads/favicon.png"
              alt="Logo"
            />
          </NavLink>
        </div>

        {/* Thanh tìm kiếm */}
        <Search onChange={handleSearch} onCartChange = {cartCount} searchValue={searh} />

        {/* Nút menu ba gạch trên mobile */}
        <button
          className={style.menuToggle}
          onClick={() => setShowMenu(!showMenu)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Menu điều hướng */}
        <nav>
          <ul
            ref={menuRef}
            className={showMenu ? style.navMobileShown : style.navMobileHidden}
          >
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Trang chủ
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/tin-tuc"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Tin tức
              </NavLink>
            </li> */}
            {/* <li>
              <NavLink
                to="/thu-vien"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Thư viện
              </NavLink>
            </li> */}
            <li>
              <Auth />
            </li>
            {showAdminLink && (
              <li>
                <NavLink
                  to="/quan-tri/tong-quan"
                  className={({ isActive }) => (isActive ? style.active : "")}
                >
                  Quản trị
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;
