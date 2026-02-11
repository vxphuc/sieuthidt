import React, { useState, useEffect } from "react";
import styles from "./CreateRewards.module.css";

const CreateRewards = () => {
    const [events, setEvents] = useState([]);
    const [nameReward, setNameReward] = useState('');
    const [pointReward, setPointReward] = useState();
    const [idevent, setIdevent] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });

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

    const handleCreateRewards = async (e) => {
        e.preventDefault();
        if (!idevent) {
            setMessage({ type: 'error', content: 'Vui lòng chọn một sự kiện!' });
            return;
        }
        if (!nameReward.trim()) {
            setMessage({ type: 'error', content: 'Vui lòng nhập tên phần thưởng!' });
            return;
        }
        setIsLoading(true);
        setMessage({ type: '', content: '' });
        const payload = {
            tenphanthuong: nameReward,
            phantramtrungthuong: Number(pointReward),
            id_sukiendoiqua: idevent,
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
                setMessage({ type: 'success', content: 'Tạo phần thưởng thành công!' });
                setNameReward('');
                setPointReward(0);
            } else {
                setMessage({ type: 'error', content: 'Có lỗi xảy ra khi tạo phần thưởng.' });
            }
        } catch (error) {
            setMessage({ type: 'error', content: 'Lỗi kết nối máy chủ.' });
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

                    {/* Hiển thị thông báo lỗi/thành công */}
                    {message.content && (
                        <div className={message.type === 'error' ? styles.errorMsg : styles.successMsg}>
                            {message.content}
                        </div>
                    )}

                    {/* Nút Submit */}
                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Tạo Phần Thưởng'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateRewards;