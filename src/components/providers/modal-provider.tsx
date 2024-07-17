"use client";

import { useEffect, useState } from "react";
import { CardModal } from "../modals/card-modal";

export const ModalProvider = () => {
  const [isMounted, setISmounted] = useState(false);

  useEffect(() => {
    setISmounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CardModal />
    </>
  );
};
