// app/dashboard/profile/page.tsx
"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [skills, setSkills] = useState("");
  const [institution, setInstitution] = useState("");
  const [location, setLocation] = useState("");

  const handleSave = async () => {
    // Call your API to save/update profile
    const res = await fetch("/api/profile", {
      method: "POST",
      body: JSON.stringify({ skills, institution, location }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Profile updated!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Edit Profile</h1>

      <div>
        <label className="block mb-1 font-medium">Skills</label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., React, SQL, Python"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Institution</label>
        <input
          type="text"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., Stanford University"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="e.g., San Francisco, CA"
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
}
