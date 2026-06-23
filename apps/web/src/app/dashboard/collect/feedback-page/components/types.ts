export type ConfigValues = {
  title: string;
  description: string;
  accentColor: string;
  backgroundColor: string;
  enableEmail: boolean;
  enableRating: boolean;
  enableCoverBanner: boolean;
};

export const DEFAULT_CONFIG: ConfigValues = {
  title: "",
  description: "",
  accentColor: "#7C3AED",
  backgroundColor: "#F5F3FF",
  enableEmail: false,
  enableRating: false,
  enableCoverBanner: false,
};
