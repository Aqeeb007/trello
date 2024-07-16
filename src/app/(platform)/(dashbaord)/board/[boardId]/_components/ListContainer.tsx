"use client";

import { ListWithCards } from "@/types";
import { List } from "@prisma/client";
import { ListFrom } from "./ListFrom";
import { useState, useEffect } from "react";
import { ListItem } from "./ListItem";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/useAction";
import { updatedListOrder } from "@/actions/updateListOrder";
import { toast } from "sonner";
import { UpdateCardOrder } from "@/actions/updateCardOrder/schema";
import { updatedCardOrder } from "@/actions/updateCardOrder";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updatedListOrder, {
    onSuccess: (data) => {
      toast.success("List order updated");
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updatedCardOrder, {
    onSuccess: (data) => {
      toast.success("List order updated");
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({
          ...item,
          order: index,
        }),
      );
      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    if (type === "card") {
      const newOrderData = [...orderedData];
      const sourceList = newOrderData.find(
        (list) => list.id === source.droppableId,
      );

      const destinationList = newOrderData.find(
        (list) => list.id === destination.droppableId,
      );

      if (!sourceList || !destinationList) return;

      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      if (!destinationList.cards) {
        sourceList.cards = [];
      }

      if (source.droppableId === destination.droppableId) {
        const reOrderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index,
        );

        reOrderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reOrderedCards;
        setOrderedData(newOrderData);
        executeUpdateCardOrder({ items: reOrderedCards, boardId: boardId });
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        movedCard.listId = destination.droppableId;
        destinationList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderData);
        executeUpdateCardOrder({ items: destinationList.cards, boardId });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {({ droppableProps, innerRef, placeholder }) => (
          <ol
            {...droppableProps}
            ref={innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} data={list} index={index} />;
            })}
            {placeholder}
            <ListFrom />
            <div className=" flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
