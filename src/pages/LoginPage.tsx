import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";
import { auth, db } from "@/config/firebase"; // Adjust import path as needed

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Fetch user data from Firestore
      const loginCollection = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const loginSnapshot = await getDocs(loginCollection);

      if (!loginSnapshot.empty) {
        // Get the first document (assuming unique emails)
        const userDoc = loginSnapshot.docs[0];
        const data = userDoc.data();

        // Extract role and clientId from user data
        const role = data.role || "user"; // Default to 'user' if role is not set
        const clientId = data.id; // Default to empty string if clientId is not set

        // Save role and clientId to localStorage
        localStorage.setItem("role", role);
        localStorage.setItem("clientId", clientId);

        // Redirect to home page or dashboard
        navigate("/home");
      } else {
        // Handle case where user data is not found
        setError("User data not found. Please contact support.");
      }
    } catch (error) {
      setPassword(""); // Clear password field on error
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
