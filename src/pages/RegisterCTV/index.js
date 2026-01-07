import React, { useState, useEffect, useCallback } from "react";
import styles from "./RegisterCTV.module.css";
import koc from "../../api/koc";

// Anh có thể cài thêm icon: npm install react-icons
// import { FaClock, FaCheckCircle, FaSync } from "react-icons/fa";

export default function RegisterCTV() {
    // view: 'loading' | 'form' | 'pending' | 'events'
    const [view, setView] = useState('loading'); 
    const [form, setForm] = useState({ hoten: "", email: "", diachi: "" });
    const [events, setEvents] = useState([]);
    
    // 1. Hàm kiểm tra trạng thái KOC (bằng cách gọi API sự kiện)
    const checkKOCStatus = useCallback(async () => {
        try {
            // Thử gọi API dành riêng cho KOC
            const res = await koc.get('/su-kien-danh-cho-koc?page=1');
            
            // Nếu gọi thành công -> User đã là KOC
            if (res.status === 200 && res.data) {
                setEvents(Array.isArray(res.data) ? res.data : []); // Lưu dữ liệu sự kiện
                setView('events'); // Chuyển sang màn hình sự kiện
                localStorage.removeItem('koc_pending'); // Xóa trạng thái chờ nếu có
            }
        } catch (err) {
            // Nếu lỗi (thường là 403 Forbidden hoặc 401) -> Chưa phải KOC
            console.log("Chưa phải KOC hoặc chưa đăng nhập");
            
            // Kiểm tra xem trước đó user đã đăng ký chưa (lưu tạm trong localStorage)
            const isPending = localStorage.getItem('koc_pending');
            if (isPending) {
                setView('pending');
            } else {
                setView('form');
            }
        }
    }, []);

    // Chạy kiểm tra khi vào trang
    useEffect(() => {
        checkKOCStatus();
    }, [checkKOCStatus]);

    // 2. Xử lý nhập liệu
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // 3. Xử lý Đăng ký
    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.hoten || !form.email || !form.diachi) {
            alert("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        try {
            const payload = { hoten: form.hoten, email: form.email, diachi: form.diachi };
            await koc.post('/dang-ky-koc', payload);
            
            // Đăng ký thành công
            alert('Đã gửi đăng ký thành công! Vui lòng chờ Admin duyệt.');
            localStorage.setItem('koc_pending', 'true'); // Lưu trạng thái chờ vào máy
            setView('pending'); // Chuyển sang màn hình chờ
            setForm({ hoten: "", email: "", diachi: "" });

        } catch (err) {
            console.error('Submit failed', err);
            const message = err?.response?.data?.detail || "Lỗi đăng ký. Vui lòng thử lại.";
            alert(message);
        }
    };

    // Helper format ngày
    const formatDate = (dateStr) => {
        if(!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('vi-VN');
    }

    // --- RENDER GIAO DIỆN ---

    // Màn hình 1: LOADING (khi mới vào)
    if (view === 'loading') {
        return <div className={styles.container}>Đang kiểm tra trạng thái...</div>;
    }

    // Màn hình 2: DANH SÁCH SỰ KIỆN (Khi đã là KOC)
    if (view === 'events') {
        return (
            <div className={styles.container}>
                <h2 className={styles.heading} style={{color: '#206a37'}}>🎉 Chào mừng KOC</h2>
                <div className={styles.headingContent}>Danh sách các chiến dịch dành riêng cho bạn</div>
                
                {events.length === 0 ? (
                    <p style={{textAlign: 'center', marginTop: 20}}>Hiện chưa có sự kiện nào.</p>
                ) : (
                    <div className={styles.eventList}>
                        {events.map((evt) => (
                            <div key={evt.id} className={styles.eventCard}>
                                <div className={styles.eventName}>{evt.tensukien}</div>
                                <div className={styles.eventDiscount}>Giảm: {evt.giatrigiamgia}%</div>
                                <div className={styles.eventTime}>
                                    📅 {formatDate(evt.thoigianbatdau)} - {formatDate(evt.thoigianketthuc)}
                                </div>
                                <span className={styles.eventStatus}>
                                    {evt.is_active ? "Đang diễn ra" : "Đã kết thúc"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Màn hình 3: CHỜ DUYỆT (Khi vừa đăng ký xong)
    if (view === 'pending') {
        return (
            <div className={styles.container}>
                <h2 className={styles.heading}>Trạng thái hồ sơ</h2>
                <div className={styles.formBox}>
                    <div className={styles.pendingBox}>
                        <div className={styles.pendingIcon}>⏳</div>
                        <h3>Hồ sơ đang chờ duyệt</h3>
                        <p>Chúng tôi đã nhận được yêu cầu của bạn.</p>
                        <p>Vui lòng đợi Admin xác nhận để truy cập vào các chiến dịch.</p>
                        
                        <button onClick={checkKOCStatus} className={styles.btnReload}>
                             Kiểm tra lại trạng thái
                        </button>
                        
                        <div style={{marginTop: '15px', fontSize: '12px', cursor: 'pointer', color: '#666'}} 
                             onClick={() => {
                                 localStorage.removeItem('koc_pending');
                                 setView('form');
                             }}>
                            (Test: Quay lại form đăng ký)
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Màn hình 4: FORM ĐĂNG KÝ (Mặc định nếu chưa là KOC)
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Đăng ký CTV</h2>
            <div className={styles.headingContent}>Đăng kí để trở thành CTV của chúng tôi</div>
            <div className={styles.formBox}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <label className={styles.label}>Họ và tên</label>
                        <input
                            className={styles.input}
                            name="hoten"
                            value={form.hoten}
                            onChange={handleChange}
                            placeholder="Nhập tên"
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>Email</label>
                        <input
                            className={styles.input}
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                            required
                        />
                    </div>

                    <div className={styles.formRow}>
                        <label className={styles.label}>Địa chỉ</label>
                        <input
                            className={styles.input}
                            name="diachi"
                            value={form.diachi}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ"
                            required
                        />
                    </div>

                    <div className={styles.actions}>
                        <button type="submit" className={styles.submitBtn}>
                            Đăng ký CTV
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}