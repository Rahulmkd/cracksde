import React from "react";

export interface CategoryProgress {
  name: string;
  count: string;
  percent: number;
  icon?: React.ElementType;
  color?: string;
  barColor?: string;
  strokeColor?: string;
  slug?: string;
  solved?: number;
  total?: number;
}

export interface PopularTopicItem {
  title: string;
  category: string;
  desc: string;
  problems: number;
  badge: string;
  link: string;
}
