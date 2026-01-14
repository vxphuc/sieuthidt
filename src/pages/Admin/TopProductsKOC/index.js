import React, { useState, useEffect } from "react";
import styles from "./TopProductsKOC.module.css";
// import api from "../../api/koc";

export default function TopProductsKOC() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hàm format tiền tệ (VND)
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND' 
        }).format(amount).replace('₫', ''); // Bỏ ký hiệu đ nếu muốn giống ảnh
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // --- KHI CÓ API THẬT, BẠN MỞ COMMENT DÒNG DƯỚI RA ---
                // const res = await api.get('/thong-ke/san-pham-mua-nhieu-koc');
                // setProducts(res.data);

                // --- DỮ LIỆU GIẢ LẬP (MOCK DATA) THEO ẢNH BẠN GỬI ---
                // Xóa phần này khi đấu API thật
                const mockData = [
                    { id: 1, name: "DTNest - Yến chưng đông trùng hạ thảo (Hộp quà)", count: 20, total: 30200000 },
                    { id: 2, name: "Okinawa - Thanh rong nho sấy vị bơ tỏi", count: 18, total: 28800000 },
                    { id: 3, name: "Okinawa - Thanh rong nho sấy vị phô mai", count: 16, total: 18500000 },
                    { id: 4, name: "Hộp quà Chè yến Trung Thu", count: 12, total: 15100000 },
                    { id: 5, name: "Okinawa - Rong nho tách nước 240gr", count: 10, total: 14300000 },
                    { id: 6, name: "[Hộp 150ml] Chè Yến Ngũ Vị - Yến Sào Khánh Hòa", count: 5, total: 11700000 },
                    { id: 7, name: "[Hộp 150ml] Chè Yến Rong Nho - DTNEST", count: 4, total: 7650000 },
                    { id: 8, name: "[Hộp Quà 6 Hũ] Tổ Yến Chưng Không Đường", count: 3, total: 5000000 },
                ];
                
                // Giả lập độ trễ mạng
                setTimeout(() => {
                    setProducts(mockData);
                    setLoading(false);
                }, 500);
                // -----------------------------------------------------

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.headerTitle}>
                    NHỮNG SẢN PHẨM MUA NHIỀU NHẤT CÓ MÃ KHUYẾN MÃI
                </h2>
                <div className={styles.subTitle}>
                    Những sản phẩm được mua nhiều (áp dụng cả mã khuyến mãi)
                </div>

                {loading ? (
                    <div style={{textAlign: 'center', padding: 20}}>Đang tải dữ liệu...</div>
                ) : (
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{width: '60px'}}>STT</th>
                                    <th>Tên sản phẩm</th>
                                    <th style={{width: '200px'}}>S.Lượng mã KM dùng khi mua</th>
                                    <th style={{width: '180px'}}>Tổng tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <td className={styles.textCenter}>{index + 1}</td>
                                            <td className={styles.textLeft}>
                                                <span className={styles.productName}>{item.name}</span>
                                            </td>
                                            <td className={styles.textCenter}>{item.count}</td>
                                            <td className={styles.textRight} style={{fontWeight: 'bold', color: '#333'}}>
                                                {formatCurrency(item.total)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className={styles.textCenter} style={{padding: 20}}>
                                            Chưa có dữ liệu thống kê.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}