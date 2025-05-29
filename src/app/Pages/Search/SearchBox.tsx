// components/SearchBox.tsx
'use client';

type SearchBoxProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
};

export default function SearchBox({ placeholder = 'Search...', onSearch }: SearchBoxProps) {
  return (
    <div className="relative w-72">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-5 pr-3 py-2 w-full rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
      />
    </div>
  );
}
