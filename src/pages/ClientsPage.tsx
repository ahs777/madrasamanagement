import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DefaultLayout from "@/layouts/default";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
} from "@nextui-org/react";
import { EyeIcon, EditIcon, DeleteIcon } from "@/components/icons";

interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  createdBy: string;
  createdAt: Date;
}

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsData: Client[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Client, "id">;
        return {
          id: doc.id,
          ...data,
        };
      });
      setClients(clientsData);
    };

    fetchClients();
  }, []);

  const handleAddClient = async () => {
    // Sample data to add, replace with actual data from form or state
    const newClient = {
      id: "new-client-id", // Generate or provide unique ID
      email: "newclient@example.com",
      clientId: "new-client-clientId",
      role: "admin",
    };

    try {
      // Add new client to `clients` collection
      await addDoc(collection(db, "clients"), {
        ...newClient,
        createdAt: new Date(),
        createdBy: "admin", // Set the creator's ID or name
      });

      // Add the same client to `users` collection
      await addDoc(collection(db, "users"), {
        clientId: newClient.clientId,
        email: newClient.email,
        id: newClient.id,
        role: newClient.role,
      });

      // Optionally, you might want to fetch clients again to refresh the list
      const querySnapshot = await getDocs(collection(db, "clients"));
      const clientsData: Client[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Client, "id">;
        return {
          id: doc.id,
          ...data,
        };
      });
      setClients(clientsData);
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const handleView = (id: string) => {
    navigate(`/client/view/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/client/edit/${id}`);
  };

  const handleDelete = async () => {
    // Handle delete functionality here
  };

  const renderCell = (
    client: Client,
    columnKey: keyof Client | "actions" | "serialNumber"
  ) => {
    if (columnKey === "actions") {
      return (
        <div className="relative flex justify-center items-center gap-2">
          <Tooltip content={t("View Client")}>
            <button
              aria-label={t("View Client")}
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={() => handleView(client.id)}
            >
              <EyeIcon />
            </button>
          </Tooltip>
          <Tooltip content={t("Edit Client")}>
            <button
              aria-label={t("Edit Client")}
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={() => handleEdit(client.id)}
            >
              <EditIcon />
            </button>
          </Tooltip>
          <Tooltip color="danger" content={t("Delete Client")}>
            <button
              aria-label={t("Delete Client")}
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => handleDelete()}
            >
              <DeleteIcon />
            </button>
          </Tooltip>
        </div>
      );
    }
    if (columnKey === "serialNumber") {
      const index = clients.findIndex((c) => c.id === client.id) + 1;
      return <span>{index}</span>;
    }
    return client[columnKey] as any;
  };

  const columns = [
    { uid: "serialNumber", name: t("S.No") },
    { uid: "name", name: t("Name") },
    { uid: "email", name: t("Email") },
    { uid: "address", name: t("Address") },
    { uid: "actions", name: t("Actions") },
  ];

  return (
    <DefaultLayout>
      <h1 className="text-3xl font-bold text-center mb-8">{t("Clients")}</h1>
      <div className="row container px-10 mb-4">
        <Button
          color="primary"
          className="col-span-2"
          onClick={handleAddClient}
        >
          {t("Add New Client")}
        </Button>
      </div>
      <section className="row container px-8 flex flex-col items-center justify-center gap-4 py-2">
        <div className="inline-block max-w-full min-w-full text-center justify-center overflow-x-auto">
          <Table aria-label={t("Clients Table")}>
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
            <TableBody items={clients}>
              {(client) => (
                <TableRow key={client.id}>
                  {(columnKey) => (
                    <TableCell>
                      {renderCell(
                        client,
                        columnKey as keyof Client | "actions" | "serialNumber"
                      )}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default ClientsPage;
