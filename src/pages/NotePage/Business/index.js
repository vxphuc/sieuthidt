import styles from "./Business.module.css";
function Business() {
    return (
        <div className={styles.containerBusiness}>
            <h3 className={styles.titleBusiness}>Thông tin về doanh nghiệp</h3>
            <p>Công ty Cổ phần DT FOOD</p>
            <p>Địa chỉ: Thôn Đắc Lộc, Phường Bắc Nha Trang, Tỉnh Khánh Hòa, Việt Nam</p>
            <p>Số điện thoại: 0336390085</p>
            <p>Email: mediateamwfour@gmail.com</p>
            <p>Mã số doanh nghiệp: 4201794039</p>
        </div>
    );
};
export default Business;