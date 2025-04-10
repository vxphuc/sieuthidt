import styles from './Background.module.css';

function BackgroundPopup({children, className }) {
    return ( <div className={` ${styles.wrapper} ${className}`}>{children}</div> );
}

export default BackgroundPopup;