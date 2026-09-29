import React from "react";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  disabled?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
  isOpen: boolean;
  onToggle: () => void;
}
