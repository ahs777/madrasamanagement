// routes.js
import IndexPage from "@/pages/index";
// import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import UserManagementPage from "@/pages/UserManagementPage";
import LoginPage from "@/pages/LoginPage";
import CreateClientPage from "@/pages/CreateClientPage";
import ClientsPage from "@/pages/ClientsPage";
import EditUserPage from "@/pages/EditUserPage";
import AdmissionForm from "@/pages/Admission/AdmissionForm";
import ClassAdd from "@/pages/control/ClassAdd";
import DepartmentAdd from "@/pages/control/DepartmentAdd";
import SectionAdd from "@/pages/control/SectionAdd";
// import ProtectedRoute from "@/components/ProtectedRoute";

const routes = [
  { path: "/", element: IndexPage, roles: ["alhafs"] },
  { path: "/home", element: IndexPage, roles: ["alhafs"] },
  { path: "/admission/AdmissionForm", element: AdmissionForm, roles: ["alhafs"] },
  { path: "/control/ClassAdd", element: ClassAdd, roles: ["alhafs"] },
  { path: "/control/SectionAdd", element: SectionAdd, roles: ["alhafs"] },
  { path: "/control/DepartmentAdd", element: DepartmentAdd, roles: ["alhafs"] },
  { path: "/pricing", element: PricingPage, roles: ["alhafs"] },
  { path: "/blog", element: BlogPage, roles: ["alhafs"] },
  { path: "/about", element: AboutPage, roles: ["alhafs"] },
  { path: "/login", element: LoginPage },
  { path: "/client", element: ClientsPage, roles: ["alhafs"] },
  { path: "/addClient", element: CreateClientPage, roles: ["alhafs"] },
  { path: "/users", element: UserManagementPage, roles: ["alhafs"] },
  { path: "/edit-user/:userId", element: EditUserPage, roles: ["alhafs"] },
];

export default routes;
