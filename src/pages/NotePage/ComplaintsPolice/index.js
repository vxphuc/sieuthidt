import styles from "./ComplaintsPolice.module.css";
function ComplaintsPolice() {
    return (
        <div className={styles.ComplaintsPoliceContainer}>
            <h2 className={styles.titleComplaintsPolice}>CHÍNH SÁCH KHIẾU NẠI</h2>
            <div>- Tiếp nhận mọi khiếu nại của khách hàng liên quan đến việc sử dụng dịch vụ của công ty.</div>
            <div>- Tất cả mọi trường hơp bảo hành, quý khách có thể liên hệ với chúng tôi để làm thủ tục bảo hành.</div>
            <div>- Thời gian giải quyết khiếu nại trong thời hạn tối đa là 03 (ba) ngày làm việc kể từ khi nhận được khiếu nại của của khách hàng. Trong trường hợp bất khả kháng 2 bên sẽ tự thương lượng.</div>
        </div>
    );
};
export default ComplaintsPolice;