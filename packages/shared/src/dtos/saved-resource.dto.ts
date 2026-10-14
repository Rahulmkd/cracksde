export interface SavedResourceDto {
  id: string;
  userId: string;
  url: string;
  title: string;
  domain: string;
  favicon: string | null;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedResourceDto {
  url: string;
}

export interface ToggleBookmarkDto {
  isBookmarked?: boolean;
}
