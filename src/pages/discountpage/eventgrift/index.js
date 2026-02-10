import React, { useState } from 'react';
import styles from './eventGrift.module.css';

const eventgrift = () => {
  const [quantity, setQuantity] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateCodes = async (e) => {
    e.preventDefault();
    
    if (quantity <= 0) {
      alert("Vui lòng nhập số lượng lớn hơn 0");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://chatapi.io.vn/tao-ma-hang-loat?soluong=${quantity}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert(`Đã gửi yêu cầu tạo ${quantity} mã thành công!`);
      } else {
        alert("Có lỗi xảy ra khi tạo mã.");
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
        <h2 className={styles.title}>Tạo Mã Giảm Giá Hàng Loạt</h2>
        
        <form onSubmit={handleCreateCodes}>
          <div className={styles.formGroup}>
            <label htmlFor="quantity">Số lượng mã muốn tạo:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Nhập số lượng"
              className={styles.inputNumber}
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = 'Nhập số lượng'}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Xác Nhận Tạo Mã'}
          </button>
        </form>

        <p className={styles.note}>
          * Lưu ý: Hệ thống sẽ tự động sinh ngẫu nhiên các mã dựa trên số lượng bạn nhập.
        </p>
      </div>
    </div>
  );
};

export default eventgrift;