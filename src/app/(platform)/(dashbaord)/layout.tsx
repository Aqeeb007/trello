import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { Navbar } from "./_components/Navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="">{children}</main>
    </div>
  );
};

export default DashboardLayout;
