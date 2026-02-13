import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Manual } from '@/types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedManual: string | 'all';
  onManualChange: (manualId: string | 'all') => void;
  manuals: Manual[];
  placeholder?: string;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedManual,
  onManualChange,
  manuals,
  placeholder = 'Search practicals...',
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => onSearchChange('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Select
        value={selectedManual}
        onValueChange={(value) => onManualChange(value as string | 'all')}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Filter by manual" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Manuals</SelectItem>
          {manuals.map((manual) => (
            <SelectItem key={manual.id} value={manual.id}>
              {manual.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
