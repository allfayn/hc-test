type WeekDataType = { time: number; commits: number };

type Chart = {
  id: number;
  name: string;
  total: number;
  weeks: WeekDataType[];
};

export type ChartData = Chart[] | undefined;