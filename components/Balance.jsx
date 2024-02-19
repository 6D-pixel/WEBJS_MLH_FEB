"use client";
import React, { useEffect, useState } from "react";
import { getFlowBalance } from "../lib/flow/tx";
import { useRecoilValue } from "recoil";
import { userAddress } from "../recoil/recoil_states";

const Balance = () => {
  const [bot, setBot] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const useradd = useRecoilValue(userAddress);
  useEffect(() => {
    getFlowBalance("0x254cc842174ec9d4").then((res) => {
      setBot(Number(res).toFixed(3));
    });
    getFlowBalance("0x3f6d0a02d7aa2baa").then((res) => {
      setUserBalance(Number(res).toFixed(3));
    });
    console.log(useradd);
  }, []);

  return (
    <div className="bg-violet-200 border-gray-200 dark:bg-gray-900 mt-10 rounded-full">
      <div className="grid grid-cols-2 gap-4 justify-items-center">
        <div>
          <div className="text-center text-red">🤖</div>
          <div className="text-center text-red-500">{bot}</div>
        </div>
        <div>
          <div className="text-center text-blue-500">YOU</div>
          <div className="text-center text-blue-500">{userBalance}</div>
        </div>
      </div>
    </div>
  );
};

export default Balance;
