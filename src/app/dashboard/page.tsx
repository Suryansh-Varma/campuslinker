"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const supabaseUrl = "https://fzuhskpycgczrlwufdky.supabase.co";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6dWhza3B5Y2djenJsd3VmZGt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzY4MTYsImV4cCI6MjA2Mzg1MjgxNn0.j1BNhXr_Nf6VE07U4sf_oyQbuBWCZi0SPYcfiMuEgNs"; // 🔐 Replace with actual anon key

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [skills, setSkills] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const fetchSkills = async () => {
    const token = await getToken({ template: "supabase" });

    const res = await fetch(`${supabaseUrl}/rest/v1/skills?user_id=eq.${user?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
      },
    });

    const data = await res.json();
    if (Array.isArray(data)) {
      setSkills(data.map((row: any) => row.skill));
    }
  };

  const addSkill = async () => {
    if (!input.trim() || !user?.id) return;
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

  useEffect(() => {
    if (user?.id) fetchSkills();
  }, [user?.id]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 to-white text-gray-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r shadow-lg p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-6">
            👋 Hi, {user?.firstName}
          </h2>

          <h3 className="text-lg font-semibold mb-3 text-gray-700">Your Skills</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {skills.length ? (
              skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">No skills yet.</p>
            )}
          </div>

          <input
            type="text"
            className="border w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
            placeholder="Add a skill..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={addSkill}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            ➕ Add Skill
          </button>
        </div>

        <footer className="text-xs text-gray-400 text-center mt-8">
          SkilLoop © {new Date().getFullYear()}
        </footer>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-4 text-blue-800">Welcome to SkilLoop</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl">
          Soon, you’ll be able to connect with other students based on your skills. Collaborate, teach,
          and grow together in the campus network 🚀
        </p>

        <div className="mt-12 text-center text-gray-400 italic">
          👥 Student skill matching system coming soon...
        </div>
      </main>
    </div>
  );
}
