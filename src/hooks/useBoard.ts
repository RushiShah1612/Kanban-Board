import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './useLocalStorage';
import { Column, Card, BoardState, Priority } from '@/types/kanban';

// Helper to get dates relative to today
const getRelativeDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

const defaultColumns: Column[] = [
  {
    id: uuidv4(),
    title: 'Backlog',
    cards: [
      {
        id: uuidv4(),
        title: 'Research competitors',
        description: 'Analyze top 5 competitors and document their features',
        priority: 'medium',
        dueDate: getRelativeDate(7),
        createdAt: Date.now(),
      },
      {
        id: uuidv4(),
        title: 'Setup project repository',
        description: 'Initialize Git repo with proper branching strategy',
        priority: 'high',
        dueDate: getRelativeDate(3),
        createdAt: Date.now(),
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'In Progress',
    cards: [
      {
        id: uuidv4(),
        title: 'Design system setup',
        description: 'Create color palette, typography, and component library',
        priority: 'high',
        dueDate: getRelativeDate(1),
        createdAt: Date.now(),
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Code Review',
    cards: [
      {
        id: uuidv4(),
        title: 'API integration',
        description: 'Review REST API endpoints implementation',
        priority: 'medium',
        dueDate: getRelativeDate(0),
        createdAt: Date.now(),
      },
    ],
  },
  {
    id: uuidv4(),
    title: 'Done',
    cards: [
      {
        id: uuidv4(),
        title: 'Project kickoff meeting',
        description: 'Initial meeting with stakeholders completed',
        priority: 'low',
        dueDate: getRelativeDate(-2),
        createdAt: Date.now(),
      },
    ],
  },
];

export function useBoard() {
  const [boardState, setBoardState] = useLocalStorage<BoardState>('kanban-board', {
    columns: defaultColumns,
  });

  const addColumn = (title: string) => {
    const newColumn: Column = {
      id: uuidv4(),
      title,
      cards: [],
    };
    setBoardState((prev) => ({
      columns: [...prev.columns, newColumn],
    }));
  };

  const deleteColumn = (columnId: string) => {
    setBoardState((prev) => ({
      columns: prev.columns.filter((c) => c.id !== columnId),
    }));
  };

  const renameColumn = (columnId: string, newTitle: string) => {
    setBoardState((prev) => ({
      columns: prev.columns.map((c) =>
        c.id === columnId ? { ...c, title: newTitle } : c
      ),
    }));
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setBoardState((prev) => ({
      columns: prev.columns.map((c) =>
        c.id === columnId
          ? { ...c, cards: c.cards.filter((card) => card.id !== cardId) }
          : c
      ),
    }));
  };

  const saveCard = (activeColumnId: string, cardData: Omit<Card, 'id' | 'createdAt'> & { id?: string }) => {
    setBoardState((prev) => ({
      columns: prev.columns.map((column) => {
        if (column.id !== activeColumnId) return column;

        if (cardData.id) {
          // Edit existing card
          return {
            ...column,
            cards: column.cards.map((card) =>
              card.id === cardData.id
                ? { ...card, ...cardData }
                : card
            ),
          };
        } else {
          // Add new card
          const newCard: Card = {
            id: uuidv4(),
            title: cardData.title,
            description: cardData.description,
            priority: cardData.priority as Priority,
            dueDate: cardData.dueDate,
            createdAt: Date.now(),
          };
          return {
            ...column,
            cards: [...column.cards, newCard],
          };
        }
      }),
    }));
  };

  const findColumnByCardId = useCallback(
    (cardId: string): Column | undefined => {
      return boardState.columns.find((column) =>
        column.cards.some((card) => card.id === cardId)
      );
    },
    [boardState.columns]
  );
  
  return {
    boardState,
    setBoardState,
    addColumn,
    deleteColumn,
    renameColumn,
    deleteCard,
    saveCard,
    findColumnByCardId
  };
}
