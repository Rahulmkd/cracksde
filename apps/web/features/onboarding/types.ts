export interface OnboardingStepInfo {
  num: number;
  title: string;
}

export interface SubjectOption {
  slug: string;
  name: string;
  recommended: boolean;
}

export interface LevelOption {
  level: string;
  desc: string;
}
