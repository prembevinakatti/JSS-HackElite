import React, { useState } from "react";
import { Button } from "../../ui/button";
import ModeTogle from "./ModeTogle";
import { useDispatch, useSelector } from "react-redux";
import { IoMenu } from "react-icons/io5";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Importing Popover component
import { setAuthUser } from "@/redux/authslice";
import axiosInstance from "@/utils/Axiosinstance";
import { RiAdminLine } from "react-icons/ri";
import { FaUserCheck } from "react-icons/fa";
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false); // State for Popover
  const dispatch = useDispatch();
  const isLogined = useSelector((state) => state.auth.authUser);

  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(setAuthUser(null));
    axiosInstance.post("");
  };
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };
  const handleSheetOpen = () => {
    // if (!isLogined) {
    //   setShowPopover(true);
    //   return;
    // }
    setIsOpen(true);
  };
  return (
    <nav className="w-screen shadow-md">
      <div className="w-full flex items-center px-4 py-3 mx-auto justify-between">
        {/* Menu Trigger with Popover */}
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger asChild>
            <div onClick={handleSheetOpen}>
              <IoMenu
                size={30}
                className="text-black dark:text-white cursor-pointer hover:text-gray-600 dark:hover:text-gray-300"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Please log in to access the menu.
            </p>
          </PopoverContent>
        </Popover>

        {/* Sidebar Sheet */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                <div>
                  <Separator className="my-3" />
                  <div
                    className="cursor-pointer text-slate-800 hover:text-black dark:text-slate-300 dark:hover:text-white"
                    onClick={() => handleNavigation("/view")}
                  >
                    view files
                  </div>
                  <Separator className="my-3" />
                  <div
                    className="cursor-pointer text-slate-800 hover:text-black dark:text-slate-300 dark:hover:text-white"
                    onClick={() => handleNavigation("/uploadfiles")}
                  >
                    uploadfiles
                  </div>
                  <Separator className="my-3" />
                  <div
                    className="cursor-pointer text-slate-800 hover:text-black dark:text-slate-300 dark:hover:text-white"
                    onClick={() => handleNavigation("/createuser")}
                  >
                    create accounts
                  </div>
                  <Separator className="my-3" />
                
                  <div className="cursor-pointer text-slate-800 hover:text-black dark:text-slate-300 dark:hover:text-white">
                    Request
                  </div>
                  
                  <Separator className="my-3" />
                  <Separator className="my-3" />
                
                  <div className="cursor-pointer text-slate-800 hover:text-black dark:text-slate-300 dark:hover:text-white" onClick={()=>navigate("/assignpanel")}>
                  assignpanel
                  </div>

                  <Separator className="my-3" />
                  <div
                    className="cursor-pointer text-slate-800 hover:text-black dark:text-slate-300 dark:hover:text-white"
                    onClick={() => handleNavigation("/connectmetamask")}
                  >
                    Connect to metamask
                  </div>
                  <Separator className="my-3" />
                  {isLogined && (
                    <div
                      className="cursor-pointer text-slate-800 hover:text-red-800 dark:hover:text-red-500 dark:text-red-200"
                      onClick={handleLogout}
                    >
                      Logout
                    </div>
                  )}
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <div className="text-2xl font-bold text-black dark:text-white">
          <a href="/"> youshould name it</a>
        </div>

        {/* Auth Buttons */}
        <div className="flex space-x-2 items-center">
          <ModeTogle />

          {isLogined ? (
            <div>
             
              <div className="flex gap-2 border-1 drop-shadow-md ">
                {isLogined?.role}
                {isLogined?.role == "Head" ? <RiAdminLine className="mt-1" /> : <FaUserCheck className="mt-1" />}
              </div>
            </div>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
