// components/EventSearch.tsx
import React from 'react';
import { Search, MapPin } from 'lucide-react';

interface EventSearchProps {
  onSearch: (params: SearchParams) => void;
  categories: Array<{ id: string, name: string }>;
}

interface SearchParams {
  q: string;
  categories: string;
  location: string;
}

export default function EventSearch({ onSearch, categories }: EventSearchProps) {
  const [searchParams, setSearchParams] = React.useState<SearchParams>({
    q: '',
    categories: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              className="w-full pl-10 pr-4 py-2 rounded-md border"
              value={searchParams.q}
              onChange={(e) => setSearchParams(prev => ({ ...prev, q: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Location..."
              className="w-full pl-10 pr-4 py-2 rounded-md border"
              value={searchParams.location}
              onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
        </div>

        <select
          className="px-4 py-2 rounded-md border min-w-[200px]"
          value={searchParams.categories}
          onChange={(e) => setSearchParams(prev => ({ ...prev, categories: e.target.value }))}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Search
        </button>
      </div>
    </form>
  );
}