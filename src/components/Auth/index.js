import { data, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import style from "./Auth.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import api from '../../api/axios'

function Auth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/sign-in/user-profile');
        setUser(response.data)
      }catch{
        console.log('error')
      }
    }
    fetchUser()
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
