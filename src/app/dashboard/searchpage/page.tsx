"use client";// Make sure the path is correct
import React, { useState, useEffect } from 'react';
import SearchResultCard from '../components/SearchResultard';

interface SearchResult {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  imageData: string | null;
}

const SearchComponent: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('student');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setResults([]);
    setError('');
  }, [searchType]);

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      let response;
      switch (searchType) {
        case 'student':
          response = await fetch(`https://localhost:7053/api/get-student/student-by-name/${query}`);
          break;
        case 'faculty':
          response = await fetch(`https://localhost:7053/api/get-faculty/faculty-by-name/${query}`);
          break;
        case 'industry':
          response = await fetch(`https://localhost:7053/api/get-industry-expert/industry-expert-by-name/${query}`);
          break;
        default:
          throw new Error('Invalid search type');
      }

      if (!response.ok) {
        throw new Error('Not Found!! Try Creating One');
      }

      const data = await response.json();
      if (data.length === 0) {
        setResults([]);
        setError('No results found');
      } else {
        setResults(data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">Search</h1>
      <div className="mb-4 flex justify-center items-center space-x-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter name"
          className="p-2 border rounded shadow-md w-64 bg-gray-800 text-white placeholder-gray-400"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="p-2 border rounded shadow-md bg-gray-800 text-white"
        >
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="industry">Industry Expert</option>
        </select>
        <button
          onClick={handleSearch}
          className="bg-gray-700 text-white p-2 rounded shadow-md"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-300 text-center">Loading...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      <div className="mt-6">
        {results.length === 0 && !loading && !error && <p className="text-center text-gray-300">No results found</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <SearchResultCard
              key={result.userId} // Use userId here
              userId={result.userId} // Pass userId here
              firstName={result.firstName}
              lastName={result.lastName}
              email={result.email}
              imageData={result.imageData}
              type={searchType} // Pass search type to the card
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
