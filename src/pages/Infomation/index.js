import styles from "./Infomation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";

function Infomation() {
  const [data, setData] = useState([]);
  const [address, setAddress] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // phần cập nhật địa chỉ
  const [editAddress, setEditAddress] = useState(null); // chứa thông tin địa chỉ đang sửa
  const [showEditForm, setShowEditForm] = useState(false); // toggle popup
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isDefault, setIsDefault] = useState(false);
  
  const fetchProvinces = async () => {
    const res = await axios.get("https://provinces.open-api.vn/api/");
    setProvinces(res.data);
  };
  
  useEffect(() => {
    if (editAddress?.provinces?.code) {
      axios.get(`https://provinces.open-api.vn/api/p/${editAddress.provinces.code}?depth=2`)
        .then(res => setDistricts(res.data.districts));
    }
  }, [editAddress?.provinces]);
  
  useEffect(() => {
    if (editAddress?.districts?.code) {
      axios.get(`https://provinces.open-api.vn/api/d/${editAddress.districts.code}?depth=2`)
        .then(res => setWards(res.data.wards));
    }
  }, [editAddress?.districts]);

  //Hàm gửi dữ liệu sửa
  const handleEditAddress = () => {
    axios.patch(`https://web-dt.onrender.com/address/update/${editAddress._id}`, {
      IDProvinces: editAddress.provinces.code,
      nameProvinces: editAddress.provinces.name,
      IDDistricts: editAddress.districts.code,
      nameDistricts: editAddress.districts.name,
      IDWards: editAddress.wards.code,
      nameWards: editAddress.wards.name,
      nameRoad: editAddress.nameRoad,
      
    }, {
      withCredentials: true
    })
    .then(() => {
      setShowEditForm(false);
      axios.get("https://web-dt.onrender.com/address", { withCredentials: true })
        .then(res => setAddress(res.data));
    });
  }
  //kết thúc

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
              <label>
                <input type="radio" name="gender" value="Anh" defaultChecked />
                Anh
              </label>
              <label>
                <input type="radio" name="gender" value="Chị" />
                Chị
              </label>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="name">Họ & Tên:</label>
              <input type="text" id="name" name="name" defaultValue={data.name || ''}/>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">Số điện thoại:</label>
              <input type="text" id="phone" name="phone" defaultValue={data.phone || ''} />
            </div>
          </form>

          <div className={styles.saveInfo}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Hủy</button>
            <button type="submit" className={styles.saveBtn}>Lưu</button>
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
              <button
                className={styles.edit}
                onClick={() => {
                  setEditAddress(item);
                  setShowEditForm(true);
                  fetchProvinces(); // Gọi khi mở
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} /> Sửa
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
                <button onClick={() => handleEditAddress()}>Xác nhận</button>
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
