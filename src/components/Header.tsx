import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "./UserMenu";

type Props = {};

const Header = (props: Props) => {
  return (
    <header className=" w-full fixed top-0 z-[1000]">
      <nav className=" container mx-auto  flex justify-between items-center px-4 py-6">
        <Link href="">Taskify</Link>

        <div className="flex items-center gap-4">
          <Link href="/project/create">
            <Button variant="default" className="flex items-center gap-2">
              <PenBox size={18} />
              <span className="hidden sm:inline">Create Project</span>
            </Button>
          </Link>
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
