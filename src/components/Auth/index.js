import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import style from "./Auth.module.css";

function Auth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Gọi API để lấy thông tin người dùng
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("https://dtweb.onrender.com/sign-in/user-profile", {
          withCredentials: true, // gửi cookie
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

  // Theo dõi khi user thay đổi
  useEffect(() => {
    if (user) {
      console.log("User cập nhật:");
      if (!user.name) {
        navigate("/cap-nhap-thong-tin", { replace: true });
      }
    }
  }, [user, navigate]);

  if (loading) return <p>Đang tải...</p>;

  return user ?(
    <NavLink
      to="/thong-tin-khach-hang/hoa-don"
      className={({ isActive }) => (isActive ? style.active : "")}
    >
      {user.name}
    </NavLink>
  ) : (
    <NavLink
      to="/dang-nhap"
      className={({ isActive }) => (isActive ? style.active : "")}
    >
      Đăng nhập
    </NavLink>
  );
}

export default Auth;
