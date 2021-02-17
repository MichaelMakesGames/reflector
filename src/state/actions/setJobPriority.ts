import { createStandardAction } from "typesafe-actions";
import jobTypes, { JobTypeCode } from "~data/jobTypes";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const setJobPriority = createStandardAction("SET_JOB_PRIORITY")<{
  jobType: JobTypeCode;
  priority: number;
}>();
export default setJobPriority;

function setJobPriorityHandler(
  state: WrappedState,
  action: ReturnType<typeof setJobPriority>,
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

registerHandler(setJobPriorityHandler, setJobPriority);
