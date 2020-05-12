import React from "react";
import MainMenu from "./MainMenu";

export default function Header() {
  return (
    <header className="flex-none bg-darkGray border-b border-gray">
      <div className="w-full max-w-screen-lg mx-auto py-1 px-2 flex flex-row">
        <h1 className="font-bold flex-1">Reflector: Laser Defense</h1>
        <MainMenu />
      </div>
    </header>
  );
}
