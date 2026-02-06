import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
    return (
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-white/40 group-focus-within:text-white/80 transition-colors" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl 
                 text-white placeholder-white/40
                 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10
                 transition-all duration-200"
                placeholder="Search cards..."
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
}
