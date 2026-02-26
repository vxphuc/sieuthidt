import React, { useEffect, useState } from 'react';
import styles from './eventGrift.module.css';
import { useNavigate } from 'react-router-dom';

const eventgrift = () => {
  const [quantity, setQuantity] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [maDinhDanh, setMaDinhDanh] = useState('');
  const [showBatchForm, setShowBatchForm] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/dang-nhap');
    }
  }, [navigate]);

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/dang-nhap');
      return;
    }
    if(!maDinhDanh.trim()){
      alert("Vui lòng nhập mã định danh lô!");
      return;
    }
    setIsLoading(true);
    try{
      const response = await fetch(`https://chatapi.io.vn/tao-lo-phieu?madinhdanh=${maDinhDanh}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data?.detail === "Could not validate credentials" || data?.detail === 404) {
        localStorage.removeItem('authToken');
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        navigate('/dang-nhap');
        return;
      }
      if (response.ok) {
        alert(`Tạo lô mã "${maDinhDanh}" thành công!`);
        setMaDinhDanh('');
      } else {
        alert(data?.detail || "Có lỗi xảy ra khi tạo lô mã.");
      }
    }catch(error){
      console.error("Lỗi kết nối:", error);
      alert("Lỗi kết nối đến máy chủ.");
    }
    finally{
      setIsLoading(false);
    }
  }

  const handleCreateCodes = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) {
        navigate('/dang-nhap');
        return;
    }
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
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data?.detail === "Could not validate credentials" || data?.detail === 404) {
            localStorage.removeItem('authToken');
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            navigate('/dang-nhap');
            return;
        }
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
        <hr className={styles.divider} />
        <button
          type="button"
          className={styles.batchToggleBtn}
          onClick={() => setShowBatchForm(!showBatchForm)}
        >
          {showBatchForm ? '− Batch ▲' : '+ Batch ▼'}
        </button>
        <div className={`${styles.batchWrapper} ${showBatchForm ? styles.open : ''}`}>
        <form onSubmit={handleCreateBatch}>
          <div className={styles.formGroup}>
            <label htmlFor="maDinhDanh">Mã định danh lô:</label>
            <input
              id="maDinhDanh"
              type="text"
              value={maDinhDanh}
              onChange={(e) => setMaDinhDanh(e.target.value)}
              placeholder="Ví dụ: lomaA"
              className={styles.inputNumber}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận tạo lô'}
          </button>
        </form>
      </div>
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
      </div>
    </div>
  );
};

export default eventgrift;