import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../../api/axios";
import { faBilibili } from "@fortawesome/free-brands-svg-icons";
import { io } from "socket.io-client";
import BackgroundPopup from "../../components/BackgroundPopup";

function PayMentBank() {
  const { id } = useParams();
  const bank_id = process.env.REACT_APP_BANK_ID;
  const ACCOUNT_NO = process.env.REACT_APP_ACCOUNT_NO;
  const [bill, setBill] = useState({});
  const navigate = useNavigate();
  let data = bill.bill ? bill.bill : bill;
  const [socketInstance, setSocketInstance] = useState(null);
  const [popupSuccess, setPopupSuccess] = useState(false);

  const handleCopy = (text) => {
    if (!navigator.clipboard) {
      alert("Trình duyệt của bạn không hỗ trợ copy!");
      return;
    }
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Đã sao chép!"))
      .catch((err) => alert("Sao chép thất bại!"));
  };

 useEffect(() => {
  const socket = io("https://sieuthidt.io.vn", {
    transports: ["websocket", "polling"],
    withCredentials: true,
  });

  setSocketInstance(socket);

  return () => socket.disconnect();
}, []);

useEffect(() => {
  if (!socketInstance || !id) return;

  socketInstance.emit("join-order", id);

  const handler = (data) => {
    console.log("Realtime:", data);
    if (data.status === "PAID") {
      setPopupSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  socketInstance.on("payment-status", handler);

  return () => {
    socketInstance.off("payment-status", handler);
  };
}, [socketInstance, id]);


  useEffect(() => {
    if (!id) return;
    api
      .get(`/bill/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        // Thêm dòng này
        setBill(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);
  const qrUrl = `https://img.vietqr.io/image/970422-0001856423848-compact2.png?amount=${data.Intomoney?.$numberDecimal}&addInfo=${data._id}&accountName=Phung The Vinh`;

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
              <p>
                Đơn này sẽ được giao cho {bill?.user?.name} và thanh toán bằng
                chuyển khoản
              </p>
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
                  0001856423848
                  <button
                    type="button"
                    onClick={() => handleCopy("0001856423848")}
                  >
                    sao chép
                  </button>
                </td>
              </tr>
              <tr>
                <td>Người hưởng thụ:</td>
                <td className={`${styles.tdin}`}>Phung The Vinh</td>
              </tr>
              <tr>
                <td>Số tiền:</td>
                <td className={`${styles.tdin}`}>
                  {data.Intomoney?.$numberDecimal}
                  <button
                    type="button"
                    onClick={() => handleCopy(data.Intomoney?.$numberDecimal)}
                  >
                    sao chép
                  </button>
                </td>
              </tr>
              <tr>
                <td>Nội dung chuyển khoản:</td>
                <td className={`${styles.tdin}`}>
                  {data._id}
                  <button type="button" onClick={() => handleCopy(data._id)}>
                    sao chép
                  </button>
                </td>
              </tr>
            </table>
            <p className={`${styles.contact}`}>
              Cần hỗ trợ vui lòng liên hệ: <a href="#">0977172851</a>
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
          <NavLink to={"/"} className={`${styles.home}`}>
            Trang chủ
          </NavLink>
          <NavLink to={`/thong-tin-khach-hang/hoa-don/${bill.bill?._id}`}>
            <button className={`${styles.defaul}`}>Xem đơn hàng</button>
          </NavLink>
        </div>
        {popupSuccess && (
          <div>
            <BackgroundPopup className={`${styles.popupSuccess || ""}`}>
              <div className={`${styles.popUp}`}>
                <div className={styles.checkIcon}>
                  <img
                    src="https://i.gifer.com/7efs.gif"
                    alt="Success"
                    style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "100%",
                            objectFit: "contain",
                          }}
                  />
                </div>
                <h3 className="text-success">Đặt Hàng Thành Công!</h3>
              </div>
            </BackgroundPopup>
          </div>
        )}
      </div>
    </div>
  );
}

export default PayMentBank;
