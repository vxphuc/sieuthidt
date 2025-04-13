import styles from "./Infomation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";

function Infomation() {
  const [data, setData] = useState([]);
  const [address, setAddress] = useState([]);

  useEffect(() => {
    axios
      .get(`https://web-dt.onrender.com/sign-in/user-profile`, {
        withCredentials: true,
      })
      .then((res) => setData(res.data));
  }, []);

  useEffect(() => {
    axios
      .get(`https://web-dt.onrender.com/address`, {
        withCredentials: true,
      })
      .then((res) => setAddress(res.data));
  }, []);

  const handleDelete = (id, wards_id, districts_id, provinces_id) => {
    axios
      .delete(
        `https://web-dt.onrender.com/address/delete/${id}/${wards_id}/${districts_id}/${provinces_id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        axios
          .get(`https://web-dt.onrender.com/address`, {
            withCredentials: true,
          })
          .then((res) => setAddress(res.data));
      });
  };

  return (
    <div className={styles.wrapper}>
      {/* Thông tin cá nhân */}
      <div className={styles.customer}>
        <h3>Thông tin cá nhân</h3>
        <p>
          Anh {data.name} - {data.phone}
        </p>
        <a href="#" className={styles.fix}>
          <FontAwesomeIcon icon={faPenToSquare} />
          <span>Sửa</span>
        </a>
      </div>

      {/* Địa chỉ nhận hàng */}
      <div className={styles.addressBox}>
        <div className={styles.addressHeader}>
          <h3>Địa chỉ nhận hàng</h3>
        </div>

        {/* Danh sách địa chỉ */}
        <div className={styles.addressList}>
          {address.map((item, index) => (
            <div key={index} className={styles.addressItem}>
              <div>
                <strong>
                  {item.nameRoad}, {item.wards.nameWards},{" "}
                  {item.districts.nameDistricts}, {item.provinces.nameProvinces}
                </strong>
                <br />
                {data.phone}
              </div>
              <div className={styles.actions}>
                <button className={styles.edit}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                  Sửa
                </button>
                <button
                  onClick={() =>
                    handleDelete(
                      item._id,
                      item.wards._id,
                      item.districts._id,
                      item.provinces._id
                    )
                  }
                  className={styles.delete}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Infomation;
