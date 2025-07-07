import { NavLink,useNavigate } from "react-router-dom";
import style from "./Header.module.css";
import Auth from "../../../Auth";
import Search from "../../Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faBars, faBell, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { CartContext } from "../../../../contexts/CartContext";
import { io } from "socket.io-client";
import api from "../../../../api/axios"

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [searh, setSearch] = useState("");
  const [userRole, setUserRole] = useState(null);
  const { cartCount } = useContext(CartContext);
  const [notifications, setNotifications] = useState([]);
  const [popupnotifications, setpopupNotifications] = useState(false);
  
  const navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem('authToken');
    window.location.reload()
  };
  // SOCKET: dùng ref để giữ instance duy nhất
  const socketRef = useRef(null);

  useEffect(() => {
    // Tạo socket chỉ 1 lần khi mount
    socketRef.current = io("https://dtweb.onrender.com", {
      reconnectionAttempts: 3,
      reconnectionDelay: 3000,
      timeout: 4000,
    });

    // Lắng nghe notification
    socketRef.current.on("notification", (msg) => {
      setNotifications((prev) => [...prev, msg]);
    });

    // Nếu kết nối lỗi, disconnect luôn – không thử nữa
    socketRef.current.on("connect_error", (err) => {
      console.error("Socket.IO connect_error:", err.message);
      socketRef.current.disconnect();
    });

    // Cleanup: remove listener, disconnect socket khi unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("notification");
        socketRef.current.off("connect_error");
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Lấy notifications từ server (REST API), chỉ chạy 1 lần
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get(
          "/sign-in/NotificationAdmin"
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("Không lấy được thông báo:", err);
      }
    };
    fetchNotifications();
  }, []);

  // Click ngoài để ẩn menu
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

  // Lấy role người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(
          "/sign-in/user-profile"
        );
        setUserRole(res.data.role);
      } catch (err) {
        setUserRole(null);
      }
    };
    fetchUser();
  }, []);

  const showAdminLink = userRole === "admin" || userRole === "editor";

  const handleSearch = (e) => setSearch(e.target.value);

  return (
    <div className={style.container}>
      <div className={`container ${style.header}`}>
        {/* Logo */}
        <div className={style.logo}>
          <NavLink to="/">
            <img
              width="70%"
              height="100%"
              src="https://dtweb.onrender.com/uploads/logo%20trang.png"
              alt="Logo"
            />
          </NavLink>
        </div>

        {/* Thanh tìm kiếm */}
        <Search
          onChange={handleSearch}
          onCartChange={cartCount}
          searchValue={searh}
        />

        {/* Menu */}
        <nav>
          <div className={style.menuWrapper} ref={menuRef}>
            <button
              className={style.menuToggle}
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <ul
              className={
                showMenu ? style.navMobileShown : style.navMobileHidden
              }
            >
              <li>
                <NavLink to="/gio-hang">
                  <div className={style.cartInside}>
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      className={style.cartIcon}
                    />
                  </div>
                </NavLink>
                <NavLink to={"/gio-hang"} className={style.NumberPopUp}>
                  {cartCount}
                </NavLink>
              </li>
              <li>
                <button className={style.navItemButton} onClick={() => setpopupNotifications((prev) => !prev)}>
                  <FontAwesomeIcon icon={faBell} className={style.cartIcon} />
                </button>
              </li>
              <li>
                <Auth />
              </li>
              {userRole && (
                <li>
                  <button className={style.logoutButton} onClick={handleLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} className={style.cartIcon} />
                  </button>
                </li>
              )}
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
          </div>
        </nav>

        {popupnotifications && (
          <div className={style.notificationPopup}>
            <h4>Thông báo</h4>
            {notifications.length === 0 ? (
              <p>Không có thông báo nào.</p>
            ) : (
              <ul className={style.notificationList}>
                {notifications.map((noti, index) => (
                  <NavLink to={`/quan-tri/chi-tiet/${noti.orderId}`} key={noti._id}>
                    <li className={style.notificationItem}>{noti.message}</li>
                  </NavLink>
                ))}
              </ul>
            )}
          </div>
        )}

        {showMenu && (
          <div
            className={style.overlay}
            onClick={() => setShowMenu(false)}
          ></div>
        )}
      </div>
    </div>
  );
}

export default Header;
