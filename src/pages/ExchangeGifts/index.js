import { useState, useEffect } from "react";
import styles from "./ExchangeGifts.module.css";
function ExchangeGifts() {
    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        phoneNumber: "",
        code1: "",
        code2: "",
        code3: "",
        code4: "",
        image: null
    });
    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files[0] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu gửi đi:", formData);
        if (formData.phoneNumber.trim() !== "") {
            setStatus("success");
        } else {
            setStatus("fail");
        }
    };
    const closeModal = () => {
        setStatus(null);
    };

    const handleReceiveAtShop = () => {
        alert("Bạn đã chọn nhận tại Shop!");
        setStatus(null);
    };

    const handleReceiveAtHome = () => {
        alert("Bạn đã chọn nhận tại Nhà!");
        setStatus(null);
    };

    return (
        <div className={styles.containerGift}>
            <div className={styles.MainGift}>
                <h2 className={styles.titleGift}>CHƯƠNG TRÌNH ĐỔI MÃ NHẬN QUÀ</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroupGift}>
                        <label className={styles.labelGift}>Nhập số điện thoại</label>
                        <input 
                            type="text" 
                            className={styles.inputGift} 
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.gridRowGift}>
                        <div className={styles.gridColGift}>
                            <label className={styles.labelGift}>Mã vỏ 1</label>
                            <input 
                                type="text" 
                                className={styles.inputGift} 
                                name="code1"
                                value={formData.code1}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.gridColGift}>
                            <label className={styles.labelGift}>Mã vỏ 2</label>
                            <input 
                                type="text" 
                                className={styles.inputGift} 
                                name="code2"
                                value={formData.code2}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Hàng 2: Mã vỏ 3 & 4 */}
                    <div className={styles.gridRowGift}>
                        <div className={styles.gridColGift}>
                            <label className={styles.labelGift}>Mã vỏ 3</label>
                            <input 
                                type="text" 
                                className={styles.inputGift} 
                                name="code3"
                                value={formData.code3}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.gridColGift}>
                            <label className={styles.labelGift}>Mã vỏ 4</label>
                            <input 
                                type="text" 
                                className={styles.inputGift} 
                                name="code4"
                                value={formData.code4}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Chọn ảnh */}
                    <div className={styles.uploadSectionGift}>
                        <label className={styles.labelGift}>Chọn ảnh</label>
                        <input 
                            type="file" 
                            id="fileUpload" 
                            style={{ display: "none" }} 
                            onChange={handleFileChange}
                        />
                        <label htmlFor="fileUpload" className={styles.uploadBtnLabelGift}>
                            {formData.image ? formData.image.name : "Tải lên"}
                        </label>
                    </div>

                    <button type="submit" className={styles.submitBtnGift}>
                        Xác nhận
                    </button>
                </form>
            </div>
            {status && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        {status === 'success' && (
                            <>
                                <img 
                                    src="/thanh cong icon.png" 
                                    alt="Thành công" 
                                    className={styles.statusIcon} 
                                />
                                <h3 className={styles.successTitle}>ĐỔI MÃ THÀNH CÔNG!</h3>
                                <p className={styles.successDesc}>
                                    Vui lòng chọn một trong hai hình thức nhận thưởng.
                                </p>
                                <div className={styles.modalBtnGroup}>
                                    <button className={styles.btnOption} onClick={handleReceiveAtShop}>
                                        <span className={styles.btnTitle}>Nhận tại Shop</span>
                                        <span className={styles.btnSub}>(Đổi trực tiếp tại cửa hàng)</span>
                                    </button>
                                    <button className={styles.btnOption} onClick={handleReceiveAtHome}>
                                        <span className={styles.btnTitle}>Nhận tại nhà</span>
                                        <span className={styles.btnSub}>(Thời gian từ 5-7 ngày)</span>
                                    </button>
                                </div>
                            </>
                        )}

                        {/* TRƯỜNG HỢP THẤT BẠI */}
                        {status === 'fail' && (
                            <>
                                <img
                                    src="/loi icon.png"
                                    alt="Thất bại"
                                    className={styles.statusIcon}
                                />
                                <h3 className={styles.failTitle}>KHÔNG THÀNH CÔNG!</h3>
                                <p className={styles.failDesc}>
                                    Mã không hợp lệ hoặc đã được sử dụng.<br/>
                                    Vui lòng nhập lại mã khác!
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

export default ExchangeGifts;