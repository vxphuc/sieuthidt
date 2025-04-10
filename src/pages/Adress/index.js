import styles from "./Adress.module.css";
import { useNavigate } from "react-router-dom";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BackgroundPopup from "../../components/BackgroundPopup";
import { useEffect, useState } from "react";
import axios from "axios";

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

  const handleFix = (e) => {
    e.preventDefault();
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
        <form className={`${styles.form}`}>
          <div className={`${styles.form__group}`}>
            <div className={`${styles.info}`}>
              <input
                type="radio"
                name="name"
                id="A"
                className={styles.radio}
                value=""
              />
              <label htmlFor="name">Anh A,</label>
              <label htmlFor="name">09999999</label>
              <br />
            </div>
            <div className={`${styles.change}`}>
              <button onClick={(e) => handleFix(e)}>Sửa</button>
              <button>Xóa</button>
            </div>
            <p className={`${styles.add}`}>nha thk zinh, 11,111</p>
          </div>
          <div className={`${styles.form__group}`}>
            <div className={`${styles.info}`}>
              <input
                type="radio"
                name="name"
                id="A"
                className={styles.radio}
                value=""
              />
              <label fohtmlForr="name">Anh A,</label>
              <label htmlFor="name">09999999</label>
              <br />
            </div>
            <div className={`${styles.change}`}>
              <button onClick={(e) => handleFix(e)}>Sửa</button>
              <button>Xóa</button>
            </div>
            <p className={`${styles.add}`}>nha thk zinh, 11,111</p>
          </div>
        </form>
        <p className={`${styles.a}`}>+ nhập địa chỉ khác</p>
        <div className={`${styles.role}`}>
          <button>Xác nhận</button>
        </div>
      </div>
      <div>
        <BackgroundPopup>
          <div className={`${styles.popup}`}>
            <div className={`${styles.titlePopup}`}>
              Thêm địa chỉ nhận hàng{" "}
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
                      <select className={`${styles.selectWards}`}>
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
                      <input placeholder="số nhà, tên đường" className={`${styles.inputStress}`}></input>
                    </div>
                  </div>
                </div>
                <button className={`${styles.buttonAdress}`}>Hoàn tất</button>
              </div>
            </div>
          </div>
        </BackgroundPopup>
      </div>
    </div>
  );
}

export default Adress;
