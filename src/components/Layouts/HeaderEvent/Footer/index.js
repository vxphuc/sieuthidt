import styles from './Footer.module.css'

function Footer() {
    return (
        <footer className={`bg-light py-4 mt-5 ${styles.foot}`}>
          <div className={`container ${styles.container} `}>
          <div className="row">
            <div className="col-6 col-md-3">
              <h5>Tổng đài hỗ trợ</h5>
              <p><strong>Gọi mua:</strong> <a href="tel:02582226999">0258.222.6999</a></p>
              <p><strong>Kiếu nại:</strong> <a href="tel:0833831183">0833.831.183</a></p>
            </div>
            <div className="col-6 col-md-3">
              <h5>Về công ty</h5>
              <ul className={styles.list_unstyled}>
                <li><a href="#">Giới thiệu công <span className={styles.break}>ty (DT GROUP)</span></a></li>
                <li><a href="#">Tuyển dụng</a></li>
                <li><a href="#">Gửi góp ý, khiếu nại</a></li>
              </ul>
            </div>
            <div className="col-6 col-md-3">
              <h5>Sản phẩm</h5>
              <ul className={styles.list_unstyled}>
                <li><a href="#">Nước yến sào</a></li>
                <li><a href="#">Yến sào tươi</a></li>
                <li><a href="#">Yến sào tinh chế</a></li>
                <li><a href="#">Yến sào chưng sẵn</a></li>
                <li><a href="#">Rong nho muối</a></li>
                <li><a href="#">Rong nho tươi</a></li>
              </ul>
            </div>
            <div className="col-6 col-md-3">
              <h5>Thông tin đối tác</h5>
              <div className={`d-flex ${styles.partnerList}`}>
              <a href='https://shopee.vn/dtvietnam2023?categoryId=100629&entryPoint=ShopByPDP&itemId=27913405107' target="_blank" rel="noopener noreferrer">
                  <img src="/download.png" alt="Shopee" className={`me-2 ${styles.partnerItem}`} />
                  </a>
                  <a href='https://www.lazada.vn/catalog/?q=y%E1%BA%BFn%20dt' target="_blank" rel="noopener noreferrer">
                  <img src="https://classic.vn/wp-content/uploads/2022/04/logo-lazada.png" alt="lazada" className={`me-2 ${styles.partnerItem}`} />
                  </a>
                  <a href='https://tiki.vn/' target="_blank" rel="noopener noreferrer">
                  <img src="https://storage.googleapis.com/hust-files/images/tiki_21.1k.png" alt="tiki" className={`me-2 ${styles.partnerItem}`} />
                  </a>
                  <a href='https://concung.com/?srsltid=AfmBOoroDP5oib1dSz_Soj5L_1zsoj2K2VrN5P1spkpm3ujtgWlHeaRb' target="_blank" rel="noopener noreferrer">
                  <img src="https://hrc.com.vn/wp-content/uploads/2024/09/Logo-Con-Cung.png" alt="concung" className={`me-2 ${styles.partnerItem}`} />
                  </a>
                  <a href='https://winmart.vn/?srsltid=AfmBOoor9SPMSnmVxQ7_HymoE-iQmF854Bqa_RCqMGSTnwWtyvFLrcf0' target="_blank" rel="noopener noreferrer">
                  <img src="https://cdn.prod.website-files.com/5fb85f26f126ce08d792d2d9/628c054a618e1928c739eb83_After_winmart-100.jpg" alt="Alibaba" className={`me-2 ${styles.partnerItem}`} />
                  </a>
              </div>
            </div>
          </div>
            <hr />
            <p className="text-center text-muted">
              Theo Nghị quyết 202/2025/QH15 về việc sắp xếp đơn vị hành chính Địa chỉ: Thôn Đắc Lộc, Phường Bắc Nha Trang, Tỉnh Khánh Hòa, Việt Nam
              Điện thoại: 0258.222.6999 - 0833.831.183. Email: info@dtvietnam.com
            </p>
          </div>
        </footer>
      );
}

export default Footer;
