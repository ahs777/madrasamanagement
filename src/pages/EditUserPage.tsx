import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { db } from "@/config/firebase";
import DefaultLayout from "@/layouts/default";
import { Button, Input } from "@nextui-org/react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FirebaseError } from "firebase/app";

interface User {
  id: string;
  email: string;
  role: string;
}

const EditUserPage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useParams<{ userId: string }>();
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        if (!userId) {
          setError(t("User ID is not provided."));
          return;
        }

        const userQuery = query(
          collection(db, "users"),
          where("id", "==", userId)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data() as Omit<User, "id">;
          setEmail(userData.email || "");
          setUserRole(userData.role || "");
        } else {
          setError(t("No such user!"));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(t("Failed to fetch user data."));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, t]);

  const handleUpdateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      setError(t("No user is currently logged in."));
      return;
    }
    
    try {
      setLoading(true);
    
      // Re-authenticate if old password is provided
      if (oldPassword) {
        const credential = EmailAuthProvider.credential(user.email!, oldPassword);
        await reauthenticateWithCredential(user, credential);
      }
    
      // Update the user's email in Firebase Authentication
      if (email !== user.email) {
        await updateEmail(user, email);
      }
    
      // Update the user's password in Firebase Authentication
      if (newPassword) {
        await updatePassword(user, newPassword);
      }
    
      // Update the user's role in Firestore
      const userDocRef = query(
        collection(db, "users"),
        where("id", "==", userId)
      );
      const userSnapshot = await getDocs(userDocRef);
    
      if (!userSnapshot.empty) {
        const docRef = userSnapshot.docs[0].ref;
        await updateDoc(docRef, {
          email: email,
          role: userRole,
        });
      }
    
      setSuccess(true);
      navigate("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            setError(t("Invalid credentials. Please check your old password and email."));
            break;
          case 'auth/email-already-in-use':
            setError(t("The email address is already in use by another account."));
            break;
          case 'auth/requires-recent-login':
            setError(t("This operation is sensitive and requires recent authentication. Please log in again."));
            break;
          default:
            setError(t("Failed to update user. Please try again."));
        }
      } else {
        setError(t("Failed to update user. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{t("Edit User")}</h1>
        {loading ? (
          <p>{t("Loading...")}</p>
        ) : (
          <form onSubmit={handleUpdateUser}>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && (
              <p className="text-green-500 mb-2">
                {t("User updated successfully!")}
              </p>
            )}

            <Input
              isClearable
              fullWidth
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label={t("Email")}
              placeholder={t("Enter the user's email")}
              variant="bordered"
            />

            <Input
              isClearable
              fullWidth
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              label={t("Old Password")}
              placeholder={t("Enter your current password")}
              variant="bordered"
            />

            <Input
              isClearable
              fullWidth
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              label={t("New Password")}
              placeholder={t("Enter a new password")}
              variant="bordered"
            />

            <Input
              isClearable
              fullWidth
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              label={t("Role")}
              placeholder={t("Enter the user's role")}
              variant="bordered"
            />

            <Button type="submit" color="primary" className="mt-4">
              {t("Update User")}
            </Button>
          </form>
        )}
      </div>
    </DefaultLayout>
  );
};

export default EditUserPage;
