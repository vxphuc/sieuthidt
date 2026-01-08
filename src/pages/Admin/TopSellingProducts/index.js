import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import styles from "./TopSellingProduct.module.css";

const TopSellingProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Dữ liệu mẫu
    const mockApiData = [
      { id: 1, name: "DTNest - Yến chưng đông trùng hạ thảo (Hộp quà)", quantity: 10, revenue: 12000000 },
      { id: 2, name: "Okinawa - Thanh rong nho sấy vị bơ tỏi", quantity: 20, revenue: 10000000 },
      { id: 3, name: "Okinawa - Thanh rong nho sấy vị phô mai", quantity: 10, revenue: 10000000 },
      { id: 4, name: "Hộp quà Chè yến Trung Thu", quantity: 10, revenue: 20000000 },
      { id: 5, name: "Okinawa - Rong nho tách nước 240gr", quantity: 10, revenue: 1000000 },
      { id: 6, name: "[Hộp 150ml] Chè Yến Ngũ Vị - Yến Sào Khánh Hòa - DTNEST", quantity: 10, revenue: 1000000 },
      { id: 7, name: "[Hộp 150ml] Chè Yến Rong Nho - Yến Sào Khánh Hòa - DTNEST", quantity: 10, revenue: 1000000 },
    ];
    setData(mockApiData);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount).replace("₫", "");
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          Top sản phẩm bán chạy trong tháng
        </h3>
        <p className={styles.subtitle}>Thống kê các sản phẩm bán chạy trong tháng</p>
      </div>

      {/* Filter Section */}
      <div className={styles.filterSection}>
        <button className={styles.filterBtn}>
          <FaFilter /> Lọc sản phẩm theo tháng
        </button>
      </div>

      {/* Table Section */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={`${styles.th} ${styles.textCenter}`} style={{ width: "80px" }}>STT</th>
              <th className={styles.th}>Tên sản phẩm</th>
              <th className={`${styles.th} ${styles.textCenter}`} style={{ width: "150px" }}>Số lượng</th>
              <th className={`${styles.th} ${styles.textEnd}`} style={{ width: "200px", paddingRight: "24px" }}>Tổng doanh thu</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {data.map((item, index) => (
              <tr key={item.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.textCenter} ${styles.stt}`}>
                  {index + 1}
                </td>
                <td className={`${styles.td} ${styles.productName}`}>
                  {item.name}
                </td>
                <td className={`${styles.td} ${styles.textCenter}`}>
                  {item.quantity}
                </td>
                <td className={`${styles.td} ${styles.textEnd} ${styles.revenue}`} style={{ paddingRight: "24px" }}>
                  {formatCurrency(item.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopSellingProducts;