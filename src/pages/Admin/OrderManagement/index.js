import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function OrderManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://dtweb.onrender.com/bill", {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleConfirmOrder = async (orderId) => {
    try {
      const response = await axios.patch(
        `https://dtweb.onrender.com/bill/billstatus/${orderId}`,
        {
          OrderStatus: "Đã xác nhận",
        },
        { withCredentials: true }
      );
      // Cập nhật lại danh sách đơn hàng sau khi xác nhận
      setOrders((prevOrders) => {
        return prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, OrderStatus: "Đã xác nhận" }
            : order
        );
      });
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.patch(
        `https://dtweb.onrender.com/bill/billstatus/${orderId}`,
        {
          OrderStatus: "hủy đơn hàng",
        },
        { withCredentials: true }
      );
      // Cập nhật lại danh sách đơn hàng sau khi hủy
      setOrders((prevOrders) => {
        return prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, OrderStatus: "hủy đơn hàng" }
            : order
        );
      });
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  return (
    <div>
      <table class="table table-striped table-bordered table-hover table-sm">
        <thead>
          <tr class="table-info">
            <th scope="col">#</th>
            <th scope="col">Mã đơn hàng</th>
            <th scope="col">Tên khách hàng</th>
            <th scope="col">Số điện thoại</th>
            <th scope="col">Địa chỉ giao hàng</th>
            <th scope="col">Tổng tiền đơn hàng</th>
            <th scope="col">Trạng thái đơn</th>
            <th scope="col">Ngày đặt hàng</th>
            {/* Nút thao tác như: Xem chi tiết / Xác nhận đơn / Hủy đơn / In đơn */}
            <th scope="col">Thao tác</th>
            {/* Nút thao tác như: Xem chi tiết / Xác nhận đơn / Hủy đơn / In đơn */}
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            const Intomoney = order.Intomoney.$numberDecimal;
            const totalPrice = Number.parseFloat(Intomoney).toLocaleString(
              "vi-VN",
              {
                style: "currency",
                currency: "VND",
              }
            );
            return (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                  <NavLink className={"text-primary"} to={"/"}>
                    {order._id}
                  </NavLink>
                </td>
                <td>{order.userInfo.name}</td>
                <td>{order.userInfo.numberPhone}</td>
                <td>{`${order.road}, ${order.ward}, ${order.District}, ${order.province}`}</td>
                <td>{totalPrice}</td>
                <td>{order.OrderStatus}</td>
                <td>{new Date(order.createDate).toLocaleDateString()}</td>
                <td className="text-center">
                  <NavLink className={`btn btn-primary`}>Xem chi tiết</NavLink>{" "}
                  {order.OrderStatus === "chờ xác nhận" ? (
                    <NavLink
                      onClick={() => handleConfirmOrder(order._id)}
                      className={`btn btn-success mt-1`}
                    >
                      Xác nhận
                    </NavLink>
                  ) : (
                    ""
                  )}
                  {order.OrderStatus === "hủy đơn hàng" ? (
                    ""
                  ) : (
                    <NavLink
                      onClick={() => handleCancelOrder(order._id)}
                      className={`btn btn-danger mt-1`}
                    >
                      Hủy đơn
                    </NavLink>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderManagement;
