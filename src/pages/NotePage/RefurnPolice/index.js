import styles from "./Refurn.module.css";
function RefurnPolice() {
    return(
        <div className={styles.containerRefurn}>
            {/* Tiêu đề chính */}
            <h3 className={styles.mainTitleRefurn}>CHÍNH SÁCH ĐỔI TRẢ HOÀN TIỀN</h3>

            {/* Mục 1 */}
            <div className={styles.section}>
                <h5 className={styles.subTitle}>1. Điều kiện đổi trả</h5>
                <p className={styles.text}>
                    Quý Khách hàng cần kiểm tra tình trạng hàng hóa và có thể đổi hàng/ trả lại hàng ngay tại thời điểm giao/nhận hàng trong những trường hợp sau:
                </p>
                <p className={styles.text}>
                    - Hàng không đúng chủng loại, mẫu mã trong đơn hàng đã đặt hoặc như trên website tại thời điểm đặt hàng.
                </p>
                <p className={styles.text}>
                    - Không đủ số lượng, không đủ bộ như trong đơn hàng.
                </p>
                <p className={styles.text}>
                    - Tình trạng bên ngoài bị ảnh hưởng như rách bao bì, bong tróc, bể vỡ…
                </p>
                <p className={styles.text}>
                    Khách hàng có trách nhiệm trình giấy tờ liên quan chứng minh sự thiếu sót trên để hoàn thành việc hoàn trả/đổi trả hàng hóa.
                </p>
            </div>

            {/* Mục 2 */}
            <div className={styles.section}>
                <h5 className={styles.subTitle}>2. Quy định về thời gian thông báo và gửi sản phẩm đổi trả</h5>
                <p className={styles.text}>
                    <strong className={styles.bold}>Thời gian thông báo đổi trả:</strong> trong vòng 48h kể từ khi nhận sản phẩm đối với trường hợp sản phẩm thiếu phụ kiện, quà tặng hoặc bể vỡ.
                </p>
                <p className={styles.text}>
                    <strong className={styles.bold}>Thời gian gửi chuyển trả sản phẩm:</strong> trong vòng 14 ngày kể từ khi nhận sản phẩm.
                </p>
                <p className={styles.text}>
                    <strong className={styles.bold}>Địa điểm đổi trả sản phẩm:</strong> Khách hàng có thể mang hàng trực tiếp đến văn phòng/ cửa hàng của chúng tôi hoặc chuyển qua đường bưu điện.
                </p>
                <p className={styles.text}>
                    Trong trường hợp Quý Khách hàng có ý kiến đóng góp/khiếu nại liên quan đến chất lượng sản phẩm, Quý Khách hàng vui lòng liên hệ đường dây chăm sóc khách hàng của chúng tôi.
                </p>
            </div>

            {/* Mục 3 */}
            <div className={styles.section}>
                <h5 className={styles.subTitle}>3. Hình thức đổi trả</h5>
                <p className={styles.text}>
                    - Chúng tôi thực hiện đổi hàng hóa đúng loại sản phẩm mà khách hàng đặt đối với sản phẩm giao sai hàng/ sai số lượng hoặc khi phát sinh sản phẩm không đạt cam kết.
                </p>
                <p className={styles.text}>
                    - Đổi sản phẩm khác có giá trị tương đương cho khách hàng trong trường hợp sản phẩm khách hàng đã đặt hết hàng nếu khách hàng đồng ý. Trường hợp khách hàng không còn nhu cầu nữa do lỗi hàng hóa hoặc không đồng ý với hàng hóa được đổi lại công ty sẽ hoàn phí cho khách hàng bằng hình thức chuyển khoản hoặc theo phương thức thỏa thuận với khách hàng trong vòng 07 ngày làm việc kể từ ngày nhận được yêu cầu.
                </p>
            </div>
        </div>
    );
};
export default RefurnPolice;