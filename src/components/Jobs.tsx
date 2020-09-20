import Tippy from "@tippyjs/react";
import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import jobTypes, { JobTypeCode } from "~data/jobTypes";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { RawState } from "~types";
import Warning from "./Warning";
import colonistStatuses, { ColonistStatusCode } from "~data/colonistStatuses";

export default function Jobs() {
  const dispatch = useDispatch();
  const jobPriorities = useSelector(selectors.jobPriorities);
  const orderedJobTypes = Object.entries(jobPriorities)
    .sort((a, b) => a[1] - b[1])
    .map(([code]) => jobTypes[code as JobTypeCode]);
  const numberUnemployed = useSelector(selectors.numberOfUnemployedColonists);

  return (
    <section className="p-2 border-b border-gray">
      <div className="flex items-baseline">
        <h2 className="text-xl flex-1">Jobs</h2>
        <span className="text-sm">Employed / Max</span>
      </div>
      <DragDropContext
        onDragEnd={(e) => {
          if (e.destination) {
            dispatch(
              actions.setJobPriority({
                jobType: e.draggableId as JobTypeCode,
                priority: e.destination.index + 1,
              }),
            );
          }
        }}
      >
        <Droppable droppableId="jobs">
          {(provided, snapshot) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              {orderedJobTypes.map((jobType, index) => (
                <JobRow key={jobType.code} code={jobType.code} index={index} />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div className="text-center text-lightGray">
        {numberUnemployed} {numberUnemployed === 1 ? "colonist" : "colonists"}{" "}
        unemployed.
      </div>
    </section>
  );
}

function JobRow({ code, index }: { code: JobTypeCode; index: number }) {
  const jobType = jobTypes[code];
  const numEmployed = useSelector((state: RawState) =>
    selectors.numberEmployed(state, code),
  );
  const employedColonists = useSelector((state: RawState) =>
    selectors.colonistsEmployedInJobType(state, code),
  );
  const isMissingResources = employedColonists.some(
    (e) => e.colonist.status === ColonistStatusCode.MissingResources,
  );
  const numDisabled = useSelector((state: RawState) =>
    selectors.numberOfDisabledJobs(state, code),
  );
  const max = useSelector((state: RawState) =>
    selectors.maxNumberEmployed(state, code),
  );
  return (
    <Draggable draggableId={code} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          data-jobs-dnd-index={index}
          data-job-type-code={code}
          className={`flex border-t p-1 ${
            snapshot.isDragging
              ? "border border-white"
              : "border-t border-darkGray"
          }`}
        >
          <Tippy
            content={
              <>
                <p className="mb-2">{jobType.description}</p>
                <p>
                  Click and drag to change priority. Colonists fill higher
                  priority jobs first.
                </p>
              </>
            }
          >
            <span className="flex-1">{jobType.label}</span>
          </Tippy>
          <Tippy
            placement="right"
            content={
              <div>
                {employedColonists.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th className="text-left">Status</th>
                        <th className="text-right">Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(colonistStatuses).map((status) => {
                        const count = employedColonists.filter(
                          (e) => e.colonist.status === status.code,
                        ).length;
                        if (count === 0) return null;
                        return (
                          <tr
                            key={status.code}
                            className="border-t border-gray"
                          >
                            <td>{status.label}</td>
                            <td className="text-right">{count}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <p>No colonists employed for this job type.</p>
                )}
                {numDisabled > 0 && (
                  <p className="mt-2">
                    {numDisabled} {numDisabled === 1 ? "job" : "jobs"} disabled.
                  </p>
                )}
              </div>
            }
          >
            <span>
              <span>
                {numEmployed} / {max}
              </span>
              <span
                className={isMissingResources ? "" : "invisible"}
                aria-hidden={!isMissingResources}
              >
                <Warning className="ml-1" />
              </span>
            </span>
          </Tippy>
        </div>
      )}
    </Draggable>
  );
}
