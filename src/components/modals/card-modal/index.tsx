"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CartWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Description } from "./description";
import { Header } from "./header";
import { Actions } from "./actions";

export const CardModal = () => {
  const { isOpen, onClose, id } = useCardModal();

  const {
    data: cardData,
    isLoading,
    isPending,
  } = useQuery<CartWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/card/${id}`),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent className="min-w-[600px]">
        {!cardData ? (
          <Header.Skeleton />
        ) : (
          <Header data={cardData as CartWithList} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-2">
          <div className="col-span-3 ">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData as CartWithList} />
              )}
            </div>
          </div>
          {!cardData ? (
            <Actions.Skeleton />
          ) : (
            <Actions data={cardData as CartWithList} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
