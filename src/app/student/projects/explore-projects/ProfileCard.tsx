"use client";
import React from "react";

interface ProfileCardProps {
  imageData: string;
  firstName: string;
  lastName: string;
  role: string;
  skills?: string[]; // <-- Accept optional array of skills
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  imageData,
  firstName,
  lastName,
  role,
  skills,
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded shadow-lg">
      {/* Basic profile info */}
      <img
        src={imageData}
        alt={`${firstName} ${lastName}`}
        className="rounded-full w-24 h-24 mb-4"
      />
      <h2 className="text-white text-lg font-bold">
        {firstName} {lastName}
      </h2>
      <p className="text-gray-400 text-sm mb-4">{role}</p>

      {/* Skills (if any) */}
      {skills && skills.length > 0 && (
        <div className="mt-4">
          <h3 className="text-white font-semibold mb-2">Skills:</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
