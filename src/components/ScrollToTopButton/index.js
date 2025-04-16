// src/components/ScrollToTopButton.jsx
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons"; // icon mũi tên lên

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {visible && (
        <button
          onClick={scrollToTop}
          style={{
            width: "40px",
            height: "40px",
            position: "fixed",
            bottom: "40px",
            right: "30px",
            zIndex: "1000",
            backgroundColor: "rgb(59 197 44 / 84%)",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgb(59 197 44 / 84%)",
            transition: "opacity 0.3s ease",
          }}
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faArrowUp} style={{marginBottom: "5px"}}/>
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
