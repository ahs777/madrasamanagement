import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/config/firebase";
import { useAuth } from "@/context/AuthContext";
import DefaultLayout from "@/layouts/default";
import { createUserWithEmailAndPassword } from "firebase/auth";

const CreateClientPage: React.FC = () => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPassword, setClientPassword] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const validateFields = () => {
    if (!clientName || !clientEmail || !clientPassword || !clientAddress) {
      setError("All fields are required.");
      return false;
    }
    if (clientPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create user with email and password in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        clientEmail,
        clientPassword
      );
      const clientId = userCredential.user.uid;

      // Check if the current user (admin) is logged in
      const createdBy = user?.uid || "Unknown"; // Fallback to "Unknown" if `user?.uid` is undefined

      // Step 2: Add client details to the "clients" collection in Firestore
      await addDoc(collection(db, "clients"), {
        id: clientId,
        name: clientName,
        email: clientEmail,
        address: clientAddress,
        createdBy: createdBy,
        createdAt: new Date(),
      });

      // Step 3: Add user details to the "users" collection in Firestore
      await setDoc(doc(db, "users", clientId), {
        id: clientId,
        email: clientEmail,
        role: "admin", // You can customize the role as needed
        createdAt: new Date(),
      });
      console.log("User added to users collection with ID: ", clientId);

      setLoading(false);
      navigate("/client");
    } catch (error: any) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setError("The email address is already in use. Please use a different email.");
      } else {
        setError(error.message); // General error message
      }
      console.error("Error adding client: ", error.code, error.message);
    }
  };

  return (
    <DefaultLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create Client</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="mt-1 p-2 block w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
              Client Email
            </label>
            <input
              type="email"
              id="clientEmail"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
              className="mt-1 p-2 block w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="clientPassword" className="block text-sm font-medium text-gray-700">
              Client Password
            </label>
            <input
              type="password"
              id="clientPassword"
              value={clientPassword}
              onChange={(e) => setClientPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 p-2 block w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">
              Client Address
            </label>
            <input
              type="text"
              id="clientAddress"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              required
              className="mt-1 p-2 block w-full border rounded-md"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded-md"
          >
            {loading ? "Creating..." : "Create Client"}
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default CreateClientPage;
