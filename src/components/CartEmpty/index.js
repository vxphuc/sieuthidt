import styles from "./CartsEmpty.module.css";

function CartsEmpty() {
  return (
    <div className={`${styles.cartsempty}`}>
        <div className={`${styles.note}`}>
            <p>Giỏ hàng của bạn</p>
        </div>
      <div className={`${styles.imgempty}`}>
        <img src="./cart-empty.png" alt="anh"></img>
        <button>Tiếp tục mua hàng</button>
      </div>
    </div>
  );
}

export default CartsEmpty;
