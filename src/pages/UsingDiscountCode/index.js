import React, { useState, useEffect } from "react";
import styles from "./UsingDiscountCode.module.css";
import api from "../../api/koc";

const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

function UsingDiscountCode() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/xem-don-hang-danh-cho-koc?page=1');

                const data = response.data;
                if (Array.isArray(data)) {
                    setOrders(data);
                } else if (data && Array.isArray(data.detail)) {
                    setOrders(data.detail);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách đơn hàng:", error);
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
                    <h2 className={styles.title}>Danh Sách Đơn Hàng Sử Dụng Mã</h2>
                    <span className={styles.countBadge}>Tổng: {orders.length} đơn</span>
                </div>

                <div className={styles.tableResponsive}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người Đặt</th>
                                <th>Mã Đã Dùng</th>
                                <th>Khu Vực</th>
                                <th>Thời Gian Đặt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className={styles.loading}>Đang tải dữ liệu...</td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((item) => (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        
                                        <td style={{fontWeight: 'bold', color: '#206a37', textTransform: 'capitalize'}}>
                                            {item.tennguoidat}
                                        </td>
                                        
                                        <td>
                                            <span style={{
                                                backgroundColor: '#e0f2f1', 
                                                color: '#00695c', 
                                                padding: '4px 8px', 
                                                borderRadius: '4px', 
                                                fontWeight: 'bold',
                                                fontSize: '13px'
                                            }}>
                                                {item.maduocsudung}
                                            </span>
                                        </td>
                                        <td>
                                            {item.ward}, {item.province}
                                        </td>
                                        <td>
                                            {formatDate(item.thoigiantaodon)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className={styles.empty}>Chưa có đơn hàng nào sử dụng mã của bạn.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UsingDiscountCode;