import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import MarkdownRenderer from "../../../components/MarkdownRenderer";

function ChatBot() {
  const [messages, setMessages] = useState("");
  const [data, setData] = useState([]);

  // lưu trữ câu hỏi
  const handleOnChange = (e) => {
    setMessages(e.target.value);
  };

  //xử lý gửi câu hỏi từ người dùng
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://dtweb.onrender.com/chatbot/analyzeRevenue",
        {
          content: messages,
        }
      );
      setData( response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div>
      <div>{<MarkdownRenderer markdownText={data.data}></MarkdownRenderer>}</div>
      <div className={styles.chatContainer}>
        <form onSubmit={handleSubmit} className={styles.chatForm}>
          <input
            className={styles.inputChat}
            onChange={handleOnChange}
            type="text"
            placeholder="Nhập câu hỏi của bạn để tôi có thể giúp bạn phân tích"
          />
          <button className={styles.btnChat} type="submit">
            <FontAwesomeIcon icon={faCaretLeft} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
