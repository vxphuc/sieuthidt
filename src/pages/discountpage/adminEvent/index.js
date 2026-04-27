import React, { useEffect, useState } from "react";
import styles from "./adminEvent.module.css";

const EventReport = () => {
    const [distributorData, setDistributorData] = useState([]);
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState("");
  const [users, setUsers] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [pageUser, setPageUser] = useState(1);
  const [pageDistributor,setPageDistributor] = useState(1);
  const [pagePopupUs, setPagePopupUs] = useState(1);
  const [pagePopupDis, setPagePopupDis] = useState(1);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [shopHistory, setShopHistory] = useState([]);
  const [showShopPopup, setShowShopPopup] = useState(false);

  const token = localStorage.getItem("authToken");

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const past30Day = new Date();
  past30Day.setDate(past30Day.getDate() - 30);
  past30Day.setHours(1, 0, 0, 0);
  const currentDay = new Date(
  today.getTime() - today.getTimezoneOffset() * 60000
)
  .toISOString()
  .slice(0, 16);

const defaultStartDay = new Date(
  past30Day.getTime() - past30Day.getTimezoneOffset() * 60000
)
  .toISOString()
  .slice(0, 16);
  const [startDate, setStartDate] = useState(defaultStartDay);
  const [endDate, setEndDate] = useState(currentDay);

// popup dữ liệu shop
    const fetchShopHistory = async (shopId) => {
        try {
            let url = `https://kocapi.io.vn/lichSuDanhSachDoiThuongBoiDaiLy?id=${shopId}&page=${pagePopupDis}&limit=20`;

            if (startDate) {
                url += `&ngaybatdau=${startDate.slice(0, 10)}T00:00:00`;
            }

                if (endDate) {
                url += `&ngayketthuc=${endDate.slice(0, 10)}T23:59:59`;
            }

            const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            const data = await res.json();

            if (res.ok) {
            setShopHistory(data);
            setSelectedShopId(shopId);
            setShowShopPopup(true);
            }
        } catch (err) {
            console.log("Lỗi lấy lịch sử đại lý", err);
        }
    };
// popup dữ liệu người dùng
  const fetchUserDetail = async (userId) => {
    try{
        const res = await fetch(`https://kocapi.io.vn/user-detail-joins-an-event?id_nguoidung=${userId}&id_sukien=${eventId}&page=${pagePopupUs}&limit=20`,{
            headers: {Authorization: `Bearer ${token}`},
        });
        const data = await res.json();
        if(res.ok){
            setUserDetail(data);
            setShowPopup(true);
        }
    }
    catch(err){
        console.log("Lỗi lấy chi tiết", err);
    }
  }

  useEffect(() => {
    const fetchEvents = async () => {
        try {
        const res = await fetch(
            "https://kocapi.io.vn/xem-su-kien-doi-qua-daily"
        );

        const data = await res.json();

        if (res.ok) {
            setEvents(data);

            // set mặc định event
            const defaultEvent = data.find(
                (e) => e.id === "e4024a25-db96-4eb3-8933-f1362e52cf76"
            );

            if (defaultEvent) {
                setEventId(defaultEvent.id);
            }
        }
        } catch (err) {
        console.log("Lỗi lấy sự kiện", err);
        }
    };
    fetchEvents();
  }, []);

  const fetchData = async () => {
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            alert("Ngày bắt đầu không được lớn hơn ngày kết thúc");
            return;
        }
    }
    try {
        let url = `https://kocapi.io.vn/special-Event-reports?page=${page}&limit=10`;

        if (eventId) url += `&id_event=${eventId}`;
        if (startDate) {
            const start = `${startDate.slice(0, 10)}T00:00:00`;
            url += `&start_date=${start}`;
            }

            if (endDate) {
            const end = `${endDate.slice(0, 10)}T23:59:59`;
            url += `&end_date=${end}`;
        }

        const res = await fetch(url, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        const result = await res.json();

        if (res.ok) {
            setData(result);
        }
        if (eventId) {
            let userUrl = `https://kocapi.io.vn/users-join-an-event?id_sukien=${eventId}&page=${pageUser}&limit=10`;

            if (startDate) {
                const start = `${startDate.slice(0, 10)}T00:00:00`;
                userUrl += `&startDate=${start}`;
            }

                if (endDate) {
                const end = `${endDate.slice(0, 10)}T23:59:59`;
                userUrl += `&endDate=${end}`;
            }

            const resUser = await fetch(userUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userData = await resUser.json();

            if (resUser.ok) {
                setUsers(userData);
            }
            let distributorUrl = `https://kocapi.io.vn/information-shop-and-event?id_sukien=${eventId}&page=${pageDistributor}`;
            if (startDate) {
                const start = `${startDate.slice(0, 10)}T00:00:00`;
                distributorUrl += `&start_date=${start}`;
            }

                if (endDate) {
                const end = `${endDate.slice(0, 10)}T23:59:59`;
                distributorUrl += `&end_date=${end}`;
            }
            const resDistributor = await fetch(distributorUrl, {
                headers: {Authorization: `Bearer ${token}`},
            });
            const distributorData = await resDistributor.json();
            if (resDistributor.ok){
                setDistributorData(distributorData)
            }
        }
    } catch (err) {
      console.log("Lỗi lấy báo cáo", err);
    }
  };

    useEffect(() => {
        if (eventId) {
            fetchData();
        }
    }, [eventId, page, pageUser, pageDistributor, startDate, endDate]);

  // lọc bỏ "may mắn lần sau"
    const filteredData = data.filter((item) => {
        const rewardName = item.tenphanthuong?.toLowerCase() || "";

        return (
            !rewardName.includes("may mắn lần sau") &&
            !rewardName.includes("chúc bạn may mắn") &&
            !rewardName.includes("may mắn")
        );
    });

  const summary = data[0] || {};

    const rewardColumns = [
        ...new Set(
            distributorData.flatMap((item) =>
            item.phanthuong ? Object.keys(item.phanthuong).filter((reward) => {
                const rewardName = reward.toLocaleLowerCase();
                return (
                    !rewardName.includes("may mắn lần sau") &&
                    !rewardName.includes("chúc bạn may mắn") &&
                    !rewardName.includes("may mắn")
                );
            }) : []
            )
        ),
    ];
    useEffect(() => {
        if (showPopup && selectedUser?.id_nguoidung) {
            fetchUserDetail(selectedUser.id_nguoidung);
        }
    }, [pagePopupUs]);
    const filteredUserDetail = userDetail.filter((item) => {
        const rewardName = item.tenphanthuong?.toLowerCase() || "";

        return (
            !rewardName.includes("may mắn lần sau") &&
            !rewardName.includes("chúc bạn may mắn") &&
            !rewardName.includes("may mắn")
        );
    });
    useEffect(() => {
        if (showShopPopup && selectedShopId) {
            fetchShopHistory(selectedShopId);
        }
    }, [pagePopupDis]);
    const filteredShopHistory = shopHistory.filter((item) => {
        const rewardName = item.tenphanthuong?.toLowerCase() || "";

        return (
            !rewardName.includes("may mắn lần sau") &&
            !rewardName.includes("chúc bạn may mắn") &&
            !rewardName.includes("may mắn")
        );
    });
  return (
    <div className={styles.containerData}>
        <div className={styles.wrapper}>
            {/* FILTER */}
            <div className={styles.filter}>
                <select
                    className={styles.input}
                    value={eventId}
                    onChange={(e) => {
                        const value = e.target.value;

                        setEventId(value);
                        setPage(1);
                        setPageUser(1);
                        setPageDistributor(1);

                        setData([]);
                        setUsers([]);
                        setDistributorData([]);
                    }}
                    >
                    {/* <option value="">Tất cả sự kiện</option> */}

                    {events.map((event) => (
                        <option key={event.id} value={event.id}>
                        {event.tensukien}
                        </option>
                    ))}
                </select>

                <input
  className={styles.input}
  type="datetime-local"
  value={startDate}
  max="9999-12-31T23:59"
  onChange={(e) => {
    const value = e.target.value;
    const year = value.split("-")[0];

    if (year.length <= 4) {
      setStartDate(value);
    }
  }}
/>

<input
  className={styles.input}
  type="datetime-local"
  value={endDate}
  max="9999-12-31T23:59"
  onChange={(e) => {
    const value = e.target.value;
    const year = value.split("-")[0];

    if (year.length <= 4) {
      setEndDate(value);
    }
  }}
/>

                <button className={styles.button} onClick={fetchData}>
                Lọc
                </button>
            </div>
            <h2 className={styles.title}>Dữ Liệu Tổng Quan</h2>
            {/* TABLE */}
            <table className={styles.table}>
                <thead>
                <tr className={styles.headerTop}>
                    <th colSpan="4">Tổng Quan</th>
                    <th colSpan="4">Giải Thưởng</th>
                </tr>
                <tr className={styles.headerSub}>
                    <th>Cửa hàng</th>
                    <th>Khách hàng</th>
                    <th>Mã</th>
                    <th>Mã đã sử dụng</th>
                    <th>Tên</th>
                    <th>Số lượng</th>
                    <th>Đã ghi nhận</th>
                    <th>Đã đổi quà</th>
                </tr>
                </thead>

                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={index}>
                        {index === 0 && (
                            <>
                            <td rowSpan={filteredData.length}>
                                {summary.total_daily}
                            </td>
                            <td rowSpan={filteredData.length}>
                                {summary.total_users}
                            </td>
                            <td rowSpan={filteredData.length}>
                                {summary.total_code_of_event}
                            </td>
                            <td rowSpan={filteredData.length}>
                                {summary.usaged_total_code_of_event}
                            </td>
                            </>
                        )}

                        <td>{item.tenphanthuong}</td>
                        <td>{item.soluong}</td>
                        <td>{item.total_phan_thuong}</td>
                        <td>{item.solved_problem}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.pageSeting}>
                <button className={styles.button}
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev -1, 1))}
                    style={{
                        opacity: filteredData.length < 10 ? 0.5 : 1,
                        cursor: filteredData.length < 10 ? "not-allowed" : "pointer",
                    }}
                >
                    Trang trước
                </button>
                <span className={styles.firtPage}>
                    Trang {page}
                </span>
                <button className={styles.button}
                    disabled={filteredData.length < 10}
                    onClick={() => setPage((prev) => prev + 1)}
                    style={{
                        opacity: filteredData.length < 10 ? 0.5 : 1,
                        cursor: filteredData.length < 10 ? "not-allowed" : "pointer",
                    }}
                >
                    Trang sau
                </button>
            </div>
        </div>
        <div className={styles.userAndDistributor}>
            <div className={styles.dataUser}>
                <h2 className={styles.title} style={{ marginTop: 40 }}>
                    Dữ liệu người dùng
                </h2>

                <table className={styles.table}>
                    <thead>
                        <tr className={styles.headerTop}>
                        <th>Tổng số quà</th>
                        <th>Tên</th>
                        <th>Số điện thoại</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((item, index) => {
                            const phone = item.numberphone?.replace(/^84/, "0");
                            return (
                                <tr key={index}>
                                <td>{item.tong || 0}</td>
                                <td>{item.hovaten || "chưa cập nhật"}</td>
                                <td
                                    style={{ cursor: "pointer", color: "#007bff", fontWeight: "bold" }}
                                    onClick={() => {
                                        setSelectedUser(item);
                                        fetchUserDetail(item.id_nguoidung);
                                    }}
                                    >
                                    {phone || "-"}
                                </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className={styles.pageSeting}>
                    <button className={styles.button}
                        disabled = {pageUser === 1}
                        onClick={() => setPageUser((prev) => Math.max(prev -1,1))}
                        style={{
                            opacity: pageUser === 1 ? 0.5 : 1,
                            cursor: pageUser === 1 ? "not-allowed" : "pointer",
                        }}
                    >
                        Trang trước
                    </button>
                    <span className={styles.firtPage}>
                        Trang {pageUser}
                    </span>
                    <button className={styles.button}
                        disabled = {users.length < 10}
                        onClick={() => setPageUser((prev) => prev + 1)}
                        style={{
                            opacity: pageUser === 1 ? 0.5 : 1,
                            cursor: pageUser === 1 ? "not-allowed" : "pointer",
                        }}
                    >
                        Trang sau
                    </button>
                </div>
            </div>
            <div className={styles.dataDistributor}>
                <h2 className={styles.title} style={{ marginTop: 40 }}>
                    Dữ liệu đại lý
                </h2>

                <table className={styles.table}>
                    <thead>
                        <tr className={styles.headerTop}>
                            <th rowSpan={2}>Tên cửa hàng</th>
                            <th rowSpan={2}>Tổng khách hàng</th>
                            <th rowSpan={2}>Tổng quà đã đổi</th>
                            <th colSpan={rewardColumns.length || 1}>Quà thưởng</th>
                        </tr>
                        <tr className={styles.headerSub}>
                            {rewardColumns.length > 0 ? (
                                rewardColumns.map((reward) => (
                                    <th key={reward}>{reward}</th>
                                ))
                            ) : (
                                <th>Không có</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {distributorData.map((item, index) => (
                            <tr key={index}>
                                <td
                                    style={{
                                        cursor: "pointer",
                                        color: "#007bff",
                                        fontWeight: "bold",
                                    }}
                                    onClick={() => fetchShopHistory(item.id_nguoidangky_daily)}
                                    >
                                    {item.tendaily}
                                </td>
                                <td>{item.tong_khach_hang}</td>
                                <td>{item.tong_qua_da_doi}</td>

                                {rewardColumns.length > 0 ? (
                                    rewardColumns.map((reward) => (
                                    <td key={reward}>
                                        {item.phanthuong?.[reward] || 0}
                                    </td>
                                    ))
                                ) : (
                                    <td>0</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className={styles.pageSeting}>
                    <button
                        className={styles.button}
                        disabled={pageDistributor === 1}
                        onClick={() =>
                        setPageDistributor((prev) => Math.max(prev - 1, 1))
                        }
                        style={{
                        opacity: pageDistributor === 1 ? 0.5 : 1,
                        cursor: pageDistributor === 1 ? "not-allowed" : "pointer",
                        }}
                    >
                        Trang trước
                    </button>

                    <span className={styles.firtPage}>
                        Trang {pageDistributor}
                    </span>

                    <button
                        className={styles.button}
                        disabled={distributorData.length < 10}
                        onClick={() => setPageDistributor((prev) => prev + 1)}
                        style={{
                        opacity: distributorData.length < 10 ? 0.5 : 1,
                        cursor:
                            distributorData.length < 10 ? "not-allowed" : "pointer",
                        }}
                    >
                        Trang sau
                    </button>
                </div>
            </div>
        </div>
        {showPopup && (
            <div className={styles.popupOverlay} onClick={() => setShowPopup(false)}>
                <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.popupTitle}>
                        <h3>
                            Chi tiết trúng thưởng
                        </h3>
                        <button
                            className={styles.button}
                            style={{ marginTop: 10 }}
                            onClick={() => setShowPopup(false)}
                        >
                            Đóng
                        </button>
                    </div>
                    <table className={styles.table}>
                        <thead>
                            <tr className={styles.headerTop}>
                                <th>Mã trúng</th>
                                <th>Sản phẩm</th>
                                <th>Thời gian</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUserDetail.map((item, index) => {
                                const date = new Date(item.thoidiemtrungthuong)
                                    return(
                                        
                                        <tr key={index}>
                                            <td>{item.ma || "-"}</td>
                                            <td>{item.tenphanthuong}</td>
                                            <td>{date.toLocaleDateString("vi-VN")}</td>
                                            <td>{item.trang_thai}</td>
                                        </tr>
                                    )
                            })}
                        </tbody>
                    </table>
                    <div className={styles.pageSeting}>
                        <button
                            className={styles.button}
                            disabled={pagePopupUs === 1}
                            onClick={() => setPagePopupUs((prev) => Math.max(prev - 1, 1))}
                            style={{
                            opacity: pagePopupUs === 1 ? 0.5 : 1,
                            cursor: pagePopupUs === 1 ? "not-allowed" : "pointer",
                            }}
                        >
                            Trang trước
                        </button>

                        <span className={styles.firtPage}>
                            Trang {pagePopupUs}
                        </span>

                        <button
                            className={styles.button}
                            disabled={filteredUserDetail.length < 20}
                            onClick={() => setPagePopupUs((prev) => prev + 1)}
                            style={{
                            opacity: filteredUserDetail.length < 20 ? 0.5 : 1,
                            cursor: filteredUserDetail.length < 20 ? "not-allowed" : "pointer",
                            }}
                        >
                            Trang sau
                        </button>
                    </div>
                </div>
            </div>
        )}
        {showShopPopup && (
            <div
                className={styles.popupOverlay}
                onClick={() => setShowShopPopup(false)}
            >
                <div
                className={styles.popup}
                onClick={(e) => e.stopPropagation()}
                >
                <div className={styles.popupTitle}>
                    <h3>Lịch sử đổi thưởng đại lý</h3>

                    <button
                    className={styles.button}
                    onClick={() => setShowShopPopup(false)}
                    >
                    Đóng
                    </button>
                </div>

                <table className={styles.table}>
                    <thead>
                    <tr className={styles.headerTop}>
                        <th>Tên khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Tên phần thưởng</th>
                        <th>Sự kiện</th>
                        <th>Số lượng</th>
                        <th>Trạng thái</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredShopHistory.map((item, index) => (
                        <tr key={index}>
                        <td>{item.hovaten || "Chưa cập nhật"}</td>
                        <td>{item.numberphone?.replace(/^84/, "0")}</td>
                        <td>{item.tenphanthuong}</td>
                        <td>{item.tensukien}</td>
                        <td>{item.soluong}</td>
                        <td>
                            {item.duyet_thuong === 1 ? "Đã duyệt" : "Chưa duyệt"}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className={pageSeting}>
                    <button
                        className={styles.button}
                        disabled = {pagePopupDis === 1}
                        onClick={() => setPagePopupDis((prev) => Math.max(prev -1, 1))}
                        style={{
                            opacity: pagePopupDis === 1 ? 0.5 : 1,
                            cursor: pagePopupDis === 1 ? "not-allowed" : "pointer",
                        }}
                    >
                        Trang trước
                    </button>
                    <span className={styles.firtPage}>
                        Trang {pagePopupDis}
                    </span>
                    <button
                        className={styles.button}
                        disabled={filteredShopHistory.length < 20}
                        onClick={() => setPagePopupDis((prev) => prev + 1)}
                        style={{
                        opacity: filteredShopHistory.length < 20 ? 0.5 : 1,
                        cursor: filteredShopHistory.length < 20 ? "not-allowed" : "pointer",
                        }}
                    >
                        Trang sau
                    </button>
                </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default EventReport;