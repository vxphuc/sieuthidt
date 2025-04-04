// components/ReviewForm.jsx
import React, { memo, useState } from "react";
import RatingStars from "../RatingStars";
import styles from "./ReviewForm.module.css";
import axios from "axios";

const ReviewForm = ({ productId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [phone, setPhone] = useState("");

  const [isSubmit, setIsSubmit] = useState(true);

  const handlePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const validateForm = () => {
    const phoneRegex = /^(0|\+84)(\d{9})$/;
    if(!name.trim()) return false;
    if(!phoneRegex.test(phone)) return false;
    if(rating <= 0) return false;
    return true
  }

  console.log(name, phone, rating, comment);
 

  const formData = new FormData();
  formData.append("rate", rating);
  formData.append("comment", comment);
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("productID", productId);



  const handleSubmit = (e) => {
    e.preventDefault();
    if(!validateForm()){
      setIsSubmit(false)
      return
    }

    const formData = new FormData();
    formData.append("rate", rating);
    formData.append("comment", comment);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("productID", productId);
    
    setIsSubmit(true)
      axios
      .post(`https://web-dt.onrender.com/ReviewForm/reviewProduct`,{
        rate: rating,
        comment: comment,
        name: name,
        phone: phone,
        productID: productId,
      })
      .then((response) => {
        console.log(response);
        if(onSuccess){
          console.log(onSuccess())
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <form className="my-4">
      <div className={`${styles.RatingStars}`}>
        <RatingStars
          value={rating}
          edit={true}
          onSelect={(value) => {
            setRating(value);
          }}
        />
      </div>
      <div>
        <div className={`${styles.inputrating__group}`}>
          <input
            placeholder="mời bạn chia sẽ thêm cảm nhận..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 mt-2"
          />
        </div>
        <div className={`${styles.item}`}>
          <div className={`${styles.fRName}`}>
            <span className={`text-danger ${(isSubmit) ? `d-none` : ``}`}>
              * bạn cần phải nhập trường này
            </span>
            <input
            value={name}
              onChange={handleName}
              placeholder="Học tên (bắt buộc)"
            ></input>
          </div>
          <div className={`${styles.fRPhone}`}>
            <span className={`text-danger ${(isSubmit) ? `d-none` : ``}`}>
              * số điện thoại phải đúng định dạng
            </span>
            <input
              value={phone}
              onChange={handlePhone}
              placeholder="nhập số điện thoại (bắt buộc)"
            ></input>
          </div>
        </div>
        <div className={`${styles.dcap}`}>
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-2"
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </form>
  );
};

export default memo(ReviewForm);
