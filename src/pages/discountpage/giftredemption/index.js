import React, { useState } from 'react';
import styles from './GiftRedemption.module.css';

const GiftRedemption = () => {
    // State quản lý form
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // State điều khiển Popup
    const [showPopup, setShowPopup] = useState(false);
    const [giftData, setGiftData] = useState(null);

    
  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code) {
      setError('Vui lòng nhập mã đổi quà.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
        const response = await fetch(`https://chatapi.io.vn/tham-du-giai-thuong?ma=${code}`,{
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            setGiftData(data);
            setShowPopup(true);
            setCode('');
        }
        else{
            setError('Mã đổi quà không hợp lệ hoặc đã được sử dụng.');
        }
    }catch(err){
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }finally{
        setIsLoading(false);
    }
  }
  const closePopup = () => {
    setShowPopup(false);
    setGiftData(null);
  };
  return(
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
        {showPopup && giftData && (
            <div className={styles.overlay}>
          <div className={styles.popup}>
            <div className={styles.popupHeader}>
              <div className={styles.iconSuccess}>✔</div>
            </div>
            <h3 className={styles.popupTitle}>Đổi Quà Thành Công!</h3>
            
            <div className={styles.popupBody}>
              <p>Chúc mừng bạn đã đổi thành công sự kiện:</p>
              <h4 className={styles.eventName}>{giftData.tensukien}</h4>
              
              <div className={styles.timeInfo}>
                <p><strong>Mã vé:</strong> {giftData.ma}</p>
                <p><strong>Thời gian:</strong> {new Date(giftData.thoihanbatdau).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>

            <button onClick={closePopup} className={styles.closeBtn}>
              OK!
            </button>
          </div>
        </div>
        )}
    </div>
  );
};
export default GiftRedemption;