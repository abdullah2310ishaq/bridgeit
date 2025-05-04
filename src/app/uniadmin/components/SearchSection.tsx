"use client"

import type React from "react"
import { useState } from "react"
import { FaSearch } from "react-icons/fa"
import { motion } from "framer-motion"

// Define the SearchResult interface here
interface SearchResult {
  userId: string
  firstName: string
  lastName: string
  email: string
  description: string
  imageData: string | null
}

interface SearchSectionProps {
  universityName: string | undefined
  onSearch: (query: string, searchType: string) => void
  searchLoading: boolean
  searchError: string
  results: SearchResult[]
}

const SearchSection: React.FC<SearchSectionProps> = ({
  universityName,
  onSearch,
  searchLoading,
  searchError,
  results,
}) => {
  const [query, setQuery] = useState("")
  const [searchType, setSearchType] = useState("student")

  const handleSearch = () => {
    onSearch(query, searchType)
  }

  return (
    <motion.div
      className="bg-gray-100 rounded-lg shadow-lg p-6 col-span-1 md:col-span-2 lg:col-span-3 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-6">
        Search {universityName}
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter name"
          className="p-3 w-full md:w-1/2 border border-gray-600 bg-gray-100 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-3 w-full md:w-auto border border-gray-600 bg-gray-100 text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <button
          onClick={handleSearch}
          className="p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-md hover:opacity-90 transition duration-300 flex items-center justify-center w-full md:w-auto"
        >
          <FaSearch className="mr-2" />
          Search
        </button>
      </div>
      {/* Search Results */}
      <div className="mt-8">
        {searchLoading && <p className="text-gray-600 text-center">Loading...</p>}
        {searchError && <p className="text-red-500 text-center">{searchError}</p>}
        {!searchLoading && !searchError && results.length === 0 && <p className="text-gray-600 text-center"></p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {results.map((result) => (
            <div key={result.userId} className="bg-gray-100 p-6 rounded-lg shadow-sm">
              <img
                src={result.imageData ? `data:image/png;base64,${result.imageData}` : "/placeholder.png"}
                alt={`${result.firstName} ${result.lastName}`}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                {result.firstName} {result.lastName}
              </h3>
              <p className="text-gray-700 text-center mb-2">{result.email}</p>
              <p className="text-gray-700 text-center text-sm">
                {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default SearchSection
