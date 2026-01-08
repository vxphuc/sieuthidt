import React from "react";
import styles from "./RegisterCTV.module.css";

const formatDate = (dateStr) => {
    if(!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('vi-VN');
}

export default function KOCDashboard({ 
    status, events, onRetry, onReset, 
    currentPage, onNext, onPrev, hasMore, onCreateCode
}) {
    
    // MÀN HÌNH CHỜ DUYỆT
    if (status === 'pending') {
        return (
            <div className={styles.container}>
                <h2 className={styles.heading}>Trạng thái hồ sơ</h2>
                <div className={styles.formBox}>
                    <div className={styles.pendingBox}>
                        <div className={styles.pendingIcon}>⏳</div>
                        <h3>Hồ sơ đang chờ duyệt</h3>
                        <p>Yêu cầu của bạn đang được Admin xem xét.</p>
                        <button onClick={onRetry} className={styles.btnReload}>
                             Kiểm tra lại trạng thái
                        </button>
                        <div style={{marginTop: '20px', fontSize: '13px', color: '#666', cursor: 'pointer', textDecoration: 'underline'}} 
                             onClick={onReset}>
                            (Quay lại màn hình đăng ký)
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading} style={{color: '#206a37'}}>🎉 Chào mừng KOC</h2>
            <div className={styles.headingContent}>Danh sách các chiến dịch dành riêng cho bạn</div>
            
            {events.length === 0 ? (
                <div style={{textAlign: 'center', marginTop: 30}}>
                    <p style={{color: '#666', fontStyle: 'italic'}}>Không có sự kiện nào ở trang này.</p>
                    {currentPage > 1 && (
                        <button className={styles.btnReload} onClick={onPrev} style={{marginTop: 10}}>
                            Quay lại trang trước
                        </button>
                    )}
                </div>
            ) : (
                <>
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
                                {evt.is_active && (
                                    <button 
                                        className={styles.createCodeBtn}
                                        onClick={() => onCreateCode(evt.id)}
                                    >
                                        Tạo Mã Giảm Giá
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* --- KHU VỰC PHÂN TRANG --- */}
                    <div style={{
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '15px', 
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop: '1px solid #eee'
                    }}>
                        <button 
                            className={styles.submitBtn} 
                            style={{width: 'auto', backgroundColor: currentPage === 1 ? '#ccc' : '#206a37'}}
                            onClick={onPrev} 
                            disabled={currentPage === 1}
                        >
                            &laquo; Trước
                        </button>
                        
                        <span style={{fontWeight: 'bold', color: '#206a37'}}>
                            Trang {currentPage}
                        </span>
                        
                        <button 
                            className={styles.submitBtn} 
                            style={{width: 'auto', backgroundColor: !hasMore ? '#ccc' : '#206a37'}}
                            onClick={onNext} 
                            disabled={!hasMore}
                        >
                            Sau &raquo;
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}