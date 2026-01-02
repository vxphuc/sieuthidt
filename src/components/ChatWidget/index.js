import React, { useState, useRef, useEffect } from "react";
import styles from "./ChatWidget.module.css";
function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào anh/chị!, em là DT luôn ở đây để hỗ trợ mình ạ." },
    { from: "bot", text: "Anh/chị cần hỗ trợ gì không ạ?" },
  ]);
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");

    // thay câu trả lời của chat bằng API thật
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "(Trả lời mẫu) " + text },
      ]);
    }, 600);
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const attachments = files.map((f) => {
      return {
        name: f.name,
        type: f.type,
        url: URL.createObjectURL(f),
      };
    });

    setMessages((prev) => [
      ...prev,
      { from: "user", text: "", files: attachments },
    ]);

    // reset input so same file can be selected again if needed
    e.target.value = null;
  };

  return (
    <div className={styles.containerchat}>
      <button
        className={styles.fabchat}
        aria-label="Mở chat"
        // onClick={() => setOpen((v) => !v)}
        onClick={() => window.open("https://www.facebook.com/messages/t/675268599012098", "_blank")}
      >
        <img src="/Artboard%209.png" alt="chat" className={styles.iconchat} />
      </button>

      <div className={`${styles.panelchat} ${open ? styles.panelOpen : styles.panelClosed}`} role="dialog" aria-modal="true" aria-hidden={!open}>
          <div className={styles.headerchat}>
            <div className={styles.headerLeft}>
              <div className={styles.headerLogo}>
                <img src="/Artboard5.png" className={styles.sendIcon} />
              </div>
              <div className={styles.headerText}>
                <div className={styles.headerTitle}>DT GROUP</div>
                <div className={styles.headerStatus}>Trực tuyến</div>
              </div>
            </div>
            <div
              className={styles.headerChevron}
              role="button"
              tabIndex={0}
              onClick={() => setOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
                  setOpen(false);
                }
              }}
              aria-label="Đóng chat"
            >
              <img src="/Artboard6.png" className={styles.sendIcon} />
            </div>
          </div>
          <div className={styles.messageschat}>
            {messages.map((m, i) => {
              const isUser = m.from === "user";
              return (
                <div key={i} className={isUser ? styles.messageRowUser : styles.messageRow}>
                  {!isUser && (
                    <img src="/Artboard5.png" alt="DT" className={styles.messageAvatar} />
                  )}

                  <div className={isUser ? styles.msgUserchat : styles.msgBotchat}>
                    {m.text}

                    {m.files && m.files.length > 0 && (
                      <div className={styles.attachmentList}>
                        {m.files.map((f, idx) => (
                          <div key={idx} className={styles.attachment}>
                            {f.type && f.type.startsWith("image/") ? (
                              <img src={f.url} alt={f.name} className={styles.attachmentImg} />
                            ) : (
                              <a href={f.url} target="_blank" rel="noreferrer">{f.name}</a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <form className={styles.formchat} onSubmit={handleSend}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.inputchat}
              placeholder={inputFocused ? "" : "Nhập tin nhắn dưới 1000 ký tự nhé"}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
            />

            <input
              id="chat-file-input"
              className={styles.hiddenFileInput}
              type="file"
              multiple
              onChange={handleFiles}
              accept="*/*"
            />

            <label htmlFor="chat-file-input" className={styles.uploadBtn} title="Đăng tải tệp">
              <img src="/Artboard7.png" alt="Gửi" className={styles.sendIcon} />
            </label>

            <button className={styles.sendchat} type="submit" aria-label="Gửi">
              <img src="/Artboard8.png" alt="Gửi" className={styles.sendIcon} />
            </button>
          </form>
        </div>
    </div>
  );
}

export default ChatWidget;
