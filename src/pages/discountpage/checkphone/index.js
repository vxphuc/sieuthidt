import React, {useEffect, useState} from "react";
import styles from "./checkphone.module.css";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
const CheckPhone = () => {
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/dang-nhap-dai-ly", {
                state: { from: "/kiem-tra-nguoi-trung-thuong" }
            });
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const exp = payload.exp * 1000;

            if (Date.now() > exp) {
                sessionStorage.removeItem("token");
                navigate("/dang-nhap-dai-ly", {
                    state: { from: "/kiem-tra-nguoi-trung-thuong" }
                });
            }
        } catch (error) {
            sessionStorage.removeItem("token");
            navigate("/dang-nhap-dai-ly", {
                state: { from: "/kiem-tra-nguoi-trung-thuong" }
            });
        }
    }, [navigate]);
    const handleCheckPhone = async (e) => {
        e.preventDefault();
        const toke = sessionStorage.getItem("token");
        if (!toke) {
            alert("Bạn cần đăng nhập để tiếp tục.");
            navigate("/dang-nhap-dai-ly");
            return;
        }
        if (!phone) {
            setMessage("Vui lòng nhập số điện thoại");
            setMessageType("error");
            return;
        }
        setIsLoading(true);
        setMessage("");
        setMessageType("");
        try {
            const response = await fetch(`https://staging.chatapi.io.vn/kiem-tra-nguoi-trung-thuong?sdt=${phone}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${toke}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(
                `SĐT ${data.numberphone} - ${data["trạng thái nhận thưởng"]} - id:${data.id}`
                );
                setMessageType("success");
            } else {
                setMessage("Không tìm thấy thông tin");
                setMessageType("error");
            }
        } catch (error) {
            setMessage("Có lỗi xảy ra khi kiểm tra số điện thoại");
            setMessageType("error");
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <h2>Kiểm Tra Người Trúng Thưởng</h2>

            <form onSubmit={handleCheckPhone} className={styles.form}>
                <input
                type="text"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                />

                <button type="submit" className={styles.button}>
                {isLoading ? "Đang kiểm tra..." : "Kiểm tra"}
                </button>
            </form>

            {message && (
                <p
                className={
                    messageType === "success" ? styles.success : styles.error
                }
                >
                {message}
                </p>
            )}
        </div>
    )
}
export default CheckPhone;