import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import ButtonOrderStatus from "../../../components/ButtonorrderStatus";

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
          OrderStatus: "đã xác nhận",
        },
        { withCredentials: true }
      );
      // Cập nhật lại danh sách đơn hàng sau khi xác nhận
      setOrders((prevOrders) => {
        return prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, OrderStatus: "đã xác nhận" }
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

    const handleConversion = async (orderId) => {
    try {
      const response = await axios.patch(
        `https://dtweb.onrender.com/bill/billstatus/${orderId}`,
        {
          OrderStatus: "đang giao hàng",
        },
        { withCredentials: true }
      );
      // Cập nhật lại danh sách đơn hàng 
      setOrders((prevOrders) => {
        return prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, OrderStatus: "đang giao hàng" }
            : order
        );
      });
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleConversionSuccsess = async (orderId) => {
    try {
      const response = await axios.patch(
        `https://dtweb.onrender.com/bill/billstatus/${orderId}`,
        {
          OrderStatus: "đã giao hàng",
        },
        { withCredentials: true }
      );
      // Cập nhật lại danh sách đơn hàng 
      setOrders((prevOrders) => {
        return prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, OrderStatus: "đã giao hàng" }
            : order
        );
      });
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleClick = async (selectedStatus) => {
    try {
      const response = await axios.get(
        `https://dtweb.onrender.com/bill?status=${selectedStatus}`,
        { withCredentials: true }
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <ButtonOrderStatus
          onStatusClick={handleClick}
          datastatus="chờ xác nhận"
          className={`btn btn-primary`}
        >
          chờ xác nhận
        </ButtonOrderStatus>
        <ButtonOrderStatus
          onStatusClick={handleClick}
          datastatus="đã xác nhận"
          className={`btn btn-info ms-2`}
        >
          đã xác nhận
        </ButtonOrderStatus>
        <ButtonOrderStatus
          onStatusClick={handleClick}
          datastatus="đang giao hàng"
          className={`btn btn-warning ms-2`}
        >
          đang vận chuyển
        </ButtonOrderStatus>
        <ButtonOrderStatus
          onStatusClick={handleClick}
          datastatus="hủy đơn hàng"
          className={`btn btn-danger ms-2`}
        >
          đơn hàng hủy
        </ButtonOrderStatus>
        <ButtonOrderStatus
          onStatusClick={handleClick}
          datastatus="đã giao hàng"
          className={`btn btn-success ms-2`}
        >
          đã giao hàng
        </ButtonOrderStatus>
      </div>
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
                  <NavLink
                    className={"text-primary"}
                    to={`/quan-tri/chi-tiet/${order._id}`}
                  >
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
                  <NavLink
                    to={`/quan-tri/chi-tiet/${order._id}`}
                    className={`btn btn-primary`}
                  >
                    Xem chi tiết
                  </NavLink>{" "}
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
                  {order.OrderStatus === "chờ xác nhận" ? (
                    <NavLink
                      onClick={() => handleCancelOrder(order._id)}
                      className={`btn btn-danger mt-1`}
                    >
                      Hủy đơn
                    </NavLink>
                  ) : (
                    ""
                  )}
                  {order.OrderStatus === "đã xác nhận" ? (
                    <NavLink
                      onClick={() => handleConversion(order._id)}
                      className={`btn btn-warning mt-1`}
                    >
                      giao vận chuyển
                    </NavLink>
                  ) : (
                    ""
                  )}
                  {order.OrderStatus === "đang giao hàng" ? (
                    <NavLink
                      onClick={() => handleConversionSuccsess(order._id)}
                      className={`btn btn-success mt-1`}
                    >
                      xác nhận giao thành công
                    </NavLink>
                  ) : (
                    ""
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
