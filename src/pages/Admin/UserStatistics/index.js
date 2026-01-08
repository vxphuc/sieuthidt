import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { FaFilter } from "react-icons/fa";
import styles from "./UserStatistics.module.css";

// Đăng ký các thành phần biểu đồ
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UserStatistics = () => {
  const [topCustomers, setTopCustomers] = useState([]);
  const [regionData, setRegionData] = useState([]);

  useEffect(() => {
    // 1. DỮ LIỆU MẪU: Top 5 khách hàng (Cho Bảng và Biểu đồ cột)
    const mockCustomers = [
      { id: 1, name: "Trương Anh Nhật", quantity: 120, total: 360000000, region: "Quảng Nam" },
      { id: 2, name: "Nguyễn Chiến Thắng", quantity: 100, total: 180000000, region: "Nha Trang" },
      { id: 3, name: "Trần Hiếu Học", quantity: 80, total: 90000000, region: "Quảng Ngãi" },
      { id: 4, name: "Phùng Thế Vinh", quantity: 50, total: 40000000, region: "Bình Dương" },
      { id: 5, name: "Trần Huỳnh Quang Trường", quantity: 20, total: 18000000, region: "Đà Nẵng" },
    ];
    setTopCustomers(mockCustomers);

    // 2. DỮ LIỆU MẪU: Thống kê khu vực (Cho Biểu đồ tròn)
    // Giả lập số lượng khách hàng ở các khu vực như hình ảnh
    const mockRegions = [
      { name: "Quảng Nam", value: 320, color: "#2980b9" }, // Xanh dương
      { name: "Nha Trang", value: 200, color: "#27ae60" }, // Xanh lá
      { name: "Quảng Ngãi", value: 180, color: "#7f8c8d" }, // Xám
      { name: "Bình Dương", value: 150, color: "#c0392b" }, // Đỏ
      { name: "Đà Nẵng", value: 80, color: "#8e44ad" },   // Tím
    ];
    setRegionData(mockRegions);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount).replace("₫", "");
  };

  // --- CẤU HÌNH BIỂU ĐỒ CỘT (Bar Chart) ---
  const barOptions = {
    indexAxis: 'y', // 'y' làm cho biểu đồ nằm ngang
    responsive: true,
    plugins: {
      legend: { display: false }, // Ẩn chú thích
    },
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Tổng tiền (VNĐ)' }
      }
    }
  };

  const barData = {
    labels: topCustomers.map(c => `Top ${c.id}: ${c.name}`), // Trục dọc là tên
    datasets: [
      {
        label: "Tổng chi tiêu",
        data: topCustomers.map(c => c.total), // Trục ngang là tiền
        backgroundColor: "#206a37",
        barThickness: 25, // Độ dày cột
      },
    ],
  };

  // --- CẤU HÌNH BIỂU ĐỒ TRÒN (Pie Chart) ---
  const pieData = {
    labels: regionData.map(r => r.name),
    datasets: [
      {
        data: regionData.map(r => r.value),
        backgroundColor: regionData.map(r => r.color),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Người mua hàng</h3>
        <p className={styles.subtitle}>Thống kê tổng doanh thu và đơn hàng đã bán được</p>
      </div>

      <div className={styles.filterSection}>
        <button className={styles.filterBtn}>
          <FaFilter /> Lọc ngày/tháng/năm
        </button>
      </div>

      {/* Charts Layout */}
      <div className={styles.chartGrid}>
        {/* Cột 1: Biểu đồ Top 5 Khách hàng */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Khách hàng (Top 5 doanh thu)</h4>
          <Bar options={barOptions} data={barData} />
        </div>

        {/* Cột 2: Biểu đồ Khu vực */}
        <div className={styles.chartCard}>
          <h4 className={styles.chartTitle}>Phân bố khách hàng theo khu vực</h4>
          <div style={{ width: "60%", margin: "0 auto" }}> {/* Thu nhỏ biểu đồ tròn lại chút cho đẹp */}
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={`${styles.th} ${styles.textCenter}`} style={{width: '60px'}}>STT</th>
              <th className={styles.th}>Tên khách hàng</th>
              <th className={`${styles.th} ${styles.textCenter}`}>SL mua</th>
              <th className={`${styles.th} ${styles.textEnd}`}>Thành tiền</th>
              <th className={`${styles.th} ${styles.textCenter}`}>Khu vực</th>
            </tr>
          </thead>
          <tbody>
            {topCustomers.map((user, index) => (
              <tr key={user.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.textCenter}`}>{index + 1}</td>
                <td className={`${styles.td} ${styles.primaryColor}`}>{user.name}</td>
                <td className={`${styles.td} ${styles.textCenter}`}>{user.quantity}</td>
                <td className={`${styles.td} ${styles.textEnd} ${styles.bold}`}>{formatCurrency(user.total)}</td>
                <td className={`${styles.td} ${styles.textCenter}`}>{user.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserStatistics;