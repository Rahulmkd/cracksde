export * from "./api";
export * from "./navigation";

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}
