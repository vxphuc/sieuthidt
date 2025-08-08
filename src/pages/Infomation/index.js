import styles from "./Infomation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useLocation } from "react-router-dom";
import { getName, getAddress } from "../../services/cartService";

function Infomation() {
  const phone = getName();
  const localAddress = getAddress();
  // sửa dòng useState ban đầu:
  const [data, setData] = useState({
    name: "",
    numberPhone: "",
  });

  const [address, setAddress] = useState(localAddress || []);
  const [showForm, setShowForm] = useState(false);

  // Địa chỉ cập nhật, popup sửa địa chỉ giữ nguyên
  const [editAddress, setEditAddress] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Lấy thông tin user-profile khi component mount hoặc numberPhoneParam thay đổi
  useEffect(() => {
    if (!phone || phone.length === 0) return;
    api
      .get(`/sign-in/user-profile`)
      .then((res) => {
        if (res.data && !data.name) {
          setData({
            name: res.data.name || "",
            numberPhone: res.data.numberPhone || "",
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin user-profile:", error);
      });
  }, [phone]);

  // Lấy danh sách địa chỉ nhận hàng (giữ nguyên)
  useEffect(() => {
    const address = getAddress()
    console.log(address)
    setAddress(address)
  }, []);


  // Cập nhật tên
  const handleSubmitName = async () => {
    try {
      const response = await api.put(
        `/sign-in/editProfile`,
        {
          name: data.name,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Cập nhật thành công:", response.data);
      setShowForm(false);
    } catch (error) {
      console.error("Lỗi cập nhật thông tin:", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Thông tin cá nhân */}
      <div className={styles.customer}>
        <h3>Thông tin cá nhân</h3>
        <p>
          {data.name} - {data.numberPhone}
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
            <form
              className={styles.formRow}
              onSubmit={(e) => e.preventDefault()}
            >
              <div className={styles.formGroup}>
                <label htmlFor="name">Họ & Tên:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
            </form>

            <div className={styles.saveInfo}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitName}
                className={styles.saveBtn}
              >
                Lưu
              </button>
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
          {address.map((item) => (
            <div key={item._id} className={styles.addressItem}>
              <div>
                <strong>
                  {item.road || ""}, {item.ward || "Chưa có phường"},{" "}
                  {item.province || "Chưa có tỉnh"}{" "}
                </strong>
                <br />
                {data.numberPhone}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup sửa địa chỉ (giữ nguyên code nếu cần) */}
      {/* {showEditForm && editAddress && (
        <>
          <div
            className={styles.overlay}
            onClick={() => setShowEditForm(false)}
          ></div>
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h3>Sửa địa chỉ nhận hàng</h3>
              <button
                className={styles.closeIcon}
                onClick={() => setShowEditForm(false)}
              >
                X
              </button>

              <select
                value={editAddress.provinces?.code}
                onChange={(e) => {
                  const p = provinces.find((p) => p.code === +e.target.value);
                  setEditAddress((prev) => ({ ...prev, provinces: p }));
                }}
              >
                <option value="">Chọn tỉnh</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                value={editAddress.districts?.code}
                onChange={(e) => {
                  const d = districts.find((d) => d.code === +e.target.value);
                  setEditAddress((prev) => ({ ...prev, districts: d }));
                }}
              >
                <option value="">Chọn quận</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                value={editAddress.wards?.code}
                onChange={(e) => {
                  const w = wards.find((w) => w.code === +e.target.value);
                  setEditAddress((prev) => ({ ...prev, wards: w }));
                }}
              >
                <option value="">Chọn phường</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
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
      )} */}
    </div>
  );
}

export default Infomation;
