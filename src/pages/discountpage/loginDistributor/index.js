import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./loginDistributor.module.css";

const LoginDistributor = () => {
    const [sodienthoai, setSodienthoai] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handelLogin = async (e) => {
        e.preventDefault();
        if (!sodienthoai || !password) {
            setMessage("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        if (sodienthoai.length !== 10) {
            setMessage("Số điện thoại phải có 10 chữ số");
            return;
        }
        if (!/^\d+$/.test(sodienthoai)) {
            setMessage("Số điện thoại chỉ được chứa chữ số");
            return;
        }
        if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(sodienthoai)) {
            setMessage("Số điện thoại không hợp lệ!");
            setMessageType("error");
            return;
        }

        try {
            const response = await fetch(`https://chatapi.io.vn/dang-nhap-voi-mat-khau`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    sodienthoai: sodienthoai,
                    password: password,
                })
            });
        }catch (error) {
            setMessage("Đăng nhập thất bại. Vui lòng thử lại!");
        }
    }
}