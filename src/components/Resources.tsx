import React from "react";
import { useSelector } from "react-redux";
import selectors from "~/state/selectors";

export default function Resources() {
  const resources = useSelector(selectors.resources);

  return (
    <div className="box">
      <div className="box__label">Resources</div>
      {Object.entries(resources).map(([resource, amount]) => (
        <div key={resource}>
          {resource}: {amount}
        </div>
      ))}
    </div>
  );
}
