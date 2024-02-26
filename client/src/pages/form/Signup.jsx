import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        navigate("/sign-in");
      } else {
        setLoading(false);
        alert(data?.message || "Something went wrong!");
      }
    } catch (error) {}
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center"
      style={{ background: "linear-gradient(to right, purple, blue)" }}
    >
      <div className="bg-white p-3 rounded-lg border shadow-lg flex flex-col items-center w-[90%] max-w-[350px]">
        <div className="text-4xl font-bold">Welcome</div>
        <div className="text-xl font-light mb-6">
          Sign Up now to get started
        </div>
        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col">
            <label htmlFor="fullName">Full Name:</label>
            <input
              id="fullName"
              placeholder="Enter your full name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-6"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({ ...formData, fullName: e.target.value });
              }}
            />
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              placeholder="Enter your email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-6"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
            />
          </div>
          <div className="w-full flex flex-col">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              placeholder="Enter your password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-6"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />
          </div>
          <button
            className="w-max p-2 rounded bg-blue-600 text-white hover:opacity-95 disabled:opacity-80"
            disabled={loading}
          >
            {loading ? "Loading" : "Sign up"}
          </button>
        </form>
        <div className="my-2">
          Already have an account?
          <Link
            to="/sign-in"
            className="text-blue-500 underline cursor-pointer"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
