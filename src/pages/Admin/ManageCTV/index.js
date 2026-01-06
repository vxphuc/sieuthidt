import React, { useState, useEffect } from 'react';
import api from '../../../api/koc';
import styles from './manageCTV.module.css';
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
        <div className="container-fluid mt-4">
            <h2 className="mb-4 text-success fw-bold">Quản lý CTV chờ duyệt</h2>
            
            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-striped mb-0">
                            <thead className="bg-success text-white">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Họ tên</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Số điện thoại</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col" className="text-center">Trạng thái</th>
                                    <th scope="col" className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">Đang tải dữ liệu...</td>
                                    </tr>
                                ) : listCTV.length > 0 ? (
                                    listCTV.map((item) => (
                                        <tr key={item.id} className="align-middle">
                                            <td>{item.id}</td>
                                            <td className="fw-bold">{item.hoten}</td>
                                            <td>{item.email}</td>
                                            <td>{item.sodienthoai}</td>
                                            <td>{item.diachi}</td>
                                            <td className="text-center">
                                                {!item.is_active ? (
                                                    <span className="badge bg-warning text-dark">Chờ duyệt</span>
                                                ) : (
                                                    <span className="badge bg-success">Đã duyệt</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <button 
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleApprove(item.id, item.hoten)}
                                                >
                                                    <i className="bi bi-check-circle me-1"></i> Duyệt
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            Không có CTV nào đang chờ duyệt.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ManageCTV;