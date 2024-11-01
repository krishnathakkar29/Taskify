"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { PenBox } from "lucide-react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";
import UserMenu from "./UserMenu";

type Props = {};

const Navbar = (props: Props) => {
  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    }),
  };

  

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          type: "spring",
          damping: 10,
          stiffness: 100,
        }}
        className="fixed top-0 z-[999] w-full border-b border-primary/10 bg-background"
      >
        <div className="wrapper flex w-full items-center justify-between p-3">
          <Link href="">Taskify</Link>

          <motion.div
            className="flex items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
            custom={0}
          >
            <Link href="/project/create">
              <Button variant="outline" className="flex items-center gap-2">
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
            <ThemeToggle />
          </motion.div>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};

export default Navbar;
