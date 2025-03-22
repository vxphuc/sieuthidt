import styles from './Footer.module.css'

function Footer() {
    return (
        <footer className="bg-light py-4 mt-5">
          <div className={`container ${styles.container} `}>
            <div className="row">
              <div className="col-md-3">
                <h5>Tổng đài hỗ trợ</h5>
                <p><strong>Gọi mua:</strong> <a href="tel:02582226999">0258.222.6999</a> (8:00 - 21:30)</p>
                <p><strong>Kiếu nại:</strong> <a href="tel:0833831183">0833.831.183</a> (8:00 - 21:30)</p>
              </div>
              <div className="col-md-3">
                <h5>Về công ty</h5>
                <ul className= {styles.list_unstyled}>
                  <li><a href="#">Giới thiệu công ty (DT GROUP)</a></li>
                  <li><a href="#">Tuyển dụng</a></li>
                  <li><a href="#">Gửi góp ý, khiếu nại</a></li>
                </ul>
              </div>
              <div className="col-md-3">
                <h5>Sản phẩm</h5>
                <ul className= {styles.list_unstyled}>
                  <li><a href="#">Nước yến sào</a></li>
                  <li><a href="#">Yến sào tươi</a></li>
                  <li><a href="#">Yến sào tinh chế</a></li>
                  <li><a href="#">Yến sào chưng sẵn</a></li>
                  <li><a href="#">Rong nho muối</a></li>
                  <li><a href="#">Rong nho tươi</a></li>
                </ul>
              </div>
              <div className="col-md-3">
                <h5>Thông tin đối tác</h5>
                <div className="d-flex">
                  <img src="partner1.png" alt="Robertet" className="me-2" width="50" />
                  <img src="partner2.png" alt="Concung" className="me-2" width="50" />
                  <img src="partner3.png" alt="Asia Group" className="me-2" width="50" />
                  <img src="partner4.png" alt="Shopee" className="me-2" width="50" />
                  <img src="partner5.png" alt="Alibaba" width="50" />
                </div>
              </div>
            </div>
            <hr />
            <p className="text-center text-muted">
              GPKD Số 4201794039 do Sở KH và ĐT TP Nha Trang cấp ngày 23/05/2018 Địa chỉ: Thôn Lương Hòa, X. Vĩnh Lương, Tp. Nha Trang, Khánh Hòa.
              Điện thoại: 0258.222.6999 - 0833.831.183. Email: info@dtvietnam.com
            </p>
          </div>
        </footer>
      );
}

export default Footer;
