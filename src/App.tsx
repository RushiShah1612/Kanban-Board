import { useState } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { Layout, Sparkles } from 'lucide-react';
import { Column as ColumnComponent } from '@/components/Column';
import { CardModal } from '@/components/CardModal';
import { AddColumnButton } from '@/components/AddColumnButton';
import { CardItem } from '@/components/CardItem';
import { SearchBar } from '@/components/SearchBar';
import { Card } from '@/types/kanban';
import { useBoard } from '@/hooks/useBoard';
import { useKanbanDnd } from '@/hooks/useKanbanDnd';

export function App() {
  const {
    boardState,
    setBoardState,
    addColumn,
    deleteColumn,
    renameColumn,
    deleteCard,
    saveCard,
    findColumnByCardId
  } = useBoard();

  const {
    sensors,
    activeCard,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useKanbanDnd({ boardState, setBoardState, findColumnByCardId });

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const handleAddCard = (columnId: string) => {
    setActiveColumnId(columnId);
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleEditCard = (columnId: string, card: Card) => {
    setActiveColumnId(columnId);
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const onSaveCard = (cardData: Omit<Card, 'id' | 'createdAt'> & { id?: string }) => {
    if (activeColumnId) {
      saveCard(activeColumnId, cardData);
    }
  };

  const totalCards = boardState.columns.reduce((acc, col) => acc + col.cards.length, 0);

  const filteredColumns = boardState.columns.map((col) => ({
    ...col,
    cards: col.cards.filter(
      (card) =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  Kanban Board
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </h1>
                <p className="text-sm text-white/60">Organize your workflow</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="w-64">
                <SearchBar onSearch={setSearchQuery} />
              </div>
              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <div className="text-right">
                  <p className="text-sm text-white/60">Total Tasks</p>
                  <p className="text-2xl font-bold text-white leading-none">{totalCards}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/60">Columns</p>
                  <p className="text-2xl font-bold text-white leading-none">
                    {boardState.columns.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="p-6 overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 items-start min-h-[calc(100vh-140px)]">
            {filteredColumns.map((column) => (
              <ColumnComponent
                key={column.id}
                column={column}
                onAddCard={handleAddCard}
                onDeleteCard={(colId, cardId) => deleteCard(colId, cardId)}
                onEditCard={handleEditCard}
                onRenameColumn={renameColumn}
                onDeleteColumn={deleteColumn}
              />
            ))}
            <AddColumnButton onAdd={addColumn} />
          </div>

          <DragOverlay>
            {activeCard ? (
              <div className="rotate-3 opacity-90 cursor-grabbing">
                <CardItem
                  card={activeCard}
                  onDelete={() => { }}
                  onEdit={() => { }}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Card Modal */}
      <CardModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCard(null);
          setActiveColumnId(null);
        }}
        onSave={onSaveCard}
        editingCard={editingCard}
      />
    </div>
  );
}
