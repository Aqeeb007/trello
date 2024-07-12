import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { Toaster } from "sonner";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <Toaster position="top-right" richColors />
      <main className="">{children}</main>
    </ClerkProvider>
  );
};

export default PlatformLayout;
