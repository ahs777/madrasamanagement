import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  role: string | null;
  clientId: string | null;
  loading: boolean;
  logout: () => void;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  clientId: null,
  loading: true,
  logout: () => {},
});

// AuthContext provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (user) {
        setUser(user);

        // Fetch user document by email
        const userQuery = query(collection(db, "users"), where("email", "==", user.email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0]; // Assuming unique emails, so we take the first doc
          const userData = userDoc.data();
          
          const fetchedRole = userData.role || "user";
          const fetchedClientId = userData.clientId || null;

          // Update state with fetched data
          setRole(fetchedRole);
          setClientId(fetchedClientId);

          // Save to local storage
          localStorage.setItem("role", fetchedRole);
          localStorage.setItem("clientId", fetchedClientId);
        } else {
          setRole(null);
          setClientId(null);
        }
      } else {
        setUser(null);
        setRole(null);
        setClientId(null);
      }

      setLoading(false);
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    const auth = getAuth();
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, clientId, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
