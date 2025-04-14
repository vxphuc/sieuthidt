import { NavLink } from "react-router-dom";
import style from "./Header.module.css";
import Auth from "../../../Auth";
import Search from "../../Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBars } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
  
function Header() {
  const [showMenu, setShowMenu] = useState(false); // toggle menu trạng thái mở/đóng
  const menuRef = useRef(null);

  //hiển thị số lượng sản phẩm trong giỏ hàng
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, []);
  // kết thúc

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
  return (
    <div className={style.container}>
      <div className={`container ${style.header}`}>
        {/* Logo bên trái */}
        <div className={style.logo}>
          <NavLink to="/">
            <img
              width="70%"
              height="100%"
              src="http://dtgroup.lovestoblog.com/anh/logodt.png"
              alt="Logo"
            />
          </NavLink>
        </div>

        {/* Thanh tìm kiếm */}
        <Search />

        {/* Nút menu ba gạch trên mobile */}
        <button
          className={style.menuToggle}
          onClick={() => setShowMenu(!showMenu)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        {/* Menu điều hướng */}
        <nav>
          <ul ref={menuRef}
              className={showMenu ? style.navMobileShown : style.navMobileHidden}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Trang chủ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tin-tuc"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Tin tức
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/thu-vien"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Thư viện
              </NavLink>
            </li>
            <li>
              <Auth />
            </li>
            <li>
              <NavLink
                to="/quan-tri"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                Quản trị
              </NavLink>
            </li>
            <li className={style.cartWrapper}>
              <NavLink
                to="/gio-hang"
                className={({ isActive }) => (isActive ? style.active : "")}
              >
                <FontAwesomeIcon
                  icon={faCartShopping}
                  style={{ color: "rgb(19 17 51)" }}
                />
                {cartCount > 0 && <span className={style.cartBadge}>{cartCount}</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;
