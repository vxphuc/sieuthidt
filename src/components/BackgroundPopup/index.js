import styles from "./Background.module.css";

function BackgroundPopup({ children, className, onClick, style }) {
  return (
    <div
      style= {style}
      onClick={onClick}
      className={` ${styles.wrapper} ${className}`}
    >
      {children}
    </div>
  );
}

export default BackgroundPopup;
