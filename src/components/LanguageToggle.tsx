import { FC, useState } from "react";
import { Button } from "@nextui-org/react";

export const LanguageToggle: FC = () => {
  const [language, setLanguage] = useState<string>(() => document.documentElement.lang || "en");

  const toggleLanguage = () => {
    setLanguage(prevLanguage => {
      const newLanguage = prevLanguage === "en" ? "ur" : "en";
      document.documentElement.lang = newLanguage;

      // If you have an i18n setup or similar, reinitialize or trigger a refresh here
      // e.g., i18n.changeLanguage(newLanguage);

      return newLanguage;
    });
  };

  return (
    <Button
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === "en" ? "Urdu" : "English"}`}
      style={{ minWidth: "auto", padding: "$sm" }} // Adjust styling if needed
    >
      Switch to {language === "en" ? "Urdu" : "English"}
    </Button>
  );
};
