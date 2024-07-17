import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ClerkProvider } from "@clerk/nextjs";
import React from "react";
import { Toaster } from "sonner";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <QueryProvider>
        <Toaster position="top-right" richColors />
        <ModalProvider />
        <main className="">{children}</main>
      </QueryProvider>
    </ClerkProvider>
  );
};

export default PlatformLayout;
