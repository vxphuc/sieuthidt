import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Home.module.css";
import TypeProduct from "../TypeProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSolid,
  faCaretRight,
  faCaretLeft,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  const [img, setImg] = useState([]);
  const sliderRef = useRef(null);
  const currentIndex = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://web-dt.onrender.com/sign-in/banner")
      .then((res) => setImg(res.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (img.length > 0) {
      AutoSlide();
    }
    return () => {
      if (intervalRef) {
        clearInterval(intervalRef.current);
      }
    };
  }, [img]);

  const AutoSlide = () => {
    intervalRef.current = setInterval(() => {
      if (sliderRef.current) {
        currentIndex.current = (currentIndex.current + 1) % img.length;
        sliderRef.current.style.transform = `translateX(-${
          currentIndex.current * 100
        }%)`;
      }
    }, 3000);
  };

  const nextSlide = () => {
    if (sliderRef.current && img.length > 0) {
      currentIndex.current = (currentIndex.current + 1) % img.length;
      sliderRef.current.style.transform = `translateX(-${
        currentIndex.current * 100
      }%)`;
      clearInterval(intervalRef.current);
      AutoSlide();
    }
  };

  const prevSlide = () => {
    if (sliderRef.current && img.length > 0) {
      currentIndex.current =
        (currentIndex.current - 1 + img.length) % img.length;
      sliderRef.current.style.transform = `translateX(-${
        currentIndex.current * 100
      }%)`;
      clearInterval(intervalRef.current);
      AutoSlide();
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div ref={sliderRef} className={styles.banner}>
          {img.map((image, index) => {
            return (
              <img
                key={index}
                src={`https://web-dt.onrender.com/uploads/${image.image}`}
              ></img>
            );
          })}
        </div>
        <div className={styles.icons}>
          <div>
            <FontAwesomeIcon
              onClick={prevSlide}
              icon={faCaretLeft}
              style={{ color: "brown" }}
              size="2x"
            />
          </div>
          <div>
            <FontAwesomeIcon
              onClick={nextSlide}
              icon={faCaretRight}
              style={{ color: "brown" }}
              size="2x"
            />
          </div>
        </div>
      </div>
      <div>
      <TypeProduct></TypeProduct>
      </div>
    </div>
  );
}

export default Home;
