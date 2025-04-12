import styles from "./Infomation.module.css";

function Infomation() {
  return (
    <div className={`${styles.defin}`}>
      <div className={``}>
        <div className={`${styles.customer}`}>
          <h3>Thông tin cá nhân</h3>
          <p>Anh Zinh - 0773915146</p>
          <a href='#' className={`${styles.fix}`}>
            <span>Sửa</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Infomation;
