export interface SavedResourceDto {
  id: string;
  userId: string;
  url: string;
  title: string;
  domain: string;
  favicon: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedResourceDto {
  url: string;
}
