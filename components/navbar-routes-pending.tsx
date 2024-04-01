"use client";

import { UserButton } from "@clerk/nextjs";

import { ModeToggle } from "./ui/theme-button";

export const NavbarRoutesPending = ({ userId }: any) => {
  return (
    <>
      <div className="flex gap-x-2 ml-auto justify-center">
        <div className="flex items-center">
          <div className="flex items-center ml-5 mr-3">
            <ModeToggle />
          </div>
        </div>
        {userId ? <UserButton afterSignOutUrl="/" /> : <></>}
      </div>
    </>
  );
};
