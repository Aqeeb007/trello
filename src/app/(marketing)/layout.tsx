import React from "react";
import { Navbar } from "./_components/Navbar";
import { Footer } from "./_components/Footer";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full bg-slate-100">
      <Navbar />
      <main className="pb-20 bg-slate-100 pt-40">{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
