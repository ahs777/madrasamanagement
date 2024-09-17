import { FC, useState } from "react";
import { Button } from "@nextui-org/react";
import { LtrIcon, RtlIcon } from "@/components/icons";

export const RtlSwitchIcon: FC = () => {
  const [isRtl, setIsRtl] = useState<boolean>(() => document.documentElement.dir === "rtl");

  const toggleRtl = () => {
    setIsRtl(prevIsRtl => {
      const newIsRtl = !prevIsRtl;
      document.documentElement.dir = newIsRtl ? "rtl" : "ltr";
      document.documentElement.lang = newIsRtl ? "ur" : "en";

      // If you have an i18n setup or similar, reinitialize or trigger a refresh here
      // e.g., i18n.changeLanguage(newIsRtl ? "ur" : "en");

      return newIsRtl;
    });
  };

  return (
    <Button
      onClick={toggleRtl}
      aria-label={`Switch to ${isRtl ? "LTR" : "RTL"}`}
      style={{ minWidth: "auto", padding: "$sm" }} // Adjust styling if needed
    >
      {isRtl ? <LtrIcon size={24} /> : <RtlIcon size={24} />}
    </Button>
  );
};
