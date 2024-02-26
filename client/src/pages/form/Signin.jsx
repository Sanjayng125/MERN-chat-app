import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Signin = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
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
        setAuth({ user: data?.user, token: data?.token });
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: data?.user,
            token: data?.token,
          })
        );
        navigate("/");
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
        <div className="text-4xl font-bold">Welcome Back</div>
        <div className="text-xl font-light mb-6">Sign In to your account</div>
        <form
          className="w-full flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex flex-col">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
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
              type="password"
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
            {loading ? "Loading" : "Sign in"}
          </button>
        </form>
        <div className="my-2">
          Don't have an account?
          <Link
            to="/sign-up"
            className="text-blue-500 underline cursor-pointer"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
