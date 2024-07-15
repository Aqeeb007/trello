"use client";

import { ListWithCards } from "@/types";
import { List } from "@prisma/client";
import { ListFrom } from "./ListFrom";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  console.log("ListContainer ~ ListContainer:", ListContainer);
  return (
    <ol>
      <ListFrom />
      <div className=" flex-shrink-0 w-1" />
    </ol>
  );
};
