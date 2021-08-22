import React from "react";
import { ResourceCode } from "../data/resources";
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
    <span className={`inline-block ${className}`}>
      {amount}
      <ResourceIcon resourceCode={resourceCode} style={{ bottom: "6px" }} />
    </span>
  );
}
