import React, { useState } from "react";
import styles from "./RegisterCTV.module.css";
import koc from "../../api/koc"; // Đường dẫn tới file cấu hình axios của anh

export default function RegisterForm({ onSuccess }) {
    const [form, setForm] = useState({ hoten: "", email: "", diachi: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.hoten || !form.email || !form.diachi) {
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }

        setLoading(true);
        try {
            // Gọi API đăng ký
            await koc.post('/dang-ky-koc', { 
                hoten: form.hoten, 
                email: form.email, 
                diachi: form.diachi 
            });
            
            onSuccess(); 
        } catch (err) {
            console.error(err);
            const message = err?.response?.data?.detail || "Lỗi đăng ký. Vui lòng thử lại.";
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Đăng ký CTV</h2>
            <div className={styles.headingContent}>Đăng kí để trở thành CTV của chúng tôi</div>
            <div className={styles.formBox}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <label className={styles.label}>Họ và tên</label>
                        <input className={styles.input} name="hoten" value={form.hoten} onChange={handleChange} placeholder="Nhập họ tên" required />
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.label}>Email</label>
                        <input className={styles.input} name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@gmail.com" required />
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.label}>Địa chỉ</label>
                        <input className={styles.input} name="diachi" value={form.diachi} onChange={handleChange} placeholder="Nhập địa chỉ" required />
                    </div>
                    <div className={styles.actions}>
                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? "Đang gửi..." : "Đăng ký CTV"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}