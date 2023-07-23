interface FmpConfig {
  timeout: number;
  docsPerPull: number;
  simulation?: boolean;
}

export const fmpConfig: FmpConfig = {
  timeout: 60,
  docsPerPull: 33,
  simulation: false,
};
