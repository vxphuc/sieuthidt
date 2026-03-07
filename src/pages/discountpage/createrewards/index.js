import React, { useState, useEffect } from "react";
import styles from "./CreateRewards.module.css";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
const CreateRewards = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [nameReward, setNameReward] = useState('');
    const [pointReward, setPointReward] = useState('');
    const [idevent, setIdevent] = useState('');
    const [quantity, setQuantity] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ type: '', title: '', content: '' });
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Bạn cần đăng nhập để tiếp tục.");
            navigate("/dang-nhap-dai-ly", {
                state: { from: "/tao-phan-thuong-cho-su-kien" }
            });
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const exp = payload.exp * 1000;
            if (Date.now() > exp) {
                sessionStorage.removeItem("token");
                alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                navigate("/dang-nhap-dai-ly", {
                    state: { from: "/tao-phan-thuong-cho-su-kien" }
                });
            }
        } catch (error) {
            sessionStorage.removeItem("token");
            alert("Token không hợp lệ. Vui lòng đăng nhập lại.");
            navigate("/dang-nhap-dai-ly", {
                state: { from: "/tao-phan-thuong-cho-su-kien" }
            });
        }
    }, [navigate]);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const [res1, res2] = await Promise.all([
                    fetch('https://staging.chatapi.io.vn/xem-su-kien-doi-qua?page=1'),
                    fetch('https://staging.chatapi.io.vn/xem-su-kien-doi-qua?page=2')
                ])
                if (!res1.ok || !res2.ok) return;
                
                const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
                const merged = [...data1, ...data2];
                const unique = merged.filter(
                    (item, index, arr) => index === arr.findIndex((x) => x.id === item.id)
                );
                setEvents(unique);
                if (unique.length > 0) setIdevent(unique[0].id);

            } catch (error) {
                console.error("Lỗi tải sự kiện:", error);
            }
        };
        fetchEvents();
    }, []);

    // Hàm hiển thị Popup
    const triggerPopup = (type, title, content) => {
        setPopupMessage({ type, title, content });
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        // Nếu là popup thành công thì reset form sau khi đóng
        if (popupMessage.type === 'success') {
            setNameReward('');
            setPointReward('');
            setQuantity('');
        }
    };

    const handleCreateRewards = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        if (!token) {
            alert("Bạn cần đăng nhập để tiếp tục.");
            navigate("/dang-nhap-dai-ly", { state: { from: "/tao-phan-thuong-cho-su-kien" } });
            return;
        }
        if (!idevent) {
            triggerPopup('error', 'Lỗi', 'Vui lòng chọn một sự kiện!');
            return;
        }
        if (!nameReward.trim()) {
            triggerPopup('error', 'Lỗi', 'Vui lòng nhập tên phần thưởng!');
            return;
        }
        
        setIsLoading(true);

        const payload = {
            tenphanthuong: nameReward,
            phantramtrungthuong: Number(pointReward) || 0,
            id_sukiendoiqua: idevent,
            soluong: Number(quantity) || 0 
        };

        try {
            const req = await fetch(`https://staging.chatapi.io.vn/them-phan-thuong-vao-su-kien`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload),
            });

            if (req.ok) {
                triggerPopup('success', 'Thành Công!', 'Đã tạo phần thưởng mới cho sự kiện.');
            } else {
                triggerPopup('error', 'Thất Bại', 'Có lỗi xảy ra khi tạo phần thưởng.');
            }
        } catch (error) {
            triggerPopup('error', 'Lỗi Kết Nối', 'Không thể kết nối đến máy chủ.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.title}>Tạo Phần Thưởng Cho Sự Kiện</h2>
                
                <form onSubmit={handleCreateRewards}>
                    <div className={styles.formGroup}>
                        <label htmlFor="eventSelect">Chọn sự kiện áp dụng:</label>
                        <select
                            id="eventSelect"
                            className={styles.selectInput}
                            value={idevent}
                            onChange={(e) => setIdevent(e.target.value)}
                        >
                            {events.length === 0 && <option value="">Đang tải sự kiện...</option>}
                            {events.map((ev) => (
                                <option key={ev.id} value={ev.id}>
                                    {ev.tensukien}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="rewardName">Tên phần thưởng:</label>
                        <input
                            id="rewardName"
                            type="text"
                            className={styles.input}
                            placeholder="Ví dụ: tặng yến đường DTNest"
                            value={nameReward}
                            onChange={(e) => setNameReward(e.target.value)}
                            onFocus={(e) => e.target.placeholder = ''}
                            onBlur={(e) => e.target.placeholder = 'Ví dụ: tặng yến đường DTNest'}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="rewardQuantity">Số lượng phần thưởng:</label>
                        <input
                            id="rewardQuantity"
                            type="number"
                            className={styles.input}
                            placeholder="Nhập số lượng phần thưởng"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            onFocus={(e) => e.target.placeholder = ''}
                            onBlur={(e) => e.target.placeholder = 'Nhập số lượng phần thưởng'}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="rewardPoint">Tỷ lệ trúng thưởng (%):</label>
                        <input
                            id="rewardPoint"
                            type="number"
                            className={styles.input}
                            placeholder="Nhập số (0-100)"
                            min="0"
                            max="100"
                            value={pointReward}
                            onChange={(e) => setPointReward(e.target.value)}
                            onFocus={(e) => e.target.placeholder = ''}
                            onBlur={(e) => e.target.placeholder = 'Nhập số (0-100)'}
                        />
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Tạo Phần Thưởng'}
                    </button>
                </form>
            </div>

            {/* --- POPUP (MODAL) --- */}
            {showPopup && (
                <div className={styles.overlay}>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                            {/* Icon dựa trên loại thông báo: Success (Xanh) hoặc Error (Đỏ) */}
                            <div className={popupMessage.type === 'success' ? styles.iconSuccess : styles.iconError}>
                                {popupMessage.type === 'success' ? '✔' : '!'}
                            </div>
                        </div>
                        
                        <h3 className={styles.popupTitle} style={{ 
                            color: popupMessage.type === 'success' ? '#218838' : '#dc3545' 
                        }}>
                            {popupMessage.title}
                        </h3>
                        
                        <div className={styles.popupBody}>
                            <p>{popupMessage.content}</p> 
                        </div>

                        <button onClick={closePopup} className={styles.closeBtn} style={{
                            backgroundColor: popupMessage.type === 'success' ? '#218838' : '#dc3545'
                        }}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateRewards;