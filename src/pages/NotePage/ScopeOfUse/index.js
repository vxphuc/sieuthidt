import styles from "./ScopeOfUse.module.css";
function ScopeOfUse() {
    return (
        <div className={styles.containerScopeOfUse}>
            <h3 className={styles.titleScopeOfUse}>Phạm vi sử dụng thông tin</h3>
            <p>Thông tin cá nhân thu thập được sẽ chỉ được Dtvietnam.com sử dụng trong nội bộ công ty và cho một hoặc tất cả các mục đích sau đây:</p>
            <p>- Hỗ trợ khách hàng</p>
            <p>- Cung cấp thông tin liên quan đến dịch vụ</p>
            <p>- Xử lý đơn đặt hàng và cung cấp dịch vụ và thông tin qua trang web của chúng tôi theo yêu cầu của bạn</p>
            <p>- Chúng tôi có thể sẽ gửi thông tin sản phẩm, dịch vụ mới, thông tin về các sự kiện sắp tới hoặc thông tin tuyển dụng nếu quý khách đăng kí nhận email thông báo.</p>
            <p>- Ngoài ra, chúng tôi sẽ sử dụng thông tin bạn cung cấp để hỗ trợ quản lý tài khoản khách hàng; xác nhận và thực hiện các giao dịch tài chính liên quan đến các khoản thanh toán trực tuyến của bạn.</p>
        </div>
    );
};
export default ScopeOfUse;