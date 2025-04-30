import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import * as api from "../api/api";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const onSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setRegisterError(null);

    if (!email) {
      setRegisterError("Please enter your email address.");
      setIsSubmitting(false);
      return;
    }
    if (!password) {
      setRegisterError("Please enter your password.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isLogin) {
        const response = await api.loginUser({ email, password });
        localStorage.setItem("token", response.data.token);
        navigate("/tasks", { replace: true });
      } else {
        const response = await api.registerUser({ email, password });
        localStorage.setItem("token", response.data.token);
        navigate("/tasks", { replace: true });
      }
    } catch (error) {
      setRegisterError(
        error.response?.data?.error || "An unexpected error occurred."
      );
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            {registerError && email === "" && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {registerError}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 placeholder:text-gray-400"
            />
            {registerError && password === "" && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                {registerError}
              </p>
            )}
          </div>
          {registerError && email !== "" && password !== "" && (
            <p className="text-red-500 dark:text-red-400 text-sm">
              {registerError}
            </p>
          )}
          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                {isLogin ? "Logging in..." : "Registering..."}
              </>
            ) : isLogin ? (
              "Login"
            ) : (
              "Register"
            )}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setRegisterError(null);
            }}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Create an account" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
