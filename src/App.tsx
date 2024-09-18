import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import UserManagementPage from "@/pages/UserManagementPage";
import LoginPage from "@/pages/LoginPage";
import CreateClientPage from "@/pages/CreateClientPage";
import ClientsPage from "@/pages/ClientsPage";
import { RtlProvider } from "@/hooks/RtlContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import EditUserPage from "@/pages/EditUserPage";
import AdmissionForm from "./pages/Admission/AdmissionForm";
import ClassAdd from "./pages/control/ClassAdd";


function App() {
  return (
    <AuthProvider>
      <RtlProvider>
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <IndexPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <IndexPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docs"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <DocsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admission/AdmissionForm"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <AdmissionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/control/ClassAdd"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <ClassAdd />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <PricingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <BlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <AboutPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/client"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addClient"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <CreateClientPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-user/:userId"
            element={
              <ProtectedRoute roles={["alhafs"]}>
                <EditUserPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </RtlProvider>
    </AuthProvider>
  );
}

export default App;
