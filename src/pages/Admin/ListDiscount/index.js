import React, { useState, useEffect } from 'react';
import api from '../../../api/koc';
import styles from './ListDiscount.module.css';
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ListDiscount() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [submittedSearch, setSubmittedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT = 10;
    // Hàm gọi API lấy danh sách
    const fetchEvents = async (page, query) => {
        setLoading(true);
        try {
            const response = await api.get(`/tat-ca-su-kien`, {
                params: {
                    q: query,
                    limit: LIMIT,
                    page: page
                }
            });
            const data = Array.isArray(response.data) ? response.data : [];
            setEvents(data);
            
            // Nếu dữ liệu trả về rỗng mà không phải trang 1, lùi lại 1 trang
            if (data.length === 0 && page > 1) {
                setCurrentPage(prev => prev - 1);
            }

        } catch (error) {
            console.error("Lỗi lấy danh sách:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchEvents(currentPage, submittedSearch);
    }, [currentPage, submittedSearch]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSubmittedSearch(searchTerm);
        setCurrentPage(1);
    };
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (events.length === LIMIT) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "---";
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Header & Tìm kiếm */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Danh Sách Khuyến Mãi</h2>
                    
                    <form onSubmit={handleSearch} className={styles.searchBox}>
                        <input 
                            type="text" 
                            placeholder="Tìm tên sự kiện..." 
                            className={styles.searchInput}
                            value={searchTerm}
                            // Chỉ cập nhật searchTerm khi gõ, chưa gọi API
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit" className={styles.btnSearch}>
                            <FaSearch /> Tìm
                        </button>
                    </form>
                </div>

                {/* Bảng Dữ Liệu */}
                <div className={styles.tableContainer}>
                    {loading ? (
                        <div className={styles.loading}>Đang tải dữ liệu...</div>
                    ) : (
                        <>
                            <table className={styles.table}>
                                <thead>
                                    <tr className={styles.tableHeader}>
                                        <th>ID</th>
                                        <th>Tên Sự Kiện</th>
                                        <th>Giảm Giá</th>
                                        <th>Thời Gian Bắt Đầu</th>
                                        <th>Thời Gian Kết Thúc</th>
                                        <th>Trạng Thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.length > 0 ? (
                                        events.map((item) => (
                                            <tr key={item.id}>
                                                <td>#{item.id}</td>
                                                <td>
                                                    <strong>{item.tensukien}</strong>
                                                    {item.is_koc && <span className={styles.kocBadge}>KOC</span>}
                                                </td>
                                                <td style={{ color: '#206a37', fontWeight: 'bold' }}>
                                                    {item.giatrigiamgia}%
                                                </td>
                                                <td>{formatDate(item.thoigianbatdau)}</td>
                                                <td>{formatDate(item.thoigianketthuc)}</td>
                                                <td>
                                                    {item.is_active ? (
                                                        <span className={`${styles.badge} ${styles.active}`}>Đang chạy</span>
                                                    ) : (
                                                        <span className={`${styles.badge} ${styles.inactive}`}>Đã tắt</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>
                                                Không tìm thấy sự kiện nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* --- PHẦN ĐIỀU KHIỂN PHÂN TRANG --- */}
                            <div className={styles.pagination}>
                                <button 
                                    className={styles.pageBtn} 
                                    onClick={handlePrevPage} 
                                    disabled={currentPage === 1 || loading}
                                >
                                    <FaChevronLeft /> Trước
                                </button>
                                
                                <span className={styles.pageInfo}>
                                    Trang {currentPage}
                                </span>
                                
                                <button 
                                    className={styles.pageBtn} 
                                    onClick={handleNextPage} 
                                    disabled={events.length < LIMIT || loading}
                                >
                                    Sau <FaChevronRight />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ListDiscount;