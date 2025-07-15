import styles from "./Adress.module.css";
import { useNavigate } from "react-router-dom";
import { faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BackgroundPopup from "../../components/BackgroundPopup";
import { useEffect, useState } from "react";
import axios from "axios";
import { saveName, saveAddress } from "../../services/cartService";

function Adress() {
  const navigate = useNavigate();
  //tỉnh thành
  const [Province, setProvince] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  // Huyện
  const [District, setDistrict] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  // Xã, Phường
  const [Ward, setWard] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  //Địa chỉ
  const [road, setRoad] = useState("");
  // thông tin cá nhân và số điện thoại
  const [dataUser, setData] = useState({
    name: "",
    phone: "",
  });

  // tỉnh
  useEffect(() => {
    axios
      .get(`https://provinces.open-api.vn/api/`)
      .then((res) => setProvince(res.data))
      .catch((err) => console.error("Lỗi khi fetch tỉnh/thành:", err));
  }, []);

  // huyện
  useEffect(() => {
    if (selectedProvince && selectedProvince.code) {
      axios(
        `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`
      )
        .then((res) => setDistrict(res.data.districts))
        .catch((err) => console.error("Lỗi khi fetch huyện:", err));
    }
  }, [selectedProvince]);

  // xã phường
  useEffect(() => {
    if (selectedDistrict && selectedDistrict.code) {
      axios(
        `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`
      )
        .then((res) => setWard(res.data.wards))
        .catch((err) => console.error("Lỗi khi fetch huyện:", err));
    }
  }, [selectedDistrict]);

  //lấy tỉnh thành
  const handleProvinceChange = (e) => {
    const selectedCode = e.target.value;
    const province = Province.find(
      (province) => province.code.toString() === selectedCode
    );
    setSelectedProvince(province);
  };

  //lấy huyện
  const handleDistrictChange = (e) => {
    const selectedCode = e.target.value;
    const district = District.find(
      (district) => district.code.toString() === selectedCode
    );
    setSelectedDistrict(district);
  };

  // lấy xã phường
  const handleWardChange = (e) => {
    const selectedCode = e.target.value;
    const ward = Ward.find((ward) => ward.code.toString() === selectedCode);
    setSelectedWard(ward);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const address = [{
      province: selectedProvince.name,
      district: selectedDistrict.name,
      ward: selectedWard.name,
      road: road,
      name: dataUser.name,
      phone: dataUser.phone
    }];
    const User = [{
      name: dataUser.name,
      phone: dataUser.phone
    }]
    saveAddress(address)
    saveName(User)
    navigate(-1)
  };
  return (
    <div className="container">
      <div className={` container ${styles.container}`}>
        <div className={`${styles.title}`}>
          <div className={`${styles.items__center}`}>
            <span onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faChevronLeft} size="lg" />
            </span>
          </div>
          <span className={`${styles.title__text}`}>Thông tin nhận hàng</span>
        </div>
        <div className={styles.relative}>
          <input
            className={styles.peer}
            onChange={(e) => setData((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="Số Điện Thoại...*"
          ></input>
        </div>
        <div className={styles.relative}>
          <input
            className={styles.peer}
            onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Họ Và Tên...*"
          ></input>
        </div>
        <div className="d-flex flex-wrap justify-between">
          <div className={styles.cbProvince}>
            <select onChange={handleProvinceChange} className={styles.Province}>
              <option value="">Chọn Tỉnh/Thành Phố</option>
              {Province.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.cbProvince}>
            <select onChange={handleDistrictChange} className={styles.Province}>
              <option value="">Chọn Quận/Huyện</option>
              {District.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.relativeward}>
            <select onChange={handleWardChange} className={styles.Province}>
              <option value="">Chọn Xã/Phường</option>
              {Ward.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.relativeward}>
            <input
              onChange={(e) => setRoad(e.target.value)}
              className={styles.peer}
              placeholder="nhập tên đường, số nhà...*"
            ></input>
          </div>
        </div>
        <div className={`${styles.role}`}>
          <button onClick={handleSubmit}>Xác nhận</button>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Adress;
