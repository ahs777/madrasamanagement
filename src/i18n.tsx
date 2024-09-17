import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translation/en.json";
import ur from "./translation/ur.json";

const resources = {
  en: {
    translation: en, // Load from the JSON file
  },
  ur: {
    translation: ur, // Load from the JSON file
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("i18nextLng") || "en", // Load from localStorage or default to 'en'
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
