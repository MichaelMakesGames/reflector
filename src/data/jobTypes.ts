export enum JobTypeCode {
  Mining = "MINING",
  Power = "POWER",
  Farming = "FARMING",
  Manufacturing = "MANUFACTURING",
}

export interface JobType {
  code: JobTypeCode;
  label: string;
}

const jobTypes: Record<JobTypeCode, JobType> = {
  [JobTypeCode.Mining]: {
    code: JobTypeCode.Mining,
    label: "Mining",
  },
  [JobTypeCode.Power]: {
    code: JobTypeCode.Power,
    label: "Power",
  },
  [JobTypeCode.Farming]: {
    code: JobTypeCode.Farming,
    label: "Farming",
  },
  [JobTypeCode.Manufacturing]: {
    code: JobTypeCode.Manufacturing,
    label: "Manufacturing",
  },
};

export default jobTypes;
