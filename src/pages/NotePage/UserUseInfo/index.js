import styles from "./UserUseInfo.module.css";
function UserUseInfo() {
    return (
        <div className={styles.containerRealTimeUse}>
            <h3 className={styles.titleRealTimeUse}>Những người hoặc tổ chức có thể được tiếp cận với thông tin cá nhân</h3>
            <p>Đối tượng được tiếp cận với thông tin cá nhân của khách hàng thuộc một trong những trường hợp sau:</p>
            <p>- CÔNG TY TNHH DT FOOD</p>
            <p>- Các đối tác có ký hợp động thực hiện 1 phần dịch vụ do CÔNG TY TNHH DT FOOD. Các đối tác này sẽ nhận được những thông tin theo thỏa thuận hợp đồng (có thể 1phần hoặc toàn bộ thông tin tuy theo điều khoản hợp đồng) để tiến hành hỗ trợ người dùng sử dụng dịch vụ do Công ty cung cấp.</p>
            <h3 className={styles.titleRealTimeUse}>Địa chỉ của đơn vị thu thập và quản lý thông tin cá nhân</h3>
            <p>CÔNG TY CỔ PHẦN DT FOOD</p>
            <p>ĐỊA CHỈ: Thôn Đắc Lộc, Phường Bắc Nha Trang, Tỉnh Khánh Hòa, Việt Nam</p>
            <p>https://sieuthidt.com/</p>
            <p>Email: info@dtvietnam.com</p>
            <h3 className={styles.titleRealTimeUse}>Thông tin về người sở hữu website</h3>
            <p>CÔNG TY CỔ PHẦN DT FOOD</p>
            <p>GPKD Số 4201794039 do Sở KH và ĐT TP Nha Trang cấp</p>
            <p>ĐỊA CHỈ: Thôn Đắc Lộc, Phường Bắc Nha Trang, Tỉnh Khánh Hòa, Việt Nam</p>
            <p>Chuyên sản xuất, phân phối và kinh doanh thương mại các loại thực phẩm, mỹ phẩm làm đẹp từ nhiên liệu thiên nhiên - đặc sản của Việt Nam.</p>

        </div>
    );
};
export default UserUseInfo;