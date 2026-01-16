import { useState, useEffect } from "react";
import styles from "../ExchangeGifts/ExchangeGifts.module.css"; 
import api from "../../api/Code"; // Import file Code.js (không token)

function CheckCodeAdmin() {
    const [code, setCode] = useState("");
    const [savedCode, setSavedCode] = useState(""); // Biến lưu mã hợp lệ
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    // [DEBUG] Theo dõi khi savedCode thay đổi
    useEffect(() => {
        console.log(">>> State savedCode vừa được cập nhật thành:", savedCode);
    }, [savedCode]);

    // --- BƯỚC 1: KIỂM TRA MÃ ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("1. Bắt đầu kiểm tra mã:", code);

        if (!code.trim()) {
            alert("Vui lòng nhập mã để kiểm tra!");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/kiem-tra-ma-hop-le', { 
                magiamgia: code.trim() 
            });
            
            console.log("   - Kết quả API Kiểm tra:", res.status);

            if (res.status === 200 || res.status === 201) {
                const validCode = code.trim();
                console.log("   - Mã hợp lệ! Đang lưu mã này:", validCode);
                
                setSavedCode(validCode); // Lưu mã vào state
                setStatus("valid");
            } else {
                console.log("   - Mã không hợp lệ.");
                setStatus("invalid");
            }
        } catch (error) {
            console.error("   - Lỗi API Kiểm tra:", error);
            setStatus("invalid");
        } finally {
            setLoading(false);
        }
    };

    // --- BƯỚC 2: SỬ DỤNG MÃ (Nút OK) ---
    const handleConfirmUse = async () => {
        console.log("2. Bắt đầu bấm nút OK (Sử dụng)");
        console.log("   - Giá trị savedCode hiện tại là:", savedCode);

        // Kiểm tra kỹ xem có mã không
        if (!savedCode) {
            console.error("   - LỖI: savedCode đang rỗng!");
            alert(`Lỗi: Không tìm thấy mã đã lưu (savedCode: "${savedCode}"). Vui lòng thử lại bước kiểm tra.`);
            return;
        }

        setLoading(true);
        try {
            console.log("   - Đang gửi API /su-dung-ma-hop-le với payload:", { magiamgia: savedCode });

            const res = await api.post('/su-dung-ma-hop-le', { 
                magiamgia: savedCode 
            });

            console.log("   - Kết quả API Sử dụng:", res.status, res.data);

            if (res.status === 200 || res.status === 201) {
                alert(`Đã kích hoạt thành công mã: ${savedCode}`);
                
                // Reset form
                setStatus("");
                setCode(""); 
                setSavedCode(""); 
            } else {
                alert("Server trả về lỗi (không phải 200). Xem console để biết chi tiết.");
            }
        } catch (error) {
            console.error("   - Lỗi API Sử dụng:", error);
            if (error.response) {
                console.log("   - Data lỗi từ server:", error.response.data);
                alert(`Lỗi Server: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Lỗi kết nối hoặc hệ thống.");
            }
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setStatus("");
    };

    return (
        <div className={styles.containerGift}>
            <img src="/headline.png" alt="Background" className={styles.backgroundImage} />
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
                        {/* TRƯỜNG HỢP HỢP LỆ */}
                        {status === 'valid' && (
                            <>
                                <img src="/thanh cong icon.png" alt="Hợp lệ" className={styles.statusIcon} />
                                <h3 className={styles.successTitle} style={{color: '#206a37'}}>MÃ HỢP LỆ!</h3>
                                
                                {/* Hiển thị thử giá trị savedCode ra màn hình để debug */}
                                <p className={styles.successDesc}>
                                    Mã <b>{savedCode}</b> có thể sử dụng.
                                </p>
                                
                                <div style={{display:'flex', gap: '10px'}}>
                                    <button 
                                        className={styles.closeBtn} 
                                        style={{backgroundColor: '#206a37'}} 
                                        onClick={handleConfirmUse}
                                        disabled={loading}
                                    >
                                        {loading ? "Đang xử lý..." : "SỬ DỤNG"}
                                    </button>
                                    <button 
                                        className={styles.closeBtn} 
                                        style={{backgroundColor: '#666'}} 
                                        onClick={closeModal}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {/* TRƯỜNG HỢP KHÔNG HỢP LỆ */}
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