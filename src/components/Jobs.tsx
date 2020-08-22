import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import jobTypes, { JobTypeCode } from "~data/jobTypes";
import actions from "~state/actions";
import selectors from "~state/selectors";
import { RawState } from "~types";

export default function Jobs() {
  const dispatch = useDispatch();
  const jobPriorities = useSelector(selectors.jobPriorities);
  const orderedJobTypes = Object.entries(jobPriorities)
    .sort((a, b) => a[1] - b[1])
    .map(([code]) => jobTypes[code as JobTypeCode]);

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
    </section>
  );
}

function JobRow({ code, index }: { code: JobTypeCode; index: number }) {
  const jobType = jobTypes[code];
  const employed = useSelector((state: RawState) =>
    selectors.numberEmployed(state, code),
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
          <span className="flex-1">{jobType.label}</span>
          <span>
            {employed} / {max}
          </span>
        </div>
      )}
    </Draggable>
  );
}
