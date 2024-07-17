"use client";

import { Card } from "@prisma/client";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";

interface CardItemProps {
  index: number;
  data: Card;
}
export const CardItem = ({ index, data }: CardItemProps) => {
  const { id, onOpen } = useCardModal();

  return (
    <Draggable draggableId={data.id} index={index}>
      {({ dragHandleProps, draggableProps, innerRef }) => (
        <div
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}
          onClick={() => onOpen(data.id)}
          role="button"
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
