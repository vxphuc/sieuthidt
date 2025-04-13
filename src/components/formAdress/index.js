import styles from "./FormAdress.module.css";
import axios from "axios";
import { useState, useEffect } from "react";

function FormAdress({ className, adress, onSelect }) {
  const [name, setName] = useState([]);

  useEffect(() => {
    const fecthUser = async () => {
      const res = await axios.get(
        "https://web-dt.onrender.com/sign-in/user-profile",
        {
          withCredentials: true,
        }
      );
      setName(res.data);
    };
    fecthUser();
  }, []);

  console.log(name)
  const handleFix = (e) => {
    e.preventDefault();
  };

  const handleSelect = (e) => {
    onSelect(e.target.value);
  };

  return (
    <div>
      <form className={`${className}`}>
        {adress.map((item, index) => {
          return (
            <div key={index} className={`${styles.form__group}`}>
              <div className={`${styles.info}`}>
                <input
                  type="radio"
                  name="name"
                  id="A"
                  className={styles.radio}
                  value={item._id}
                  onChange={handleSelect}
                />
                <label htmlFor="name">{name.name}, {name.phone}</label>
                <br />
              </div>
              <div className={`${styles.change}`}>
                <button onClick={(e) => handleFix(e)}>Sửa</button>
                <button>Xóa</button>
              </div>
              <p className={`${styles.add}`}>
                {item.nameRoad}, {item.wards.nameWards},{" "}
                {item.districts.nameDistricts}, {item.provinces.nameProvinces}
              </p>
            </div>
          );
        })}
      </form>
    </div>
  );
}

export default FormAdress;
