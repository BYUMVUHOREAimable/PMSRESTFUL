/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonContext } from "@/context";
import React, { useContext } from "react";
import { BiMenu } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const { setShowSidebar } = useContext(CommonContext);
  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;

  return (
    <div className="w-full bg-white flex items-center justify-between px-14 py-2">
      <div className="flex items-center">
        <button
          className="w-12 h-12 rounded-full bg-slate-200 smlg:hidden flex items-center justify-center"
          onClick={() => setShowSidebar(true)}
        >
          <BiMenu size={25} className="text-slate-900" />
        </button>
      </div>
      <Link to={`/${role.toLowerCase()}/profile`}>
        <img
          src="https://picsum.photos/200/300"
          className="w-12 h-12 rounded-full object-cover"
          alt=""
        />
      </Link>
    </div>
  );
};

export default Navbar;
