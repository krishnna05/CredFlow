import { useState } from "react";
import API from "../services/api";
import "./BusinessProfile.css";

export default function BusinessProfile() {
  const [form, setForm] = useState({});

  const submit = async () => {
    await API.post("/business/profile", form);
    alert("Profile created");
  };

  return (
    <div className="business-container">
      <h1 className="business-title">Business Profile</h1>

      {[
        "businessName",
        "industry",
        "registrationNumber",
        "annualRevenue",
        "yearsInOperation",
        "address",
      ].map((field) => (
        <input
          key={field}
          placeholder={field}
          className="business-input"
          onChange={(e) =>
            setForm({ ...form, [field]: e.target.value })
          }
        />
      ))}

      <button onClick={submit} className="business-button">
        Save
      </button>
    </div>
  );
}
