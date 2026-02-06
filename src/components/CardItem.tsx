import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Priority } from '@/types/kanban';
import { cn } from '@/utils/cn';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getDueDateColor(dateString: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'text-red-600 bg-red-50';
  } else if (diffDays === 0) {
    return 'text-orange-600 bg-orange-50';
  } else if (diffDays <= 2) {
    return 'text-yellow-600 bg-yellow-50';
  }

  return 'text-gray-500 bg-gray-50';
}

interface CardItemProps {
  card: Card;
  onDelete: (cardId: string) => void;
  onEdit: (card: Card) => void;
}

const priorityConfig: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-green-100 text-green-700 border-green-200' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  high: { label: 'High', color: 'bg-red-100 text-red-700 border-red-200' },
};

export function CardItem({ card, onDelete, onEdit }: CardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'group bg-white rounded-lg shadow-lg border-2 border-purple-500 p-3 mb-2 opacity-50 rotate-3 cursor-grabbing z-50'
        )}
      >
        <div className="flex items-start gap-2">
          <div className="p-1 text-gray-400">
            <GripVertical size={14} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">{card.title}</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layoutId={card.id}
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'group bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-2',
        'hover:shadow-md transition-shadow duration-200',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing outline-none"
        >
          <GripVertical size={14} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-gray-900 text-sm break-words">{card.title}</h4>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(card)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(card.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {card.description && (
            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{card.description}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-block px-2 py-0.5 text-xs font-medium rounded-full border',
                priorityConfig[card.priority].color
              )}
            >
              {priorityConfig[card.priority].label}
            </span>

            {card.dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full',
                  getDueDateColor(card.dueDate)
                )}
              >
                <Calendar size={10} />
                {formatDate(card.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
