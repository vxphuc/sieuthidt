import { NavLink, replace } from "react-router-dom";
import style from "./Auth.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Auth() {
    const [user, setUser] = useState(null); // State lưu thông tin người dùng
    const [loading, setLoading] = useState(true); // Trạng thái loading khi lấy dữ liệu
    const navigate = useNavigate(); // Sử dụng navigate để chuyển trang

    useEffect(() => {
        const fetchUserProfile = async () => {
            function getCookie(name) {
                const cookies = document.cookie.split(';');
                for (const cookie of cookies) {
                    const [key, value] = cookie.trim().split('=');
                    if (key === name) return value;
                }
                return null;
            }

            const token = getCookie("authToken"); // Lấy token từ cookie

            if (!token) {
                console.log("Chưa đăng nhập");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('https://web-dt.onrender.com/sign-in/user-profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userProfile = Array.isArray(response.data) ? response.data[0] : response.data;
                setUser(userProfile)
            } catch (error) {
                console.error("Lỗi khi lấy thông tin người dùng:", error);
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchUserProfile();
    }, []);

    // Khi user được cập nhật, kiểm tra nếu không có name thì chuyển hướng
    useEffect(() => {

        if (user !== null && !user.name) {
            navigate  ("/cap-nhap-thong-tin", {replace: true});
        }
    }, [user]);

    
   

    if (loading) return <p>Đang tải...</p>;

    return (
        !user?.phone ? (
            <NavLink
                to="/dang-nhap"
                className={({ isActive }) => (isActive ? style.active : "")}
            >
                Đăng nhập
            </NavLink>
        ) : (
            <NavLink
                to="/thong-tin-khach-hang"
                className={({ isActive }) => (isActive ? style.active : "")}
            >
                {user.name}
            </NavLink>
        )
    );
}

export default Auth;
