import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './GiftRedemption.module.css';

const GiftRedemption = () => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const [isWin, setIsWin] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/dang-nhap');
        }
    }, [navigate]);

    const handleRedeem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/dang-nhap');
            return;
        }
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
                    'Authorization': `Bearer ${token}`,
                },
                
            });
            const data = await response.json(); 
            if (data && data.detail === "Could not validate credentials" || data && data.detail === 404) {
                localStorage.removeItem('authToken');
                alert("Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!");
                navigate('/dang-nhap');
                return;
            }
            if (data === "mã không hợp lệ") {
                setError("Mã không hợp lệ hoặc đã được sử dụng.");
            } 
            else if (data.includes("may mắn lần sau")) {
                setPopupMessage("Chúc bạn may mắn lần sau!");
                setIsWin(false);
                setShowPopup(true);
                setCode('');
            } 
            else {
                setPopupMessage(data);
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