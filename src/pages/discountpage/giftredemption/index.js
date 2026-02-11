import React, { useState } from 'react';
import styles from './GiftRedemption.module.css';

const GiftRedemption = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // State cho Popup
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    // Thêm state để phân biệt loại popup (nếu muốn đổi icon/màu sắc)
    const [isWin, setIsWin] = useState(true); 

    const handleRedeem = async (e) => {
        e.preventDefault();
        if (!code) {
            setError('Vui lòng nhập mã đổi quà.');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setPopupMessage('');

        try {
            const response = await fetch(`https://chatapi.io.vn/tham-du-giai-thuong?ma=${code}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json(); 

            // LOGIC MỚI:
            
            // 1. Trường hợp lỗi: Mã không hợp lệ
            if (data === "mã không hợp lệ") {
                setError("Mã không hợp lệ hoặc đã được sử dụng.");
            } 
            // 2. Trường hợp: Chúc may mắn lần sau (Vẫn hiện Popup nhưng nội dung khác)
            else if (data.includes("may mắn lần sau")) {
                setPopupMessage("Chúc bạn may mắn lần sau!");
                setIsWin(false); // Đánh dấu là không trúng quà thật (để đổi icon nếu cần)
                setShowPopup(true);
                setCode('');
            } 
            // 3. Trường hợp: Trúng thưởng thật
            else {
                setPopupMessage(data); // Ví dụ: "chúc mừng bạn đã trúng yến sữa"
                setIsWin(true);
                setShowPopup(true);
                setCode('');
            }
        } catch (err) {
            console.error(err);
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Đổi Quà Tặng</h2>
                <p className={styles.subtitle}>Nhập mã sự kiện để nhận thưởng ngay!</p>
                
                <form onSubmit={handleRedeem} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <input
                            type='text'
                            placeholder='Nhập mã đổi quà'
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={styles.input}
                            onFocus={(e) => e.target.placeholder = ''}
                            onBlur={(e) => e.target.placeholder = 'Nhập mã đổi quà'}
                        />
                    </div>
                    
                    {error && <p className={styles.error}>{error}</p>}
                    
                    <button type='submit' className={styles.button} disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'Đổi Quà'}
                    </button>
                </form>
            </div>

            {showPopup && (
                <div className={styles.overlay}>
                    <div className={styles.popup}>
                        <div className={styles.popupHeader}>
                            <div className={isWin ? styles.iconSuccess : styles.iconLuck}>
                                {isWin ? '✔' : '✔'}
                            </div>
                        </div>
                        
                        <h3 className={styles.popupTitle}>
                            {isWin ? 'Sử dụng mã thành công!' : 'Sử dụng mã thành công!'}
                        </h3>
                        
                        <div className={styles.popupBody}>
                            <p className={styles.messageText}>{popupMessage}</p> 
                        </div>

                        <button onClick={closePopup} className={styles.closeBtn}>
                            Xác nhận
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GiftRedemption;