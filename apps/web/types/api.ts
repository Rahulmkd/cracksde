export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination?: PaginatedMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  statusCode?: number;
}
