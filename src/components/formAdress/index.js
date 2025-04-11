import styles from "./FormAdress.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

function FormAdress({ className, adress, onSelect }) {
console.log(adress)
  //lấy token
  const getToken = (name) => {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if (key === name) {
        return value;
      }
    }
  };
  const Token = getToken("authToken");
  console.log(adress);
  const handleFix = (e) => {
    e.preventDefault();
  };

  const handleSelect = (e) => {
    onSelect(e.target.value)
  }

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
                  value= {item._id}
                  onChange={handleSelect}
                />
                <label htmlFor="name">Anh A,</label>
                <label htmlFor="name">09999999</label>
                <br />
              </div>
              <div className={`${styles.change}`}>
                <button onClick={(e) => handleFix(e)}>Sửa</button>
                <button>Xóa</button>
              </div>
              <p className={`${styles.add}`}>{item.nameRoad}, {item.wards.nameWards}, {item.districts.nameDistricts}, {item.provinces.nameProvinces}</p>
            </div>
          );
        })}
      </form>
    </div>
  );
}

export default FormAdress;
