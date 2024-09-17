import { FC } from "react";
import { useDirectionLanguage } from "@/components/DirectionLanguageContext";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@nextui-org/navbar";
import { link as linkStyles } from "@nextui-org/theme";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";
import { Logo } from "@/components/icons";
import { RtlSwitchButton } from "@/components/rtlSwitch"; // Import the RtlSwitch component
import Logout from "./logout";

// Adjusted function to return role directly
const useUserRole = () => {
  return localStorage.getItem("role") || "guest";
};

export const Navbar: FC = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { isRtl } = useDirectionLanguage();

  // Directly use the role from useUserRole
  const role = useUserRole();

  const searchInput = (
    <Input
      aria-label={t("Search")}
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder={t("Search...")}
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  // Filter navItems based on user role
  const filteredNavItems = siteConfig.navItems.filter(
    (item) => item.roles.length === 0 || item.roles.includes(role)
  );

  return (
    <NextUINavbar maxWidth="xl" position="sticky">
      <NavbarContent
        className="basis-1/5 sm:basis-full text-xl"
        justify="center"
      >
        <div className="hidden lg:flex sm:flex md:flex gap-4 text-xl justify-center ml-2">
          {filteredNavItems.map((item) => (
            <NavbarItem key={item.href} className="text-xl">
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  pathname === item.href && "text-primary font-medium"
                )}
                color="foreground"
                href={item.href}
                style={{ fontSize: "18pt" }} // Set font size to 26pt
              >
                {isRtl ? item.translations.ur : item.translations.en}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2 text-xl">
          {filteredNavItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  pathname === item.href && "text-primary font-medium"
                )}
                color="foreground"
                href={item.href}
                style={{ fontSize: "16pt" }} // Set font size to 26pt
              >
                {isRtl ? item.translations.ur : item.translations.en}
              </Link>
            </NavbarItem>
          ))}
          <NavbarItem>
            <Logout />
          </NavbarItem>
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
