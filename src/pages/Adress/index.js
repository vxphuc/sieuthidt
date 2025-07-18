import styles from "./Adress.module.css";
import { useNavigate } from "react-router-dom";
import { faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BackgroundPopup from "../../components/BackgroundPopup";
import { useEffect, useState, useRef  } from "react";
import axios from "axios";
import { saveName, saveAddress,getAddress, getName } from "../../services/cartService";

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
  // phần bắt nhập tt
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const provinceRef = useRef(null);
  const districtRef = useRef(null);
  const wardRef = useRef(null);
  const roadRef = useRef(null);
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
  useEffect(() => {
  const savedAddress = getAddress();
  const savedUser = getName();

  if (savedAddress && savedAddress.length > 0) {
    const addr = savedAddress[0];
    setRoad(addr.road || "");

    // ⚠️ Dùng name để tìm object đầy đủ từ mảng gốc
    const selectedProvinceObj = Province.find(p => p.name === addr.province);
    setSelectedProvince(selectedProvinceObj);

    // Cần fetch huyện tương ứng trước rồi mới set huyện
    if (selectedProvinceObj) {
      axios(`https://provinces.open-api.vn/api/p/${selectedProvinceObj.code}?depth=2`)
        .then((res) => {
          const districts = res.data.districts;
          setDistrict(districts);

          const selectedDistrictObj = districts.find(d => d.name === addr.district);
          setSelectedDistrict(selectedDistrictObj);

          // Tiếp tục fetch xã/phường
          if (selectedDistrictObj) {
            axios(`https://provinces.open-api.vn/api/d/${selectedDistrictObj.code}?depth=2`)
              .then((res) => {
                const wards = res.data.wards;
                setWard(wards);

                const selectedWardObj = wards.find(w => w.name === addr.ward);
                setSelectedWard(selectedWardObj);
              });
          }
        });
    }
  }

  if (savedUser && savedUser.length > 0) {
    setData({
      name: savedUser[0].name || "",
      phone: savedUser[0].phone || ""
    });
  }
}, [Province]);
  const handleSubmit = (e) => {
    e.preventDefault();
    // chua nhap du tt
    const addHighlight = (ref) => {
    if (ref.current) {
      ref.current.classList.remove("highlight-missing");
      setTimeout(() => {
        ref.current.classList.add("highlight-missing");
        ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
    };

    const showAlert = () => {
      alert("⚠️ Vui lòng nhập đủ thông tin trước khi xác nhận!");
    };

    if (!dataUser.name.trim()) {
      addHighlight(nameRef);
      showAlert();
      return;
    }
    if (!dataUser.phone.trim()) {
      addHighlight(phoneRef);
      showAlert();
      return;
    }
    if (!selectedProvince) {
      addHighlight(provinceRef);
      showAlert();
      return;
    }
    if (!selectedDistrict) {
      addHighlight(districtRef);
      showAlert();
      return;
    }
    if (!selectedWard) {
      addHighlight(wardRef);
      showAlert();
      return;
    }
    if (!road.trim()) {
      addHighlight(roadRef);
      showAlert();
      return;
    }

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
            ref={phoneRef}
            className={styles.peer}
            value={dataUser.phone}
            onChange={(e) => 
              {
              phoneRef.current.classList.remove("highlight-missing");
              const onlyNums = e.target.value.replace(/\D/g, "");
              setData((prev) => ({ ...prev, phone: onlyNums }))}}
            placeholder="Số Điện Thoại...*"
          ></input>
        </div>
        <div className={styles.relative}>
          <input
            ref={nameRef}
            value={dataUser.name} 
            className={styles.peer}
            onChange={(e) =>
              {
              nameRef.current.classList.remove("highlight-missing");
              setData((prev) => ({ ...prev, name: e.target.value }))}}
            placeholder="Họ Và Tên...*"
          ></input>
        </div>
        <div className="d-flex flex-wrap justify-between">
          <div className={styles.cbProvince}>
            <select
              ref={provinceRef}
              value={selectedProvince?.code || ""}
             onChange={handleProvinceChange} className={styles.Province}>
              <option value="">Chọn Tỉnh/Thành Phố</option>
              {Province.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.cbProvince}>
            <select
              ref={districtRef}
              value={selectedDistrict?.code || ""}
            onChange={handleDistrictChange} className={styles.Province}>
              <option value="">Chọn Quận/Huyện</option>
              {District.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.relativeward}>
            <select
              ref={wardRef}
              value={selectedWard?.code || ""}
            onChange={handleWardChange} className={styles.Province}>
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
              ref={roadRef}
              value={road} 
              onChange={(e) =>
                {
                roadRef.current.classList.remove("highlight-missing");
                setRoad(e.target.value)}}
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
