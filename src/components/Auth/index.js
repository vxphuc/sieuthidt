import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import style from "./Auth.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import api from '../../api/axios'

function Auth() {
  const [user, setUser] = useState(null);
  const [loading] = useState(false);

  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Lỗi parse user:", e);
      localStorage.removeItem("user");
    }
  } else {
    // fallback gọi API nếu cần
    const fetchUser = async () => {
      try {
        const response = await api.get('/sign-in/user-profile');
        setUser(response.data.user); // tùy theo backend
      } catch (error) {
        console.log("Lỗi lấy profile:", error);
      }
    };
    fetchUser();
  }
}, []);

  if (loading) return <p>Đang tải...</p>;

  const isLoggedIn = !!user;

  return (
    <NavLink
      to={isLoggedIn ? "/thong-tin-khach-hang/hoa-don" : "/dang-nhap"}
      className={({ isActive }) => `${style.loginButton} ${isActive ? style.active : ""}`}
    >
      <button className={style.button}>
        <FontAwesomeIcon icon={faUser} className={style.userIcon} />
        {isLoggedIn ? user.numberPhone : "Đăng nhập"}
      </button>
    </NavLink>
  );
}

export default Auth;
