import React from "react";

const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex justify-center items-center h-screen">
      {children}
    </main>
  );
};

export default ClerkLayout;
