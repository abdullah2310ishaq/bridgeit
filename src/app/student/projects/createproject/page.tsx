"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateProjectPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [team, setTeam] = useState<number | undefined>(undefined);
    const [stack, setStack] = useState('');
    const [currentStatus, setCurrentStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const router = useRouter();

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('token');  // Retrieve the JWT token from localStorage

        const projectData = {
            title,
            description,
            team,
            stack,
            currentStatus,
            startDate,
            endDate,
            studentId: null, // Set to null since you're logged in as a student, this could be handled on the backend
            indExpertId: null // Optional, depending on your setup
        };

        try {
            const response = await fetch('http://localhost:7/api/projects/create-projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  // Include the JWT token in the request header
                },
                body: JSON.stringify(projectData),
            });

            if (response.ok) {
                alert('Project created successfully!');
                router.push('/student/projects');  // Redirect to the projects page after creation
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert('Failed to create project. Please try again.');
            }
        } catch (error) {
            console.error('There was an error creating the project:', error);
            alert('Failed to create project. Please try again.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-semibold text-center mb-8">Create a New Project</h1>
            <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Title:</label>
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Description:</label>
                    <textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Team Size:</label>
                    <input 
                        type="number" 
                        value={team || ''} 
                        onChange={(e) => setTeam(parseInt(e.target.value))} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Stack:</label>
                    <input 
                        type="text" 
                        value={stack} 
                        onChange={(e) => setStack(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Current Status:</label>
                    <input 
                        type="text" 
                        value={currentStatus} 
                        onChange={(e) => setCurrentStatus(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Start Date:</label>
                    <input 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">End Date:</label>
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default CreateProjectPage;
