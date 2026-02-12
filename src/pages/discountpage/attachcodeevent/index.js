import React, { useState, useEffect } from "react";
import styles from './attachCode.module.css';

const AttachCodeEvent = () => {
    const [events, setEvents] = useState([]);
    const [eventId, setEventId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://chatapi.io.vn/xem-su-kien-doi-qua?page=1');
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                    if (data.length > 0) {
                        setEventId(data[0].id);
                    }
                }
            } catch (error) {
                console.error("Lỗi tải sự kiện:", error);
            }
        };
        fetchEvents();
    }, []);

    const handleAttachCode = async (e) => {
        e.preventDefault();

        if (!eventId) {
            alert("Vui lòng chọn một sự kiện!");
            return;
        }
        if (quantity <= 0) {
            alert("Vui lòng nhập số lượng mã lớn hơn 0");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`https://chatapi.io.vn/gan-ma-tuong-ung-vao-sukien?soluong=${quantity}&id_sukien=${eventId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert(`Đã gửi yêu cầu gán ${quantity} mã vào sự kiện thành công!`);
                setQuantity('');
            } else {
                alert("Có lỗi xảy ra khi gán mã vào sự kiện.");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Lỗi kết nối đến máy chủ.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.title}>Gán mã vào sự kiện</h2>
                
                <form onSubmit={handleAttachCode}>
                    <div className={styles.formGroup}>
                        <label htmlFor="eventId">Chọn sự kiện:</label>
                        <select
                            id="eventId"
                            className={styles.selectInput}
                            value={eventId}
                            onChange={(e) => setEventId(e.target.value)}
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
                        <label htmlFor="quantity">Số lượng mã muốn gán:</label>
                        <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Nhập số lượng mã (VD: 100)"
                            className={styles.inputNumber}
                            min="1"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Gán mã vào sự kiện'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AttachCodeEvent;