import React, { useEffect, useState} from "react";
"use client";
import styles from "./listdistributor.module.css";

const ListDistributor = () => {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        try{
            const token = localStorage.getItem("authToken");
            const response = await fetch(`https://chatapi.io.vn/dai-ly-chua-duoc-duyet?page=${page}`,{
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