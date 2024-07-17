"use client";

import { copyCard } from "@/actions/copyCard";
import { deleteCard } from "@/actions/deleteCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/useAction";
import { CartWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface ActionsProps {
  data: CartWithList;
}
export const Actions = ({ data }: ActionsProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const { execute: copyExecute } = useAction(copyCard, {
    onSuccess: (data) => {
      toast.success("Card copied");

      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: deleteExecute } = useAction(deleteCard, {
    onSuccess: (data) => {
      toast.success("Card deleted");
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={() => {
          const boardId = params.boardId as string;
          copyExecute({ id: data.id, boardId });
        }}
        variant={"gray"}
        className="justify-start w-full"
        size={"inline"}
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={() => {
          const boardId = params.boardId as string;
          deleteExecute({ id: data.id, boardId });
        }}
        variant={"gray"}
        className="justify-start w-full"
        size={"inline"}
      >
        <Trash className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20 text-neutral-200" />
      <Skeleton className="h-8 w-full text-neutral-200" />
      <Skeleton className="h-8 w-full text-neutral-200" />
    </div>
  );
};
