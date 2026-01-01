import { useState } from "react";
import API from "../services/api";
import "./BusinessProfile.css";

export default function BusinessProfile() {
  const [form, setForm] = useState({
    businessName: "",
    industry: "",
    registrationNumber: "",
    annualRevenue: "",
    yearsInOperation: "",
    address: ""
  });

  const submit = async () => {
    try {
      await API.post("/business/profile", form);
      alert("Profile created successfully!");
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile.");
    }
  };

  const handleChange = (e, field) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const formatPlaceholder = (str) => {
    const result = str.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
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
        <div key={field} className="form-group">
          <input
            type={field === "annualRevenue" || field === "yearsInOperation" ? "number" : "text"}
            name={field}
            value={form[field] || ""}
            placeholder={formatPlaceholder(field)}
            className="business-input"
            onChange={(e) => handleChange(e, field)}
          />
        </div>
      ))}

      <button onClick={submit} className="business-button">
        Save Profile
      </button>
    </div>
  );
}