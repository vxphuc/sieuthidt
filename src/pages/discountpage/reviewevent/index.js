import React, { useState, useEffect } from 'react';
import styles from './reviewEvent.module.css';

const formatForInput = (dateObj) => {
  const d = new Date(dateObj);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16); 
};

const getDefaultDates = () => {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 30);
  return {
    start: formatForInput(now),
    end: formatForInput(nextWeek)
  };
};

const ReviewEvent = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  const defaultDates = getDefaultDates();
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    tensukien: '',
    thoihanbatdau: defaultDates.start,
    thoihanketthuc: defaultDates.end
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      let url = `https://chatapi.io.vn/xem-su-kien-doi-qua?page=${page}`;
      if (activeQuery) {
        url += `&q=${encodeURIComponent(activeQuery)}`;
      }

      const response = await fetch(url);
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
  }, [page, activeQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveQuery(searchInput);
    setPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Bạn cần đăng nhập để tiếp tục.");
      return;
    }
    const payload = {
      tensukien: newEvent.tensukien,
      thoihanbatdau: new Date(newEvent.thoihanbatdau).toISOString(),
      thoihanketthuc: new Date(newEvent.thoihanketthuc).toISOString()
    };

    try {
      const response = await fetch('https://chatapi.io.vn/tao-su-kien-doi-qua', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Tạo sự kiện thành công!");
        setShowForm(false);
        
        const freshDates = getDefaultDates();
        setNewEvent({ 
            tensukien: '', 
            thoihanbatdau: freshDates.start, 
            thoihanketthuc: freshDates.end 
        });
        
        fetchEvents();
      } else {
        alert("Có lỗi xảy ra khi tạo sự kiện.");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (events.length === 8) {
        setPage(prev => prev + 1);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản Lý Sự Kiện</h2>

      <div className={styles.topControls}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Tìm kiếm sự kiện..." 
            className={styles.searchInput}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className={styles.searchBtn}>Tìm kiếm</button>
        </form>

        <button 
          className={styles.createBtn} 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Đóng Form' : '+ Tạo Sự Kiện Mới'}
        </button>
      </div>

      {/* --- FORM TẠO MỚI --- */}
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
              onFocus={(e) => e.target.placeholder = ''}
              onBlur={(e) => e.target.placeholder = 'Ví dụ: Sự kiện đổi quà'}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Thời gian bắt đầu:</label>
            <input 
              type="datetime-local"
              lang="en-US"
              name="thoihanbatdau" 
              required
              value={newEvent.thoihanbatdau}
              onChange={handleInputChange}
              max="2099-12-31T23:59" 
            />
          </div>

          <div className={styles.formGroup}>
            <label>Thời gian kết thúc:</label>
            <input 
              type="datetime-local" 
              lang="en-US"
              name="thoihanketthuc" 
              required
              value={newEvent.thoihanketthuc}
              onChange={handleInputChange}
              min={newEvent.thoihanbatdau} 
              max="2099-12-31T23:59" 
            />
          </div>

          <button type="submit" className={styles.submitBtn}>Xác nhận tạo</button>
        </form>
      )}

      {/* --- DANH SÁCH SỰ KIỆN --- */}
      <div className={styles.eventList}>
        {isLoading ? (
            <p style={{textAlign: 'center'}}>Đang tải dữ liệu trang {page}...</p>
        ) : events.length > 0 ? (
            events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
                <h3 className={styles.eventName}>{event.tensukien}</h3>
                <h4 className={styles.eventId}>ID: {event.id}</h4>
                <p>Bắt đầu: {formatDate(event.thoihanbatdau)}</p>
                <p>Kết thúc: {formatDate(event.thoihanketthuc)}</p>
            </div>
            ))
        ) : (
            <p style={{textAlign: 'center', color: '#666'}}>
                {activeQuery 
                  ? `Không tìm thấy kết quả cho "${activeQuery}"` 
                  : `Không có sự kiện nào ở trang này.`}
            </p>
        )}
      </div>

      {/* --- PHÂN TRANG --- */}
      <div className={styles.pagination}>
        <button 
            className={styles.pageBtn} 
            onClick={handlePrevPage} 
            disabled={page === 1 || isLoading}
        >
            &laquo; Trước
        </button>
        
        <span className={styles.pageNumber}>Trang {page}</span>
        
        <button 
            className={styles.pageBtn} 
            onClick={handleNextPage}
            disabled={events.length < 8 || isLoading}
        >
            Sau &raquo;
        </button>
      </div>
    </div>
  );
};

export default ReviewEvent;
