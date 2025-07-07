// components/ReviewList.jsx
import React, { memo, useEffect, useState } from "react";
import styles from "./ReviewList.module.css";
import ReviewForm from "../ReviewForm/ReviewForm";
import axios from "axios";
import Rating from "react-rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rc_bhx, setRc_bhx] = useState(false);
  const [showAll, setShowAll] = useState(false); // thêm trạng thái xem tất cả

  const handlebtn = () => {
    setRc_bhx(!rc_bhx);
  };

  useEffect(() => {
    axios
      .get(`https://dtweb.onrender.com/ReviewForm/${productId}`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [productId]);

  // danh sách hiển thị: top 5 hoặc tất cả
  const displayedReviews = showAll
    ? [...reviews]
    : [...reviews].sort((a, b) => b.rate - a.rate).slice(0, 3);

  return (
    <div className={`mt-2 bg-white ${styles.ReviewList}`}>
      <div className={`${styles.contentReview}`}>
        <div className={`${styles.boxrate}`}>
          <h2>Đánh giá</h2>
          <div className={`${styles.boxrate__top}`}></div>

          <div className={`${styles.rt_list}`}>
            <ul className={`${styles.comment_list}`}>
              {displayedReviews.map((item, index) => (
                <li key={item._id} className={`${styles.r_57511140}`}>
                  <div className={`${styles.cmt_top}`}>
                    <p className={`${styles.cmt_top_name}`}>{item.name}</p>
                  </div>
                  <div className={`${styles.cmt_intro}`}>
                    <div className={`${styles.cmt_top_star}`}>
                      <Rating
                        initialRating={item.rate}
                        readonly={true}
                        emptySymbol={
                          <span className="star">
                            <FontAwesomeIcon
                              icon={faStar}
                              size="lg"
                              style={{ color: "#b0b6bf" }}
                            />
                          </span>
                        }
                        fullSymbol={
                          <span className="star full">
                            <FontAwesomeIcon
                              icon={faStar}
                              size="lg"
                              style={{ color: "#FFD43B" }}
                            />
                          </span>
                        }
                      />
                    </div>
                  </div>
                  <div className={`${styles.cmt_content}`}>
                    <p className={`${styles.cmt_txt}`}>{item.comment}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* nút xem thêm hoặc ẩn bớt */}
            {reviews.length > 3 && (
              <div className={styles.box_flex}>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className={styles.rc_bhx}
                >
                  {showAll ? "Ẩn bớt" : "Xem tất cả đánh giá"}
                </button>
              </div>
            )}

            {/* nút viết đánh giá */}
            <div className={`${styles.box_flex}`}>
              <div
                onClick={handlebtn}
                className={`${styles.rc_bhx} ${rc_bhx ? `d-none` : ``}`}
              >
                Viết đánh giá
              </div>
            </div>
          </div>

          {/* popup form đánh giá */}
          <div className={`${rc_bhx ? `` : `d-none`}`}>
            <ReviewForm
              onSuccess={() => setRc_bhx(false)}
              productId={productId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ReviewList);
