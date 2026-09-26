export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
}
