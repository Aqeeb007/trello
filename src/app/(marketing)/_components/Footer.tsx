import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full p-4 border-t bg-slate-100">
      <div className="flex md:max-w-screen-2xl mx-auto w-full items-center justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size={"sm"} variant={"ghost"}>
            Privacy policy
          </Button>
          <Button size={"sm"} variant={"ghost"}>
            Terms and conditions
          </Button>
        </div>
      </div>
    </div>
  );
};
