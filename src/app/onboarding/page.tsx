"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const supabaseUrl = "https://fzuhskpycgczrlwufdky.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dWhza3B5Y2djenJsd3VmZGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzY4MTYsImV4cCI6MjA2Mzg1MjgxNn0.j1BNhXr_Nf6VE07U4sf_oyQbuBWCZi0SPYcfiMuEgNs"; // Keep it secure in env in prod

export default function Onboarding() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [skills, setSkills] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const router = useRouter();

  const addSkill = async () => {
    if (!input || !user?.id) return;
    const token = await getToken({ template: "supabase" });

    await fetch(`${supabaseUrl}/rest/v1/skills`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ user_id: user.id, skill: input }),
    });

    setSkills((prev) => [...prev, input]);
    setInput("");
  };

  const handleFinish = () => router.push("/dashboard");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-white p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-4 text-black">Welcome, {user?.firstName} 👋</h1>
        <p className="mb-6 text-black">Let’s set up your skills to get started!</p>

        <div className="flex gap-2 mb-4">
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full text-black"
            placeholder="Enter a skill (e.g., Python)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={addSkill} className="bg-blue-600 text-white px-4 py-2 rounded ">
            Add
          </button>
        </div>

        {skills.length > 0 && (
          <ul className="text-left mb-6">
            {skills.map((skill, i) => (
              <li key={i} className="py-1 px-2 bg-blue-50 rounded mb-1 text-black">
                {skill}
              </li>
            ))}
          </ul>
        )}

        <button onClick={handleFinish} className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Finish Setup
        </button>
      </div>
    </div>
  );
}
