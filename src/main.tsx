import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import i18n from "./i18n.tsx";
import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import { I18nextProvider } from "react-i18next";
import { DirectionLanguageProvider } from "@/components/DirectionLanguageContext.tsx"; // Import provider
import { UserRoleProvider } from "@/context/UserRoleContext";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DirectionLanguageProvider>
        <I18nextProvider i18n={i18n}>
          <Provider>
            <UserRoleProvider>
              <App />
            </UserRoleProvider>
          </Provider>
        </I18nextProvider>
      </DirectionLanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
