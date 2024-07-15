"use client";

import { ListWithCards } from "@/types";
import { List } from "@prisma/client";
import { ListFrom } from "./ListFrom";
import { useState, useEffect } from "react";
import { ListItem } from "./ListItem";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData.map((list, index) => {
        return <ListItem key={list.id} data={list} index={index} />;
      })}
      <ListFrom />
      <div className=" flex-shrink-0 w-1" />
    </ol>
  );
};
