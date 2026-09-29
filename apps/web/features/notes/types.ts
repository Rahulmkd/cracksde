export interface NoteItem {
  id: string;
  title: string;
  subject?: string;
  content: string;
  updatedAt: string;
  tags?: string[];
}
