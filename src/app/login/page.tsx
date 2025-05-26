import React, { useState } from "react";
import SkillInput from "../components/SkillInput";

const Dashboard = () => {
  const userName = "Your Name"; // Replace with Google auth logic if needed
  const [skills, setSkills] = useState([]);

  const handleAddSkill = (newSkill) => {
    setSkills((prevSkills) => [...prevSkills, newSkill]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome, <span className="text-blue-600">{userName}</span> 👋
      </h1>

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add Your Skills</h2>
        <SkillInput onAdd={handleAddSkill} />

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Your Skills:</h3>
          <ul className="list-disc list-inside space-y-1">
            {skills.length === 0 ? (
              <p className="text-gray-500">No skills added yet.</p>
            ) : (
              skills.map((skill, index) => <li key={index}>{skill}</li>)
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
