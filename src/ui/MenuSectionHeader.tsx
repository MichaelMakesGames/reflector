import React from "react";

export default function MenuSectionHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h3 className="text-2xl mt-5">{children}</h3>;
}
