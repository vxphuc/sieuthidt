import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import style from "./Auth.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function Auth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("https://dtweb.onrender.com/sign-in/user-profile", {
          withCredentials: true,
        });

        const userData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        setUser(userData);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
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
        {isLoggedIn ? user.phone : "Đăng nhập"}
      </button>
    </NavLink>
  );
}

export default Auth;
