import { useState } from 'react';
import {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import confetti from 'canvas-confetti';
import { BoardState, Card, Column } from '@/types/kanban';

type SetBoardState = (value: BoardState | ((prev: BoardState) => BoardState)) => void;

interface UseKanbanDndProps {
    boardState: BoardState;
    setBoardState: SetBoardState;
    findColumnByCardId: (cardId: string) => Column | undefined;
}

export function useKanbanDnd({ boardState, setBoardState, findColumnByCardId }: UseKanbanDndProps) {
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const [originalColumnId, setOriginalColumnId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const column = findColumnByCardId(active.id as string);
        if (column) {
            const card = column.cards.find((c) => c.id === active.id);
            if (card) {
                setActiveCard(card);
                setOriginalColumnId(column.id);
            }
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeColumn = findColumnByCardId(activeId);
        const overColumn = findColumnByCardId(overId) || boardState.columns.find((c) => c.id === overId);

        if (!activeColumn || !overColumn) return;
        if (activeColumn.id === overColumn.id) return;

        setBoardState((prev) => {
            const activeColumnIndex = prev.columns.findIndex((c) => c.id === activeColumn.id);
            const overColumnIndex = prev.columns.findIndex((c) => c.id === overColumn.id);

            const activeCardIndex = activeColumn.cards.findIndex((c) => c.id === activeId);
            const card = activeColumn.cards[activeCardIndex];

            const newColumns = [...prev.columns];

            // Remove from active column
            newColumns[activeColumnIndex] = {
                ...newColumns[activeColumnIndex],
                cards: newColumns[activeColumnIndex].cards.filter((c) => c.id !== activeId),
            };

            // Add to over column
            const overCardIndex = overColumn.cards.findIndex((c) => c.id === overId);
            const insertIndex = overCardIndex >= 0 ? overCardIndex : overColumn.cards.length;

            newColumns[overColumnIndex] = {
                ...newColumns[overColumnIndex],
                cards: [
                    ...newColumns[overColumnIndex].cards.slice(0, insertIndex),
                    card,
                    ...newColumns[overColumnIndex].cards.slice(insertIndex),
                ],
            };

            return { columns: newColumns };
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveCard(null);

        if (!over) {
            setOriginalColumnId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) {
            setOriginalColumnId(null);
            return;
        }

        const activeColumn = findColumnByCardId(activeId);
        let overColumn = findColumnByCardId(overId);

        // If overId is a column ID directly (handling drops on empty columns)
        if (!overColumn) {
            overColumn = boardState.columns.find((c) => c.id === overId);
        }

        if (!activeColumn || !overColumn) {
            setOriginalColumnId(null);
            return;
        }

        // Trigger confetti if dropped in "Done" column and it wasn't already there (checking original column)
        if (overColumn.title === 'Done' && originalColumnId !== overColumn.id) {
            console.log('🎉 Triggering Confetti!');
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                zIndex: 9999, // Ensure it's on top
                colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'],
            });
        }
        
        setOriginalColumnId(null);

        const activeCardIndex = activeColumn.cards.findIndex((c) => c.id === activeId);
        const overCardIndex = overColumn.cards.findIndex((c) => c.id === overId);

        // If dropped over a column (not a card), default to the end of the list
        const finalOverCardIndex = overCardIndex === -1 ? overColumn.cards.length : overCardIndex;

        if (activeColumn.id === overColumn.id) {
            // Reordering in same column
            setBoardState((prev) => {
                const columnIndex = prev.columns.findIndex((c) => c.id === activeColumn.id);
                const newCards = arrayMove(prev.columns[columnIndex].cards, activeCardIndex, overCardIndex); // Use overCardIndex here as it handles index-based targets
                const newColumns = [...prev.columns];
                newColumns[columnIndex] = { ...newColumns[columnIndex], cards: newCards };
                return { columns: newColumns };
            });
        } else {
            // Moving to different column
            setBoardState((prev) => {
                const activeColumnIndex = prev.columns.findIndex((c) => c.id === activeColumn.id);
                const overColumnIndex = prev.columns.findIndex((c) => c.id === overColumn!.id);

                const activeCardIndex = activeColumn.cards.findIndex((c) => c.id === activeId);
                const card = activeColumn.cards[activeCardIndex];

                const newColumns = [...prev.columns];

                // Remove from active
                newColumns[activeColumnIndex] = {
                    ...newColumns[activeColumnIndex],
                    cards: newColumns[activeColumnIndex].cards.filter(c => c.id !== activeId)
                };

                // Add to over
                const newCards = [...newColumns[overColumnIndex].cards];
                newCards.splice(finalOverCardIndex, 0, card);

                newColumns[overColumnIndex] = {
                    ...newColumns[overColumnIndex],
                    cards: newCards
                };

                return { columns: newColumns };
            });
        }
    };

    return {
        sensors,
        activeCard,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
}
