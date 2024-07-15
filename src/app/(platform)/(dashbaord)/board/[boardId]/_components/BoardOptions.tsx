"use client";
import { deleteBoard } from "@/actions/deleteBoard";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/useAction";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

interface BoardOptionsProps {
  id: string;
}
export const BoardOptions = ({ id }: BoardOptionsProps) => {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant={"transparent"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="center">
        <div className="text-sm font-semibold text-center text-neutral-600 pb-4">
          Board actions
        </div>
        <PopoverClose>
          <Button
            disabled={isLoading}
            className="h-auto w-auto p-2 absolute top-2 right-2"
            variant={"ghost"}
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant={"ghost"}
          onClick={onClick}
          className="text-sm rounded-none h-auto w-full p-2 px-5 justify-start font-normal"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
