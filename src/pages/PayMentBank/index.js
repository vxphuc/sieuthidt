import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

function PayMentBank() {
  return (
    <div className={`${styles.PayMentBank}`}>
      <div className={`${styles.payMenMetho}`}>
        <div className={`${styles.header}`}>
            <h2><FontAwesomeIcon icon={faCircleCheck} style={{ marginRight: "8px", color: "green" }} />
             Đặt hàng thành công</h2>
        </div>
        <div className={`${styles.typepayment}`}>
            <button>
                <div>
                    <p>Chờ xác nhận thanh toán <strong>Chuyển Khoản</strong></p>
                </div>
                <div>
                    <p>Đơn này sẽ được giao cho anh zinh và thanh toán tiền mặt cho đến khi chuyển khoản thành công</p>
                </div>
            </button>
        </div>
        <div className={`${styles.ifm}`}>
            <strong >Thông tin chuyển khoản</strong>
            <div className={`${styles.paymentInfo}`}>
                <table>
                    <tr>
                        <td>Ngân hàng:</td>
                        <td className={`${styles.tdin}`}>Viettinbank</td>
                    </tr>
                    <tr>
                        <td>Số tài khoản:</td>
                        <td className={`${styles.tdin}`}>09999999999 <button>sao chép</button></td>
                    </tr>
                    <tr>
                        <td>Người hưởng thụ:</td>
                        <td className={`${styles.tdin}`}>Zinh cắn ác</td>
                    </tr>
                    <tr>
                        <td>Số tiền:</td>
                        <td className={`${styles.tdin}`}>1.000.000.000đ <button>sao chép</button></td>
                    </tr>
                    <tr>
                        <td>Nội dung:</td>
                        <td className={`${styles.tdin}`}>zinh quá tệ</td>
                    </tr>
                </table>
                <p className={`${styles.contact}`}>Cần hỗ trợ vui lòng liên hệ: <a href="#">099 899</a></p>
            </div>
        </div>
        <div>
            
        </div>
      </div>
    </div>
  );
}

export default PayMentBank;
