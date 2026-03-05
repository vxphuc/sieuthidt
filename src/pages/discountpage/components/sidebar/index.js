import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./sidebar.module.css";

const Sidebar = () => {
    const getNavLinkClass = ({ isActive }) => {
        return isActive ? `${styles.NavLink} ${styles.activeLink}` : styles.NavLink;
    };

    return (
        <div className={styles.sidebarContainer}>
            <div className={styles.logoArea}>
                <h3>Admin Sự Kiện</h3>
            </div>
            <ul className={styles.navList}>
                <li>
                    <NavLink to="/danh-sach-su-kien-doi-qua" className={getNavLinkClass}>
                        <span className={styles.icon}></span> Quản Lý Sự Kiện
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/tao-ma-giam-gia-hang-loat" className={getNavLinkClass}>
                        <span className={styles.icon}></span> Tạo Mã Giảm Giá Hàng Loạt
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/gan-ma-giam-gia-vao-su-kien" className={getNavLinkClass}>
                        <span className={styles.icon}></span> Gán mã vào sự kiện
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/tao-phan-thuong-cho-su-kien" className={getNavLinkClass}>
                        <span className={styles.icon}></span> Tạo Phần Thưởng Cho Sự Kiện
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/danh-sach-dai-ly" className={getNavLinkClass}>
                        <span className={styles.icon}></span> Danh Sách Đại Lý
                    </NavLink>
                </li>
            </ul>
        </div>
        
    );
}
export default Sidebar;