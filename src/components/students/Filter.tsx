"use client";


import {FilterOptions, SortField, SortOrder} from "../../types/student";            
interface StudentFiltersProps {
  filters: FilterOptions;
  filterOptions: {
    grades: number[];
    classes: string[];
    sexes: string[];
  };
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
  onClearFilters: () => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
}
    
export default function StudentFilters({
  filters,
  filterOptions,
    onFilterChange,
    onClearFilters,
    sortField,
    sortOrder,
    onSort,
}: StudentFiltersProps) {
 
return (


                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  <select
                    value={filters.grade}
                    onChange={(e) => onFilterChange("grade", e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Grades</option>
                    {filterOptions.grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
        
                  <select
                    value={filters.class}
                    onChange={(e) => onFilterChange("class", e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Classes</option>
                    {filterOptions.classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
        
                  <select
                    value={filters.sex}
                    onChange={(e) => onFilterChange("sex", e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Genders</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
        
                  {(filters.grade || filters.class || filters.sex || filters.searchTerm) && (
                    <button onClick={onClearFilters} className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 font-medium">
                      Clear All
                    </button>
                  )}
        
                  <div className="ml-auto flex gap-2">
                    <button
                      onClick={() => onSort("name")}
                      className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
                        sortField === "name" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                    <button
                      onClick={() => onSort("grade")}
                      className={`px-3 py-1.5 text-sm rounded-lg capitalize ${
                        sortField === "grade" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Grade {sortField === "grade" && (sortOrder === "asc" ? "↑" : "↓")}
                    </button>
                  </div>
                </div>
);       
}