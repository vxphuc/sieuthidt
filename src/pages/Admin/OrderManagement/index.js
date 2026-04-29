import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ButtonOrderStatus from "../../../components/ButtonorrderStatus";
import api from "../../../api/axios";
import styles from "./orderManagement.module.css";

const ORDER_STATUS = {
  WAITING: "chờ xác nhận",
  CONFIRMED: "đã xác nhận",
  SHIPPING: "đang giao hàng",
  CANCELED: "hủy đơn hàng",
  DELIVERED: "đã giao hàng",
};

function OrderManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/bill", {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.patch(
        `/bill/billstatus/${orderId}`,
        { OrderStatus: status },
        { withCredentials: true }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, OrderStatus: status } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleClick = async (selectedStatus) => {
    try {
      const response = await api.get(`/bill?status=${selectedStatus}`, {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case ORDER_STATUS.WAITING:
        return styles.statusWaiting;
      case ORDER_STATUS.CONFIRMED:
        return styles.statusConfirmed;
      case ORDER_STATUS.SHIPPING:
        return styles.statusShipping;
      case ORDER_STATUS.CANCELED:
        return styles.statusCanceled;
      case ORDER_STATUS.DELIVERED:
        return styles.statusDelivered;
      default:
        return styles.statusDefault;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Quản lý đơn hàng</h2>
            <p className={styles.subtitle}>
              Theo dõi trạng thái và xử lý các đơn hàng trong hệ thống
            </p>
          </div>
        </div>

        <div className={styles.statusFilter}>
          <ButtonOrderStatus
            onStatusClick={handleClick}
            datastatus={ORDER_STATUS.WAITING}
            className={`${styles.filterButton} ${styles.filterPrimary}`}
          >
            Chờ xác nhận
          </ButtonOrderStatus>
          <ButtonOrderStatus
            onStatusClick={handleClick}
            datastatus={ORDER_STATUS.CONFIRMED}
            className={`${styles.filterButton} ${styles.filterInfo}`}
          >
            Đã xác nhận
          </ButtonOrderStatus>
          <ButtonOrderStatus
            onStatusClick={handleClick}
            datastatus={ORDER_STATUS.SHIPPING}
            className={`${styles.filterButton} ${styles.filterWarning}`}
          >
            Đang vận chuyển
          </ButtonOrderStatus>
          <ButtonOrderStatus
            onStatusClick={handleClick}
            datastatus={ORDER_STATUS.CANCELED}
            className={`${styles.filterButton} ${styles.filterDanger}`}
          >
            Đơn hàng hủy
          </ButtonOrderStatus>
          <ButtonOrderStatus
            onStatusClick={handleClick}
            datastatus={ORDER_STATUS.DELIVERED}
            className={`${styles.filterButton} ${styles.filterSuccess}`}
          >
            Đã giao hàng
          </ButtonOrderStatus>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Mã đơn hàng</th>
                <th scope="col">Tên khách hàng</th>
                <th scope="col">Số điện thoại</th>
                <th scope="col">Địa chỉ giao hàng</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Ngày đặt</th>
                <th scope="col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => {
                  const intoMoney = order.Intomoney?.$numberDecimal || 0;
                  const totalPrice = Number.parseFloat(intoMoney).toLocaleString(
                    "vi-VN",
                    {
                      style: "currency",
                      currency: "VND",
                    }
                  );

                  return (
                    <tr key={order._id}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        <NavLink
                          className={styles.orderLink}
                          to={`/quan-tri/chi-tiet/${order._id}`}
                        >
                          {order._id}
                        </NavLink>
                      </td>
                      <td className={styles.customerName}>{order.UserName}</td>
                      <td>{order.phoneNumber}</td>
                      <td>{`${order.road}, ${order.ward}, ${order.province}`}</td>
                      <td className={styles.totalPrice}>{totalPrice}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${getStatusClass(order.OrderStatus)}`}>
                          {order.OrderStatus}
                        </span>
                      </td>
                      <td>{new Date(order.createDate).toLocaleDateString("vi-VN")}</td>
                      <td>
                        <div className={styles.actionGroup}>
                          <NavLink
                            to={`/quan-tri/chi-tiet/${order._id}`}
                            className={`${styles.actionButton} ${styles.actionOutline}`}
                          >
                            Xem chi tiết
                          </NavLink>

                          {order.OrderStatus === ORDER_STATUS.WAITING && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  updateOrderStatus(order._id, ORDER_STATUS.CONFIRMED)
                                }
                                className={`${styles.actionButton} ${styles.actionSuccess}`}
                              >
                                Xác nhận
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateOrderStatus(order._id, ORDER_STATUS.CANCELED)
                                }
                                className={`${styles.actionButton} ${styles.actionDanger}`}
                              >
                                Hủy đơn
                              </button>
                            </>
                          )}

                          {order.OrderStatus === ORDER_STATUS.CONFIRMED && (
                            <button
                              type="button"
                              onClick={() =>
                                updateOrderStatus(order._id, ORDER_STATUS.SHIPPING)
                              }
                              className={`${styles.actionButton} ${styles.actionWarning}`}
                            >
                              Giao vận chuyển
                            </button>
                          )}

                          {order.OrderStatus === ORDER_STATUS.SHIPPING && (
                            <button
                              type="button"
                              onClick={() =>
                                updateOrderStatus(order._id, ORDER_STATUS.DELIVERED)
                              }
                              className={`${styles.actionButton} ${styles.actionSuccess}`}
                            >
                              Xác nhận giao thành công
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className={styles.emptyRow}>
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;