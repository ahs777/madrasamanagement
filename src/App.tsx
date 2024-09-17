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


function App() {
  return (
    <AuthProvider>
      <RtlProvider>
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute roles={[""]}>
                <IndexPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute roles={[""]}>
                <IndexPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docs"
            element={
              <ProtectedRoute roles={[""]}>
                <DocsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admission/AdmissionForm"
            element={
              <ProtectedRoute roles={[""]}>
                <AdmissionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute roles={[""]}>
                <PricingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute roles={[""]}>
                <BlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute roles={[""]}>
                <AboutPage />
              </ProtectedRoute>
            }
          />
          
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/client"
            element={
              <ProtectedRoute roles={[""]}>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addClient"
            element={
              <ProtectedRoute roles={[""]}>
                <CreateClientPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/users"
            element={
              <ProtectedRoute roles={[""]}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-user/:userId"
            element={
              <ProtectedRoute roles={[""]}>
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
