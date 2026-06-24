import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Brochure.module.css";

const FLIPBOOK_URL = "https://heyzine.com/flip-book/5a21d6b845.html";
const OEMBED_URL = `https://heyzine.com/api1/oembed?url=${encodeURIComponent(
  FLIPBOOK_URL
)}&format=json`;

function Brochure() {
  const [flipbook, setFlipbook] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadFlipbook() {
      try {
        const response = await fetch(OEMBED_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Heyzine responded with status ${response.status}`);
        }

        const data = await response.json();
        setFlipbook(data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          console.error("Không thể tải Heyzine oEmbed:", requestError);
          setError("Không thể tải brochure. Vui lòng thử lại sau.");
        }
      }
    }

    loadFlipbook();

    return () => controller.abort();
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.homeLink} to="/">
          ← Trang chủ
        </Link>
        <h1>{flipbook?.title || "Brochure DT Group"}</h1>
        <span className={styles.headerSpacer} aria-hidden="true" />
      </header>

      <div className={styles.container}>
        <aside className={styles.banner}>
          <img src="/aaa.jpg" alt="Banner" />
        </aside>

        <section className={styles.viewer} aria-live="polite">
        {!flipbook && !error && (
          <div className={styles.status}>
            <span className={styles.spinner} aria-hidden="true" />
            <p>Đang tải brochure...</p>
          </div>
        )}

        {error && (
          <div className={styles.status}>
            <p>{error}</p>
            <a href={FLIPBOOK_URL} target="_blank" rel="noreferrer">
              Mở trực tiếp trên Heyzine
            </a>
          </div>
        )}

        {flipbook && (
          <iframe
            className={styles.iframe}
            src={FLIPBOOK_URL}
            title={flipbook.title || "Brochure DT Group"}
            allow="clipboard-write"
            allowFullScreen
            scrolling="no"
          />
        )}
      </section>
      </div>
    </main>
  );
}

export default Brochure;
