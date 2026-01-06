import styles from './Menuu.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faReceipt, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../../../api/axios';
import { getName } from '../../../../services/cartService';

function Menu() {
const [token, setToken] = useState([]);
const navigate = useNavigate();

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
      {" "}
      <div className={`${styles.infomation}`}>
        <NavLink to='/thong-tin-khach-hang/hoa-don' className={({isActive}) => isActive ? `${styles.order} ${styles.active}` : styles.order }><FontAwesomeIcon icon={faReceipt} /> Đơn hàng đã mua</NavLink>
        <NavLink end to='/thong-tin-khach-hang' className={({isActive}) => isActive ? `${styles.ifm} ${styles.active}` : styles.ifm }><FontAwesomeIcon icon={faAddressBook} /> Thông tin và địa chỉ</NavLink>
        <NavLink to='/thong-tin-khach-hang/dang-ky-ctv' className={({isActive}) => isActive ? `${styles.ifm} ${styles.active}` : styles.ifm }><FontAwesomeIcon icon={faFileAlt} /> Đăng ký CTV</NavLink>
        <button onClick={logout} className={`${styles.logout}`}>Đăng xuất</button>
        <button className={`${styles.point}`}>
          Tổng điểm tích lũy: {token.token}
        </button>
      </div>
    </div>
  );
}

export default Menu;
