export enum JobTypeCode {
  Mines = "MINES",
  MiningSpots = "MINING_SPOTS",
  Farms = "FARMS",
  Factories = "FACTORIES",
}

export interface JobType {
  code: JobTypeCode;
  label: string;
  description: string;
}

const jobTypes: Record<JobTypeCode, JobType> = {
  [JobTypeCode.MiningSpots]: {
    code: JobTypeCode.MiningSpots,
    label: "Mining Spots",
    description: "Jobs at mining spots to produce metal.",
  },
  [JobTypeCode.Mines]: {
    code: JobTypeCode.Mines,
    label: "Mines",
    description: "Jobs at mines to produce metal while consuming power.",
  },
  [JobTypeCode.Farms]: {
    code: JobTypeCode.Farms,
    label: "Farms",
    description: "Jobs at farms to produce food.",
  },
  [JobTypeCode.Factories]: {
    code: JobTypeCode.Factories,
    label: "Factories",
    description: "Jobs at factories to produce machinery from metal and power.",
  },
};

export default jobTypes;
