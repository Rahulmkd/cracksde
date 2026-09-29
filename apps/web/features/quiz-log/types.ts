import type { CreateQuestionInput } from "./schemas/create-question-schema";

export type { CreateQuestionInput };

export interface QuizLogFilterState {
  search: string;
  subject: string;
  difficulty: string;
  type: string;
  page: number;
}
