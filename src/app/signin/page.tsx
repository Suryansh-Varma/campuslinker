// Add these imports at the top
'use client';
import React, { useState } from 'react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const url = isLogin ? '/api/login' : '/api/signup';
    const body = isLogin ? { email, password } : { name, email, password };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Welcome to Skilloop</h2>
        <p className="text-center mb-6 text-gray-500">{isLogin ? "Login to continue" : "Create your account"}</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <div className="my-4 text-center text-gray-500">or</div>

        <button
          className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg flex justify-center items-center hover:bg-gray-100 transition"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
          {isLogin ? "Login with Google" : "Sign up with Google"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? "New to Skilloop?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
