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

  const [activeTab, setActiveTab] = useState<"home" | "profile" | "connect">("home");
  const [isSearching, setIsSearching] = useState(false);

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

  const [connectSearch, setConnectSearch] = useState("");
  const [connectResults, setConnectResults] = useState<any[]>([]);
  const [selectedConnectUser, setSelectedConnectUser] = useState<any>(null);

  const fetchData = async () => {
    try {
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
      
      if (!skillRes.ok) throw new Error("Failed to fetch skills");
      
      const skillData = await skillRes.json();
      if (Array.isArray(skillData)) setSkills(skillData);

      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: anonKey,
          },
        }
      );
      
      if (!profileRes.ok) throw new Error("Failed to fetch profile");
      
      const profileData = await profileRes.json();
      if (profileData.length) {
        setLocation(profileData[0].location ?? "");
        setUniversity(profileData[0].university ?? "");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const deleteSkill = async (skillId: number) => {
    try {
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
        setSkills((prev) => prev.filter((s) => s.id !== skillId));
        setDeleteSuccessMessage("✅ Skill deleted successfully!");
        setTimeout(() => setDeleteSuccessMessage(""), 3000);
      } else {
        throw new Error("Failed to delete skill");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const updateProfile = async () => {
    try {
      const token = await getToken({ template: "supabase" });
      const res = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${user?.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: anonKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ location, university }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      setEditMode(false);
      setSavedMessage("✅ Profile info saved!");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const addSkill = async () => {
    try {
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

      if (!res.ok) throw new Error("Failed to add skill");

      const data = await res.json();
      if (Array.isArray(data)) setSkills((prev) => [...prev, data[0]]);
      setNewSkill("");
    } catch (error) {
      console.error("Add skill error:", error);
    }
  };

  const startEditing = (id: number, value: string) => {
    setEditingSkillId(id);
    setEditingSkillValue(value);
  };

  const saveEditedSkill = async () => {
    try {
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

      if (!res.ok) throw new Error("Failed to update skill");

      setSkills((prev) =>
        prev.map((s) =>
          s.id === editingSkillId ? { ...s, skill: editingSkillValue } : s
        )
      );
      setEditSuccessMessage("✅ Skill edited successfully!");
      setTimeout(() => setEditSuccessMessage(""), 3000);
      setEditingSkillId(null);
      setEditingSkillValue("");
    } catch (error) {
      console.error("Edit skill error:", error);
    }
  };

const searchUsersBySkill = async () => {
  try {
    setIsSearching(true);
    setConnectResults([]);
    setSelectedConnectUser(null);

    console.log("Starting search for skill:", connectSearch); // Debug log

    if (!connectSearch.trim()) {
      alert("Please enter a skill to search");
      return;
    }

    const token = await getToken({ template: "supabase" });
    if (!token) {
      console.error("No token available");
      return;
    }

    // Debug: Log the full request URL
    const skillSearchTerm = connectSearch.trim().toLowerCase();
    const skillsUrl = `${supabaseUrl}/rest/v1/skills?skill=ilike.%25${encodeURIComponent(skillSearchTerm)}%25&select=skill,user_id`;

    console.log("Skills query URL:", skillsUrl);

    const skillRes = await fetch(skillsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
      },
    });

    if (!skillRes.ok) {
      const errorText = await skillRes.text();
      console.error("Skills query failed:", errorText);
      return;
    }

    const skillData = await skillRes.json();
    console.log("Skills found:", skillData); // Debug log

    const userIds = [...new Set(skillData.map((s: any) => s.user_id))]
      .filter((id) => id !== user?.id);
    
    console.log("User IDs found:", userIds); // Debug log

    if (userIds.length === 0) {
      console.log("No matching users found (excluding current user)");
      setConnectResults([]);
      return;
    }

    const profilesUrl = `${supabaseUrl}/rest/v1/profiles?id=in.(${userIds.join(",")})`;
    console.log("Profiles query URL:", profilesUrl); // Debug log

    const profileRes = await fetch(profilesUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
      },
    });

    if (!profileRes.ok) {
      const errorText = await profileRes.text();
      console.error("Profiles query failed:", errorText);
      return;
    }

    const profiles = await profileRes.json();
    console.log("Profiles found:", profiles); // Debug log

    setConnectResults(profiles);
    
  } catch (error) {
    console.error("Search failed:", error);
  } finally {
    setIsSearching(false);
  }
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
          <button
            onClick={() => setActiveTab("connect")}
            className={clsx(
              "w-full text-left px-4 py-2 rounded-lg font-medium",
              activeTab === "connect"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            )}
          >
            🔗 Connect
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
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
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

          {activeTab === "connect" && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-2xl font-bold text-blue-800 mb-4">🔗 Connect with Students</h2>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search by skill (e.g. html)"
                  value={connectSearch}
                  onChange={(e) => setConnectSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchUsersBySkill()}
                  className="border px-4 py-2 w-full rounded"
                />
                <button
                  onClick={searchUsersBySkill}
                  disabled={isSearching}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </div>

              {isSearching && <p className="text-gray-500">Searching for users...</p>}

              {connectResults.length > 0 && (
                <ul className="space-y-4">
                  {connectResults.map((u) => (
                    <li
                      key={u.id}
                      onClick={() => setSelectedConnectUser(u)}
                      className="border p-4 rounded cursor-pointer hover:bg-gray-50"
                    >
                      <p className="font-semibold">{u.full_name || "Unnamed User"}</p>
                      <p className="text-sm text-gray-600">{u.university || "Unknown University"}</p>
                      <p className="text-sm text-gray-600">{u.location || "No location specified"}</p>
                    </li>
                  ))}
                </ul>
              )}

              {!isSearching && connectResults.length === 0 && connectSearch && (
                <p className="text-gray-500">No users found with that skill</p>
              )}

              {selectedConnectUser && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-lg font-bold mb-2">👤 {selectedConnectUser.full_name || "Unnamed User"}</h3>
                  <p>University: {selectedConnectUser.university || "Not specified"}</p>
                  <p>Location: {selectedConnectUser.location || "Not specified"}</p>
                  <div className="flex gap-4 mt-4">
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">💬 Message</button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">📧 Contact via Email</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}