import { createAction } from "typesafe-actions";
import { JobTypeCode } from "../../data/jobTypes";
import { registerHandler } from "../handleAction";
import WrappedState from "../../types/WrappedState";

const increaseJobPriority = createAction(
  "INCREASE_JOB_PRIORITY"
)<JobTypeCode>();
export default increaseJobPriority;

function increaseJobPriorityHandler(
  state: WrappedState,
  action: ReturnType<typeof increaseJobPriority>
) {
  const previousPriority = state.select.jobPriority(action.payload);
  const newPriority = previousPriority - 1;
  const jobPriorities: Record<JobTypeCode, number> = {
    ...state.raw.jobPriorities,
  };
  (Object.keys(jobPriorities) as JobTypeCode[]).forEach((jobType) => {
    if (jobPriorities[jobType] === newPriority) {
      jobPriorities[jobType] = previousPriority;
      jobPriorities[action.payload] = newPriority;
    }
  });
  state.setRaw({
    ...state.raw,
    jobPriorities,
  });
}

registerHandler(increaseJobPriorityHandler, increaseJobPriority);
