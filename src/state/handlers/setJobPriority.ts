import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import jobTypes from "~data/jobTypes";
import { registerHandler } from "~state/handleAction";

function setJobPriority(
  state: WrappedState,
  action: ReturnType<typeof actions.setJobPriority>,
): void {
  const { jobType: code, priority: newPriority } = action.payload;
  const oldPriority = state.select.jobPriority(code);
  const newPriorities = {
    ...state.raw.jobPriorities,
  };
  for (const jobType of Object.values(jobTypes)) {
    const priority = newPriorities[jobType.code];
    if (jobType.code === code) {
      newPriorities[jobType.code] = newPriority;
    } else if (priority > oldPriority && priority <= newPriority) {
      newPriorities[jobType.code] = priority - 1;
    } else if (priority < oldPriority && priority >= newPriority) {
      newPriorities[jobType.code] = priority + 1;
    }
  }
  state.setRaw({
    ...state.raw,
    jobPriorities: newPriorities,
  });
}

registerHandler(setJobPriority, actions.setJobPriority);
