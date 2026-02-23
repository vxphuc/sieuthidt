import React from 'react';
import Sidebar from '../sidebar';
import styles from './layout.module.css';

const Layout = ({ children }) => {
    return (
        <div className={styles.container}>
            <div className={styles.sidebarWrapper}>
                <Sidebar />
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.contentInner}>
                    {children}
                </div>
            </div>
        </div>
    );
}
export default Layout;