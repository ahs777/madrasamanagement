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


function App() {
  return (
    <AuthProvider>
      <RtlProvider>
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute roles={["admin", "user", "alhafs"]}>
                <IndexPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute roles={["admin", "user", "alhafs"]}>
                <IndexPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/docs"
            element={
              <ProtectedRoute roles={["admin", "user", "alhafs"]}>
                <DocsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute roles={["admin", "user", "alhafs"]}>
                <PricingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog"
            element={
              <ProtectedRoute roles={["admin", "user", "alhafs"]}>
                <BlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute roles={["admin", "user", "alhafs"]}>
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
              <ProtectedRoute roles={["admin", "alhafs"]}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-user/:userId"
            element={
              <ProtectedRoute roles={["admin", "alhafs"]}>
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
