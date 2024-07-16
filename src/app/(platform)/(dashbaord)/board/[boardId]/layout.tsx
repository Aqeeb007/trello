import React from "react";

import { startCase } from "lodash";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/BoardNavbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string };
}) {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  const title = startCase(board?.title || "organization");
  return {
    title,
  };
}

const BoardIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative min-h-screen bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${board.imageFullUrl})`,
      }}
    >
      <div className="absolute bg-black/10 inset-0" />
      <BoardNavbar board={board} />
      <main className="relative pt-28 h-screen">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
