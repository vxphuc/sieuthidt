import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Home.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSolid,
  faCaretRight,
  faCaretLeft,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import ProductHome from "../ProductHome";

function Home() {
  const [img, setImg] = useState([]);
  const sliderRef = useRef(null);
  const currentIndex = useRef(0);
  const intervalRef = useRef(null);
  const [newProduct, setNewProduct] = useState([]);
  const nameNewProduct = useRef(null);

  const getcookie = (name) => {
    const cookies = document.cookie.split(";");
    for(const cookie of cookies) {
      const [key, value] = cookie.trim().split("=");
      if(key === name) {
        return value;
      }
    }
  };

  const token = getcookie('authToken')

  // mua sản phẩm
  const handleBuy = (product) => {
      axios
        .post("http://localhost:5000/cart/create", {
          productID: product,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => console.log(error));
  }
  

  //new product
  useEffect(() => {
    axios
      .get("https://web-dt.onrender.com/product/newProduct")
      .then((res) => setNewProduct(res.data))
      .catch((error) => console.log(error));
  }, []);

  //banner
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
    <div className="">
      <div className={``}>
        
        <div className={``}>
          <div className={`${styles.container}`}>
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

          <div className={styles.newProduct}>
            <div className={`${styles.title} d-flex justify-content-between`}>
              <h2>Sản phẩm mới</h2>
            </div>
            <div className={`d-flex ${styles.products}`}>
              {newProduct.map((product, index) => {
                let price = Number.parseInt(product.price.$numberDecimal);
                price = price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                });
                return (
                  <div className={`${styles.boxProduct}`} key={index}>
                    <NavLink to = {`/${product.typeProduct[0].slug}/${product.slug}`}>
                      <img
                        className={`${styles.imgNewProduct}`}
                        src={`${product.image[0]}`}
                        alt="product"
                      ></img>
                      <div
                        className={`position-absolute top-0 z-1 bg-success text-white ${styles.new}`}
                      >
                        <p className={``}>new</p>
                      </div>
                      <div className={`${styles.infoProduct}`}>
                        <h5 ref={nameNewProduct}>
                          {product.name.length > 18
                            ? `${product.name.substring(0, 25)}...`
                            : product.name}
                        </h5>
                      </div>
                    </NavLink>
                    <div className={`${styles.content} d-flex`}>
                      <div className={`${styles.price}`}>
                        <h6>{price}</h6>
                      </div>
                      <div className={`${styles.btnBuy}`}>
                        <button onClick={() => handleBuy(product._id)} className={`${styles.btn}`}>Mua</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${styles.product}`}>
              <ProductHome></ProductHome>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
