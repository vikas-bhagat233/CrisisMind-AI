import React from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Footer from "../components/common/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 flex gap-8">
        <Sidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
