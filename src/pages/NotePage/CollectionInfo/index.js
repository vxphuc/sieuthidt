import styles from "./CollectionInfo.module.css";
function CollectionInfo() {
    return (
        <div className={styles.containercollectionInfo}>
            <h3 className={styles.titlecollectionInfo}>Mục đích và phạm vi thu thập thông tin</h3>
            <p><strong>sieuthidt.com</strong> không bán, chia sẻ hay trao đổi thông tin cá nhân của khách hàng thu thập trên trang web cho một bên thứ ba nào khác.</p>
            <p>Thông tin cá nhân thu thập được sẽ chỉ được sử dụng trong nội bộ công ty.</p>
            <p>Khi bạn liên hệ đăng ký dịch vụ, thông tin cá nhân mà sieuthidt.com thu thập bao gồm:</p>
            <p>Họ và tên</p>
            <p>Địa chỉ</p>
            <p>Điện thoại</p>
            <p>Ngoài thông tin cá nhân là các thông tin về dịch vụ</p>
            <p>Tên sản phẩm</p>
            <p>Số lượng</p>
            <p>Thời gian giao nhận sản phẩm</p>
        </div>
    );
};
export default CollectionInfo;