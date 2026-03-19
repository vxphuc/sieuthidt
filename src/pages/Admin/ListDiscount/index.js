import React, { useState, useEffect } from 'react';
import api from '../../../api/koc';
import styles from './ListDiscount.module.css';
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ListDiscount() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        tensukien: '',
        is_active: '',
        is_koc: ''
    });

    const [submittedFilters, setSubmittedFilters] = useState(filters);
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ build query string
    const buildQuery = (params) => {
        return Object.entries(params)
            .filter(([_, v]) => v !== '' && v !== undefined)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join('&');
    };

    // ✅ CALL API bằng URL
    const fetchEvents = async (page, filterData) => {
        setLoading(true);

        try {
            const query = buildQuery({
                page,
                tensukien: filterData.tensukien,
                is_active: filterData.is_active,
                is_koc: filterData.is_koc
            });

            const url = `/xem-su-kien?${query}`;

            console.log("CALL API:", url);

            const response = await api.get(url);

            const data = response.data?.data || response.data || [];

            setEvents(data);

            if (data.length === 0 && page > 1) {
                setCurrentPage(prev => prev - 1);
            }

        } catch (error) {
            console.error("Lỗi API:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(currentPage, submittedFilters);
    }, [currentPage, submittedFilters]);

    // ✅ handle change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ submit search
    const handleSearch = (e) => {
        e.preventDefault();
        setSubmittedFilters(filters);
        setCurrentPage(1);
    };

    // pagination
    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (events.length > 0) setCurrentPage(prev => prev + 1);
    };

    // format date
    const formatDate = (dateString) => {
        if (!dateString) return "---";
        return new Date(dateString).toLocaleString('vi-VN');
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>

                {/* HEADER */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Danh Sách Khuyến Mãi</h2>

                    <form onSubmit={handleSearch} className={styles.searchBox}>

                        {/* Tên sự kiện */}
                        <input
                            type="text"
                            name="tensukien"
                            placeholder="Tên sự kiện..."
                            className={styles.searchInput}
                            value={filters.tensukien}
                            onChange={handleChange}
                        />

                        {/* is_active */}
                        <select
                            name="is_active"
                            value={filters.is_active}
                            onChange={handleChange}
                            className={styles.searchInput}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="true">Đang chạy</option>
                            <option value="false">Đã tắt</option>
                        </select>

                        {/* is_koc */}
                        <select
                            name="is_koc"
                            value={filters.is_koc}
                            onChange={handleChange}
                            className={styles.searchInput}
                        >
                            <option value="">Tất cả</option>
                            <option value="true">KOC</option>
                            <option value="false">Không KOC</option>
                        </select>

                        <button type="submit" className={styles.btnSearch}>
                            <FaSearch /> Tìm
                        </button>
                    </form>
                </div>

                {/* TABLE */}
                <div className={styles.tableContainer}>
                    {loading ? (
                        <div className={styles.loading}>Đang tải dữ liệu...</div>
                    ) : (
                        <>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên sự kiện</th>
                                        <th>Giảm giá</th>
                                        <th>Bắt đầu</th>
                                        <th>Kết thúc</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {events.length > 0 ? (
                                        events.map(item => (
                                            <tr key={item.id}>
                                                <td>#{item.id}</td>
                                                <td>
                                                    <strong>{item.tensukien}</strong>
                                                    {item.is_koc && (
                                                        <span className={styles.kocBadge}>KOC</span>
                                                    )}
                                                </td>
                                                <td style={{ color: '#206a37', fontWeight: 'bold' }}>
                                                    {item.giatrigiamgia}%
                                                </td>
                                                <td>{formatDate(item.thoigianbatdau)}</td>
                                                <td>{formatDate(item.thoigianketthuc)}</td>
                                                <td>
                                                    {item.is_active ? (
                                                        <span className={`${styles.badge} ${styles.active}`}>
                                                            Đang chạy
                                                        </span>
                                                    ) : (
                                                        <span className={`${styles.badge} ${styles.inactive}`}>
                                                            Đã tắt
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: 20 }}>
                                                Không có dữ liệu
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* PAGINATION */}
                            <div className={styles.pagination}>
                                <button
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1 || loading}
                                >
                                    <FaChevronLeft /> Trước
                                </button>

                                <span>Trang {currentPage}</span>

                                <button
                                    onClick={handleNextPage}
                                    disabled={loading}
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