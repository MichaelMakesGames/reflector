import { createStandardAction } from "typesafe-actions";
import { JobTypeCode } from "~data/jobTypes";
import { registerHandler } from "~state/handleAction";
import WrappedState from "~types/WrappedState";

const decreaseJobPriority = createStandardAction("DECREASE_JOB_PRIORITY")<
  JobTypeCode
>();
export default decreaseJobPriority;

function decreaseJobPriorityHandler(
  state: WrappedState,
  action: ReturnType<typeof decreaseJobPriority>,
) {
  const previousPriority = state.select.jobPriority(action.payload);
  const newPriority = previousPriority + 1;
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

registerHandler(decreaseJobPriorityHandler, decreaseJobPriority);
