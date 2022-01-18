import Tippy from "@tippyjs/react";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "./GameProvider";
import resources, { Resource } from "../data/resources";
import selectors from "../state/selectors";
import { RawState } from "../types";
import ResourceIcon from "./ResourceIcon";

export default function Resources() {
  return (
    <section className="p-2 border-b border-gray" data-section="RESOURCES">
      <h2 className="text-xl">Resources</h2>
      <table className="w-full">
        <thead className="hidden">
          <tr>
            <th>Icon</th>
            <th>Resource</th>
            <th>Amount</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {Object.values(resources).map((r) => (
            <ResourceRow key={r.code} resource={r} />
          ))}
        </tbody>
      </table>
    </section>
  );
}

function ResourceRow({ resource }: { resource: Resource }) {
  const amount = useSelector((state: RawState) =>
    selectors.resource(state, resource.code)
  );
  const storage = useSelector((state: RawState) =>
    selectors.storage(state, resource.code)
  );
  const changes = useSelector((state: RawState) =>
    selectors.resourceChange(state, resource.code)
  );
  const totalChange = changes
    .filter((change) => change.reason !== "Building")
    .reduce((acc, cur) => acc + cur.amount, 0);
  const { formatNumber } = useIntl();
  const getChangeColorClass = (change: number) => {
    if (change > 0) return "text-green";
    if (change < 0) return "text-red";
    return "text-lightGray";
  };

  return (
    <tr
      className="flex flex-row items-center h-8 box-content border-t border-darkGray"
      data-resource={resource.code}
    >
      <Tippy content={resource.description}>
        <td className="flex-initial h-6">
          <ResourceIcon resourceCode={resource.code} />
        </td>
      </Tippy>
      <Tippy content={resource.description}>
        <td className="flex-1">{resource.label}</td>
      </Tippy>
      <Tippy
        placement="right"
        content={
          <table>
            <tbody>
              <tr>
                <th className="text-left">Last Turn</th>
                <th
                  className={`text-right pl-2 ${getChangeColorClass(
                    totalChange
                  )}`}
                >
                  {formatNumber(totalChange, { signDisplay: "always" })}
                </th>
              </tr>
              {changes.map((change) => (
                <tr key={change.reason}>
                  <td className="text-left">{change.reason}</td>
                  <td
                    className={`text-right pl-2 ${getChangeColorClass(
                      change.amount
                    )}`}
                  >
                    {formatNumber(change.amount, { signDisplay: "always" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      >
        <td className="flex-1 text-right">
          <span className={amount >= storage ? "text-yellow" : "text-white"}>
            {formatNumber(amount)}
          </span>
          <span className="text-lightGray">/{formatNumber(storage)}</span>
        </td>
      </Tippy>
    </tr>
  );
}
