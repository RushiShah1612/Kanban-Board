import { useState } from 'react';
import { Plus, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AddColumnButtonProps {
  onAdd: (title: string) => void;
}

export function AddColumnButton({ onAdd }: AddColumnButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setTitle('');
      setIsAdding(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isAdding ? (
        <motion.div
          key="adding"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-72 bg-gray-100 rounded-xl p-3"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter column title..."
            autoFocus
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2 mt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <Check size={16} />
              Add
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#e5e7eb" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setTitle('');
                setIsAdding(false);
              }}
              className="py-2 px-3 text-gray-600 rounded-lg transition-colors text-sm font-medium"
            >
              <X size={16} />
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          key="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{ scale: 1.02, backgroundColor: "rgb(229 231 235)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAdding(true)}
          className="flex-shrink-0 w-72 h-12 bg-gray-100 rounded-xl flex items-center justify-center gap-2 text-gray-600 transition-colors font-medium"
        >
          <Plus size={20} />
          Add Column
        </motion.button>
      )}
    </AnimatePresence>
  );
}
