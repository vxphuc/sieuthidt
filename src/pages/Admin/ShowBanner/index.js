import { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import style from './ShowBanner.module.css'

function ShowBanner() {
  const [dataBanner, setDataBanner] = useState([]);

  const getCookie = (name)=>{
    const cookies = document.cookie.split(';')
    for(let cookie of cookies){
        const [key, value] = cookie.trim().split('=');
        if(key === name) return(value)
    }
return null
}

const token = getCookie('authToken')
 useEffect(()=>{
    axios
    .get("https://web-dt.onrender.com/sign-in/banner",{
        headers: { Authorization: `Bearer ${token}` }
    })
        .then((res) => setDataBanner(res.data));
 }, [])
  return (
    <div>
      <NavLink className= "btn btn-primary" to= '/quan-tri/them-moi-banner'>Thêm mới banner</NavLink>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">banner</th>
            <th scope="col">Thời gian tạo</th>
            <th scope="col">chức năng</th>
          </tr>
        </thead>
        <tbody>
          {dataBanner.map((banner, index) => {
            return (
              <tr key={index}>
                <th scope="row">{index+1}</th>
                <td><img width= '300px' height='200px' src={`https://web-dt.onrender.com/uploads/${banner.image}`}></img></td>
                <td>{banner.dateCreate}</td>
                <td>
                  <NavLink className= {`btn btn-danger`}>Xóa</NavLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ShowBanner;
