import React from "react";
import { OrgControl } from "./_components/org-control";

import { startCase } from "lodash";
import { auth } from "@clerk/nextjs/server";

export async function generateMetadata() {
  const { orgSlug } = auth();
  const title = startCase(orgSlug || "organization");
  return {
    title,
  };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
