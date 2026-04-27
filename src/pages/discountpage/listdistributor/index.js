import React, { useEffect, useState} from "react";
"use client";
import styles from "./listdistributor.module.css";
import { useNavigate } from "react-router-dom";
const ListDistributor = () => {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Bạn cần đăng nhập để tiếp tục.");
            navigate("/dang-nhap", {
                state: { from: "/quan-tri/duyet-phan-thuong" }
            });
            return;
        }
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const exp = payload.exp * 1000;
            if (Date.now() > exp) {
                localStorage.removeItem("authToken");
                alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                navigate("/dang-nhap", {
                    state: { from: "/quan-tri/duyet-phan-thuong" }
                });
            }
        } catch (error) {
            localStorage.removeItem("authToken");
            alert("Token không hợp lệ. Vui lòng đăng nhập lại.");
            navigate("/dang-nhap", {
                state: { from: "/quan-tri/duyet-phan-thuong" }
            });
        }
    }
    , [navigate]);
    const fetchData = async () => {
        try{
            const token = localStorage.getItem("authToken");
            const response = await fetch(`https://kocapi.io.vn/dai-ly-chua-duoc-duyet?page=${page}`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setList(data);
            console.log("Danh sách đại lý:", data);
            console.log("TOKEN:", token);
        }catch(error){
            console.error("Lỗi tải danh sách:", error);
        }
    }
    useEffect(() => {
        fetchData();
    }, [page]);
    const approveDistributor = async (id) => {
        try {

            const token = localStorage.getItem("authToken");
                const response = await fetch(
                `https://kocapi.io.vn/duyet-dai-ly?id=${id}`,
                {
                    method: "PATCH",
                    headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                    }
                }
                );
                const data = await response.json();
                if (response.ok) {
                    alert("Duyệt đại lý thành công!");
                } else {
                    alert("Duyệt đại lý thất bại. Vui lòng thử lại.");
                }
                fetchData();

            } catch (error) {
                console.error("Lỗi duyệt đại lý:", error);
        }
    };
    return(
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Tên đại lý</th>
                        <th>Số điện thoại</th>
                        <th>Tỉnh</th>
                        <th>Xã</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(list) && list.map((item, index) => (
                        <tr key={index}>
                            <td>{item.tendaily}</td>
                            <td>{item.numberphone}</td>
                            <td>{item.tinh}</td>
                            <td>{item.xa}</td>
                            <td>{item.diachicuthe}</td>
                            <td>{item.trangthai}</td>
                            <td>
                                <button
                                onClick={() => approveDistributor(item.id)}
                                className={styles.approveBtn}
                                >
                                Duyệt
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pagination}>
                <button className={styles.pageButton} onClick={() => setPage(page - 1)} disabled={page === 1}>
                Trang trước
                </button>

                <span className={styles.pageNumber}>Trang {page}</span>

                <button className={styles.pageButton} onClick={() => setPage(page + 1)}>
                Trang sau
                </button>
            </div>
        </div>
    )
}
export default ListDistributor;