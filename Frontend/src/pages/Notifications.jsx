import "./Notifications.css";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/notifications").then((res) =>
      setItems(res.data)
    );
  }, []);

  return (
    <div className="notifications">
      <h3>Notifications</h3>

      {items.map((n) => (
        <div
          key={n._id}
          className={`note ${n.isRead ? "read" : ""}`}
        >
          <b>{n.title}</b>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
