
import React from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <header className="flex items-center justify-center py-6 bg-white">
        <img
          src="/pics/logo.png" // Make sure this is in your /public directory
          alt="CampusLinker Logo"
          className="w-20 h-20 mr-3"
        />
        <h1 className="text-2xl font-bold text-gray-800">Campus-Linker</h1>
      </header>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-black">Sign In to CampusLinker</h1>
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
