"use client";
import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Vote,
  LayoutDashboard,
  History,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  Bell,
  Eye,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("userEmail");

    setUserName(name || "User");
    setUserEmail(email || "");

    if (!email) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const navigationItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/vote-history",
      label: "Vote History",
      icon: History,
    },
    {
      href: "/observers",
      label: "Observe",
      icon: Eye,
    },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo and Brand */}
      <div className="flex flex-col items-center p-6 border-b border-green-200">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
          <Vote className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">E-Voting Portal</h2>
        <p className="text-sm text-gray-600">Student Dashboard</p>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-green-200">
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {userName}
            </p>
            <p className="text-xs text-gray-600 truncate">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                  onClick={isMobile ? close : undefined}
                >
                  <Icon className="w-5 h-5 group-hover:text-green-600" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-green-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] shadow-md"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex bg-gradient-to-br from-green-50 via-white to-emerald-50 min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-80 bg-white shadow-xl border-r border-green-100 fixed h-full z-10">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title=""
        padding={0}
        size="320px"
        className="lg:hidden"
        styles={{
          drawer: {
            backgroundColor: "#ffffff",
          },
          header: {
            display: "none",
          },
        }}
      >
        <div className="h-full bg-white">
          {/* Close button */}
          <div className="flex justify-end p-4">
            <button
              onClick={close}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <SidebarContent isMobile={true} />
        </div>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-80">
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b border-green-100 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={open}
              className="lg:hidden p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Welcome Message */}
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {userName}!
              </h1>
              <p className="text-gray-600">
                Manage your votes and view election results
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-6">
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 lg:p-8 min-h-[calc(100vh-200px)]">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Welcome Message */}
      <div className="lg:hidden fixed bottom-4 right-4 z-20">
        <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
          <p className="text-sm font-medium">Hi, {userName}!</p>
        </div>
      </div>
    </div>
  );
}
