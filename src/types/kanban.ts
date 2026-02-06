export type Priority = 'low' | 'medium' | 'high';

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string; // ISO date string (YYYY-MM-DD)
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export interface BoardState {
  columns: Column[];
}
