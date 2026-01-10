import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FaFilter, FaChartBar, FaTimes } from "react-icons/fa";
import styles from "./RevenueStatistics.module.css";

// Đăng ký component biểu đồ
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueStatistics = () => {
  const [data, setData] = useState([]);
  const [showChart, setShowChart] = useState(false); // Trạng thái ẩn/hiện biểu đồ
  const [chartMode, setChartMode] = useState("week"); // 'week' hoặc 'month'

  useEffect(() => {
    // Dữ liệu mẫu bảng (Mock Data)
    const mockData = [
      { id: 1, name: "Nguyễn Xuân Du", product: "[Hộp Quà 6 Hũ] Tổ Yến Chưng Đông Trùng Hạ Thảo", date: "20-11-2025", customerId: "KH001", quantity: 10, total: 12000000 },
      { id: 2, name: "Trương Anh Nhật", product: "[Hộp Quà 6 Hũ] Tổ Yến Chưng Đường Phèn", date: "20-11-2025", customerId: "KH002", quantity: 8, total: 9600000 },
      { id: 3, name: "Trần Huỳnh Quang Trường", product: "[Lốc 6 Hũ] Tổ Yến Chưng Dành Cho Trẻ Em", date: "30-11-2025", customerId: "KH003", quantity: 15, total: 15000000 },
      { id: 4, name: "Nguyễn Chiến Thắng", product: "[Hộp 1 Hũ] Tổ Yến Sữa Dành Cho Trẻ Em", date: "30-11-2025", customerId: "KH004", quantity: 10, total: 5000000 },
      { id: 5, name: "Trần Hiếu Học", product: "[Lốc 6 Hũ] Tổ Yến Chưng Lysine + Taurine", date: "02-01-2026", customerId: "KH005", quantity: 16, total: 16000000 },
      { id: 6, name: "Vương Nhật Quang", product: "[Hộp Quà 6 Hũ] Tổ Yến Chưng Không Đường", date: "02-01-2026", customerId: "KH006", quantity: 20, total: 24000000 },
      { id: 7, name: "Phùng Thế Vinh", product: "[Hộp 4 Chén] Hộp Quà Chè Yến Cao Cấp", date: "02-01-2026", customerId: "KH007", quantity: 15, total: 18000000 },
      { id: 8, name: "Nguyễn Thị Thảo Ngân", product: "[Hộp 240g] Rong Nho Tách Nước Okinawa", date: "02-01-2026", customerId: "KH008", quantity: 10, total: 2000000 },
    ];
    setData(mockData);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  // --- CẤU HÌNH DỮ LIỆU BIỂU ĐỒ ---
  
  // Dữ liệu theo Tuần (Giả lập)
  const weekData = {
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"],
    datasets: [
      {
        label: "Doanh thu tuần này (VNĐ)",
        data: [15000000, 23000000, 18000000, 32000000, 28000000, 45000000, 50000000],
        backgroundColor: "#206a37",
        borderRadius: 4,
        barThickness: 40,
      },
    ],
  };

  // Dữ liệu theo Tháng (Giả lập)
  const monthData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
    datasets: [
      {
        label: "Doanh thu năm 2026 (VNĐ)",
        data: [120000000, 150000000, 180000000, 90000000, 200000000, 170000000, 220000000, 250000000, 300000000, 280000000, 350000000, 500000000],
        backgroundColor: "#206a37",
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: chartMode === 'week' ? 'Biểu đồ doanh thu 7 ngày gần nhất' : 'Biểu đồ doanh thu theo tháng' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) { return value / 1000000 + ' Tr'; } // Rút gọn số hiển thị
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Tổng doanh thu</h3>
        <p className={styles.subtitle}>Thống kê tổng doanh thu và đơn hàng đã bán được trong thời gian qua</p>
      </div>

      {/* Toolbar: Filters & Chart Toggle */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            <FaFilter /> Lọc ngày/tháng/năm
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            Lọc KH dùng mã KM
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            Lọc KH không dùng mã KM
          </button>
        </div>

        {/* Nút Xem biểu đồ */}
        <button 
          className={`${styles.btn} ${showChart ? styles.btnActive : styles.btnOutline}`}
          onClick={() => setShowChart(!showChart)}
        >
          {showChart ? <FaTimes /> : <FaChartBar />} 
          {showChart ? "Đóng biểu đồ" : "Xem biểu đồ thống kê"}
        </button>
      </div>

      {/* Chart Section (Chỉ hiện khi showChart = true) */}
      {showChart && (
        <div className={styles.chartContainer}>
          <div className={styles.chartHeader}>
            <h5 style={{fontWeight: 'bold', color: '#333'}}>Thống kê doanh thu</h5>
            <div className={styles.chartControls}>
              <button 
                className={`${styles.controlBtn} ${chartMode === 'week' ? styles.controlBtnActive : ''}`}
                onClick={() => setChartMode('week')}
              >
                Theo Tuần
              </button>
              <button 
                className={`${styles.controlBtn} ${chartMode === 'month' ? styles.controlBtnActive : ''}`}
                onClick={() => setChartMode('month')}
              >
                Theo Tháng
              </button>
            </div>
          </div>
          <Bar options={chartOptions} data={chartMode === 'week' ? weekData : monthData} height={80} />
        </div>
      )}

      {/* Table Section */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Tên KH</th>
              <th className={styles.th} style={{width: '35%'}}>Sản phẩm</th>
              <th className={`${styles.th} ${styles.textCenter}`}>Thời gian</th>
              <th className={`${styles.th} ${styles.textCenter}`}>Mã KH</th>
              <th className={`${styles.th} ${styles.textCenter}`}>Số lượng</th>
              <th className={`${styles.th} ${styles.textEnd}`} style={{paddingRight: '20px'}}>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={styles.tr}>
                <td className={`${styles.td} ${styles.bold}`}>{item.name}</td>
                <td className={styles.td}>{item.product}</td>
                <td className={`${styles.td} ${styles.textCenter}`}>{item.date}</td>
                <td className={`${styles.td} ${styles.textCenter}`}>{item.customerId}</td>
                <td className={`${styles.td} ${styles.textCenter}`}>{item.quantity}</td>
                <td className={`${styles.td} ${styles.textEnd} ${styles.money}`} style={{paddingRight: '20px'}}>
                  {formatCurrency(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueStatistics;