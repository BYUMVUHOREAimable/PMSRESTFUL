/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogoRound } from "@/assets";
import { CommonContext } from "@/context";
import { logout } from "@/redux/slices/userReducer";
import React, { useContext } from "react";
import { BiLogOut } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const MobileSidebar: React.FC = () => {
  const { setShowSidebar } = useContext(CommonContext);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setShowSidebar(false)}
      />

      {/* Sidebar */}
      <div className="relative bg-white w-10/12 sm:w-7/12 max-w-xs h-full flex flex-col p-6 shadow-xl animate-slideInLeft rounded-r-2xl z-50">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <img src={LogoRound} className="w-36 mx-auto" alt="" />
          <span className="font-extrabold text-2xl text-gray-800">PMS</span>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-6">
          <Link
            to="/"
            onClick={() => setShowSidebar(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-all"
          >
            <MdDashboard size={24} className="text-indigo-500" />
            <span className="text-lg font-medium text-gray-700">Dashboard</span>
          </Link>

          <button
            onClick={() => {
              handleLogout();
              setShowSidebar(false);
            }}
            className="flex items-center gap-3 p-3 rounded-lg  hover:bg-slate-300/60"
          >
            <BiLogOut size={24} />
            <span className="text-lg font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MobileSidebar;
