import React, { useState, useEffect } from "react";
import { Mail, Key, Trash2, User, Loader2 } from "lucide-react";
import * as api from "../api/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .getUserProfile()
      .then((res) => {
        setUser(res.data);
        setNewEmail(res.data.email);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load profile.");
        setLoading(false);
      });
  }, []);

  const handleUpdateEmail = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await api.updateUserEmail(user._id, newEmail);
      setMessage("Email updated successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update email.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await api.updateUserPassword(user._id, { oldPassword, newPassword });
      setMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setError(null);
    setMessage(null);
    if (window.confirm("Are you sure you want to delete your account?")) {
      setLoading(true);
      try {
        await api.deleteUser(user._id);
        localStorage.removeItem("token");
        window.location.href = "/register";
      } catch (err) {
        setError(err.response?.data?.error || "Failed to delete account.");
        setLoading(false);
      }
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Loading Profile...
          </h2>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
          👤 My Profile
        </h2>

        {message && (
          <div className="mb-4 text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-400 px-4 py-2 rounded-md">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-400 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </div>
          </label>
          <input
            id="email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <button
            onClick={handleUpdateEmail}
            disabled={loading}
            className={`mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                Updating...
              </>
            ) : (
              "Update Email"
            )}
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Change Password
            </div>
          </label>
          <input
            id="password"
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400"
          />
          <button
            onClick={handleUpdatePassword}
            disabled={loading}
            className={`mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={handleDeleteAccount}
            disabled={loading}
            className={`w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
