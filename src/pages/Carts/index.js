import styles from "./Carts.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";

function Carts() {
  let navigate = useNavigate();
  return (
    <div className={`container ${styles.container} `}>
      <div className={`${styles.bg_black_20}`}>
        <main>
          <div className={`${styles.carts} container`}>
            <div className={`${styles.titleCarts}`}>
              <div className={`${styles.iconTitlecarts}`}>
                <span onClick={() => navigate(-1)}>
                  <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                </span>
              </div>
              <span>Giỏ hàng</span>
            </div>
            <div className={`${styles.bg_transparent}`}>
              <div className={`${styles.address}`}>
                <div className={`${styles.pick_up_store}`}>
                  <div className={`${styles.chose_address}`}>giao đến</div>
                  <div className={`${styles.address_user}`}>
                    <span><NavLink>Đổi</NavLink></span>
                    <div className={`${styles.pb4 }`}>
                        <p>12vdt, Xã Vĩnh Trung, TP. Nha Trang, Khánh Hòa</p>
                        <div className={`${styles.textBasic}`}>
                            <div className={`${styles.name}`}>Anh Vinh</div>
                            <div>0911147616</div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.listCarts}`}>
              <img src="https://res.cloudinary.com/dlqxlgre4/image/upload/v1743492800/products/vreeh4bf0fgwho99ysdc.webp" alt="anh1" ></img>
              <div className={`${styles.content}`}>
                <p>Giá tiền: 100.000₫</p>
                <button className={`${styles.tru}`}>-</button>
                <input type="number" value="1" min="1" max="10"></input>
                <button className={`${styles.cong}`}>+</button>
              </div>
            </div>
          </div>
        </main>
        
      </div>
    </div>
  );
}

export default Carts;