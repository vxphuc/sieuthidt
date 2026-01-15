import { useState } from "react";
import styles from "./ExchangeGifts.module.css";
import api from "../../api/Code";
import axios from "../../api/axios";

function ExchangeGifts() {
    // State form đổi quà chính
    const [formData, setFormData] = useState({
        phoneNumber: "",
        code1: "",
        code2: "",
        code3: "",
        code4: "",
        image: null
    });
    const [status, setStatus] = useState(""); 
    const [giftCode, setGiftCode] = useState("");
    const [successStep, setSuccessStep] = useState("options");

    const [errorDetail, setErrorDetail] = useState("");

    const [deliveryForm, setDeliveryForm] = useState({
        name: "",
        phone: "",
        province: "",
        ward: "",
        road: ""
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const validatePhoneNumber = (phone) => {
        const regex = /^(03|05|07|08|09)+([0-9]{8})$/;
        return regex.test(phone);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "phoneNumber") {
            const re = /^[0-9\b]+$/;
            if (value !== '' && !re.test(value)) return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const phone = formData.phoneNumber.trim();
        if (!phone) {
            alert("Vui lòng nhập số điện thoại!");
            return;
        }

        // [CẬP NHẬT] Kiểm tra định dạng số điện thoại
        if (!validatePhoneNumber(phone)) {
            alert("Số điện thoại không hợp lệ!");
            return;
        }

        const listCodes = [];
        if (formData.code1.trim()) listCodes.push({ tenmagiamgia: formData.code1.trim() });
        if (formData.code2.trim()) listCodes.push({ tenmagiamgia: formData.code2.trim() });
        if (formData.code3.trim()) listCodes.push({ tenmagiamgia: formData.code3.trim() });
        if (formData.code4.trim()) listCodes.push({ tenmagiamgia: formData.code4.trim() });

        if (listCodes.length === 0) {
            alert("Vui lòng nhập ít nhất 1 mã vỏ hộp!");
            return;
        }
        setErrorDetail("");

        try {
            const payload = {
                magiamgia: listCodes,
                sdt: phone
            };
            const res = await api.post('/tra-ve-ma-nhan-thuong', payload);

            if (res.status === 200) {
                setGiftCode(res.data);
                setStatus("success");
                setSuccessStep("options");
                setDeliveryForm(prev => ({...prev, phone: phone}));
            }
        } catch (error) {
            console.error("Lỗi đổi thưởng:", error);
            setStatus("fail");
        }
    };

    const closeModal = () => {
        setStatus(null);
        setGiftCode("");
        setSuccessStep("options");
        setIsSubmitting(false);
    };

    // --- CÁC HÀM XỬ LÝ POPUP ---

    const handleReceiveAtShop = () => {
        setSuccessStep("shop");
    };

    const handleReceiveAtHome = () => {
        setSuccessStep("home");
    };

    const handleDeliveryChange = (e) => {
        const { name, value } = e.target;
        setDeliveryForm(prev => ({ ...prev, [name]: value }));
    };

    // --- [ĐÃ SỬA] GỬI FORM NHẬN TẠI NHÀ ---
    const handleSubmitDelivery = async (e) => {
        e.preventDefault();
        
        if(!deliveryForm.name || !deliveryForm.phone || !deliveryForm.province || !deliveryForm.ward || !deliveryForm.road) {
            alert("Vui lòng điền đầy đủ thông tin nhận hàng!");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            magiamgia: giftCode,
            madonhang: "6954c48b3f84f2fd3ec4bb68",
            province: deliveryForm.province,
            ward: deliveryForm.ward,
            road: deliveryForm.road,
            UserName: deliveryForm.name,
            phoneNumber: deliveryForm.phone
        };

        try {
            const res = await axios.post('/bill/mua-yen-sua', payload);

            if (res.status === 200 || res.status === 201) {
                alert("Đăng ký nhận quà tại nhà thành công!");
                closeModal();
            }
        } catch (error) {
            console.error("Lỗi gửi giao hàng:", error);
            alert("Gửi yêu cầu thất bại. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.containerGift}>
            <img src="/headline.png" alt="Background" className={styles.backgroundImage} />
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
                            placeholder="Nhập SĐT của bạn"
                        />
                    </div>
                    
                    <div className={styles.gridRowGift}>
                        <div className={styles.gridColGift}>
                            <label className={styles.labelGift}>Mã vỏ 1</label>
                            <input className={styles.inputGift} name="code1" value={formData.code1} onChange={handleChange} />
                        </div>
                        <div className={styles.gridColGift}>
                            <label className={styles.labelGift}>Mã vỏ 2</label>
                            <input className={styles.inputGift} name="code2" value={formData.code2} onChange={handleChange} />
                        </div>
                    </div>

                    <div className={styles.gridRowGift}>
                        <div className={styles.gridColGift}>
                            <label className={styles.labelGift}>Mã vỏ 3</label>
                            <input className={styles.inputGift} name="code3" value={formData.code3} onChange={handleChange} />
                        </div>
                        <div className={styles.gridColGift}>
                            <label className={styles.labelGift}>Mã vỏ 4</label>
                            <input className={styles.inputGift} name="code4" value={formData.code4} onChange={handleChange} />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtnGift}>
                        Xác nhận
                    </button>
                </form>
            </div>
            
            {/* --- MODAL XỬ LÝ KẾT QUẢ --- */}
            {status && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        
                        {/* TRƯỜNG HỢP THÀNH CÔNG */}
                        {status === 'success' && (
                            <>
                                <img src="/thanh cong icon.png" alt="Thành công" className={styles.statusIcon} />
                                <h3 className={styles.successTitle}>ĐỔI MÃ THÀNH CÔNG!</h3>
                                <div style={{margin: '5px 0 20px 0'}}>
                                    <p style={{fontSize: '18px', color: '#333', marginBottom: '5px'}}>
                                        Quà tặng: <strong style={{color: '#206a37'}}>Yến Sữa</strong>
                                    </p>
                                    <img
                                        src="/yensua.png"
                                        alt="Yến Sữa"
                                        style={{width: '60px', height: '60px', objectFit: 'contain', marginBottom: '5px'}}
                                    />
                                    <p style={{fontSize: '16px', color: '#666', margin: 0}}>
                                        Giá trị: <strong style={{color: '#d32f2f'}}>60.000đ</strong>
                                    </p>
                                </div>

                                {/* BƯỚC 1: LỰA CHỌN */}
                                {successStep === 'options' && (
                                    <>
                                        <p className={styles.successDesc}>
                                            Vui lòng chọn hình thức nhận thưởng:
                                        </p>
                                        <div className={styles.modalBtnGroup}>
                                            <button className={styles.btnOption} onClick={handleReceiveAtShop}>
                                                <span className={styles.btnTitle}>Nhận tại Shop</span>
                                                <span className={styles.btnSub}>(Hiện mã Code)</span>
                                            </button>
                                            <button className={styles.btnOption} onClick={handleReceiveAtHome}>
                                                <span className={styles.btnTitle}>Nhận tại nhà</span>
                                                <span className={styles.btnSub}>(Điền địa chỉ)</span>
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* BƯỚC 2A: HIỆN MÃ (SHOP) */}
                                {successStep === 'shop' && (
                                    <div style={{animation: 'fadeIn 0.3s'}}>
                                        <p className={styles.successDesc}>Vui lòng đưa mã này cho nhân viên:</p>
                                        <div style={{
                                            margin: '15px 0', 
                                            padding: '15px', 
                                            backgroundColor: '#e8f5e9', 
                                            borderRadius: '8px', 
                                            border: '2px dashed #206a37'
                                        }}>
                                            <p style={{
                                                margin: 0, 
                                                color: '#d32f2f', 
                                                fontSize: '28px', 
                                                fontWeight: '900', 
                                                letterSpacing: '2px'
                                            }}>
                                                {giftCode || "..."}
                                            </p>
                                        </div>
                                        <div style={{display: 'flex', gap: 10}}>
                                                <button type="button" 
                                                    className={styles.closeBtn} 
                                                    onClick={() => setSuccessStep('options')}
                                                    style={{background: '#999', flex: 1}}
                                                >
                                                    Quay lại
                                                </button>
                                            <button className={styles.closeBtn} onClick={closeModal}>Hoàn tất</button>
                                        </div>
                                    </div>
                                )}

                                {/* BƯỚC 2B: HIỆN FORM (NHÀ) */}
                                {successStep === 'home' && (
                                    <div style={{textAlign: 'left', animation: 'fadeIn 0.3s'}}>
                                        <p style={{textAlign: 'center', marginBottom: 15, color: '#666'}}>
                                            Thông tin nhận quà tại nhà:
                                        </p>
                                        <form onSubmit={handleSubmitDelivery}>
                                            <div style={{marginBottom: 10}}>
                                                <label className={styles.labelGift} style={{fontSize: 14}}>Họ tên:</label>
                                                <input 
                                                    className={styles.inputGift} 
                                                    style={{fontSize: 14, padding: 8}}
                                                    name="name" 
                                                    value={deliveryForm.name}
                                                    onChange={handleDeliveryChange}
                                                    required
                                                />
                                            </div>
                                            <div style={{marginBottom: 10}}>
                                                <label className={styles.labelGift} style={{fontSize: 14}}>Số điện thoại:</label>
                                                <input 
                                                    className={styles.inputGift}
                                                    style={{fontSize: 14, padding: 8}}
                                                    name="phone" 
                                                    value={deliveryForm.phone}
                                                    onChange={handleDeliveryChange}
                                                    required
                                                />
                                            </div>
                                            
                                            <div style={{display: 'flex', gap: 10, marginBottom: 10}}>
                                                <div style={{flex: 1}}>
                                                    <label className={styles.labelGift} style={{fontSize: 14}}>Tỉnh/TP:</label>
                                                    <input 
                                                        className={styles.inputGift}
                                                        style={{fontSize: 14, padding: 8}}
                                                        name="province" 
                                                        value={deliveryForm.province}
                                                        onChange={handleDeliveryChange}
                                                        placeholder="VD: HCM"
                                                        required
                                                    />
                                                </div>
                                                <div style={{flex: 1}}>
                                                    <label className={styles.labelGift} style={{fontSize: 14}}>Quận/Phường:</label>
                                                    <input 
                                                        className={styles.inputGift}
                                                        style={{fontSize: 14, padding: 8}}
                                                        name="ward" 
                                                        value={deliveryForm.ward}
                                                        onChange={handleDeliveryChange}
                                                        placeholder="VD: P.7"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div style={{marginBottom: 20}}>
                                                <label className={styles.labelGift} style={{fontSize: 14}}>Số nhà, Tên đường:</label>
                                                <input 
                                                    className={styles.inputGift}
                                                    style={{fontSize: 14, padding: 8}}
                                                    name="road" 
                                                    value={deliveryForm.road}
                                                    onChange={handleDeliveryChange}
                                                    placeholder="VD: 123 Nguyễn Văn Cừ"
                                                    required
                                                />
                                            </div>

                                            <div style={{display: 'flex', gap: 10}}>
                                                <button type="button" 
                                                    className={styles.closeBtn} 
                                                    onClick={() => setSuccessStep('options')}
                                                    style={{background: '#999', flex: 1}}
                                                >
                                                    Quay lại
                                                </button>
                                                <button type="submit" 
                                                    className={styles.submitBtnGift} 
                                                    style={{fontSize: 16, padding: 10, flex: 1}}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? "Đang gửi..." : "Gửi đi"}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </>
                        )}
                        
                        {status === 'fail' && (
                            <>
                                <img src="/loi icon.png" alt="Thất bại" className={styles.statusIcon} />
                                <h3 className={styles.failTitle}>KHÔNG THÀNH CÔNG!</h3>
                                <p className={styles.failDesc}>
                                    Mã không hợp lệ hoặc lỗi hệ thống.<br/>
                                    Vui lòng kiểm tra lại thông tin!
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