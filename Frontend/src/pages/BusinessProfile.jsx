import { useState } from "react";
import API from "../services/api";

export default function BusinessProfile() {
  const [form, setForm] = useState({});

  const submit = async () => {
    await API.post("/business/profile", form);
    alert("Profile created");
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Business Profile</h1>

      {["businessName","industry","registrationNumber","annualRevenue","yearsInOperation","address"].map((field) => (
        <input
          key={field}
          placeholder={field}
          className="w-full border p-2 mb-2"
          onChange={(e) =>
            setForm({ ...form, [field]: e.target.value })
          }
        />
      ))}

      <button
        onClick={submit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
