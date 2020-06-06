import React from "react";
import { ResourceCode } from "~data/resources";
import ResourceIcon from "./ResourceIcon";

interface Props {
  resourceCode: ResourceCode;
  amount: number;
  className?: string;
}
export default function ResourceAmount({
  resourceCode,
  amount,
  className = "",
}: Props) {
  return (
    <span className={`flex flex-row ${className}`}>
      <ResourceIcon resourceCode={resourceCode} />
      {amount}
    </span>
  );
}
