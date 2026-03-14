import React, {useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./loginDistributor.module.css";
import { Link } from "react-router-dom";
const LoginDistributor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sodienthoai, setSodienthoai] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messageType, setMessageType] = useState("");
    const [message, setMessage] = useState("");

    const handelLogin = async (e) => {
        e.preventDefault();
        if (!sodienthoai || !password) {
            setMessage("Vui lòng nhập đầy đủ thông tin");
            setMessageType("error");
            return;
        }
        if (sodienthoai.length !== 10) {
            setMessage("Số điện thoại phải có 10 chữ số");
            setMessageType("error");
            return;
        }
        if (!/^\d+$/.test(sodienthoai)) {
            setMessage("Số điện thoại chỉ được chứa chữ số");
            setMessageType("error");
            return;
        }
        if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(sodienthoai)) {
            setMessage("Số điện thoại không hợp lệ!");
            setMessageType("error");
            return;
        }
        setIsLoading(true);
        setMessage("");
        setMessageType("");
        try {
            const response = await fetch(`https://staging.chatapi.io.vn/dang-nhap-voi-mat-khau`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sodienthoai: sodienthoai,
                    password: password,
                })
            });
            const data = await response.json();
            if (response.ok) {
                if (data) {
                    sessionStorage.setItem("token", data);
                }
                setMessage("Đăng nhập thành công!");
                setMessageType("success");
                const checkRes = await fetch(
                    "https://staging.chatapi.io.vn/trang-thai-duyet-daily",
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${data}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                const checkData = await checkRes.json();
                if (checkData) {
                    navigate("/duyet-phan-thuong");
                } 
                else {
                    navigate("/dang-ky-dai-ly");
                }

                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }else{
                setMessage(data.message || "Sai tài khoản hoặc mật khẩu");
                setMessageType("error");
            }
        }catch (error) {
            setMessage("Đăng nhập thất bại. Vui lòng thử lại!");
            setMessageType("error");
        }finally {
            setIsLoading(false);
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.title}>Đăng Nhập Đại Lý</h2>
                <p className={styles.subtitle}>Đăng nhập bằng số điện thoại và mật khẩu để đăng ký đại lý</p>
                <form onSubmit={handelLogin} className={styles.form}>
                    <div className={styles.formGroup}>
                        <input
                            type="tel"
                            value={sodienthoai}
                            onChange={(e) => setSodienthoai(e.target.value.replace(/\D/g, ""))}
                            maxLength={10}
                            placeholder="Số điện thoại"
                            className={styles.input}
                            onFocus={(e) => e.target.placeholder = ''}
                            onBlur={(e) => e.target.placeholder = 'Số điện thoại'}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            className={styles.input}
                            ònFocus={(e) => e.target.placeholder = ''}
                            onBlur={(e) => e.target.placeholder = 'Mật khẩu'}
                        />
                    </div>
                    {message && (
                        <p
                        className={
                            messageType === "success"
                            ? styles.successMessage
                            : styles.errorMessage
                        }
                        >
                        {message}
                        </p>
                    )}
                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                    </button>
                </form>
                <p className={styles.rgtAcount}>
                    Chưa có tài khoản? {" "}
                    <span className={styles.rgtAcountLink} onClick={() => navigate("/dang-ky-tai-khoan")}>
                        Đăng ký ngay
                    </span>
                </p>
                <p className={styles.rgtAcount}>
                    Quên mật khẩu? {" "}
                    <span className={styles.rgtAcountLink} onClick={() => navigate("/quen-mat-khau")}>
                        Tạo mới mật khẩu
                    </span>
                </p>
            </div>
        </div>
    )
}
export default LoginDistributor;