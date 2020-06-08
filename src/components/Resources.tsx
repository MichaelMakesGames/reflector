import Tooltip from "rc-tooltip";
import React from "react";
import { useSelector } from "react-redux";
import resources from "~data/resources";
import selectors from "~state/selectors";
import ResourceIcon from "./ResourceIcon";

export default function Resources() {
  const resourceAmounts = useSelector(selectors.resources);
  const resourceChanges = useSelector(selectors.resourceChanges);
  return (
    <section className="p-2 border-b border-gray">
      <h2 className="text-xl">Resources</h2>
      <table>
        <thead className="hidden">
          <tr>
            <th />
            <th>Resource</th>
            <th>Amount</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(resources).map((r) => (
            <tr key={r.code}>
              <td>
                <ResourceIcon resourceCode={r.code} />
              </td>
              <td>{r.label}</td>
              <td>{resourceAmounts[r.code]}</td>
              <Tooltip
                placement="right"
                overlay={
                  <ul>
                    {resourceChanges[r.code].length === 0 && (
                      <li>No changes</li>
                    )}
                    {resourceChanges[r.code].map((change) => (
                      <li key={change.reason}>
                        {change.reason} {change.amount}
                      </li>
                    ))}
                  </ul>
                }
              >
                <td>
                  {resourceChanges[r.code].reduce(
                    (acc, cur) => acc + cur.amount,
                    0,
                  )}
                </td>
              </Tooltip>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
