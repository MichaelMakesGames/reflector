import React from "react";

export default function Alert({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block rounded-full h-4 w-4 text-center text-xs font-bold my-1 text-black ${className}`}
      style={{ transform: "translateY(-1px)" }}
    >
      !
    </div>
  );
}
