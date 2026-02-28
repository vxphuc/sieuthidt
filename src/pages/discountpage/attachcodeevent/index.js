import React, { useState, useEffect } from "react";
import styles from './attachCode.module.css';

const AttachCodeEvent = () => {
    const [events, setEvents] = useState([]);
    const [eventId, setEventId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [batchId, setBatchId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [batches, setBatches] = useState([]);
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const res = await fetch('https://chatapi.io.vn/ds-lo-phieu?page=1');
                if (!res.ok) return;

                const data = await res.json();
                setBatches(data);
                if (data.length > 0) setBatchId(data[0].id);
            } catch (error) {
                console.error("Lỗi tải lô:", error);
            }
        };

        fetchBatches();
    }, []);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
            const [res1, res2] = await Promise.all([
                fetch('https://chatapi.io.vn/xem-su-kien-doi-qua?page=1'),
                fetch('https://chatapi.io.vn/xem-su-kien-doi-qua?page=2'),
            ]);

            if (!res1.ok || !res2.ok) return;

            const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
            const merged = [...data1, ...data2];

            // nếu sợ trùng id thì lọc trùng:
            const unique = merged.filter(
                (item, index, arr) => index === arr.findIndex((x) => x.id === item.id)
            );

            setEvents(unique);
            if (unique.length > 0) setEventId(unique[0].id);
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
            const response = await fetch(`https://chatapi.io.vn/gan-ma-tuong-ung-vao-sukien?soluong=${quantity}&id_sukien=${eventId}&id_lophieu=${batchId}`, {
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
                        <label htmlFor="batchId">Mã định danh lô:</label>
                        <div className={styles.formGroup}>
                            <label htmlFor="batchId">Chọn lô:</label>
                            <select
                                id="batchId"
                                className={styles.selectInput}
                                value={batchId}
                                onChange={(e) => setBatchId(e.target.value)}
                            >
                                {batches.length === 0 && <option value="">Đang tải lô...</option>}
                                {batches.map((batch) => (
                                    <option key={batch.id} value={batch.id}>
                                        {batch.madinhdanh}
                                    </option>
                                ))}
                            </select>
                        </div>
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
                            onFocus={(e) => e.target.placeholder = ''}
                            onBlur={(e) => e.target.placeholder = 'Nhập số lượng mã (VD: 100)'}
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