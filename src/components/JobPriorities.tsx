/* global document */
import classNames from "classnames";
import React, { useState } from "react";
import Modal from "react-modal";
import { useSelector, useDispatch } from "react-redux";
import selectors from "~state/selectors";
import actions from "~state/actions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function JobPriorities({ isOpen, onClose }: Props) {
  const dispatch = useDispatch();
  const jobPriorities = useSelector(selectors.jobPriorities);
  const sortedJobs = Object.entries(jobPriorities)
    .sort((a, b) => a[1] - b[1])
    .map(([jobType, _]) => jobType as JobType);
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const focusNext = (jobType: JobType) => {
    const nextJobType = sortedJobs[sortedJobs.indexOf(jobType) + 1];
    if (nextJobType) {
      document.getElementById(`job-button-${nextJobType}`)?.focus();
    }
  };

  const focusPrev = (jobType: JobType) => {
    const nextJobType = sortedJobs[sortedJobs.indexOf(jobType) - 1];
    if (nextJobType) {
      document.getElementById(`job-button-${nextJobType}`)?.focus();
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      overlayClassName="inset-0 fixed h-screen w-screen bg-opaqueWhite"
      className="w-2/5 h-auto mx-auto my-8 shadow-2xl bg-black p-8 border border-white border-solid rounded"
      onRequestClose={onClose}
    >
      <h1>Job Priorities</h1>
      <ul>
        {sortedJobs.map((jobType, i) => (
          <li key={jobType}>
            <button
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus={i === 0}
              id={`job-button-${jobType}`}
              className={classNames("bg-black border-l-8 mb-1", {
                "border-blue": selectedJob === jobType,
              })}
              type="button"
              onKeyDown={e => {
                if (selectedJob === jobType) {
                  if ([" ", "Enter"].includes(e.key))
                    setSelectedJob(null);
                  if (["ArrowUp", "w", "8"].includes(e.key))
                    dispatch(actions.increaseJobPriority(jobType));
                  if (["ArrowDown", "s", "2"].includes(e.key))
                    dispatch(actions.decreaseJobPriority(jobType));
                } else {
                  if ([" ", "Enter"].includes(e.key)) setSelectedJob(jobType);
                  if (["ArrowDown", "s", "2"].includes(e.key))
                    focusNext(jobType);
                  if (["ArrowUp", "w", "8"].includes(e.key)) focusPrev(jobType);
                }
              }}
            >
              {jobType}
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
