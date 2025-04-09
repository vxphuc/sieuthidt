import styles from "./Adress.module.css";

function Adress() {
  return (
    <div className="container">
      <div className={` container ${styles.container}`}>
        <div className={`${styles.title}`}></div>
      </div>
    </div>
  );
}

export default Adress;
