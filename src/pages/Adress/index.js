import styles from "./Adress.module.css";
import { useNavigate } from "react-router-dom";
import { faChevronLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BackgroundPopup from "../../components/BackgroundPopup";
import { useEffect, useState } from "react";
import axios from "axios";
import FormAdress from "../../components/formAdress";

function Adress() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
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
  const [Address, setAddress] = useState('');
  //truyền địa chỉ xuống form địa chỉ
  const [data, setData] = useState([]);
  //gửi địa chỉ vào shop
  const [selectedAddressId, setSelectedAddressId] = useState(null);
 

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

  // lấy địa chỉ
  const hadleAdress = (e) => {
    setAddress(e.target.value);
  };
  // gửi địa chỉ lên server
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(
      `https://web-dt.onrender.com/address/create`,
      {
        IDProvinces: selectedProvince.code,
        nameProvinces: selectedProvince.name,
        IDDistricts: selectedDistrict.code,
        nameDistricts: selectedDistrict.name,
        IDWards: selectedWard.code,
        nameWards: selectedWard.name,
        nameRoad: Address,
        idWards: selectedWard.code,
      },
      {
        withCredentials: true
      }
    )
    .then(res => {
      setShowPopup(false);
      axios
      .get("https://web-dt.onrender.com/address", {
        withCredentials: true
      })
      .then((response) => {
        setData(response.data);
      });
    })
    .catch(err => console.log(err))
  };

  //khởi tạo address từ đầu
  useEffect(() => {
    axios.get("https://web-dt.onrender.com/address", {
      withCredentials: true
    })
    .then(res => setData(res.data))
    .catch(err => console.log(err));
  }, []);
  

  const handleClose = () => {
    setShowPopup(false);
  };
  const handleShow = () => {
    setShowPopup(true);
  };

  const handleSelect = () =>{
    axios.patch(`https://web-dt.onrender.com/cart/updateAddress`, {
      roadID: selectedAddressId
    }, {
      withCredentials: true
    })
    .then(res => {
      navigate(-1)
    })
  }



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
        <FormAdress onSelect = {(id) => {setSelectedAddressId(id)}} adress = {data} className={styles.form}></FormAdress>
        <p onClick={handleShow} className={`${styles.a}`}>
          + nhập địa chỉ khác
        </p>
        {!showPopup && (
        <div className={`${styles.role}`}>
          <button onClick={handleSelect}>Xác nhận</button>
        </div>
        )}
      </div>
      <div>
        <BackgroundPopup
          style={{ display: showPopup ? "" : "none" }}
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${styles.popup}`}
          >
            <div className={`${styles.titlePopup} position-relative`}>
              Thêm địa chỉ nhận hàng
              <span onClick={handleClose} className={styles.closeIcon}>
                <FontAwesomeIcon icon={faXmark} />
              </span>
            </div>
            <div className={`${styles.bodyPopup}`}>
              <div className={`${styles.pdPopup}`}>
                <div className={`${styles.popupAdress}`}>
                  <div className={`${styles.distric}`}>
                    <div className={`${styles.districSelect}`}>
                      <select
                        onChange={handleProvinceChange}
                        className={`${styles.selectDistric}`}
                      >
                        <option value="">Chọn tỉnh thành</option>
                        {Province.map((item, index) => {
                          return (
                            <option key={index} value={item.code}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className={`${styles.distric}`}>
                    <div className={`${styles.districSelect}`}>
                      <select
                        onChange={handleDistrictChange}
                        className={`${styles.selectDistric}`}
                      >
                        <option value="">Chọn quận huyện</option>
                        {District.map((item, index) => {
                          return (
                            <option key={index} value={item.code}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className={`${styles.wards}`}>
                    <div className={`${styles.wardsSelect}`}>
                      <select
                        onChange={handleWardChange}
                        className={`${styles.selectWards}`}
                      >
                        <option value="">Chọn phường xã</option>
                        {Ward.map((item, index) => {
                          return (
                            <option key={index} value={item.code}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className={`${styles.stress}`}>
                    <div className={`position-relative`}>
                      <input
                        onChange={hadleAdress}
                        placeholder="số nhà, tên đường"
                        className={`${styles.inputStress}`}
                      ></input>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  className={`${styles.buttonAdress}`}
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          </div>
        </BackgroundPopup>
      </div>
    </div>
  );
}

export default Adress;
