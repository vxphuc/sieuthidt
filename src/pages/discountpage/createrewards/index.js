import React, { useState, useEffect } from "react";
import styles from "./CreateRewards.module.css";

const CreateRewards = () => {
    const [events, setEvents] = useState([]);
    const [nameReward, setNameReward] = useState('');
    const [pointReward, setPointReward] = useState('');
    const [idevent, setIdevent] = useState('');
    const [quantity, setQuantity] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState({ type: '', title: '', content: '' });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://chatapi.io.vn/xem-su-kien-doi-qua?page=1');
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                    if (data.length > 0) setIdevent(data[0].id);
                }
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
            const req = await fetch(`https://chatapi.io.vn/them-phan-thuong-vao-su-kien`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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