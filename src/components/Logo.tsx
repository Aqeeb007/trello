import Image from "next/image";
import localFont from "next/font/local";
import Link from "next/link";

import { images } from "@/constants/images";
import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: "../../src/assets/fonts/font.woff2",
});

export const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="hover:opacity-75 transition items-center gap-2 hidden md:flex">
        <Image src={images.logo} alt="logo" height={30} width={30} />
        <p className={cn("text-lg text-neutral-700", headingFont.className)}>
          Taskify
        </p>
      </div>
    </Link>
  );
};
