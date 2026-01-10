import React, { useState, useEffect } from 'react';
import api from '../../../api/koc';
import styles from './ActiveKOCList.module.css';

function ActiveKOCList() {
    const [kocList, setKocList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/xem-koc-dang-hoat-dong?page=1');
                if (response.status === 200 && response.data && response.data.detail) {
                    setKocList(response.data.detail);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách KOC:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Danh Sách KOC Đang Hoạt Động</h2>
                    <span className={styles.countBadge}>Tổng: {kocList.length}</span>
                </div>

                <div className={styles.tableResponsive}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ Tên</th>
                                <th>Số Điện Thoại</th>
                                <th>Email</th>
                                <th>Địa Chỉ</th>
                                <th style={{textAlign: 'center'}}>Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className={styles.loading}>Đang tải dữ liệu...</td>
                                </tr>
                            ) : kocList.length > 0 ? (
                                kocList.map((koc) => (
                                    <tr key={koc.id}>
                                        <td>#{koc.id}</td>
                                        <td style={{fontWeight: 'bold', color: '#206a37'}}>{koc.hoten}</td>
                                        <td>{koc.sodienthoai}</td>
                                        <td>{koc.email}</td>
                                        <td style={{maxWidth: '200px'}}>{koc.diachi}</td>
                                        <td style={{textAlign: 'center'}}>
                                            {koc.is_active ? (
                                                <span className={styles.badgeActive}>Đang hoạt động</span>
                                            ) : (
                                                <span className={styles.badgeInactive}>Ngừng hoạt động</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className={styles.empty}>Chưa có KOC nào đang hoạt động.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ActiveKOCList;