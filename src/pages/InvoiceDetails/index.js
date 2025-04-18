import axios from "axios";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function InvoiceDetails() {
  const [data, setData] = useState([]);
  let params = useParams();

  useEffect(() => {
    const fetchs = async () => {
      const res = await axios.get(
        `https://dtweb.onrender.com/bill/${params.id}`,
        {
          withCredentials: true,
        }
      );
      setData(res.data);
    };
    fetchs();
  }, [params.id]);

  console.log(data);
  return (
    <div>
      <div className={`${styles.container}`}>
        <div className={`${styles.detailProduct}`}>
          <div className={`${styles.header}`}>
            <h3>
              Chi tiết đơn hàng {data._id} - {data.OrderStatus}
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
                      <td>Anh thế zinh - 0773915146</td>
                    </tr>
                    <tr>
                      <td>Địa chỉ: </td>
                      <td>Nha trang, Khánh hòa Nha trang, Khánh hòa</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className={styles.payment}>
                <h5>Hình thức thanh toán</h5>
                <p>{data.PaymentForm}</p>
              </div>
            </div>
          </div>
          <div className={styles.listProduct}>
            <h5>Thông tin sản phẩm</h5>
            {Array.isArray(data.products) ? data.products.map((item, index) => {
              return (
                <div className={styles.infoProduct}>
                  <div className={styles.imgName}>
                    <img src={item.img} alt="anh"></img>
                    <p>{item.name}</p>
                  </div>
                  <div className={styles.infoContent}>
                    <p>số lượng: {item.quantity}</p>
                    <p>Đơn giá: </p>
                  </div>
                </div>
              );
            }): ''}
          </div>
          <div className={styles.button}>
            <button className={styles.backHome}>
              Về trang danh sách đơn hàng
            </button>
            <button className={styles.cancelOrder}>Hủy đơn hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
