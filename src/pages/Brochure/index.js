import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HTMLFlipBook from "react-pageflip";
import api from "../../api/axios";
import styles from "./Brochure.module.css";

const DEFAULT_BROCHURE_ID =
  process.env.REACT_APP_BROCHURE_ID ||
  "efdccd01-454a-4e45-bc51-bb94e0125231";

function getRequestedBrochureId() {
  const queryId = new URLSearchParams(window.location.search).get("id");
  return queryId || DEFAULT_BROCHURE_ID;
}

function toAbsolutePageUrl(pageUrl) {
  const apiBaseUrl = api.defaults.baseURL || window.location.origin;
  return new URL(pageUrl, apiBaseUrl).toString();
}

function Brochure() {
  const flipBookRef = useRef(null);
  const viewerRef = useRef(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const brochureId = useMemo(getRequestedBrochureId, []);

  const loadBrochure = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/brochure/${brochureId}`);
      const brochurePages = response.data?.data?.pages;

      if (!Array.isArray(brochurePages) || brochurePages.length === 0) {
        throw new Error("Brochure chưa có trang nào");
      }

      setPages(brochurePages.map(toAbsolutePageUrl));
      setCurrentPage(1);
    } catch (requestError) {
      console.error("Không thể tải brochure:", requestError);
      setError(
        requestError.response?.data?.message ||
          "Không thể tải brochure. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  }, [brochureId]);

  useEffect(() => {
    loadBrochure();
  }, [loadBrochure]);

  const previousPage = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipPrev();
  }, []);

  const nextPage = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipNext();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") previousPage();
      if (event.key === "ArrowRight") nextPage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextPage, previousPage]);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await viewerRef.current?.requestFullscreen();
      }
    } catch (fullscreenError) {
      console.error("Không thể bật chế độ toàn màn hình:", fullscreenError);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.homeLink} to="/">
          ← Trang chủ
        </Link>
        <h1>Brochure DT Group</h1>
        <button
          className={styles.fullscreenButton}
          type="button"
          onClick={toggleFullscreen}
        >
          Toàn màn hình
        </button>
      </header>

      <div className={styles.container}>

        <section ref={viewerRef} className={styles.viewer} aria-live="polite">
          {loading && (
            <div className={styles.status}>
              <span className={styles.spinner} aria-hidden="true" />
              <p>Đang tải brochure...</p>
            </div>
          )}

          {!loading && error && (
            <div className={styles.status}>
              <p>{error}</p>
              <button type="button" onClick={loadBrochure}>
                Thử lại
              </button>
            </div>
          )}

          {!loading && !error && pages.length > 0 && (
            <>
              <div className={styles.bookStage}>
                <div
                  className={`${styles.bookPosition} ${
                    currentPage === 1 ? styles.coverCentered : ""
                  }`}
                >
                  <HTMLFlipBook
                    ref={flipBookRef}
                    width={480}
                    height={520}
                    size="stretch"
                    maxShadowOpacity={0.25}
                    showCover
                    usePortrait
                    mobileScrollSupport
                    drawShadow
                    flippingTime={650}
                    className={styles.flipBook}
                    onFlip={(event) => setCurrentPage(event.data + 1)}
                  >
                    {pages.map((pageUrl, index) => (
                      <div className={styles.sheet} key={pageUrl}>
                        <img
                          src={pageUrl}
                          alt={`Trang ${index + 1}`}
                          draggable="false"
                          loading={index < 4 ? "eager" : "lazy"}
                        />
                      </div>
                    ))}
                  </HTMLFlipBook>
                </div>
              </div>

              <nav className={styles.controls} aria-label="Điều khiển brochure">
                <button
                  type="button"
                  onClick={previousPage}
                  disabled={currentPage <= 1}
                  aria-label="Trang trước"
                >
                  ‹
                </button>
                <span>
                  Trang {currentPage} / {pages.length}
                </span>
                <button
                  type="button"
                  onClick={nextPage}
                  disabled={currentPage >= pages.length}
                  aria-label="Trang sau"
                >
                  ›
                </button>
              </nav>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default Brochure;
