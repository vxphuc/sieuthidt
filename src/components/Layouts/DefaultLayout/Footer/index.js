import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.containerfooter}>
                <div className={styles.rowfooter}>
                    {/* Cột 1: Tổng đài */}
                    <div className={styles.colfooter}>
                        <h5 className={styles.headingfooter}>Tổng đài hỗ trợ</h5>
                        <p className={styles.textfooter}><strong>Gọi mua:</strong> <a href="tel:0833416868" className={styles.linkfooter}>0833.416.868</a></p>
                        <p className={styles.textfooter}><strong>Khiếu nại:</strong> <a href="tel:0847236868" className={styles.linkfooter}>0847.236.868</a></p>
                    </div>

                    {/* Cột 2: Sản phẩm */}
                    <div className={styles.colfooter}>
                        <h5 className={styles.headingfooter}>Sản phẩm</h5>
                        <ul className={styles.listUnstyledfooter}>
                            <li><a href="#" className={styles.linkfooter}>Nước yến sào</a></li>
                            <li><a href="#" className={styles.linkfooter}>Yến sào tươi</a></li>
                            <li><a href="#" className={styles.linkfooter}>Yến sào tinh chế</a></li>
                            <li><a href="#" className={styles.linkfooter}>Yến sào chưng sẵn</a></li>
                        </ul>
                    </div>

                    {/* Cột 3: Đối tác */}
                    <div className={styles.colfooter}>
                        <h5 className={styles.headingfooter}>Thông tin đối tác</h5>
                        <div className={styles.partnerListfooter}>
                            <a href='https://shopee.vn/dtvietnam2023?categoryId=100629&entryPoint=ShopByPDP&itemId=27913405107' target="_blank" rel="noopener noreferrer">
                                <img src="/download.png" alt="Shopee" className={styles.partnerItemfooter} />
                            </a>
                            <a href='https://www.lazada.vn/catalog/?q=y%E1%BA%BFn%20dt' target="_blank" rel="noopener noreferrer">
                                <img src="https://classic.vn/wp-content/uploads/2022/04/logo-lazada.png" alt="lazada" className={styles.partnerItemfooter} />
                            </a>
                            <a href='https://tiki.vn/' target="_blank" rel="noopener noreferrer">
                                <img src="https://storage.googleapis.com/hust-files/images/tiki_21.1k.png" alt="tiki" className={styles.partnerItemfooter} />
                            </a>
                            <a href='https://concung.com/?srsltid=AfmBOoroDP5oib1dSz_Soj5L_1zsoj2K2VrN5P1spkpm3ujtgWlHeaRb' target="_blank" rel="noopener noreferrer">
                                <img src="https://hrc.com.vn/wp-content/uploads/2024/09/Logo-Con-Cung.png" alt="concung" className={styles.partnerItemfooter} />
                            </a>
                            <a href='https://winmart.vn/?srsltid=AfmBOoor9SPMSnmVxQ7_HymoE-iQmF854Bqa_RCqMGSTnwWtyvFLrcf0' target="_blank" rel="noopener noreferrer">
                                <img src="https://cdn.prod.website-files.com/5fb85f26f126ce08d792d2d9/628c054a618e1928c739eb83_After_winmart-100.jpg" alt="Alibaba" className={styles.partnerItemfooter} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className={styles.row2footer}>
                  <div className={styles.col2footer}>
                    <h5>Chính sách bảo mật</h5>
                    <ul>
                      <li><a href="/chinh-sach-muc-dich-pham-vi-thu-thap-thong-tin" className={styles.linkfooter}>Mục đích thu thập thông tin</a></li>
                      <li><a href="/chinh-sach-pham-vi-su-dung" className={styles.linkfooter}>Phạm vi sử dụng</a></li>
                      <li><a href="/chinh-sach-thoi-gian-luu-tru" className={styles.linkfooter}>Thời gian tích trữ</a></li>
                      <li><a href="/don-vi-tiep-can-thong-tin" className={styles.linkfooter}>Đơn vị tiếp cận thông tin</a></li>
                      <li><a href="/cach-nguoi-dung-chinh-sua-yeu-cau-xoa-du-lieu" className={styles.linkfooter}>Cách người dùng chỉnh sửa, yêu cầu xóa dữ liệu</a></li>
                    </ul>
                  </div>
                  <div className={styles.col2footer}>
                    <h5>Chính sách bán hàng</h5>
                    <ul>
                      <li><a href="/thong-tin-dieu-kien-giao-dich-chung" className={styles.linkfooter}>Thông tin về điều kiện giao dịch chung</a></li>
                      <li><a href="/chinh-sach-thanh-toan" className={styles.linkfooter}>Chính sách thanh toán</a></li>
                      <li><a href="/chinh-sach-van-chuyen-giao-nhan" className={styles.linkfooter}>Chính sách vận chuyển - giao nhận</a></li>
                      <li><a href="/chinh-sach-doi-tra" className={styles.linkfooter}>Chính sách đổi trả - hoàn tiền</a></li>
                      <li><a href="/chinh-sach-khieu-nai" className={styles.linkfooter}>Chính sách khiếu nại</a></li>
                    </ul>
                  </div>
                  <div className={styles.col2footer}>
                    <h5>Doanh nghiệp</h5>
                    <ul>
                      <li><a href="/thong-tin-doanh-nghiep" className={styles.linkfooter}>Tên doanh nghiệp</a></li>
                      <li><a href="/thong-tin-doanh-nghiep" className={styles.linkfooter}>Địa chỉ trụ sở chính</a></li>
                      <li><a href="/thong-tin-doanh-nghiep" className={styles.linkfooter}>Số điện thoại, Email hợp lệ</a></li>
                      <li><a href="/thong-tin-doanh-nghiep" className={styles.linkfooter}>Mã số doanh nghiệp / mã số thuế</a></li>
                      <li><a href="/thong-tin-doanh-nghiep" className={styles.linkfooter}>Số giấy chứng nhận đăng ký kinh doanh và nơi cấp</a></li>
                    </ul>
                  </div>
                </div>

                {/* Phần thông tin chân trang (được ghim dưới đáy) */}
                <div className={styles.bottomWrapperfooter}>
                    <div className={styles.dividerfooter}></div>
                    <p className={styles.bottomTextfooter}>
                        Theo Nghị quyết 202/2025/QH15 về việc sắp xếp đơn vị hành chính.<br />
                        Địa chỉ: Thôn Đắc Lộc, Phường Bắc Nha Trang, Tỉnh Khánh Hòa, Việt Nam.<br />
                        Điện thoại: 0258.222.6999 - 0833.831.183. Email: du.nguyen@dtvietnam.com
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;