import { useState } from "react";
import styles from "../ExchangeGifts/ExchangeGifts.module.css"; 
import api from "../../api/koc"; // [1] Thêm import api

function CheckCodeAdmin() {
    const [code, setCode] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code.trim()) {
            alert("Vui lòng nhập mã để kiểm tra!");
            return;
        }

        setLoading(true);
        try {
            // [2] Sử dụng api.post thay vì fetch
            // api.post sẽ dùng cấu hình chung (baseURL, timeout...) từ file koc.js
            const res = await api.post('/kiem-tra-ma-hop-le', { 
                magiamgia: code.trim() 
            });

            // Axios tự động ném lỗi nếu status không ok, nên nếu chạy tới đây là thành công
            if (res.status === 200 || res.status === 201) {
                setStatus("valid");
            } else {
                setStatus("invalid");
            }
        } catch (error) {
            console.error("Lỗi kiểm tra:", error);
            setStatus("invalid");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setStatus("");
    };

    return (
        <div className={styles.containerGift}>
            <div className={styles.MainGift}>
                <h2 className={styles.titleGift}>KIỂM TRA MÃ HỢP LỆ</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroupGift}>
                        <label className={styles.labelGift}>Nhập mã giảm giá</label>
                        <input 
                            type="text" 
                            className={styles.inputGift} 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Nhập mã cần kiểm tra..."
                        />
                    </div>

                    <button type="submit" className={styles.submitBtnGift} disabled={loading}>
                        {loading ? "Đang kiểm tra..." : "KIỂM TRA NGAY"}
                    </button>
                </form>
            </div>

            {status && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        {status === 'valid' && (
                            <>
                                <img src="/thanh cong icon.png" alt="Hợp lệ" className={styles.statusIcon} />
                                <h3 className={styles.successTitle} style={{color: '#206a37'}}>MÃ HỢP LỆ!</h3>
                                <p className={styles.successDesc}>
                                    Mã <b>{code}</b> có thể sử dụng.
                                </p>
                                <button className={styles.closeBtn} style={{backgroundColor: '#206a37'}} onClick={closeModal}>
                                    OK
                                </button>
                            </>
                        )}
                        
                        {status === 'invalid' && (
                            <>
                                <img src="/loi icon.png" alt="Không hợp lệ" className={styles.statusIcon} />
                                <h3 className={styles.failTitle}>KHÔNG HỢP LỆ!</h3>
                                <p className={styles.failDesc}>
                                    Mã <b>{code}</b> không tồn tại hoặc đã hết hạn.
                                </p>
                                <button className={styles.closeBtn} onClick={closeModal}>
                                    Đóng
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckCodeAdmin;