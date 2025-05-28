"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [activeTab, setActiveTab] = useState<"home" | "profile">("home");

  const [skills, setSkills] = useState<{ id: number; skill: string }[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [editingSkillValue, setEditingSkillValue] = useState("");

  const [location, setLocation] = useState("");
  const [university, setUniversity] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [editSuccessMessage, setEditSuccessMessage] = useState("");
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");

  const fetchData = async () => {
    const token = await getToken({ template: "supabase" });
    if (!user?.id || !token) return;

    const skillRes = await fetch(
      `${supabaseUrl}/rest/v1/skills?user_id=eq.${user.id}&select=id,skill`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: anonKey,
        },
      }
    );
    const skillData = await skillRes.json();
    if (Array.isArray(skillData)) {
      setSkills(skillData);
    }

    const profileRes = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: anonKey,
        },
      }
    );
    const profileData = await profileRes.json();
    if (profileData.length) {
      setLocation(profileData[0].location ?? "");
      setUniversity(profileData[0].university ?? "");
    }
  };

  const deleteSkill = async (skillId: number) => {
    if (!user?.id) return;

    const token = await getToken({ template: "supabase" });

    const res = await fetch(`${supabaseUrl}/rest/v1/skills?id=eq.${skillId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
        Prefer: "return=minimal",
      },
    });

    if (res.ok) {
      setSkills((prev) => prev.filter((skill) => skill.id !== skillId));
      setDeleteSuccessMessage("✅ Skill deleted successfully!");
      setTimeout(() => setDeleteSuccessMessage(""), 3000);
    } else {
      console.error("❌ Failed to delete skill from Supabase");
    }
  };

  const updateProfile = async () => {
    const token = await getToken({ template: "supabase" });

    await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user?.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ location, university }),
    });

    setEditMode(false);
    setSavedMessage("✅ Profile info saved!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const addSkill = async () => {
    if (!newSkill.trim() || !user?.id) return;
    const token = await getToken({ template: "supabase" });

    const res = await fetch(`${supabaseUrl}/rest/v1/skills`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ user_id: user.id, skill: newSkill }),
    });

    const data = await res.json();
    if (Array.isArray(data)) {
      setSkills((prev) => [...prev, data[0]]);
    }
    setNewSkill("");
  };

  const startEditing = (id: number, value: string) => {
    setEditingSkillId(id);
    setEditingSkillValue(value);
  };

  const saveEditedSkill = async () => {
    if (!editingSkillId) return;
    const token = await getToken({ template: "supabase" });

    const res = await fetch(`${supabaseUrl}/rest/v1/skills?id=eq.${editingSkillId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ skill: editingSkillValue }),
    });

    if (res.ok) {
      setSkills((prev) =>
        prev.map((s) =>
          s.id === editingSkillId ? { ...s, skill: editingSkillValue } : s
        )
      );
      setEditSuccessMessage("✅ Skill edited successfully!");
      setTimeout(() => setEditSuccessMessage(""), 3000);
    }

    setEditingSkillId(null);
    setEditingSkillValue("");
  };

  useEffect(() => {
    if (user?.id) fetchData();
  }, [user?.id]);

  return (
    <div className="flex min-h-screen bg-[#f3f2ef] text-gray-800">
      <aside className="w-64 bg-white border-r p-6 shadow-sm flex flex-col">
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("home")}
            className={clsx(
              "w-full text-left px-4 py-2 rounded-lg font-medium",
              activeTab === "home"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            )}
          >
            🏠 Home
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={clsx(
              "w-full text-left px-4 py-2 rounded-lg font-medium",
              activeTab === "profile"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            )}
          >
            🙍‍♂️ Profile
          </button>
        </nav>
        <div className="mt-auto text-xs text-gray-400 text-center">
          SkilLoop © {new Date().getFullYear()}
        </div>
      </aside>

      <main className="flex-1 p-10">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Your Profile</h2>
              <div className="space-y-4">
                {!editMode ? (
                  <>
                    <p><strong>Full Name:</strong> {user?.firstName} {user?.lastName}</p>
                    <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress}</p>
                    <p><strong>Location:</strong> {location || "Not set"}</p>
                    <p><strong>University:</strong> {university || "Not set"}</p>
                    <button
                      onClick={() => setEditMode(true)}
                      className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                    >
                      ✏️ Edit Info
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      className="w-full border px-4 py-2 rounded"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <input
                      className="w-full border px-4 py-2 rounded"
                      placeholder="University"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={updateProfile}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="bg-gray-300 px-4 py-2 rounded"
                      >
                        ✖ Cancel
                      </button>
                    </div>
                  </>
                )}

                {savedMessage && <p className="text-green-600 text-sm">{savedMessage}</p>}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Skills</h3>
                {(editSuccessMessage || deleteSuccessMessage) && (
                  <p className="text-green-600 text-sm mb-2">
                    {editSuccessMessage || deleteSuccessMessage}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <div
                      key={s.id}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      {editingSkillId === s.id ? (
                        <>
                          <input
                            value={editingSkillValue}
                            onChange={(e) => setEditingSkillValue(e.target.value)}
                            className="border px-2 py-1 rounded text-sm"
                          />
                          <button onClick={saveEditedSkill} className="text-green-600">✔</button>
                          <button onClick={() => setEditingSkillId(null)} className="text-red-600">✖</button>
                        </>
                      ) : (
                        <>
                          <span>{s.skill}</span>
                          <button onClick={() => startEditing(s.id, s.skill)} className="text-blue-500">✏️</button>
                          <button onClick={() => deleteSkill(s.id)} className="text-red-500">🗑️</button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border px-4 py-2 rounded"
                    placeholder="Add a new skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                  <button
                    onClick={addSkill}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    ➕ Add
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}