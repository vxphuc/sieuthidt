import styles from './Menuu.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
function Menu() {
const [token, setToken] = useState([]);
const navigate = useNavigate();

useEffect(()=>{
  const response = async () => {
    const response = await axios.get("http://localhost:5000/sign-in/user-profile", {
      withCredentials: true,
    });
    setToken(response.data);
  };
  response();
},[])

const logout = () =>{
  axios.post("http://localhost:5000/sign-in/logout", {},{
    withCredentials: true
  })
  .then(()=>{
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/');
  })
}

  return (
    <div>
      {" "}
      <div className={`${styles.infomation}`}>
        <NavLink to='/thong-tin-khach-hang/hoa-don' className={`${styles.order}`}><FontAwesomeIcon icon={faReceipt} /> Đơn hàng đã mua</NavLink>
        <NavLink to='/thong-tin-khach-hang' className={`${styles.ifm}`}><FontAwesomeIcon icon={faAddressBook} /> Thông tin và địa chỉ</NavLink>
        <button onClick={logout} className={`${styles.logout}`}>Đăng xuất</button>
        <button className={`${styles.point}`}>
          Tổng điểm tích lũy: {token.token}
        </button>
      </div>
    </div>
  );
}

export default Menu;
