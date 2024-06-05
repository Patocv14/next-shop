"use client";

import Link from "next/link";
import { useUiStore } from "@/store";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";
import clsx from "clsx";
import { logout } from "@/actions";
import { signOut, useSession } from "next-auth/react";

export const Sidebar = () => {
  const isSideMenuOpen = useUiStore((state) => state.isSideMenuOpen);
  const closeMenu = useUiStore((state) => state.closeIsdeMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  const handleLogout = async () => {
    closeMenu();
    signOut({ redirect: false })
  }

  return (
    <div>
      {/* Background black */}
      {/* blur */}
      {isSideMenuOpen && (
        <>
          <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
          <div className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm" />
        </>
      )}

      {/* side menu */}
      <nav
        className={clsx(
          "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl translate-x-0 transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => closeMenu()}
        />

        {/* input */}

        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {isAuthenticated && (
          <>
            <Link
              href={"/profile"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 transition-all"
              onClick={() => closeMenu()}
            >
              <IoPersonOutline size={30} />
              <span className="ml-3 text-xl">Perfil</span>
            </Link>
            <Link
              href={"/orders"}
              onClick={() => closeMenu()}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>
          </>
        )}

        {/* navbar */}

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 transition-all"
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-xl">Salir</span>
          </button>
        )}
        {!isAuthenticated && (
          <Link
            onClick={() => closeMenu()}
            href={"/auth/login"}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 transition-all"
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        )}

        {/* Line separator */}

        {isAdmin && (
          <>
            <div className="w-full h-px bg-gray-200 my-10" />
            <Link
              href={"/"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 transition-all"
            >
              <IoShirtOutline size={30} />
              <span className="ml-3 text-xl">Productos</span>
            </Link>
            <Link
              href={"/"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>
            <Link
              href={"/"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 transition-all"
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl">Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
