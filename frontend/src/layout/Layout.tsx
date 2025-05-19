import MobileSidebar from "@/components/MobileSidebar";
import { CommonContext } from "@/context";
import React, { useContext } from "react";

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { showSidebar } = useContext(CommonContext);

  return (
    <div className="w-full flex flex-col min-h-screen justify-between bg-[#f3f6fa]">
      {showSidebar && <MobileSidebar />}
      {children}
    </div>
  );
};

export default Layout;
