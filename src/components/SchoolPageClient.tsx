export default function SchoolPageClient({ university, initialItems, locations, isAdmin }: SchoolPageClientProps) {
  // ... existing state and functions ...

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center space-y-8">
        {/* University Logo and Title */}
        <div className="text-center">
          {university.logo && (
            <UniversityImage
              src={university.logo}
              alt={`${university.name} logo`}
              size="medium"
            />
          )}
          <h1 className="text-3xl font-bold mt-4">{university.name}</h1>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search lost items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute right-3 top-3 h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Lost Items Grid */}
        <div className="w-full">
          <LostItemsGrid
            items={filteredItems}
            onDelete={handleDeleteItem}
            isAdmin={isAdmin}
          />
        </div>

        {/* Add Item Button for Admins */}
        {isAdmin && (
          <button
            onClick={() => setShowAddItemModal(true)}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}

        {/* Add Item Modal */}
        {showAddItemModal && (
          <AddItemModal
            onClose={() => setShowAddItemModal(false)}
            onAdd={handleAddItem}
            locations={locations}
            universityId={university.id}
            schoolName={university.name}
          />
        )}
      </div>
    </div>
  );
} 