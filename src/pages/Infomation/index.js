import styles from "./Infomation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import api from "../../api/axios";

function Infomation() {
  
  const [data, setData] = useState({
    name: "",
    numberPhone: ""
  });
  const [address, setAddress] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // phần cập nhật địa chỉ
  const [editAddress, setEditAddress] = useState(null); // chứa thông tin địa chỉ đang sửa
  const [showEditForm, setShowEditForm] = useState(false); // toggle popup
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isDefault, setIsDefault] = useState(false);
  

  useEffect(() => {
    api
      .get(`/sign-in/user-profile`, {
        withCredentials: true,
      })
      .then((res) => setData(res.data));
  }, []);

  useEffect(() => {
    api
      .get(`/address`, {
        withCredentials: true,
      })
      .then((res) => setAddress(res.data));
  }, []);

  const handleDelete = (id, wards_id, districts_id, provinces_id) => {
    api
      .delete(
        `/address/delete/${id}/${wards_id}/${districts_id}/${provinces_id}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        api
          .get(`/address`, {
            withCredentials: true,
          })
          .then((res) => setAddress(res.data));
      });
  };
  const handleSubmitName = async () =>{
    const { name, numberPhone } = data;
    const response = await api.put(`/sign-in/editProfile`,{
      name,
      numberPhone
    },{
      withCredentials: true
    })
    console.log(response.data)
  }

  return (
    <div className={styles.wrapper}>
      {/* Thông tin cá nhân */}
      <div className={styles.customer}>
        <h3>Thông tin cá nhân</h3>
        <p>
           {data.name} - {data.phone}
        </p>
        <button
          type="button"
          className={styles.fix}
          onClick={() => setShowForm(true)}
        >
          <FontAwesomeIcon icon={faPenToSquare} />
          <span>Sửa</span>
        </button>
        {showForm && (
        <div className={styles.updateInfo}>
          <form className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Họ & Tên:</label>
              <input type="text" id="name" name="name" onChange={(e) => setData({...data, name: e.target.value})} defaultValue={data.name || ''}/>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Số điện thoại:</label>
              <input type="text" id="phone" name="phone" defaultValue={data.phone || ''} />
            </div>
          </form>

          <div className={styles.saveInfo}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Hủy</button>
            <button type="submit" onClick={handleSubmitName} className={styles.saveBtn}>Lưu</button>
          </div>
        </div>
        )}
      </div>

      {/* Địa chỉ nhận hàng */}
      <div className={styles.addressBox}>
        <div className={styles.addressHeader}>
          <h3>Địa chỉ nhận hàng</h3>
        </div>

        {/* Danh sách địa chỉ */}
        <div className={styles.addressList}>
          {address.map((item, index) => (
            <div key={item._id} className={styles.addressItem}>
              <div>
                <strong>
                  {item.nameRoad}, {item.wards.nameWards},{" "}
                  {item.districts.nameDistricts}, {item.provinces.nameProvinces}
                </strong>
                <br />
                {data.phone}
              </div>
              <div className={styles.actions}>
             
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
      {showEditForm && editAddress && (
        <>
        <div className={styles.overlay} onClick={() => setShowEditForm(false)}></div>
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h3>Sửa địa chỉ nhận hàng</h3>
              <button className={styles.closeIcon} onClick={() => setShowEditForm(false)}>X</button>

              <select value={editAddress.provinces?.code} onChange={(e) => {
                const p = provinces.find(p => p.code === +e.target.value);
                setEditAddress(prev => ({ ...prev, provinces: p }));
              }}>
                <option value="">Chọn tỉnh</option>
                {provinces.map(p => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>

              <select value={editAddress.districts?.code} onChange={(e) => {
                const d = districts.find(d => d.code === +e.target.value);
                setEditAddress(prev => ({ ...prev, districts: d }));
              }}>
                <option value="">Chọn quận</option>
                {districts.map(d => (
                  <option key={d.code} value={d.code}>{d.name}</option>
                ))}
              </select>

              <select value={editAddress.wards?.code} onChange={(e) => {
                const w = wards.find(w => w.code === +e.target.value);
                setEditAddress(prev => ({ ...prev, wards: w }));
              }}>
                <option value="">Chọn phường</option>
                {wards.map(w => (
                  <option key={w.code} value={w.code}>{w.name}</option>
                ))}
              </select>

              <input
                type="text"
                value={editAddress.nameRoad}
                onChange={(e) =>
                  setEditAddress((prev) => ({ ...prev, nameRoad: e.target.value }))
                }
              />

              <div className={styles.popupActions}>
                <button>Xác nhận</button>
                <button onClick={() => setShowEditForm(false)}>Đóng</button>
              </div>
            </div>
          </div>
          </>
        )}
      </div>
  );
}

export default Infomation;
