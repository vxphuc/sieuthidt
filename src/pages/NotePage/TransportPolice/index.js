import styles from "./Transport.module.css";
function TransportPolice() {
    return(
        <div className={styles.containerTransportPolice}>
            <h3 className={styles.titleTransportPolice}>CHÍNH SÁCH VẬN CHUYỂN - GIAO NHẬN</h3>
            <div>
                <h5 className={styles.sectionTitle}>a) Các phương thức giao hàng</h5>
                <p >Chúng tôi sử dụng 02 phương thức giao hàng:</p>
                <p>- Khách hàng mua trực tiếp hàng tại công ty, cửa hàng của chúng tôi.</p>
                <p>- Ship hàng.</p>
            </div>

            {/* Mục b */}
            <div>
                <h5 className={styles.sectionTitle}>b) Thời hạn ước tính cho việc giao hàng</h5>
                <p className={styles.textBlock}>
                    Thông thường sau khi nhận được thông tin đặt hàng chúng tôi sẽ xử lý đơn hàng trong vòng 24h và phản hồi lại thông tin cho khách hàng về việc thanh toán và giao nhận.
                </p>
                <p className={styles.textBlock}>
                    Thời gian giao hàng thường trong khoảng từ 3-5 ngày kể từ ngày chốt đơn hàng hoặc theo thỏa thuận với khách khi đặt hàng.
                </p>
                <p className={styles.textBlock}>
                    Tuy nhiên, cũng có trường hợp việc giao hàng kéo dài hơn nhưng chỉ xảy ra trong những tình huống bất khả kháng như sau:
                </p>
                <p>- Nhân viên chúng tôi liên lạc với khách hàng qua điện thoại không được nên không thể giao hàng.</p>
                <p>- Địa chỉ giao hàng bạn cung cấp không chính xác hoặc khó tìm.</p>
                <p>- Số lượng đơn hàng tăng đột biến khiến việc xử lý đơn hàng bị chậm.</p>
                <p>- Đối tác cung cấp hàng chậm hơn dự kiến khiến việc giao hàng bị chậm lại hoặc đối tác vận chuyển giao hàng bị chậm.</p>
                <p className={styles.textBlock}>
                    Về phí vận chuyển, chúng tôi sử dụng dịch vụ vận chuyển ngoài nên cước phí vận chuyển sẽ được tính theo phí của các đơn vị vận chuyển tùy vào vị trí và khối lượng của đơn hàng, khi liên hệ lại xác nhận đơn hàng với khách sẽ báo mức phí cụ thể cho khách hàng.
                </p>
            </div>

            <div>
                <h5 className={styles.sectionTitle}>c) Các giới hạn về mặt địa lý cho việc giao hàng</h5>
                <p className={styles.textBlock}>
                    Riêng khách tỉnh có nhu cầu mua số lượng lớn hoặc khách buôn sỉ nếu có nhu cầu mua sản phẩm, chúng tôi sẽ nhờ dịch vụ giao nhận của các công ty vận chuyển và phí sẽ được tính theo phí của các đơn vị cung cấp dịch vụ vận chuyển hoặc theo thỏa thuận hợp đồng giữa 2 bên.
                </p>
            </div>

            {/* Mục d */}
            <div>
                <h5 className={styles.sectionTitle}>
                    d) Phân định trách nhiệm của thương nhân, tổ chức cung ứng dịch vụ logistics về cung cấp chứng từ hàng hóa trong quá trình giao nhận.
                </h5>
                <p className={styles.textBlock}>
                    Tất cả các đơn hàng đều được đóng gói sẵn sàng trước khi vận chuyển, được niêm phong bởi Dtvietnam.com.
                </p>
                <p className={styles.textBlock}>
                    Đơn vị vận chuyển sẽ chỉ chịu trách nhiệm vận chuyển hàng hóa theo nguyên tắc “nguyên đai, nguyên kiện”.
                </p>
                <p className={styles.textBlock}>
                    Trên bao bì tất cả các đơn hàng đều có thông tin:
                </p>
                    <p>Thông tin Người nhận, bao gồm: Tên người nhận, số điện thoại và địa chỉ người nhận.</p>
                    <p>Mã vận đơn của đơn hàng.</p>
                <p className={styles.textBlock}>
                    Để đảm bảo an toàn cho hàng hóa, Dtvietnam.com sẽ gửi kèm hóa đơn tài chính hoặc phiếu xuất kho hợp lệ của sản phẩm trong bưu kiện (nếu có).
                </p>
                <p className={styles.textBlock}>
                    Hóa đơn tài chính hoặc phiếu xuất kho là căn cứ hỗ trợ quá trình xử lý khiếu nại như: xác định giá trị thị trường của hàng hóa, đảm bảo hàng hóa lưu thông hợp lệ v.v..
                </p>
            </div>

            {/* Mục e */}
            <div>
                <h5 className={styles.sectionTitle}>e) Trách nhiệm về trường hợp hàng bị hư hỏng do quá trình vận chuyển</h5>
                <p className={styles.textBlock}>
                    Về việc cung cấp chứng từ hàng hóa trong quá trình giao nhận.
                </p>
                <p className={styles.textBlock}>
                    Đối với hàng hóa bị hư hỏng do quá trình vận chuyển dù là đơn hàng do chính cửa hàng vận chuyển hay do bên thứ 3 vận chuyển thì chúng tôi sẽ là bên đứng ra chịu trách nhiệm giải quyết vấn đề cho khách hàng.
                </p>
                <p className={styles.textBlock}>
                    Khách hàng có quyền từ chối nhận sản phẩm và yêu cầu đổi trả theo quy định “đổi trả hoàn phí” còn mọi vấn đề phát sinh chúng tôi sẽ làm việc lại với đối tác vận chuyển để giải quyết đền bù cho đơn hàng theo thỏa thuận hợp tác giữa công ty với đối tác thứ 3 cung cấp dịch vụ vận chuyển.
                </p>
                <p className={`${styles.textBlock} ${styles.italic}`}>
                    <strong>Lưu ý:</strong> Trường hợp phát sinh chậm trễ trong việc giao hàng chúng tôi sẽ thông tin kịp thời cho khách hàng và khách hàng có thể lựa chọn giữa việc Hủy hoặc tiếp tục chờ hàng.
                </p>
            </div>
        </div>
    );
}
export default TransportPolice;