export type ConfigValues = {
  title: string;
  description: string;
  accentColor: string;
  backgroundColor: string;
  enableEmail: boolean;
  enableRating: boolean;
  enableCoverBanner: boolean;
  coverBannerUrl: string;
  showFeedback: boolean;
};

export const DEFAULT_CONFIG: ConfigValues = {
  title: "",
  description: "",
  accentColor: "#7C3AED",
  backgroundColor: "#2D7DD2",
  enableEmail: false,
  enableRating: false,
  enableCoverBanner: false,
  coverBannerUrl: "",
  showFeedback: false,
};
