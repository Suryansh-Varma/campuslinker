import React from "react";
import Link from "next/link";
export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Header Section with Logo */}
      <header className="flex items-center justify-center py-6 bg-white">
        <img
          src="/pics/logo.png" // Make sure this is in your /public directory
          alt="CampusLinker Logo"
          className="w-10 h-10 mr-3 rounded-md"
        />
        <h1 className="text-2xl font-bold text-gray-800">Skilloop</h1>
      </header>

      <section className="text-center py-20 bg-blue-50">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Showcase Your Talent. Connect. Collaborate. Get Discovered.
        </h1>
        <p className="text-lg md:text-xl max-w-xl mx-auto mb-6">
          Skilloop helps students display their skills and projects,
          join campus collaborations, and get noticed by recruiters.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <Link
            href="/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            {
              title: "Student Profiles",
              desc: "Highlight your skills, projects, certificates, and experiences.",
              bg: "bg-blue-100",
            },
            {
              title: "Collaboration Boards",
              desc: "Find peers to join clubs, competitions, and freelance projects.",
              bg: "bg-green-100",
            },
            {
              title: "Micro-Gigs",
              desc: "Offer or join paid student gigs across campuses.",
              bg: "bg-yellow-100",
            },
            {
              title: "Recruiter Access",
              desc: "Let companies and clubs discover student talent directly.",
              bg: "bg-purple-100",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-6 ${feature.bg} rounded-2xl shadow`}
            >
              <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-6 bg-gray-100 max-w-6xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Why Skilloop?</h2>
          <p className="text-lg">
            Unlike LinkedIn, CampusLinker is built specifically for students.
            Whether you're an artist, coder, organizer, or speaker — you
            deserve to be seen. We connect offline student communities with
            online opportunities.
          </p>
        </div>
      </section>

      {/* Devlopers Section */}
      <section className="py-16 px-6 bg-white">
        <h1 className="text-3xl font-bold text-center mb-12">Develpoers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          {[
            {
              title: "Balaji",
              desc: "I am a lover boy",
              bg: "bg-pink-100 ",
            },
            {
              title: "Suryansh",
              desc: "I dont want to tell you",
              bg: "bg-black text-white",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-6 ${feature.bg} rounded-2xl shadow`}
            >
              <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-blue-50 text-center text-gray-600 text-sm">
        © 2025 CampusLinker. Connect. Collaborate. Get Discovered.
      </footer>
    </div>
  );
}
