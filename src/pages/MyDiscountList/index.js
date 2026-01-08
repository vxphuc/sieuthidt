import React, { useState, useEffect } from "react";
import styles from "./MyDiscountList.module.css";
import koc from "../../api/koc";
import { BiSolidDiscount } from "react-icons/bi";

const formatDate = (dateStr) => {
    if(!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
}

export default function MyDiscountList() {
    const [myCodes, setMyCodes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const res = await koc.get('/hien-thi-ma-giam-gia-chua-xoa-cua-ca-nhan');
                if (res.status === 200 && Array.isArray(res.data)) {
                    setMyCodes(res.data);
                }
            } catch (err) {
                console.error("Lỗi lấy mã:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCodes();
    }, []);

    return (
        <div className={styles.container}>
            <h2 className={styles.heading} style={{color: '#206a37'}}><BiSolidDiscount /> Kho mã giảm giá của bạn</h2>
            <div className={styles.headingContent}>Danh sách các mã giảm giá bạn đang sở hữu</div>

            {loading ? (
                <div style={{textAlign: 'center', padding: 20}}>Đang tải danh sách...</div>
            ) : myCodes.length > 0 ? (
                <div className={styles.myCodeList}>
                    {myCodes.map((code, index) => (
                        <div key={index} className={styles.codeCard}>
                            <div className={styles.codeName}>{code.tenmagiamgia}</div>

                            <div className={styles.codeEventName}>
                                Sự kiện: {code.tensukien}
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 5}}>
                                <div className={styles.codeValue}>Giảm {code.giatrimagiam}%</div>
                                <div style={{fontSize: '13px', fontWeight: 'bold', color: code.is_active === false ? 'red' : 'green'}}>
                                    {code.is_active === false ? '● Đã khóa' : '● Hoạt động'}
                                </div>
                            </div>

                            <div className={styles.codeTime}>
                                📅 {formatDate(code.thoigianbatdau)} - {formatDate(code.thoigianketthuc)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{textAlign: 'center', marginTop: 30, color: '#666'}}>
                    <p>Bạn chưa có mã giảm giá nào.</p>
                </div>
            )}
        </div>
    );
}