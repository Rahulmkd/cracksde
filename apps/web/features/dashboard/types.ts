import React from "react";

export interface CategoryProgress {
  name: string;
  count: string;
  percent: number;
  icon: React.ElementType;
  color: string;
  barColor?: string;
}

export interface PopularTopicItem {
  title: string;
  category: string;
  desc: string;
  problems: number;
  badge: string;
  link: string;
}
