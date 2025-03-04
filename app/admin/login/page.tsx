import LoginPage from "../components/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Priscilla Celine",
  description: "Login to access the admin dashboard",
};

export default function AdminLoginPage() {
  return <LoginPage />;
}
