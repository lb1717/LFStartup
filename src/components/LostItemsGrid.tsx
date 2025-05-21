'use client';

import { LostItem } from '@/data/lostItems';
import LostItemCard from './LostItemCard';
import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface LostItemsGridProps {
  items: LostItem[];
  onDelete: (itemId: string) => Promise<void>;
  isAdmin: boolean;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 9; // 3 rows × 3 columns

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="p-4 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
      </div>
    </div>
  );
}

export default function LostItemsGrid({ items, onDelete, isAdmin, isLoading = false }: LostItemsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  useEffect(() => {
    // Reset to first page when items change
    setCurrentPage(1);
  }, [items]);

  const handlePageChange = async (newPage: number) => {
    setIsTransitioning(true);
    setCurrentPage(newPage);
    
    // Scroll to top of grid with smooth animation
    document.getElementById('lost-items-grid')?.scrollIntoView({ behavior: 'smooth' });
    
    // Wait for scroll animation to complete before showing new items
    await new Promise(resolve => setTimeout(resolve, 300));
    setIsTransitioning(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} items
        </div>
      </div>

      <div 
        id="lost-items-grid" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-busy={isLoading || isTransitioning}
      >
        {(isLoading || isTransitioning) ? (
          // Show skeleton cards while loading
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : (
          currentItems.map((item) => (
            <LostItemCard
              key={item.id}
              item={item}
              onDelete={onDelete}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>

      {totalPages > 1 && !isLoading && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isTransitioning}
            className={`p-2 rounded-full transition-colors ${
              currentPage === 1 || isTransitioning
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          
          <span className="text-gray-600" role="status">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || isTransitioning}
            className={`p-2 rounded-full transition-colors ${
              currentPage === totalPages || isTransitioning
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Next page"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
} 