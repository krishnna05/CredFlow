import "./AIAssistant.css";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function AIAssistant({ invoiceId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    API.get(`/assistant/invoice/${invoiceId}`).then(
      (res) => setMessages(res.data.explanation)
    );
  }, [invoiceId]);

  return (
    <div className="ai-box">
      <h3>CredFlow AI Assistant</h3>

      {messages.map((m, i) => (
        <p key={i}>{m}</p>
      ))}
    </div>
  );
}
