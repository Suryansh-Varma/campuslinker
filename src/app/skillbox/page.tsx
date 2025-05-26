import React, { useState } from "react";

const SkillInput = ({ onAdd }) => {
  const [skill, setSkill] = useState("");

  const handleAdd = () => {
    if (skill.trim() === "") return;
    onAdd(skill.trim());
    setSkill("");
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="text"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        placeholder="Enter a skill..."
        className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition duration-200"
      >
        Add
      </button>
    </div>
  );
};

export default SkillInput;
