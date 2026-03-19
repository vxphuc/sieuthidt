import React, { useState, useEffect } from 'react';
import api from '../../../api/koc';
import styles from './manageCTV.module.css';
import { FaCheckCircle, FaUserCheck } from "react-icons/fa";

function ManageCTV() {
    const [listCTV, setListCTV] = useState([]);
    const [loading, setLoading] = useState(true);

    const [phoneSearch, setPhoneSearch] = useState("");
    const [filterKOC, setFilterKOC] = useState("all");

    const fetchCTV = async () => {
        setLoading(true);
        try {
            const response = await api.get('/xem-KOC?page=1');
            let data = response.data;

            // lọc theo số điện thoại
            if (phoneSearch) {
                data = data.filter(item =>
                    item.sodienthoai.includes(phoneSearch)
                );
            }

            // lọc theo is_koc
            if (filterKOC !== "all") {
                data = data.filter(item => item.is_koc === Number(filterKOC));
            }

            setListCTV(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách KOC:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCTV();
    }, [filterKOC]);

    const handleApprove = async (id, name) => {
        if (!window.confirm(`Duyệt KOC: ${name}?`)) return;

        try {
            const res = await api.patch('/duyet-dang-ky-KOC', { id });

            if (res.status === 200 || res.status === 201) {
                alert("Duyệt thành công!");
                fetchCTV();
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi duyệt!");
        }
    };
    const handleReject = async (id, name) => {
        if (!window.confirm(`Từ chối KOC: ${name}?`)) return;

        try {
            const res = await api.patch('/duyet-dang-ky-KOC', { 
                id,
                is_koc: 2 // 👈 từ chối
            });

            if (res.status === 200 || res.status === 201) {
                alert("Đã từ chối!");
                fetchCTV();
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi từ chối!");
        }
    };
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>
                <FaUserCheck style={{ marginRight: 10 }} />
                Danh sách KOC
            </h2>

            <div className={styles.filterBox}>
                <input
                    type="text"
                    placeholder="Nhập số điện thoại..."
                    value={phoneSearch}
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    className={styles.input}
                />

                <select
                    value={filterKOC}
                    onChange={(e) => setFilterKOC(e.target.value)}
                    className={styles.select}
                >
                    <option value="all">Tất cả</option>
                    <option value="0">Chờ duyệt</option>
                    <option value="1">Đã duyệt</option>
                    <option value="2">Từ chối</option>
                </select>

                <button className={styles.btnSearch} onClick={fetchCTV}>
                    Tìm kiếm
                </button>
            </div>
            <div className={styles.card}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Địa chỉ</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7">Đang tải...</td>
                            </tr>
                        ) : listCTV.length > 0 ? (
                            listCTV.map(item => (
                                <tr key={item.id}>
                                    <td>#{item.id}</td>
                                    <td>{item.hoten}</td>
                                    <td>{item.email}</td>
                                    <td>{item.sodienthoai}</td>
                                    <td>{item.diachi}</td>

                                    <td>
                                        {item.is_koc === 0 && (
                                            <span className={styles.waiting}>
                                                Chờ duyệt
                                            </span>
                                        )}
                                        {item.is_koc === 1 && (
                                            <span className={styles.approved}>
                                                Đã duyệt
                                            </span>
                                        )}
                                        {item.is_koc === 2 && (
                                            <span className={styles.reject}>
                                                Từ chối
                                            </span>
                                        )}
                                    </td>

                                    <td>
                                        {item.is_koc === 0 && (
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                
                                                {/* DUYỆT */}
                                                <button
                                                    className={styles.btnApprove}
                                                    onClick={() => handleApprove(item.id, item.hoten)}
                                                >
                                                    <FaCheckCircle /> Duyệt
                                                </button>

                                                {/* TỪ CHỐI */}
                                                <button
                                                    className={styles.btnReject}
                                                    onClick={() => handleReject(item.id, item.hoten)}
                                                >
                                                    ❌ Từ chối
                                                </button>

                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Không có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ManageCTV;
