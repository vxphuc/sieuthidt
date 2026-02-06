import React, { useState, useEffect } from 'react';
import styles from './reviewEvent.module.css';

const ReviewEvent = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State cho tạo mới sự kiện
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    tensukien: '',
    thoihanbatdau: '',
    thoihanketthuc: ''
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://chatapi.io.vn/xem-su-kien-doi-qua?page=1');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Lỗi tải trang:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const payload = {
      tensukien: newEvent.tensukien,
      id:  newEvent.id,
      thoihanbatdau: new Date(newEvent.thoihanbatdau).toISOString(),
      thoihanketthuc: new Date(newEvent.thoihanketthuc).toISOString()
    };

    try {
      const response = await fetch('https://chatapi.io.vn/su-kien-doi-qua', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Tạo sự kiện thành công!");
        setShowForm(false);
        setNewEvent({ tensukien: '', thoihanbatdau: '', thoihanketthuc: '' });
        fetchEvents();
      } else {
        alert("Có lỗi xảy ra khi tạo sự kiện.");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản Lý Sự Kiện</h2>

      {/* Nút mở form tạo mới */}
      <div className={styles.actions}>
        <button 
          className={styles.createBtn} 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Đóng Form' : '+ Tạo Sự Kiện Mới'}
        </button>
      </div>

      {/* Form Tạo Sự Kiện (Chỉ hiện khi showForm = true) */}
      {showForm && (
        <form className={styles.formBox} onSubmit={handleCreateEvent}>
          <h3>Nhập thông tin sự kiện</h3>
          
          <div className={styles.formGroup}>
            <label>Tên sự kiện:</label>
            <input 
              type="text" 
              name="tensukien" 
              required
              value={newEvent.tensukien}
              onChange={handleInputChange}
              placeholder="Ví dụ: Sự kiện đổi quà"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Thời gian bắt đầu:</label>
            <input 
              type="datetime-local" 
              name="thoihanbatdau" 
              required
              value={newEvent.thoihanbatdau}
              onChange={handleInputChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Thời gian kết thúc:</label>
            <input 
              type="datetime-local" 
              name="thoihanketthuc" 
              required
              value={newEvent.thoihanketthuc}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>Xác nhận tạo</button>
        </form>
      )}

      {/* Danh sách hiển thị */}
      <div className={styles.eventList}>
        {isLoading ? <p>Đang tải...</p> : events.map((event) => (
          <div key={event.id} className={styles.eventCard}>
            <h3 className={styles.eventName}>{event.tensukien}</h3>
            <h4 className={styles.eventId}>ID: {event.id}</h4>
            <p>Bắt đầu: {formatDate(event.thoihanbatdau)}</p>
            <p>Kết thúc: {formatDate(event.thoihanketthuc)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewEvent;