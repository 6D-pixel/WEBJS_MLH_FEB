import Image from "next/image";
import TicTacToe from "@/components/TicTacToe";
import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <main className="bg-violet-300 h-screen">
      <Navbar />
      <h1 className="text-4xl text-center text-blue-500 mt-5">
        Flow Tic-Tac-Toe
      </h1>
      <TicTacToe />
    </main>
  );
}
