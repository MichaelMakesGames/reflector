export enum JobTypeCode {
  Mining = "MINING",
  Power = "POWER",
  Farming = "FARMING",
  Manufacturing = "MANUFACTURING",
}

export interface JobType {
  code: JobTypeCode;
  label: string;
  description: string;
}

const jobTypes: Record<JobTypeCode, JobType> = {
  [JobTypeCode.Mining]: {
    code: JobTypeCode.Mining,
    label: "Mining",
    description:
      "Jobs at mines (require power) and mining spots (unpowered) to produce metal.",
  },
  [JobTypeCode.Power]: {
    code: JobTypeCode.Power,
    label: "Power",
    description: "Jobs at reactors to produce power.",
  },
  [JobTypeCode.Farming]: {
    code: JobTypeCode.Farming,
    label: "Farming",
    description: "Jobs at farms to produce food.",
  },
  [JobTypeCode.Manufacturing]: {
    code: JobTypeCode.Manufacturing,
    label: "Manufacturing",
    description: "Jobs at factories to produce machinery from metal and power.",
  },
};

export default jobTypes;
