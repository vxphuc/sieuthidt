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
  const [communes, setCommunes] = useState([]);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [road, setRoad] = useState("");
  const [dataUser, setData] = useState({ name: "", phone: "" });

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const provinceRef = useRef(null);
  const communeRef = useRef(null);
  const roadRef = useRef(null);

  // ✅ Fetch tỉnh
  useEffect(() => {
    axios.get("https://production.cas.so/address-kit/2025-07-01/provinces")
      .then((res) => setProvinces(res.data.provinces || []))
      .catch((err) => console.error("❌ Lỗi fetch tỉnh/thành:", err));
  }, []);

  // ✅ Fetch xã/phường
  useEffect(() => {
  axios.get("https://production.cas.so/address-kit/2025-07-01/communes")
    .then((res) => {
      if (Array.isArray(res.data.communes)) {
        setCommunes(res.data.communes);
      } else {
        console.error("❌ Không có danh sách communes trong response");
      }
    })
    .catch((err) => console.error("❌ Lỗi fetch xã/phường:", err));
}, []);

  // ✅ Chỉ lọc xã thuộc tỉnh đã chọn
  const filteredCommunes = selectedProvince
    ? communes.filter((c) => c.provinceCode?.toString() === selectedProvince.code?.toString())
    : [];

  // ✅ Chờ provinces và communes load xong mới xử lý dữ liệu cũ từ localStorage
  useEffect(() => {
    if (provinces.length === 0 || communes.length === 0) return;

    const savedAddress = getAddress();
    const savedUser = getName();

    if (savedUser?.length) {
      setData({ name: savedUser[0].name || "", phone: savedUser[0].phone || "" });
    }

    if (savedAddress?.length) {
      const addr = savedAddress[0];
      setRoad(addr.road || "");

      const provinceObj = provinces.find(p => p.name === addr.province);
      if (provinceObj) {
        setSelectedProvince(provinceObj);
        const wardObj = communes.find(w =>
          w.name === addr.ward &&
          w.provinceCode?.toString() === provinceObj.code?.toString()
        );
        if (wardObj) setSelectedCommune(wardObj);
      }
    }
  }, [provinces, communes]);

  // ✅ Xử lý khi chọn tỉnh
  const handleProvinceChange = (e) => {
    const selectedCode = e.target.value;
    const found = provinces.find((p) => p.code.toString() === selectedCode);
    setSelectedProvince(found || null);
    setSelectedCommune(null);
  };

  // ✅ Xử lý khi chọn xã
  const handleCommuneChange = (e) => {
    const selectedCode = e.target.value;
    const found = filteredCommunes.find((c) => c.code.toString() === selectedCode);
    setSelectedCommune(found || null);
  };

  // ✅ Kiểm tra trước khi submit
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

    const showAlert = (msg = "⚠️ Vui lòng nhập đủ thông tin!") => alert(msg);

    if (!dataUser.name.trim()) return addHighlight(nameRef), showAlert();
    if (!dataUser.phone.trim()) return addHighlight(phoneRef), showAlert();
    if (!/^0[3|5|7|8|9][0-9]{8}$/.test(dataUser.phone)) return addHighlight(phoneRef), showAlert("⚠️ Số điện thoại không hợp lệ!");
    if (!selectedProvince) return addHighlight(provinceRef), showAlert();
    if (!selectedCommune) return addHighlight(communeRef), showAlert();
    if (!road.trim()) return addHighlight(roadRef), showAlert();

    const address = [{
      province: selectedProvince.name,
      ward: selectedCommune.name,
      road,
      name: dataUser.name,
      phone: dataUser.phone
    }];

    saveAddress(address);
    saveName([{ name: dataUser.name, phone: dataUser.phone }]);
    navigate(-1);
  };

  return (
    <div className="container">
      <div className={`container ${styles.container}`}>
        <div className={styles.title}>
          <div className={styles.items__center}>
            <span onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faChevronLeft} size="lg" />
            </span>
          </div>
          <span className={styles.title__text}>Thông tin nhận hàng</span>
        </div>

        <div className={styles.relative}>
          <input ref={phoneRef} value={dataUser.phone} onChange={(e) => {
            phoneRef.current.classList.remove("highlight-missing");
            const onlyNums = e.target.value.replace(/\D/g, "");
            setData((prev) => ({ ...prev, phone: onlyNums }));
          }} placeholder="Số Điện Thoại...*" className={styles.peer} />
        </div>

        <div className={styles.relative}>
          <input ref={nameRef} value={dataUser.name} onChange={(e) => {
            nameRef.current.classList.remove("highlight-missing");
            setData((prev) => ({ ...prev, name: e.target.value }));
          }} placeholder="Họ Và Tên...*" className={styles.peer} />
        </div>

        <div className="d-flex flex-wrap justify-between">
          <div className={styles.cbProvince}>
            <select ref={provinceRef} value={selectedProvince?.code || ""} onChange={handleProvinceChange} className={styles.Province}>
              <option value="">Chọn Tỉnh/Thành Phố</option>
              {provinces.map((p) => (
                <option key={p.code} value={p.code}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.relativeward}>
            <select ref={communeRef} value={selectedCommune?.code || ""} onChange={handleCommuneChange} className={styles.Province}>
              <option value="">Chọn Xã/Phường</option>
              {filteredCommunes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}{c.district_name ? ` (${c.district_name})` : ""}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.relativeward}>
            <input ref={roadRef} value={road} onChange={(e) => {
              roadRef.current.classList.remove("highlight-missing");
              setRoad(e.target.value);
            }} placeholder="Tên đường, số nhà..." className={styles.peer} />
          </div>
        </div>

        <div className={styles.role}>
          <button onClick={handleSubmit}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
}

export default Adress;
