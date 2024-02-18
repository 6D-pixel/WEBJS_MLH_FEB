"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [connected, setConnected] = useState(false);
  useEffect(() => fcl.currentUser().subscribe(setUser), []);
  // fcl.config({
  //   // Testnet
  //    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
  // })
  const handleConnect = async () => {
    const wallet = await fcl.discovery();
    // Connect to the selected wallet
    await fcl.connect(wallet);
    setConnected(true);
  };

  return (
    <nav className="bg-violet-200 border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Game on
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Button onClick={handleConnect}>connect</Button>

          <button
            data-collapse-toggle="navbar-cta"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-cta"
        ></div>
      </div>
    </nav>
  );
};

export default Navbar;
