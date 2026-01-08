import styles from './Menuu.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faReceipt, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../../../api/axios';
import { getName } from '../../../../services/cartService';
import { BiSolidDiscount } from "react-icons/bi";
function Menu() {
const [token, setToken] = useState([]);
const navigate = useNavigate();

const location = useLocation();

const isCTVPage = location.pathname.includes('/thong-tin-khach-hang/dang-ky-ctv') || location.pathname.includes('/thong-tin-khach-hang/kho-ma-giam-gia');

useEffect(()=>{
  const response = async () => {
    const phone = getName()
    const numberPhone = phone[0].phone
    const response = await api.get("/sign-in/user-profile", {
      params: {
        numberPhone
      }
    });
    setToken(response.data);
  };
  response();
},[])

const logout = () =>{
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.reload();
  window.location.href = '../../../../pages/Home';
}

  return (
    <div>
      <div className={`${styles.infomation}`}>
        
        <NavLink 
            to='/thong-tin-khach-hang/hoa-don' 
            className={({ isActive }) => isActive ? `${styles.order} ${styles.active}` : styles.order}
        >
            <FontAwesomeIcon icon={faReceipt} /> Đơn hàng đã mua
        </NavLink>
        
        <NavLink 
            end to='/thong-tin-khach-hang' 
            className={({ isActive }) => isActive ? `${styles.ifm} ${styles.active}` : styles.ifm}
        >
            <FontAwesomeIcon icon={faAddressBook} /> Thông tin và địa chỉ
        </NavLink>
        
        <NavLink 
            to='/thong-tin-khach-hang/dang-ky-ctv' 
            className={({ isActive }) => isActive ? `${styles.ifm} ${styles.active}` : styles.ifm}
        >
            <FontAwesomeIcon icon={faFileAlt} /> Đăng ký CTV
        </NavLink>
        {isCTVPage && (
            <NavLink 
                to='/thong-tin-khach-hang/kho-ma-giam-gia' 
                className={({ isActive }) => isActive ? `${styles.ifm} ${styles.active}` : styles.ifm}
                style={{ marginLeft: '20px', width: 'calc(100% - 20px)', fontSize: '0.95em', borderLeft: '3px solid #ccc' }} 
            >
                <BiSolidDiscount style={{ marginRight: '5px' }} /> Kho mã giảm giá
            </NavLink>
        )}
        
        <button onClick={logout} className={`${styles.logout}`}>Đăng xuất</button>
        <button className={`${styles.point}`}>
          Tổng điểm tích lũy: {token.token || 0}
        </button>
      </div>
    </div>
  );
}

export default Menu;
