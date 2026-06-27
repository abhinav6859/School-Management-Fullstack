"use client";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface PaginationProps {
  page: number;
  count: number;
}

const Pagination = ({ page, count }: PaginationProps) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;
  const totalPages = Math.ceil(count / ITEM_PER_PAGE);
  
  const changePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  // For mobile: show limited page numbers
  const getPageNumbers = () => {
    if (isMobile) {
      // On mobile, show only current, previous, and next if they exist
      const pages = [];
      if (page > 1) pages.push(page - 1);
      pages.push(page);
      if (page < totalPages) pages.push(page + 1);
      return pages;
    }
    
    // Desktop: show all pages (limited to 7)
    const pages = [];
    const maxVisible = 7;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(totalPages, page + half);
    
    if (page <= half) end = Math.min(totalPages, maxVisible);
    if (page > totalPages - half) start = Math.max(1, totalPages - maxVisible + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
      {/* Previous Button */}
      <button
        disabled={!hasPrev}
        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 min-w-[60px] sm:min-w-[70px]"
        onClick={() => changePage(page - 1)}
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">‹</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {!isMobile && page > 2 && (
          <>
            <button
              onClick={() => changePage(1)}
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              1
            </button>
            {page > 3 && <span className="text-gray-400 text-sm">…</span>}
          </>
        )}
        
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => changePage(pageNum)}
            className={`
              w-8 sm:w-10 h-8 sm:h-10 rounded-lg text-xs sm:text-sm font-medium
              transition-all duration-200
              ${page === pageNum 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {pageNum}
          </button>
        ))}

        {!isMobile && page < totalPages - 1 && (
          <>
            {page < totalPages - 2 && <span className="text-gray-400 text-sm">…</span>}
            <button
              onClick={() => changePage(totalPages)}
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next Button */}
      <button
        disabled={!hasNext}
        className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs sm:text-sm font-medium text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 min-w-[60px] sm:min-w-[70px]"
        onClick={() => changePage(page + 1)}
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">›</span>
      </button>

      {/* Page Info */}
      <div className="w-full text-center text-xs text-gray-400 mt-1 sm:hidden">
        Page {page} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;