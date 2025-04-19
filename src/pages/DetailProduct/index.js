import styles from "./DetailProduct.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink, useParams, useNavigate, data } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import ListProductSame from "../ListProductSame";
import ReviewList from "../../components/Ratingstars/ReviewList/ReviewList.js";
import ReviewForm from "../../components/Ratingstars//ReviewForm/ReviewForm.js";
import {CartContext} from "../../contexts/CartContext.js";

function DetailProduct() {
  const { slug } = useParams();
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [bgX, setBgX] = useState(0);
  const {fetchCartCount} = useContext(CartContext);

  const bgXRef = useRef(0);
  const [moreDescription, setMoreDescription] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      bgXRef.current = Math.random() * 100;
      // update lại style bằng JS nếu cần
      const button = document.getElementById("btn-buy");
      if (button) {
        button.style.backgroundPositionX = `${bgXRef.current}%`;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlemoreDescription = () => {
    setMoreDescription(!moreDescription);
  };

  const nextImage = () => {
    const totalImages = product[0].image.length || 0;
    setCurrentImage((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    const totalImages = product[0]?.image.length || 0;
    setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages);
  };

  useEffect(() => {
    axios.get(`https://dtweb.onrender.com/product/${slug}`).then((response) => {
      setProduct(response.data);
    });
  }, [slug]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlechooseImg = (index) => {
    setCurrentImage(index);
  };

  const handleBuy = (product) => {
    axios
      .post(
        "https://dtweb.onrender.com/cart/create",
        {
          productID: product,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        fetchCartCount(); // Cập nhật số lượng giỏ hàng sau khi thêm sản phẩm
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className={`${styles.DetailProduct}`}>
      <div className={`${styles.titleDetailProduct}`}>
        <button onClick={handleGoBack} className={`${styles.back}`}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>
        <div className={`${styles.nameProduct} `}>
          {" "}
          {product.map((item, index) => {
            return <span key={index}>{item.Typeproduct[0].name}</span>;
          })}
        </div>
      </div>
      <div className={`d-flex mt-2 flex-wrap`}>
        <div className={`${styles.product}`}>
          <div className={`${styles.image} `}>
            <div className={`${styles.h_full}`}>
              <div
                onClick={prevImage}
                className={`${styles.left} `}
              >
                <button className={`d-flex`}>
                  {" "}
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    size="lg"
                    style={{ color: "#ffffff" }}
                  />
                </button>
              </div>
              <div
                onClick={nextImage}
                className={`${styles.right} `}
              >
                <button className={`d-flex`}>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    size="lg"
                    style={{ color: "#ffffff" }}
                  />
                </button>
              </div>
              <div className={`${styles.layout}`}>
                <div
                  className={`${styles.LayoutImg}`}
                  style={{
                    transform: `translateX(-${currentImage * 100}%)`,
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  {product.map((item) => {
                    return item.image.map((img, index) => {
                      return (
                        <div className={`${styles.swiper_slide}`} key={index}>
                          <div
                            className={`position-relative d-flex justify-content-center align-items-center`}
                          >
                            <span
                              className={`${styles.span_slide} `}
                            >
                              <img src={img}></img>
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
              <div className={`${styles.childrenImg}`}>
                <div
                  className={`${styles.swiperWrapper}`}
                >
                  {product.map((item) => {
                    return item.image.map((img, index) => {
                      
                      return (
                        <div
                          className={`${styles.swiper_slide_img}`}
                          key={index}
                        >
                          <div
                            className={`position-relative d-flex justify-content-center align-items-center`}
                          >
                            <span
                              className={`${styles.span_slide_img} ${
                                index === currentImage ? styles.active : ""
                              } position-relative`}
                            >
                              <img
                                onClick={() => handlechooseImg(index)}
                                className={`${
                                  index === currentImage ? styles.active : ""
                                }`}
                                src={img}
                              ></img>
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.divPrice} position-sticky`}>
          {product.map((item, index) => {
            return (
              <h1 key={index} className={`${styles.TitleNameProduct}`}>
                {item.name}
              </h1>
            );
          })}
          <div className={`${styles.price} d-flex flex-column`}>
            {product.map((item, index) => {
              return (
                <div key={index}>
                  <div className={`mb-2 d-flex align-items-center`}>
                    <div className={`text-danger ${styles.textPrice}`}>
                      {Number.parseInt(item.price).toLocaleString() + "đ"}
                    </div>
                  </div>
                </div>
              );
            })}
            <button
            onClick={() => handleBuy(product[0]._id)}
              style={{
                backgroundPositionY: `50%`,
                backgroundPositionX: `${bgX}%`,
              }}
            >
              Mua
            </button>
          </div>
          <div>
            <ListProductSame></ListProductSame>
          </div>
        </div>
      </div>
      <div className={`${styles.Description} position-relative`}>
        <h2 className={` position-relative`}>Thông tin sản phẩm</h2>
        {product.map((item, idex) => {
          return (
            <div
              key={idex}
              dangerouslySetInnerHTML={{
                __html:
                  moreDescription === false
                    ? `${item.description.slice(0, 550)}`
                    : item.description,
              }}
            ></div>
          );
        })}
        <div className={styles.moreDescription}>
          <div
            onClick={handlemoreDescription}
            className="justify-content-center align-items-center d-flex"
          >
            {moreDescription === false ? `Xem thêm >` : `Thu gọn`}
          </div>
        </div>
      </div>
      <ReviewList
        productId={product.length > 0 ? product[0]._id : ""}
      ></ReviewList>
    </div>
  );
}

export default DetailProduct;
