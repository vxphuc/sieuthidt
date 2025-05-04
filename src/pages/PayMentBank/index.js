import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";

function PayMentBank() {
  const { id } = useParams();
  const bank_id = process.env.REACT_APP_BANK_ID;
  const ACCOUNT_NO = process.env.REACT_APP_ACCOUNT_NO;
  const [bill, setBill] = useState([]);
  const navigate = useNavigate();
  console.log(bill);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`https://dtweb.onrender.com/bill/${id}`, {
        withCredentials: true,
      })
      .then((res) => setBill(res.data))
      .catch((err) => console.log(err));
  }, []);
  console.log(bill);
  const cleanAmount = bill.Intomoney
    ? Number(bill.Intomoney.$numberDecimal.replace(/[.,₫\s]/g, ""))
    : 0;
  const qrUrl = `https://img.vietqr.io/image/${bank_id}-${ACCOUNT_NO}-compact2.png?amount=${cleanAmount}&addInfo=${bill._id}&accountName=Phung The Vinh`;

  useEffect(() => {
    if (!bill._id || !bill.Intomoney) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.post(
          `https://dtweb.onrender.com/webhook/check`,{
            id: bill._id,
          }
        );
        console.log(res.data);
        if (res.data.code === 200) {
          clearInterval(interval); // ✅ Dừng kiểm tra
          alert("✅ Thanh toán đã được xác nhận!"); // hoặc set trạng thái để hiển thị lên UI
          await axios.patch(`https://dtweb.onrender.com/bill/status/${id}`,{},{
            withCredentials: true
          })
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));
          navigate('/')
        }
      } catch (err) {
        console.error("Lỗi kiểm tra thanh toán:", err.message);
      }
    }, 5000); // mỗi 15 giây kiểm tra 1 lần

    return () => clearInterval(interval); // cleanup khi component bị unmount
  }, [bill]);

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
                  {bill.Intomoney?.$numberDecimal} <button>sao chép</button>
                </td>
              </tr>
              <tr>
                <td>Nội dung chuyển khoản:</td>
                <td className={`${styles.tdin}`}>{bill._id}<button>sao chép</button></td>
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
        <div className={`${styles.instruction} container`}>
          <strong>Hướng dẫn thanh toán</strong>
          <p>1. Mở ứng dụng ngân hàng của bạn</p>
          <p>2. Chọn chức năng quét mã QR</p>
          <p>3. Quét mã QR bên trên</p>
          <p>4. Nhập số tiền và nội dung chuyển khoản</p>
          <p>5. Nhấn nút thanh toán</p>
          <p>6. Chờ xác nhận thanh toán</p>
          </div>
        <div className={`${styles.detail}`}>
          <NavLink to={'/'} className={`${styles.home}`}>Trang chủ</NavLink>
          <button className={`${styles.defaul}`}>Xem đơn hàng</button>
        </div>
      </div>
    </div>
  );
}

export default PayMentBank;
