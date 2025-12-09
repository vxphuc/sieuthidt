import styles from "./Infomation.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useLocation } from "react-router-dom";
import { getName, getAddress } from "../../services/cartService";

function Infomation() {
  const localAddress = getAddress();
  const [data, setData] = useState({
    name: "",
    numberPhone: "",
  });

  const [address, setAddress] = useState(localAddress || []);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const stored = getName();
    if (!stored || (Array.isArray(stored) && stored.length === 0)) return;

    api
      .get(`/sign-in/user-profile`)
      .then((res) => {
        if (res.data) {
          setData({
            name: res.data.name || "",
            numberPhone: res.data.numberPhone || "",
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin user-profile:", error);
      });
  }, []);

  useEffect(() => {
    const stored = getAddress();
    const safe = Array.isArray(stored) ? stored : [];
    console.log('loaded address', safe);
    setAddress(safe);
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
    </div>
  );
}

export default Infomation;
