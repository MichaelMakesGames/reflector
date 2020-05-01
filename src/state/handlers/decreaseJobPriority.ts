import WrappedState from "~types/WrappedState";
import actions from "~state/actions";
import { registerHandler } from "~state/handleAction";

function decreaseJobPriority(
  state: WrappedState,
  action: ReturnType<typeof actions.decreaseJobPriority>,
) {
  const previousPriority = state.select.jobPriority(action.payload);
  const newPriority = previousPriority + 1;
  const jobPriorities: Record<JobType, number> = {
    ...state.raw.jobPriorities,
  };
  (Object.keys(jobPriorities) as JobType[]).forEach((jobType) => {
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

registerHandler(decreaseJobPriority, actions.decreaseJobPriority);