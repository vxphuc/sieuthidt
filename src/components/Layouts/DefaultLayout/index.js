import Header from "./Header";
import Footer from "./Footer";
import TypeProduct from "./TypeProduct";
import styles from "./DefaultLayout.module.css";

function DefaultLayout({ children }) {
  return (
    <div className="">
      <div>
        <Header></Header>
      </div>
      <div className={`${styles.container} row container`}>
        <div className={styles.listType}>
          <div className={` ${styles.typeProduct}`}>
            <TypeProduct></TypeProduct>
          </div>
        </div>
        <div className={styles.productList}>
          {children}
          <div>
            <Footer></Footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DefaultLayout;
