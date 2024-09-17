export const siteConfig = {
  name: "Vite + NextUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Admission",
      href: "/",
      translations: {
        en: "Admission",
        ur: "داخلا",
      },
      roles: [], // No specific role required
    },
    {
      label: "Books",
      href: "/bookList",
      translations: {
        en: "Books",
        ur: "کتابیں",
      },
      roles: [], // No specific role required
    },
    {
      label: "Inventory",
      href: "/Inventory",
      translations: {
        en: "Inventory",
        ur: "انوینٹری",
      },
      roles: [], // No specific role required
    },
    {
      label: "Sales",
      href: "/sales",
      translations: {
        en: "Sales",
        ur: "فروخت",
      },
      roles: [], // No specific role required
    },
    {
      label: "Order",
      href: "/orders",
      translations: {
        en: "Order",
        ur: "آرڈر",
      },
      roles: [], // No specific role required
    },
    {
      label: "Users",
      href: "/users",
      translations: {
        en: "Users",
        ur: "یوزرز",
      },
      roles: ['admin', 'alhafs'], // Only visible to admins
    },
    {
      label: "Clients",
      href: "/client",
      translations: {
        en: "Clients",
        ur: "کلایئنٹس",
      },
      roles: ['alhafs'], // Only visible to 'alhafs' role
    },
  ],
  TopBarItems: [
    {
      label: "Hifz",
      href: "/",
      translations: {
        en: "Hifz",
        ur: "",
      },
      roles: [], // No specific role required
    },
    {
      label: "Books",
      href: "/bookList",
      translations: {
        en: "Books",
        ur: "کتابیں",
      },
      roles: [], // No specific role required
    },
    {
      label: "Inventory",
      href: "/Inventory",
      translations: {
        en: "Inventory",
        ur: "انوینٹری",
      },
      roles: [], // No specific role required
    },
    {
      label: "Sales",
      href: "/sales",
      translations: {
        en: "Sales",
        ur: "فروخت",
      },
      roles: [], // No specific role required
    },
    {
      label: "Order",
      href: "/orders",
      translations: {
        en: "Order",
        ur: "آرڈر",
      },
      roles: [], // No specific role required
    },
    {
      label: "Users",
      href: "/users",
      translations: {
        en: "Users",
        ur: "یوزرز",
      },
      roles: ['admin', 'alhafs'], // Only visible to admins
    },
    {
      label: "Clients",
      href: "/client",
      translations: {
        en: "Clients",
        ur: "کلایئنٹس",
      },
      roles: ['alhafs'], // Only visible to 'alhafs' role
    },
  ],
  admissionItems:[
    {
      key: "postgraduate",
      label: "postgraduate",
      translations: {
        en: "Admission Form",
        ur: "داخلا فارم",
      },
    },
    {
      key: "admissionList",
      label: "postgraduate",
      translations: {
        en: "Addmision List",
        ur: "فہرست",
      },
    }
  ],
  // Similar changes to navMenuItems if needed
};
