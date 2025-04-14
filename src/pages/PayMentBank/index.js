import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PayMentBank() {
  const { id } = useParams();
  const bank_id = process.env.REACT_APP_BANK_ID;
  const ACCOUNT_NO = process.env.REACT_APP_ACCOUNT_NO;
  const CASSO_Getpage = process.env.REACT_APP_API_CASSO_Getpage;
  const ApiKey = process.env.REACT_APP_API_CASSO;
  const [bill, setBill] = useState([]);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`https://web-dt.onrender.com/bill/${id}`,{
        withCredentials: true
      })
      .then((res) => setBill(res.data))
      .catch((err) => console.log(err));
  }, []);
  const cleanAmount = bill.Intomoney ? Number(bill.Intomoney.replace(/[.,₫\s]/g, "")) : 0;
  const qrUrl = `https://img.vietqr.io/image/${bank_id}-${ACCOUNT_NO}-compact2.png?amount=${cleanAmount}&addInfo=${bill._id}&accountName=Phung The Vinh`;
  
  return (
    <div className={`${styles.PayMentBank}`}>
      <div className={`${styles.payMenMetho}`}>
        <div className={`${styles.header}`}>
          <h2>
            <FontAwesomeIcon
              icon={faCircleCheck}
              style={{ marginRight: "8px", color: "green" }}
            />
            Đặt hàng thành công
          </h2>
        </div>
        <div className={`${styles.typepayment}`}>
          <button>
            <div>
              <p>
                Chờ xác nhận thanh toán <strong>Chuyển Khoản</strong>
              </p>
            </div>
            <div>
              <p>Đơn này sẽ được giao cho anh zinh và thanh toán tiền mặt</p>
            </div>
          </button>
        </div>
        <div className={`${styles.ifm}`}>
          <strong>Thông tin chuyển khoản</strong>
          <div className={`${styles.paymentInfo}`}>
            <table>
              <tr>
                <td>Ngân hàng:</td>
                <td className={`${styles.tdin}`}>MBBank</td>
              </tr>
              <tr>
                <td>Số tài khoản:</td>
                <td className={`${styles.tdin}`}>
                  {ACCOUNT_NO} <button>sao chép</button>
                </td>
              </tr>
              <tr>
                <td>Người hưởng thụ:</td>
                <td className={`${styles.tdin}`}>Phung The Vinh</td>
              </tr>
              <tr>
                <td>Số tiền:</td>
                <td className={`${styles.tdin}`}>
                  {bill.Intomoney} <button>sao chép</button>
                </td>
              </tr>
              <tr>
                <td>Nội dung:</td>
                <td className={`${styles.tdin}`}>{bill._id}</td>
              </tr>
            </table>
            <p className={`${styles.contact}`}>
              Cần hỗ trợ vui lòng liên hệ: <a href="#">099 899</a>
            </p>
          </div>
        </div>
        <div className={`${styles.qrcode}`}>
          <img src={qrUrl}></img>
        </div>
        <div className={`${styles.ifm}`}>
          <div className={`${styles.paymentInfo}`}>
            <table>
              <tr>
                <td>Ngân hàng:</td>
                <td className={`${styles.tdin}`}>Viettinbank</td>
              </tr>
              <tr>
                <td>Số tài khoản:</td>
                <td className={`${styles.tdin}`}>
                  09999999999 <button>sao chép</button>
                </td>
              </tr>
              <tr>
                <td>Người hưởng thụ:</td>
                <td className={`${styles.tdin}`}>Zinh cắn ác</td>
              </tr>
              <tr>
                <td>Số tiền:</td>
                <td className={`${styles.tdin}`}>
                  1.000.000.000đ <button>sao chép</button>
                </td>
              </tr>
              <tr>
                <td>Nội dung:</td>
                <td className={`${styles.tdin}`}>zinh quá tệ</td>
              </tr>
            </table>
            <p className={`${styles.contact}`}>
              Cần hỗ trợ vui lòng liên hệ: <a href="#">099 899</a>
            </p>
          </div>
        </div>
        <div className={`${styles.detail}`}>
          <button className={`${styles.home}`}>Trang chủ</button>
          <button className={`${styles.defaul}`}>Xem đơn hàng</button>
        </div>
      </div>
    </div>
  );
}

export default PayMentBank;
