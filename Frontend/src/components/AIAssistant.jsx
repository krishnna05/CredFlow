import { useEffect, useState } from "react";
import API from "../services/api";
import "./AIAssistant.css";

export default function AIAssistant({ invoiceId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!invoiceId) return;

    API.get(`/assistant/invoice/${invoiceId}`)
      .then((res) => {
        setMessages(res.data.explanation || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("AI Assistant Error:", err);
        setMessages(["AI insights currently unavailable."]);
        setLoading(false);
      });
  }, [invoiceId]);

  return (
    <div className="ai-box">
      <h4>🤖 CredFlow AI Insights</h4>
      
      {loading ? (
        <p className="ai-loading">Analyzing invoice risk...</p>
      ) : (
        <ul className="ai-messages">
          {messages.length > 0 ? (
            messages.map((m, i) => <li key={i}>{m}</li>)
          ) : (
            <li>No insights available for this invoice.</li>
          )}
        </ul>
      )}
    </div>
  );
}