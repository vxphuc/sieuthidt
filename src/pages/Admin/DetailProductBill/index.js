import { NavLink, useParams, useNavigate  } from "react-router-dom";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../../api/axios";

function DetailProductBill() {
  const { id } = useParams();
  const [order, setOrder] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await api.get(
        `/bill/${id}`,
        {
          withCredentials: true,
        }
      );
      setOrder(response.data);
    };
    fetchOrder();
  }, []);

  const handleclickreturn = () =>{
    navigate(-1)
  }
  return (
    <div>
      <div>
        <h3>chi tiết đơn hàng {id}</h3>
      </div>
      <div className={`row ${styles.infomationBill}`}>
        <div className="col-md-5 bg-light-subtle mt-3">
          <h5>Thông tin người nhận</h5>
          <div>
            <p>Người nhận: {order ? order.user.name : "đang tải..."}</p>
            <p>Số điện thoại: {order? order.user.numberPhone : 'đang tải...'}</p>
            <p>
              Địa chỉ:{" "}
              {order
                ? `${order.bill.road}, ${order.bill.ward}, ${order.bill.District}, ${order.bill.province}`
                : "đang tải..."}
            </p>
          </div>
        </div>
        <div className="col-md-6 bg-light-subtle mt-3">
          <h5>Thông tin đơn hàng</h5>
          <div>
            <p>
              Ngày đặt hàng:{" "}
              {order
                ? new Date(order.bill.createDate).toLocaleString("vi-VN")
                : "đang tải..."}
            </p>
            <p>
              Trạng thái đơn hàng:{" "}
              <span className="text-danger">
                {order ? order.bill.OrderStatus : "đang tải..."}
              </span>
            </p>
            <p>
              Tổng tiền:{" "}
              {order
                ? Number.parseFloat(
                    order.bill.Intomoney.$numberDecimal
                  ).toLocaleString()
                : "đang tải..."}
            </p>
            <p>
              Phương thức thanh toán:{" "}
              <span className="text-warning">
                {order ? order.bill.PaymentForm : "đang tải..."}
              </span>
            </p>
            <p>
              Trạng thái thanh toán:{" "}
              <span className={`${order ? order.bill.statusPay === "chưa thanh toán" ? "text-danger" : "text-success" : "text-warning"}`}>
                {order ? order.bill.statusPay : "đang tải..."}
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 bg-light-subtle">
        <div>
          {order.bill && Array.isArray(order.bill.products)
            ? order.bill.products.map((product, index) => {
              return (
                <div className="row">
                  <div className="col-md-2 mt-2 ms-2">
                    <div><img src={product.img} width='100%' height="100%"></img></div>
                  </div>
                  <div className="col-md-8 mt-2">
                    <h5 className="text-start">{product.name}</h5>
                    <p>số lượng: {product.quantity}</p>
                    <p>đơn giá: {Number.parseFloat(product.price.$numberDecimal).toLocaleString()}</p>
                  </div>
                </div>
              )
            })
            : ""}
        </div>
      </div>
      <div className="mt-4 text-center ">
            <NavLink className={`btn btn-primary`} onClick={handleclickreturn}>Quay về</NavLink>
      </div>
    </div>
  );
}

export default DetailProductBill;
