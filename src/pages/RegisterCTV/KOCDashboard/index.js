import React from "react";
import styles from "./RegisterCTV.module.css";

// Helper format ngày
const formatDate = (dateStr) => {
    if(!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
}

export default function KOCDashboard({ status, events, onRetry, onLogout }) {
    
    // TRƯỜNG HỢP 1: ĐANG CHỜ DUYỆT (PENDING)
    if (status === 'pending') {
        return (
            <div className={styles.container}>
                <h2 className={styles.heading}>Trạng thái hồ sơ</h2>
                <div className={styles.formBox}>
                    <div className={styles.pendingBox}>
                        <div className={styles.pendingIcon}>⏳</div>
                        <h3>Hồ sơ đang chờ duyệt</h3>
                        <p>Chúng tôi đã nhận được yêu cầu của bạn.</p>
                        <p>Vui lòng đợi Admin xác nhận để truy cập vào các chiến dịch.</p>
                        
                        <button onClick={onRetry} className={styles.btnReload}>
                             Kiểm tra lại trạng thái
                        </button>
                        
                        {/* Nút reset dành cho việc test */}
                        <div style={{marginTop: '20px', fontSize: '12px', color: '#666', cursor: 'pointer'}} onClick={onLogout}>
                            (Quay lại trang đăng ký)
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // TRƯỜNG HỢP 2: ĐÃ DUYỆT -> HIỆN SỰ KIỆN (APPROVED)
    return (
        <div className={styles.container}>
            <h2 className={styles.heading} style={{color: '#206a37'}}>🎉 Chào mừng KOC</h2>
            <div className={styles.headingContent}>Danh sách các chiến dịch dành riêng cho bạn</div>
            
            {events.length === 0 ? (
                <p style={{textAlign: 'center', marginTop: 30, color: '#666'}}>
                    Hiện chưa có chiến dịch nào đang diễn ra.
                </p>
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