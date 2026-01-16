import { useState, useEffect } from "react";
import styles from "./ExchangeGifts.module.css";
import api from "../../api/Code"; 
import axios from "../../api/axios";

function ExchangeGifts() {
    const [formData, setFormData] = useState({
        phoneNumber: "",
        code1: "",
        code2: "",
        code3: "",
        code4: "",
        image: null
    });
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollBtn(true);
            } else {
                setShowScrollBtn(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Hiệu ứng lướt mượt mà
        });
    };

    const [status, setStatus] = useState(""); 
    const [giftCode, setGiftCode] = useState(""); 
    const [successStep, setSuccessStep] = useState("options");
    const [errorDetail, setErrorDetail] = useState(""); 

    const [verifiedPayload, setVerifiedPayload] = useState(null);

    // State form nhận tại nhà
    const [deliveryForm, setDeliveryForm] = useState({
        name: "",
        phone: "",
        province: "",
        ward: "",
        road: ""
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- HÀM KIỂM TRA SỐ ĐIỆN THOẠI ---
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
                setFormData(prev => ({
                    ...prev,
                    image: e.target.files[0]
                }));
            }
        };
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const phone = formData.phoneNumber.trim();
        if (!phone || !validatePhoneNumber(phone)) {
            alert("Vui lòng nhập số điện thoại hợp lệ!");
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
        setIsSubmitting(true);

        const payload = {
            magiamgia: listCodes,
            sdt: phone
        };
        
        try {
            const res = await api.post('https://chatapi.io.vn/kiem-tra-4-ma-nhan-thuong', payload);

            if (res.status === 200 || res.status === 201) {
                setVerifiedPayload(payload);
                setStatus("success");
                setSuccessStep("options");

                setDeliveryForm(prev => ({...prev, phone: phone}));
            }
        } catch (error) {
            console.error("Lỗi kiểm tra:", error);
            setStatus("fail");

            if (error.response && error.response.data && error.response.data.detail) {
                const detailStr = error.response.data.detail;
                if (typeof detailStr === 'string' && detailStr.includes("mã không tồn tại")) {
                    const matches = detailStr.match(/'([^']+)'/g);
                    if (matches && matches.length > 0) {
                        const invalidCodes = matches.map(code => code.replace(/'/g, "")).join(", ");
                        setErrorDetail(invalidCodes);
                    }
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleClaimReward = async (targetStep) => {
        if (!verifiedPayload) return;

        setIsSubmitting(true);
        try {
            // [API 2] Post lại payload đã lưu để lấy mã quà tặng
            const res = await api.post('https://chatapi.io.vn/tra-ve-ma-nhan-thuong', verifiedPayload);

            if (res.status === 200 || res.status === 201) {
                setGiftCode(res.data); // Lưu mã quà tặng trả về
                setSuccessStep(targetStep); // Chuyển sang Shop hoặc Home
            }
        } catch (error) {
            console.error("Lỗi đổi quà:", error);
            alert("Có lỗi xảy ra khi lấy mã quà tặng. Vui lòng thử lại!");
            // Có thể setStatus('fail') nếu muốn hiện lỗi to
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setStatus(null);
        setGiftCode("");
        setErrorDetail("");
        setSuccessStep("options");
        setVerifiedPayload(null); // Reset payload
        setIsSubmitting(false);
    };

    // --- XỬ LÝ GIAO HÀNG ---
    const handleDeliveryChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {
            const re = /^[0-9\b]+$/;
            if (value !== '' && !re.test(value)) return;
        }
        setDeliveryForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitDelivery = async (e) => {
        e.preventDefault();
        // ... (Validate form giữ nguyên) ...
        if(!deliveryForm.name || !deliveryForm.phone || !deliveryForm.province || !deliveryForm.ward || !deliveryForm.road) {
            alert("Vui lòng điền đầy đủ thông tin nhận hàng!");
            return;
        }
        if (!validatePhoneNumber(deliveryForm.phone)) {
            alert("Số điện thoại nhận hàng không hợp lệ!");
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
                    {/* ... (Phần Form nhập liệu giữ nguyên không đổi) ... */}
                    <div className={styles.formGroupGift}>
                        <label className={styles.labelGift}>Nhập số điện thoại</label>
                        <input type="text" className={styles.inputGift} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Nhập SĐT của bạn" maxLength="10" />
                    </div>
                    <div className={styles.gridRowGift}>
                        <div className={styles.gridColGift}><label className={styles.labelGift}>Mã vỏ 1</label><input className={styles.inputGift} name="code1" value={formData.code1} onChange={handleChange} /></div>
                        <div className={styles.gridColGift}><label className={styles.labelGift}>Mã vỏ 2</label><input className={styles.inputGift} name="code2" value={formData.code2} onChange={handleChange} /></div>
                    </div>
                    <div className={styles.gridRowGift}>
                        <div className={styles.gridColGift}><label className={styles.labelGift}>Mã vỏ 3</label><input className={styles.inputGift} name="code3" value={formData.code3} onChange={handleChange} /></div>
                        <div className={styles.gridColGift}><label className={styles.labelGift}>Mã vỏ 4</label><input className={styles.inputGift} name="code4" value={formData.code4} onChange={handleChange} /></div>
                    </div>
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
                    <button type="submit" className={styles.submitBtnGift} disabled={isSubmitting}>
                        {isSubmitting ? "Đang kiểm tra..." : "Xác nhận"}
                    </button>
                </form>
            </div>
            <div className={styles.RulesGifts}>
                <h3>THỂ LỆ CHƯƠNG TRÌNH</h3>
                <h3>THU VỎ CŨ ĐỔI QUÀ MỚI</h3>
                <h5>1. Đối tượng tham gia</h5>
                <p>Tất cả khách hàng mua sản phẩm của hệ thống có nhãn khuyến mãi và sở hữu mã số hợp lệ dưới nắp hũ.</p>
                <h5>2. Thời gian diễn ra</h5>
                <p><strong>- Thời gian tích mã:</strong> Từ ngày [Ngày bắt đầu] đến hết ngày [Ngày kết thúc].</p>
                <p><strong>- Thời gian đổi thưởng:</strong> Đến hết ngày [Ngày kết thúc đổi thưởng].</p>
                <h5>3. Cơ cấu giải thưởng</h5>
                <p>- Khách hàng tích lũy đủ <strong>04 mã số</strong> hợp lệ sẽ nhận được <strong>01 hũ sản phẩm</strong> cùng loại hoàn toàn miễn phí.</p>
                <h5>4. Cách thức tham gia</h5>
                <p><strong>- Bước 1:</strong> Khách hàng thu thập 04 mã số dưới nắp hũ sau khi sử dụng sản phẩm.</p>
                <p className={styles.contentlink}><strong>- Bước 2:</strong> Truy cập vào website: <a href="https://sieuthidt.com/doi-qua"> https://sieuthidt.com/doi-qua</a></p>
                <p><strong>- Bước 3:</strong> Nhập đầy đủ 04 mã số và tải lên 01 hình ảnh chụp rõ nét 4 nắp hũ (có hiển thị mã) để hệ thống xác thực.</p>
                <p><strong>- Bước 4:</strong> Lựa chọn hình thức nhận thưởng.</p>
                <h5>5. Hình thức nhận thưởng</h5>
                <strong>Lựa chọn 1: Nhận trực tiếp tại cửa hàng</strong>
                <p>- Sau khi xác nhận thành công, hệ thống gửi mã Voucher đổi thưởng về Zalo của khách hàng.</p>
                <p>- Khách hàng mang tin nhắn Zalo chứa mã đến cửa hàng/đại lý gần nhất.</p>
                <p>- Nhân viên cửa hàng kiểm tra mã trên hệ thống và trao quà trực tiếp cho khách hàng.</p>
                <strong>Lựa chọn 2: Nhận quà tại nhà</strong>
                <p>- Hệ thống tự động chuyển hướng khách hàng về trang đặt hàng với sản phẩm thưởng trị giá 0đ.</p>
                <p>- Khách hàng cung cấp thông tin giao hàng (Họ tên, địa chỉ, số điện thoại).</p>
                <p>- Quà tặng sẽ được gửi đến khách hàng theo hình thức chuyển phát từ 5-7 ngày.</p>
                <h5>6. Các quy định chung</h5>
                <p>- Mỗi mã số dưới nắp hũ chỉ được sử dụng <strong>01 lần duy nhất.</strong></p>
                <p>- Hình ảnh nắp hũ gửi kèm phải là ảnh thật, không qua chỉnh sửa và hiển thị rõ mã số để đối chiếu khi cần thiết.</p>
                <p>- Mã Voucher nhận qua Zalo có giá trị sử dụng trong vòng 15 ngày kể từ ngày nhận.</p>
                <p>- Ban tổ chức có quyền từ chối trao quà nếu phát hiện hành vi gian lận hoặc mã số không tồn tại trên hệ thống.</p>
                <p>- Mọi quyết định cuối cùng thuộc về Ban tổ chức chương trình.</p>
                <h5>7. Thông tin hỗ trợ</h5>
                <p>- Mọi thắc mắc về chương trình, quý khách vui lòng liên hệ:</p>
                <p>- Hotline: 0847216868</p>
            </div>
            {showScrollBtn && (
                <button 
                    onClick={scrollToTop} 
                    className={styles.scrollTopBtn}
                    title="Lên đầu trang"
                >
                    ▲
                </button>
            )}
            {status && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        
                        {/* TRƯỜNG HỢP THÀNH CÔNG */}
                        {status === 'success' && (
                            <>
                                <img src="/thanh cong icon.png" alt="Thành công" className={styles.statusIcon} />
                                <h3 className={styles.successTitle}>MÃ HỢP LỆ!</h3>
                                <div style={{margin: '5px 0 20px 0'}}>
                                    <p style={{fontSize: '18px', color: '#333', marginBottom: '5px'}}>
                                        Quà tặng: <strong style={{color: '#206a37'}}>Yến Sữa</strong>
                                    </p>
                                    <img src="/yensua.png" alt="Yến Sữa" style={{width: '60px', height: '60px', objectFit: 'contain', marginBottom: '5px'}} />
                                    <p style={{fontSize: '16px', color: '#666', margin: 0}}>
                                        Giá trị: <strong style={{color: '#d32f2f'}}>60.000đ</strong>
                                    </p>
                                </div>
                                {successStep === 'options' && (
                                    <>
                                        <p className={styles.successDesc}>
                                            Vui lòng chọn hình thức nhận thưởng:
                                        </p>
                                        <div className={styles.modalBtnGroup}>

                                            <button 
                                                className={styles.btnOption} 
                                                onClick={() => handleClaimReward('shop')}
                                                disabled={isSubmitting}
                                            >
                                                <span className={styles.btnTitle}>Nhận tại Shop</span>
                                                <span className={styles.btnSub}>
                                                    {isSubmitting ? "(Đang xử lý...)" : "(Hiện mã Code)"}
                                                </span>
                                            </button>
                                            
                                            <button 
                                                className={styles.btnOption} 
                                                onClick={() => handleClaimReward('home')}
                                                disabled={isSubmitting}
                                            >
                                                <span className={styles.btnTitle}>Nhận tại nhà</span>
                                                <span className={styles.btnSub}>
                                                    {isSubmitting ? "(Đang xử lý...)" : "(Điền địa chỉ)"}
                                                </span>
                                            </button>
                                        </div>
                                    </>
                                )}
                                {successStep === 'shop' && (
                                    <div style={{animation: 'fadeIn 0.3s'}}>
                                        <p className={styles.successDesc}>Vui lòng đưa mã này cho nhân viên:</p>
                                        <div style={{margin: '15px 0', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px', border: '2px dashed #206a37'}}>
                                            <p style={{margin: 0, color: '#d32f2f', fontSize: '28px', fontWeight: '900', letterSpacing: '2px'}}>
                                                {giftCode || "..."}
                                            </p>
                                        </div>
                                        <button className={styles.closeBtn} onClick={closeModal}>Hoàn tất</button>
                                    </div>
                                )}
                                {successStep === 'home' && (
                                    <div style={{textAlign: 'left', animation: 'fadeIn 0.3s'}}>
                                        <p style={{textAlign: 'center', marginBottom: 15, color: '#666'}}>
                                            Thông tin nhận quà tại nhà:
                                        </p>
                                        <form onSubmit={handleSubmitDelivery}>
                                            <div style={{marginBottom: 10}}>
                                                <label className={styles.labelGift} style={{fontSize: 14}}>Họ tên:</label>
                                                <input className={styles.inputGift} style={{fontSize: 14, padding: 8}} name="name" value={deliveryForm.name} onChange={handleDeliveryChange} placeholder="Họ và tên" required />
                                            </div>
                                            <div style={{marginBottom: 10}}>
                                                <label className={styles.labelGift} style={{fontSize: 14}}>Số điện thoại:</label>
                                                <input className={styles.inputGift} style={{fontSize: 14, padding: 8}} name="phone" value={deliveryForm.phone} onChange={handleDeliveryChange} required maxLength="10"/>
                                            </div>
                                            <div style={{display: 'flex', gap: 10, marginBottom: 10}}>
                                                <div style={{flex: 1}}><label className={styles.labelGift} style={{fontSize: 14}}>Tỉnh/TP:</label><input className={styles.inputGift} style={{fontSize: 14, padding: 8}} name="province" value={deliveryForm.province} onChange={handleDeliveryChange} placeholder="VD: HCM" required /></div>
                                                <div style={{flex: 1}}><label className={styles.labelGift} style={{fontSize: 14}}>Quận/Phường:</label><input className={styles.inputGift} style={{fontSize: 14, padding: 8}} name="ward" value={deliveryForm.ward} onChange={handleDeliveryChange} placeholder="VD: P.7" required /></div>
                                            </div>
                                            <div style={{marginBottom: 20}}>
                                                <label className={styles.labelGift} style={{fontSize: 14}}>Số nhà, Tên đường:</label>
                                                <input className={styles.inputGift} style={{fontSize: 14, padding: 8}} name="road" value={deliveryForm.road} onChange={handleDeliveryChange} placeholder="VD: 123 Nguyễn Văn Cừ" required />
                                            </div>
                                            <div style={{display: 'flex', gap: 10}}>
                                                <button type="button" className={styles.closeBtn} onClick={() => setSuccessStep('options')} style={{background: '#999', flex: 1}}>Quay lại</button>
                                                <button type="submit" className={styles.submitBtnGift} style={{fontSize: 16, padding: 10, flex: 1}} disabled={isSubmitting}>{isSubmitting ? "Đang gửi..." : "Gửi đi"}</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </>
                        )}
                        
                        {/* TRƯỜNG HỢP THẤT BẠI (HIỆN LỖI CHI TIẾT) */}
                        {status === 'fail' && (
                            <>
                                <img src="/loi icon.png" alt="Thất bại" className={styles.statusIcon} />
                                <h3 className={styles.failTitle}>KHÔNG THÀNH CÔNG!</h3>
                                <p className={styles.failDesc}>
                                    {errorDetail ? (
                                        <>Các mã sau không hợp lệ hoặc đã sử dụng:<br/><strong style={{color: '#d32f2f', display:'block', marginTop: 10}}>{errorDetail}</strong></>
                                    ) : (
                                        <>Mã không hợp lệ hoặc lỗi hệ thống.<br/>Vui lòng kiểm tra lại!</>
                                    )}
                                </p>
                                <button className={styles.closeBtn} onClick={closeModal}>Đóng</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExchangeGifts;