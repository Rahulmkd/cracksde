"use client";

import { useState, useEffect, useCallback } from "react";

export interface UsePracticeFiltersReturn {
  searchQuery: string;
  setSearchQuery: (search: string) => void;
  debouncedSearch: string;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
  selectedPattern: string;
  setSelectedPattern: (pattern: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  pageSize: number;
  isFilterActive: boolean;
  clearFilters: () => void;
}

export function usePracticeFilters(initialPageSize = 50): UsePracticeFiltersReturn {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedPattern, setSelectedPattern] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearch("");
    setSelectedSubject("all");
    setSelectedDifficulty("all");
    setSelectedPattern("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  }, []);

  const isFilterActive =
    selectedSubject !== "all" ||
    selectedDifficulty !== "all" ||
    selectedPattern !== "all" ||
    selectedStatus !== "all" ||
    Boolean(searchQuery);

  return {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    selectedSubject,
    setSelectedSubject,
    selectedDifficulty,
    setSelectedDifficulty,
    selectedPattern,
    setSelectedPattern,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    pageSize: initialPageSize,
    isFilterActive,
    clearFilters,
  };
}
