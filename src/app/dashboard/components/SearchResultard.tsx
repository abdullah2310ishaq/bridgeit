// components/SearchResultCard.tsx
import React from 'react';
import Link from 'next/link';

interface SearchResultCardProps {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  imageData: string | null;
  type: string;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
  userId,
  firstName,
  lastName,
  email,
  imageData,
  type,
}) => {
  const formatImageSrc = (imageData: string | null) => {
    if (imageData) {
      return imageData.startsWith('data:image') ? imageData : `data:image/jpeg;base64,${imageData}`;
    }
    return '/unknown.jpg';
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
      <div className="relative">
        <img
          src={formatImageSrc(imageData)}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full border-4 border-gray-600 mx-auto"
        />
      </div>
      <h2 className="text-2xl font-semibold mt-4 text-center text-white">
        {firstName} {lastName}
      </h2>
      <p className="text-gray-300 text-center">Email: {email}</p>
      <Link
        href={`/dashboard/profile/${type}/${userId}`} // Use userId here
        className="block mt-4 text-center text-blue-400 hover:underline"
      >
        View Profile
      </Link>
    </div>
  );
};

export default SearchResultCard;
