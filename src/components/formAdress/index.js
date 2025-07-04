import styles from "./FormAdress.module.css";
import api from "../../api/axios";
import { useState, useEffect } from "react";

function FormAdress({ className, adress, onSelect }) {
  const [name, setName] = useState([]);
  useEffect(() => {
    const fecthUser = async () => {
      const res = await api.get(
        "/sign-in/user-profile",
        {
          withCredentials: true,
        }
      );
      setName(res.data);
    };
    fecthUser();
  }, []);


  const handleSelect = (e) => {
    onSelect(e.target.value);
  };
   const handledelete = (e, index) =>{
    e.preventDefault();
    api.delete(`/address/delete/${adress[index]._id}/${adress[index].wards._id}/${adress[index].districts._id}/${adress[index].provinces._id}`,{
      withCredentials: true,
    })

    window.location.reload()
    
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
                  value={item._id}
                  onChange={handleSelect}
                />
                <label htmlFor="name">{name.name}, {name.phone}</label>
                <br />
              </div>
              <div className={`${styles.change}`}>
                <button onClick={(e) => handledelete(e, index)}>Xóa</button>
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
