import React, { useState, useEffect } from 'react';
import api from '../../../api/koc';
import styles from './manageCTV.module.css';
import { FaCheckCircle, FaUserCheck } from "react-icons/fa";
function ManageCTV() {
    const [listCTV, setListCTV] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCTV = async () => {
        try {
            const response = await api.get('/xem-KOC-dang-ky-chua-duyet');
            const data = response.data;
            if (Array.isArray(data)) {
                setListCTV(data);
            } else {
                console.error("Dữ liệu trả về không đúng định dạng:", data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách CTV:", error);
            if (error.response && error.response.status === 401) {
                alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCTV();
    }, []);
``
    const handleApprove = async (id, name) => {
        if (!window.confirm(`Bạn có chắc chắn muốn duyệt CTV: ${name}?`)) {
            return;
        }

        try {
            const response = await api.patch('/duyet-dang-ky-KOC', { id: id });
            if (response.status === 200 || response.status === 201) {
                alert("Duyệt thành công!");
                fetchCTV();
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi duyệt:", error);
            const message = error.response?.data?.message || "Lỗi kết nối đến máy chủ.";
            alert(message);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                <FaUserCheck style={{marginRight: '10px'}}/> 
                Quản lý CTV Chờ Duyệt
            </h2>
            
            <div className={styles.card}>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.textCenter}>ID</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th className={styles.textCenter}>Trạng thái</th>
                                <th className={styles.textCenter}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className={styles.loadingText}>Đang tải dữ liệu...</td>
                                </tr>
                            ) : listCTV.length > 0 ? (
                                listCTV.map((item) => (
                                    <tr key={item.id}>
                                        <td className={styles.textCenter}>#{item.id}</td>
                                        <td className={styles.nameCol}>{item.hoten}</td>
                                        <td>{item.email}</td>
                                        <td>{item.sodienthoai}</td>
                                        <td>{item.diachi || '---'}</td>
                                        
                                        <td className={styles.textCenter}>
                                            {!item.is_active ? (
                                                <span className={`${styles.badge} ${styles.badgeWaiting}`}>
                                                    Chờ duyệt
                                                </span>
                                            ) : (
                                                <span className={`${styles.badge} ${styles.badgeApproved}`}>
                                                    Đã duyệt
                                                </span>
                                            )}
                                        </td>
                                        
                                        <td className={styles.textCenter}>
                                            <button 
                                                className={styles.btnApprove}
                                                onClick={() => handleApprove(item.id, item.hoten)}
                                            >
                                                <FaCheckCircle className={styles.icon} /> Duyệt
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className={styles.emptyText}>
                                        Không có CTV nào đang chờ duyệt.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default ManageCTV;