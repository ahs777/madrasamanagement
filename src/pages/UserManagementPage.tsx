import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/config/firebase";
import DefaultLayout from "@/layouts/default";
import {
  Button,
  Input,
  Modal,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  useDisclosure,
  Select, // Updated import
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  SelectItem,
} from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type User = {
  id: string;
  email: string;
  role: string;
};

const UserManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [availableRoles, setAvailableRoles] = useState<string[]>([
    "user",
    "admin",
  ]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const getClientId = () => {
    return localStorage.getItem("clientId");
  };

  const fetchUsers = async () => {
    const clientId = getClientId();
    if (!clientId) return;

    setLoading(true);
    try {
      const usersCollection = query(
        collection(db, "users"),
        where("clientId", "==", clientId)
      );
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
      })) as User[];
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Determine available roles based on clientId
    const clientId = getClientId();
    if (clientId === "02IENhIRAKSoUdGIVJa9") {
      setAvailableRoles(["user", "admin", "alhafs"]);
    } else {
      setAvailableRoles(["user", "admin"]);
    }
  }, []);

  const handleView = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const handleEdit = (userId: string) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDelete = async (userId: string) => {
    const clientId = getClientId();
    if (!clientId) return;

    if (confirm(t("Are you sure you want to delete this user?"))) {
      try {
        await deleteDoc(doc(db, `users`, userId));
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(t("Failed to delete user. Please try again."));
      }
    }
  };

  const handleAddUser = async () => {
    const auth = getAuth();
    const clientId = getClientId();

    if (password.length < 6) {
      setError(t("Password should be at least 6 characters long."));
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      if (!clientId) return;

      const usersCollection = collection(db, `users`);
      await addDoc(usersCollection, {
        id: userId,
        email,
        role: userRole,
        clientId: clientId,
      });

      setEmail("");
      setPassword("");
      setUserRole("user"); // Resetting role
      onClose();

      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      setError(
        t(
          "Failed to add user. Please check the email and password and try again."
        )
      );
    }
  };
  const handleRoleChange = (value: string) => {
    setUserRole(value);
  };
  const columns = [
    { uid: "email", name: t("Email") },
    { uid: "role", name: t("Role") },
    { uid: "actions", name: t("Actions") },
  ];

  return (
    <DefaultLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{t("User Management")}</h1>
        <div className="mb-4">
          <Button color="primary" onPress={onOpen}>
            {t("Add New User")}
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {t("Add New User")}
                  </ModalHeader>
                  <ModalBody>
                    {error && <p className="text-red-500 mb-2">{error}</p>}
                    <Input
                      isClearable
                      fullWidth
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      label={t("Email")}
                      placeholder={t("Enter user email")}
                      variant="bordered"
                    />
                    <Input
                      isClearable
                      fullWidth
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      label={t("Password")}
                      placeholder={t("Enter user password")}
                      variant="bordered"
                    />
                    <Select
                      fullWidth
                      label={t("Role")}
                      value={userRole}
                      onChange={(e) => handleRoleChange(e.target.value)}
                    >
                      {availableRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </Select>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      {t("Close")}
                    </Button>
                    <Button color="primary" onPress={handleAddUser}>
                      {t("Add User")}
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
        <h2 className="text-xl font-semibold mb-4">{t("User List")}</h2>
        {loading ? (
          <p>{t("Loading...")}</p>
        ) : (
          <Table aria-label={t("User List")}>
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={users}>
              {(user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Tooltip content={t("View user")}>
                      <button
                        aria-label={t("View user")}
                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                        onClick={() => handleView(user.id)}
                      >
                        <EyeIcon />
                      </button>
                    </Tooltip>
                    <Tooltip content={t("Edit user")}>
                      <button
                        aria-label={t("Edit user")}
                        className="text-lg text-default-400 cursor-pointer active:opacity-50"
                        onClick={() => handleEdit(user.id)}
                      >
                        <EditIcon />
                      </button>
                    </Tooltip>
                    <Tooltip color="danger" content={t("Delete user")}>
                      <button
                        aria-label={t("Delete user")}
                        className="text-lg text-danger cursor-pointer active:opacity-50"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteIcon />
                      </button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </DefaultLayout>
  );
};

export default UserManagementPage;
