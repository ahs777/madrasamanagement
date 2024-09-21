// App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import { RtlProvider } from "@/hooks/RtlContext";
import { AuthProvider } from "@/context/AuthContext";
import routes from "./routes";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <RtlProvider>
        <Routes>
          {routes.map(({ path, element, roles }) => (
            <Route
              key={path}
              path={path}
              element={
                roles ? (
                  <ProtectedRoute roles={roles}>
                    {React.createElement(element)}
                  </ProtectedRoute>
                ) : (
                  React.createElement(element)
                )
              }
            />
          ))}
        </Routes>
      </RtlProvider>
    </AuthProvider>
  );
}

export default App;
