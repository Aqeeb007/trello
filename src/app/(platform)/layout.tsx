import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <main className="">{children}</main>
    </ClerkProvider>
  );
};

export default PlatformLayout;
