import React from "react";
import styles from "./PaymentPolice.module.css";
function PaymentPolice() {
    return(
        <div className={styles.containerPaymentPolice}>
            <h2 className={styles.titlePaymentPolice}>CHÍNH SÁCH THANH TOÁN</h2>
            
            <p className={styles.textBlockPaymentPolice}>
                Có 3 hình thức thanh toán, khách hàng có thể lựa chọn hình thức thuận tiện và phù hợp với mình nhất:
            </p>

            {/* Danh sách các cách thanh toán */}
            <div className={styles.methodListPaymentPolice}>
                <p className={styles.methodItemPaymentPolice}>
                    <strong>Cách 1: Thanh toán tiền mặt trực tiếp địa chỉ của chúng tôi:</strong> Khách hàng mua hàng tại địa điểm kinh doanh của chúng tôi, tại đây KH có thể thanh toán trực tiếp.
                </p>
                <p className={styles.methodItemPaymentPolice}>
                    <strong>Cách 2: Thanh toán khi nhận hàng (COD):</strong> Với hình thức này khách hàng xem hàng tại nhà, thanh toán tiền mặt cho nhân viên giao nhận hàng.
                </p>
                <p className={styles.methodItemPaymentPolice}>
                    <strong>Cách 3: Chuyển khoản trước:</strong> Quý khách chuyển khoản trước, sau đó chúng tôi tiến hành giao hàng theo thỏa thuận hoặc hợp đồng với Quý khách.
                </p>
            </div>

            {/* Thông tin tài khoản */}
            <div className={styles.bankInfoPaymentPolice}>
                <p className={styles.boldPaymentPolice}>Thông tin tài khoản</p>
                <p className={styles.companyNamePaymentPolice}>Công Ty TNHH DT FOOD</p>
                <p className={styles.textBlockPaymentPolice}>
                    <strong>Số tài khoản: 114808088888</strong> - Ngân hàng Vietinbank - CN Khánh Hoà
                </p>
            </div>

            {/* Phần Lưu ý */}
            <div className={styles.noteSectionPaymentPolice}>
                <p className={styles.boldPaymentPolice}>• Lưu ý</p>
                <p className={styles.textBlockPaymentPolice}>
                    Nội dung chuyển khoản: ghi rõ <strong>Số điện thoại</strong> hoặc <strong>Số đơn hàng</strong>.
                </p>
                <p className={styles.textBlockPaymentPolice}>
                    Sau khi chuyển khoản, chúng tôi sẽ liên hệ xác nhận và tiến hành giao hàng.
                </p>
                <p className={styles.textBlockPaymentPolice}>
                    Nếu sau thời gian thỏa thuận mà chúng tôi không giao hàng hoặc không phản hồi lại, quý khách có thể gửi khiếu nại trực tiếp về địa chỉ trụ sở.
                </p>
                <p className={styles.textBlockPaymentPolice}>
                    Đối với khách hàng có nhu cầu mua số lượng lớn để kinh doanh hoặc buôn sỉ vui lòng liên hệ trực tiếp với chúng tôi để có chính sách giá cả hợp lý. Và việc thanh toán sẽ được thực hiện theo hợp đồng.
                </p>
            </div>

            {/* Cam kết cuối */}
            <p className={`${styles.textBlockPaymentPolice} ${styles.boldPaymentPolice}`} style={{ marginTop: "20px" }}>
                Chúng tôi cam kết kinh doanh minh bạch, hợp pháp, bán hàng chất lượng, có nguồn gốc.
            </p>
        </div>
    );
};
export default PaymentPolice;