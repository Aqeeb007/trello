import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="fixed top-0 w-full h-14 px-4 border shadow-sm bg-white flex items-center">
      <div className="flex md:max-w-screen-2xl mx-auto w-full items-center justify-between">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size={"sm"} variant={"outline"} asChild>
            <Link href={"sign-in"}>Login</Link>
          </Button>
          <Button size={"sm"} asChild>
            <Link href={"sign-up"}>Get Taskify for free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
