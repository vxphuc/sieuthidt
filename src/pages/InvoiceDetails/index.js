import api from "../../api/axios";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

function InvoiceDetails() {
  const [data, setData] = useState({});
  let params = useParams();

    // Hàm lấy dữ liệu đơn hàng
  const fetchOrder = async () => {
    const res = await api.get(
      `/bill/${params.id}`,
      {
        withCredentials: true,
      }
    );
    setData(res.data);
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const cancelOrder = async () => {
    try {
      await api.patch(
        `/bill/cancel/${params.id}`,
        {},
        {
          withCredentials: true,
        }
      );
      await fetchOrder();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className={`${styles.container}`}>
        <div className={`${styles.detailProduct}`}>
          <div className={`${styles.header}`}>
            <h3>
              Chi tiết đơn hàng{" "}
              {data.bill
                ? `${data.bill._id} - ${data.bill.OrderStatus}`
                : "đang tải..."}
            </h3>
          </div>
          <div className={styles.info}>
            <div className={styles.infoBox}>
              <div className={styles.user}>
                <h5>Thông tin nhận hàng</h5>
                <table>
                  <tbody>
                    <tr>
                      <td>Người nhận: </td>
                      <td>
                        {data.bill
                          ? `${data.bill.UserName} - ${data.user.numberPhone}`
                          : "đang tải..."}
                      </td>
                    </tr>
                    <tr>
                      <td>Địa chỉ: </td>
                      <td>
                        {data.bill
                          ? `${data.bill.road} - ${data.bill.ward} - ${data.bill.province}`
                          : "đang tải..."}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.payment}>
                <h5>Hình thức thanh toán</h5>
                <p>{data.bill ? data.bill.PaymentForm : "đang tải..."}</p>
                <p className={(data?.bill?.statusPay === 'chưa thanh toán' ? 'text-danger' : 'text-success-emphasis')}>{data.bill ? data.bill.statusPay : "đang tải..."}</p>
                {
                  data?.bill?.statusPay === "chưa thanh toán" && data?.bill?.OrderStatus === 'chờ xác nhận' ? (<NavLink to={`/gio-hang/thanh-toan/${params.id}`} className={'btn btn-primary'}>Thanh toán bằng ngân hàng</NavLink>) : "" 
                }
              </div>
            </div>
          </div>
          <div className={styles.listProduct}>
            <h5>Thông tin sản phẩm</h5>
            {data.bill && Array.isArray(data.bill.products)
              ? data.bill.products.map((item, index) => {
                  return (
                    <div key={item._id} className={styles.infoProduct}>
                      <div className={styles.imgName}>
                        <img src={item.img} alt="anh"></img>
                        <p>{item.name}</p>
                      </div>
                      <div className={styles.infoContent}>
                        <p>số lượng: {item.quantity}</p>
                        <p>
                          Đơn giá:{" "}
                          {Number.parseFloat(
                            item.price.$numberDecimal
                          ).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
          <div className={styles.button}>
            <NavLink
              to={"/thong-tin-khach-hang/hoa-don"}
              className={styles.backHome}
            >
              Về trang danh sách đơn hàng
            </NavLink>
            {data.bill && data.bill.OrderStatus === "chờ xác nhận" ? (
              <button onClick={cancelOrder} className={styles.cancelOrder}>
                Hủy đơn hàng
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
