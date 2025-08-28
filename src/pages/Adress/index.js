import styles from "./Adress.module.css";
import { useNavigate } from "react-router-dom";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { saveName, saveAddress, getAddress, getName } from "../../services/cartService";

function Adress() {
  const navigate = useNavigate();
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  const [road, setRoad] = useState("");
  const [dataUser, setData] = useState({ name: "", phone: "" });

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const provinceRef = useRef(null);
  const wardRef = useRef(null);
  const roadRef = useRef(null);

  // Fetch tỉnh
  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/v2/p/")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("❌ Lỗi khi fetch tỉnh/thành:", err));
  }, []);

  // Fetch xã/phường
  useEffect(() => {
    if (selectedProvince?.code) {
      axios.get("https://provinces.open-api.vn/api/v2/w/")
        .then((res) => {
          const filtered = res.data.filter(w => w.province_code === selectedProvince.code);
          setWards(filtered);
        })
        .catch((err) => console.error("❌ Lỗi khi fetch xã/phường:", err));
    }
  }, [selectedProvince]);

  const handleProvinceChange = (e) => {
    const code = parseInt(e.target.value);
    const province = provinces.find(p => p.code === code);
    setSelectedProvince(province);
    setSelectedWard(null);
  };

  const handleWardChange = (e) => {
    const code = parseInt(e.target.value);
    const ward = wards.find(w => w.code === code);
    setSelectedWard(ward);
  };

  useEffect(() => {
    const savedAddress = getAddress();
    const savedUser = getName();
    if (savedAddress && savedAddress.length > 0) {
      const addr = savedAddress[0];
      setRoad(addr.road || "");
      const selectedProvinceObj = provinces.find(p => p.name === addr.province);
      setSelectedProvince(selectedProvinceObj);
      if (selectedProvinceObj) {
        axios.get("https://provinces.open-api.vn/api/v2/w/")
          .then((res) => {
            const wardList = res.data.filter(w => w.province_code === selectedProvinceObj.code);
            setWards(wardList);
            const selectedWardObj = wardList.find(w => w.name === addr.ward);
            setSelectedWard(selectedWardObj);
          });
      }
    }
    if (savedUser && savedUser.length > 0) {
      setData({ name: savedUser[0].name || "", phone: savedUser[0].phone || "" });
    }
  }, [provinces]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const addHighlight = (ref) => {
      if (ref.current) {
        ref.current.classList.remove("highlight-missing");
        setTimeout(() => {
          ref.current.classList.add("highlight-missing");
          ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    };

    const showAlert = () => alert("⚠️ Vui lòng nhập đủ thông tin trước khi xác nhận!");

    if (!dataUser.name.trim()) return addHighlight(nameRef), showAlert();
    if (!dataUser.phone.trim()) return addHighlight(phoneRef), showAlert();

    const isValidPhone = /^0[3|5|7|8|9][0-9]{8}$/.test(dataUser.phone);
    if (!isValidPhone) return addHighlight(phoneRef), alert("⚠️ Số điện thoại không hợp lệ!");

    if (!selectedProvince) return addHighlight(provinceRef), showAlert();
    if (!selectedWard) return addHighlight(wardRef), showAlert();
    if (!road.trim()) return addHighlight(roadRef), showAlert();

    const address = [{
      province: selectedProvince.name,
      ward: selectedWard.name,
      road: road,
      name: dataUser.name,
      phone: dataUser.phone
    }];
    const user = [{ name: dataUser.name, phone: dataUser.phone }];

    saveAddress(address);
    saveName(user);
    navigate(-1);
  };

  return (
    <div className={`container ${styles.container}`}>
      <div className={styles.title}>
        <div className={styles.items__center}>
          <span onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faChevronLeft} size="lg" />
          </span>
        </div>
        <span className={styles.title__text}>Thông tin nhận hàng</span>
      </div>

      <input
        ref={phoneRef}
        className={styles.peer}
        value={dataUser.phone}
        onChange={(e) => {
          phoneRef.current.classList.remove("highlight-missing");
          const onlyNums = e.target.value.replace(/\D/g, "");
          setData((prev) => ({ ...prev, phone: onlyNums }));
        }}
        placeholder="Số Điện Thoại...*"
      />

      <input
        ref={nameRef}
        value={dataUser.name}
        className={styles.peer}
        onChange={(e) => {
          nameRef.current.classList.remove("highlight-missing");
          setData((prev) => ({ ...prev, name: e.target.value }));
        }}
        placeholder="Họ Và Tên...*"
      />

      <div className="d-flex flex-wrap justify-between">
        <div className={styles.cbProvince}>
          <select
            ref={provinceRef}
            value={selectedProvince?.code || ""}
            onChange={handleProvinceChange}
            className={styles.Province}
          >
            <option value="">Chọn Tỉnh/Thành Phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.relativeward}>
          <select
            ref={wardRef}
            value={selectedWard?.code || ""}
            onChange={handleWardChange}
            className={styles.Province}
          >
            <option value="">Chọn Xã/Phường</option>
            {wards.map((ward) => (
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
            onChange={(e) => {
              roadRef.current.classList.remove("highlight-missing");
              setRoad(e.target.value);
            }}
            className={styles.peer}
            placeholder="nhập tên đường, số nhà...*"
          />
        </div>
      </div>

      <div className={styles.role}>
        <button onClick={handleSubmit}>Xác nhận</button>
      </div>
    </div>
  );
}

export default Adress;
