import styles from "./Infomation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash  } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

function Infomation() {


  return (
    <div className={styles.wrapper}>
      {/* Thông tin cá nhân */}
      <div className={styles.customer}>
        <h3>Thông tin cá nhân</h3>
        <p>Anh Zinh - 0773915146</p>
        <a href="#" className={styles.fix}>
        <FontAwesomeIcon icon={faPenToSquare} />
          <span>Sửa</span>
        </a>
      </div>

      {/* Địa chỉ nhận hàng */}
      <div className={styles.addressBox}>
        <div className={styles.addressHeader}>
          <h3>Địa chỉ nhận hàng</h3>
        </div>

        {/* Danh sách địa chỉ */}
        <div className={styles.addressList}>
          <div className={styles.addressItem}>
            <div>
              <strong>Nhà riêng</strong> - 123 Lê Lợi, Nha Trang<br />
              0773915146
            </div>
            <div className={styles.actions}>
              <button className={styles.edit}><FontAwesomeIcon icon={faPenToSquare} />Sửa</button>
              <button className={styles.delete}><FontAwesomeIcon icon={faTrash} />Xóa</button>
            </div>
          </div>

          <div className={styles.addressItem}>
            <div>
              <strong>Văn phòng</strong> - 88 Pasteur, TP.HCM<br />
              0987654321
            </div>
            <div className={styles.actions}>
              <button className={styles.edit}><FontAwesomeIcon icon={faPenToSquare} />Sửa</button>
              <button className={styles.delete}><FontAwesomeIcon icon={faTrash} />Xóa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Infomation;
