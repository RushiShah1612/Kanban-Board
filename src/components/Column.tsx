import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal, Trash2, Edit2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Column as ColumnType, Card } from '@/types/kanban';
import { CardItem } from './CardItem';
import { cn } from '@/utils/cn';

interface ColumnProps {
  column: ColumnType;
  onAddCard: (columnId: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onEditCard: (columnId: string, card: Card) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export function Column({
  column,
  onAddCard,
  onDeleteCard,
  onEditCard,
  onRenameColumn,
  onDeleteColumn,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const handleRename = () => {
    if (title.trim()) {
      onRenameColumn(column.id, title.trim());
    } else {
      setTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setTitle(column.title);
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex-shrink-0 w-72 bg-gray-100 rounded-xl p-3',
        'flex flex-col max-h-full',
        isOver && 'ring-2 ring-blue-400 ring-opacity-50'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        {isEditing ? (
          <div className="flex items-center gap-1 flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleRename}
              autoFocus
              className="flex-1 px-2 py-1 text-sm font-semibold bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRename}
              className="p-1 text-green-600 hover:bg-green-100 rounded"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => {
                setTitle(column.title);
                setIsEditing(false);
              }}
              className="p-1 text-gray-500 hover:bg-gray-200 rounded"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-700 text-sm">{column.title}</h3>
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                {column.cards.length}
              </span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
              >
                <MoreHorizontal size={18} />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-32">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Edit2 size={14} />
                      Rename
                    </button>
                    <button
                      onClick={() => {
                        onDeleteColumn(column.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto min-h-[100px] pb-2"
      >
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onDelete={(cardId) => onDeleteCard(column.id, cardId)}
              onEdit={(card) => onEditCard(column.id, card)}
            />
          ))}
        </SortableContext>

        {column.cards.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No cards yet
          </div>
        )}
      </div>

      {/* Add Card Button */}
      <button
        onClick={() => onAddCard(column.id)}
        className="mt-2 w-full py-2 px-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
      >
        <Plus size={16} />
        Add Card
      </button>
    </motion.div>
  );
}
